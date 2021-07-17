const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");
const errorHandler = require("../utils/error-handler");
const keyboardMarkup = require("../utils/keyboard");

module.exports = class Music extends Provider {
	constructor(bot) {
		super(bot);
		this.type = "music";
		this.endpoint = process.env.MUSIC_API;
	}

	/**
	 * List music
	 * @param  {} message
	 * @param  {} params
	 */
	async list({ chat }, params) {
		try {
			const { message_id } = await this.bot.sendMessage(
				chat.id,
				"\u{1F504} Fetching music \u{1F4E1}",
				keyboardMarkup
			);

			const response = await axios.get(`${this.endpoint}/list`, { params });
			const data = response.data.data;
			const genre = params.genre || false;
			const page = params.page;

			await this.bot.sendChatAction(chat.id, "upload_voice");
			const options = { parse_mode: "html" };

			if (genre) {
				_.map(data, (music, i) => {
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
												type: "paginate_music",
												page: page + 1,
												genre,
											}),
										},
								  ]
								: [];

							if (page > 1 && pagination.length > 0) {
								pagination.unshift({
									text: "Previous",
									callback_data: JSON.stringify({
										type: "paginate_music",
										page: page - 1,
										genre,
									}),
								});
							}

							options.reply_markup = JSON.stringify({
								inline_keyboard: [
									[
										{
											text: `Download (${music.size})`,
											url: music.url,
										},
									],
									pagination,
								],
							});

							const msg = await this.bot.sendMessage(
								chat.id,
								`\u{1F4BF} ${music.name}`,
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
				});
			} else {
				const keyboardLayout = data.map(gnr => ({
					text: gnr.name,
					callback_data: JSON.stringify({
						type: "list_music",
						genre: gnr.name,
						page: 1,
					}),
				}));

				options.reply_markup = JSON.stringify({
					inline_keyboard: _.chunk(keyboardLayout, 4),
				});

				await this.bot.sendMessage(
					chat.id,
					"Select a genre \u{1F447}",
					options
				);
			}

			await this.bot.deleteMessage(chat.id, message_id);
		} catch (error) {
			await errorHandler(this.bot, chat.id, error);
		}
	}

	/**
	 * Search for music
	 * @param  {} message
	 * @param  {} params
	 */
	async search({ chat }, params) {
		try {
			const query = params.query;
			const { message_id } = await this.bot.sendMessage(
				chat.id,
				`\u{1F504} Searching for \`${query}\` \u{1F4E1}`,
				keyboardMarkup
			);

			const response = await axios.get(`${this.endpoint}/search`, { params });
			const data = response.data.data;
			const page = params.page;

			await this.bot.sendChatAction(chat.id, "upload_voice");
			const options = { parse_mode: "html" };

			_.map(data, (music, i) => {
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
											type: "paginate_search_music",
											page: page + 1,
											query,
										}),
									},
							  ]
							: [];

						if (page > 1 && pagination.length > 0) {
							pagination.unshift({
								text: "Previous",
								callback_data: JSON.stringify({
									type: "paginate_search_music",
									page: page - 1,
									query,
								}),
							});
						}

						options.reply_markup = JSON.stringify({
							inline_keyboard: [
								[
									{
										text: `Download (${music.size})`,
										url: music.url,
									},
								],
								pagination,
							],
						});

						const msg = await this.bot.sendMessage(
							chat.id,
							`\u{1F4BF} ${music.name}`,
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
			});

			await this.bot.deleteMessage(chat.id, message_id);
		} catch (error) {
			await errorHandler(this.bot, chat.id, error);
		}
	}

	/**
	 * Interactive search
	 * @param  {} message
	 * @param  {} page=1
	 */
	async interactiveSearch(message, page = 1) {
		const chatId = message.chat.id;
		const { message_id } = await this.bot.sendMessage(
			chatId,
			"\u{1F50D} Tell me the music title or artiste name",
			{ reply_markup: JSON.stringify({ force_reply: true }) }
		);

		const listenerId = this.bot.onReplyToMessage(
			chatId,
			message_id,
			async reply => {
				this.bot.removeReplyListener(listenerId);
				await this.search(message, { query: reply.text, page });
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
			case "list_music":
				await this.list(message, data);
				break;
			case "paginate_music":
				await this.paginate(message, data, "list");
				break;
			case "search_music":
				await this.interactiveSearch(message, data.page);
				break;
			case "paginate_search_music":
				await this.paginate(message, data, "search");
				break;
		}
	}
};
