const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");
const keyboardMarkup = require("../utils/keyboard");
const errorHandler = require("../utils/error-handler");

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
		const { message_id } = await this.bot.sendMessage(
			chat.id,
			"\u{1F4E1} Fetching latest music",
			keyboardMarkup
		);

		await this.bot.sendChatAction(chat.id, "upload_voice");
		const response = await axios.get(`${this.endpoint}/list`, { params });
		const data = response.data.data;
		const genre = params.genre || false;
		const page = params.page;

		if (genre) {
			_.map(data, (music, i) => {
				const isLastItem = data.length - 1 === i;
				const options = { parse_mode: "html" };
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
											type: `paginate_${this.type}`,
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
									type: `paginate_${this.type}`,
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
							`\u{1F4BF} <b>${music.name}</b>`,
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

			await this.bot.sendMessage(chat.id, "Select a genre \u{1F447}", {
				parse_mode: "html",
				reply_markup: JSON.stringify({
					inline_keyboard: _.chunk(keyboardLayout, 4),
				}),
			});
		}

		await this.bot.deleteMessage(chat.id, message_id);
	}

	/**
	 * Search for music
	 * @param  {} message
	 * @param  {} params
	 */
	async search({ chat }, params) {
		const query = params.query;
		const { message_id } = await this.bot.sendMessage(
			chat.id,
			`\u{1F4E1} Searching for \`${query}\``,
			keyboardMarkup
		);

		await this.bot.sendChatAction(chat.id, "upload_voice");
		const response = await axios.get(`${this.endpoint}/search`, { params });
		const data = response.data.data;
		const page = params.page;

		_.map(data, (music, i) => {
			const isLastItem = data.length - 1 === i;
			const options = { parse_mode: "html" };
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
										type: `paginate_search_${this.type}`,
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
								type: `paginate_search_${this.type}`,
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
						`\u{1F4BF} <b>${music.name}</b>`,
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
		try {
			switch (data.type) {
				case `list_${this.type}`:
					await this.list(message, data);
					break;
				case `paginate_${this.type}`:
					await this.paginate(message, data, "list");
					break;
				case `search_${this.type}`:
					await this.interactiveSearch(message, data.page);
					break;
				case `paginate_search_${this.type}`:
					await this.paginate(message, data, "search");
					break;
			}
		} catch (error) {
			await errorHandler(this.bot, message.chat.id, error);
		}
	}
};
