const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");
const errorHandler = require("../utils/error-handler");
const keyboardMarkup = require("../utils/keyboard");

module.exports = class Movie extends Provider {
	constructor(bot) {
		super(bot);
		this.type = "movie";
		this.endpoint = process.env.MOVIE_API;
	}

	/**
	 * List movies
	 * @param  {} message
	 * @param  {} page=1
	 */
	async list({ chat }, page = 1) {
		try {
			const { message_id } = await this.bot.sendMessage(
				chat.id,
				"\u{1F504} Fetching movies \u{1F4E1}",
				keyboardMarkup
			);

			const { data } = await axios.get(`${this.endpoint}/list`, {
				params: { page, engine: "fzmovies" },
			});

			await this.bot.sendChatAction(chat.id, "upload_video");
			const options = { parse_mode: "Markdown" };

			_.map(data, (movie, i) => {
				if (movie.Size && movie.CoverPhotoLink) {
					const isLastItem = data.length - 1 === i;
					/*
					 * Ensure all messages are sent before pagination
					 */
					setTimeout(
						async () => {
							const pagination = isLastItem
								? [
										{
											text: "Next",
											callback_data: JSON.stringify({
												type: "paginate_movie",
												page: page + 1,
											}),
										},
								  ]
								: [];

							if (page > 1 && pagination.length > 0) {
								pagination.unshift({
									text: "Previous",
									callback_data: JSON.stringify({
										type: "paginate_movie",
										page: page - 1,
									}),
								});
							}

							options.reply_markup = JSON.stringify({
								inline_keyboard: [
									[
										{
											text: `Download (${movie.Size})`,
											url: movie.DownloadLink,
										},
									],
									pagination,
								],
							});

							const description = movie.Description
								? "\n\n*Description:* " + movie.Description.slice(0, -6)
								: "";
							const msg = await this.bot.sendMessage(
								chat.id,
								`[\u{1F3AC}](${movie.CoverPhotoLink}) *${movie.Title}*${description}`,
								options
							);

							await new Paginator({
								_id: msg.message_id,
								type: this.type,
								user: msg.chat.id,
							}).save();
						},
						isLastItem ? 2500 : 0
					);
				}
			});

			await this.bot.deleteMessage(chat.id, message_id);
		} catch (error) {
			await errorHandler(this.bot, chat.id, error);
		}
	}

	/**
	 * Search for movies
	 * @param  {} message
	 * @param  {} params
	 */
	async search({ chat }, params) {
		try {
			const { message_id } = await this.bot.sendMessage(
				chat.id,
				`\u{1F504} Searching for \`${params.query}\` \u{1F4E1}`,
				keyboardMarkup
			);

			const { data } = await axios.get(`${this.endpoint}/search`, {
				params: {
					query: params.query.replace(" ", "+"),
					engine: "fzmovies",
				},
			});

			await this.bot.sendChatAction(chat.id, "upload_video");
			const options = { parse_mode: "Markdown" };

			_.map(data, async movie => {
				if (movie.Size && movie.CoverPhotoLink) {
					options.reply_markup = JSON.stringify({
						inline_keyboard: [
							[{ text: `Download (${movie.Size})`, url: movie.DownloadLink }],
						],
					});

					const description = movie.Description
						? "\n\n*Description:* " + movie.Description.slice(0, -6)
						: "";

					await this.bot.sendMessage(
						chat.id,
						`[\u{1F3AC}](${movie.CoverPhotoLink}) *${movie.Title}*${description}`,
						options
					);
				}
			});

			await this.bot.deleteMessage(chat.id, message_id);
		} catch (error) {
			await errorHandler(this.bot, chat.id, error);
		}
	}

	/**
	 * Interactive search
	 * @param  {} message
	 */
	async interactiveSearch(message) {
		const chatId = message.chat.id;
		const { message_id } = await this.bot.sendMessage(
			chatId,
			"\u{1F50D} Tell me the title of the movie you want",
			{ reply_markup: JSON.stringify({ force_reply: true }) }
		);

		const listenerId = this.bot.onReplyToMessage(
			chatId,
			message_id,
			async reply => {
				this.bot.removeReplyListener(listenerId);
				await this.search(message, { query: reply.text });
			}
		);
	}

	/**
	 * Task resolver
	 * @param  {} data
	 * @param  {} message
	 */
	async resolve(data, message) {
		switch (data.type) {
			case "list_movie":
				await this.list(message);
				break;
			case "paginate_movie":
				await this.paginate(message, data.page, "list");
				break;
			case "search_movie":
				await this.interactiveSearch(message);
				break;
		}
	}
};
