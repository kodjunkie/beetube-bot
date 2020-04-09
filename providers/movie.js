const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");
const errorHandler = require("../utils/error-handler");

module.exports = class Movie extends Provider {
	/**
	 * List movies
	 * @param  {} message
	 * @param  {} page=1
	 */
	async list({ chat }, page = 1) {
		try {
			const { message_id } = await this.bot.sendMessage(
				chat.id,
				"\u{1F504} Fetching movies \u{1F4E1}"
			);

			const { data } = await axios.get(
				`${process.env.MOVIES_API}/list?page=${page}`
			);

			const options = { parse_mode: "Markdown" };
			_.map(data, (movie, i) => {
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
											type: "movie",
											page: page + 1,
										}),
									},
							  ]
							: [];

						if (page > 1 && pagination.length > 0) {
							pagination.unshift({
								text: "Previous",
								callback_data: JSON.stringify({
									type: "movie",
									page: page - 1,
								}),
							});
						}

						options.reply_markup = JSON.stringify({
							inline_keyboard: [
								[{ text: `Download ${movie.Size}`, url: movie.DownloadLink }],
								pagination,
							],
						});

						const msg = await this.bot.sendMessage(
							chat.id,
							`[\u{1F4C0}](${movie.CoverPhotoLink}) *${movie.Title}*`,
							options
						);

						await new Paginator({
							_id: msg.message_id,
							type: "movie",
							user: msg.chat.id,
						}).save();
					},
					isLastItem ? 2500 : 0
				);
			});

			this.bot.deleteMessage(chat.id, message_id);
		} catch (error) {
			errorHandler(this.bot, chat.id, error);
		}
	}

	/**
	 * Handle pagination
	 * @param  {} message
	 * @param  {} page
	 */
	async paginate(message, page) {
		const chatId = message.chat.id;
		const results = await Paginator.find({
			user: chatId,
			type: "movie",
			createdAt: { $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
		});

		if (results.length > 0) {
			const IDs = [];
			_.map(results, result => {
				IDs.push(result._id);
				this.bot.deleteMessage(chatId, result._id);
			});
			await Paginator.deleteMany({ _id: { $in: IDs } });
		}

		await this.list(message, page);
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
				`\u{1F504} Searching for \`${params.query}\` \u{1F4E1}`
			);

			const query = params.query.replace(" ", "+");
			const server = params.server ? `&engine=${params.server}` : "";
			const { data } = await axios.get(
				`${process.env.MOVIES_API}/search?query=${query + server}`
			);

			const options = { parse_mode: "Markdown" };
			_.map(data, async movie => {
				if (movie.Size && movie.CoverPhotoLink) {
					options.reply_markup = JSON.stringify({
						inline_keyboard: [
							[{ text: `Download ${movie.Size}`, url: movie.DownloadLink }],
						],
					});

					const msg = await this.bot.sendMessage(
						chat.id,
						`[\u{1F4C0}](${movie.CoverPhotoLink}) *${movie.Title}*`,
						options
					);

					await new Paginator({
						_id: msg.message_id,
						type: "movie",
						user: msg.chat.id,
					}).save();
				}
			});

			this.bot.deleteMessage(chat.id, message_id);
		} catch (error) {
			errorHandler(this.bot, chat.id, error);
		}
	}
};
