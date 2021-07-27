const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");
const errorHandler = require("../utils/error-handler");
const { keyboard, keypad } = require("../utils/bot-helper");

module.exports = class Music extends Provider {
	constructor(bot) {
		super(bot);
		this.type = "music";
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
			keyboard
		);

		this.bot.sendChatAction(chat.id, "typing");
		const response = await axios.get(`${this.endpoint}/list`, { params });
		const data = response.data.data;

		if (data.length < 1) {
			await this.bot.deleteMessage(chat.id, message_id);
			await this.bot.sendMessage(
				chat.id,
				"\u{26A0} You've reached the end of the list.",
				keyboard
			);
			return;
		}

		const genre = params.genre || false;
		const page = params.page;
		const pages = [];

		if (genre) {
			const promises = [],
				paging = data.pop();

			_.map(data, music => {
				const options = { parse_mode: "html" };
				options.reply_markup = JSON.stringify({
					inline_keyboard: [
						[{ text: `${keypad.download} (${music.size})`, url: music.url }],
					],
				});

				promises.push(
					this.bot
						.sendMessage(chat.id, `\u{1F4BF} <b>${music.name}</b>`, options)
						.then(msg => {
							pages.push({
								insertOne: {
									document: {
										_id: msg.message_id,
										type: this.type,
										user: msg.chat.id,
									},
								},
							});
						})
				);
			});

			await Promise.all(promises);
			/*
			 * Ensure all messages are sent before pagination
			 */
			const pagination = [
				{
					text: keypad.next,
					callback_data: JSON.stringify({
						type: `paginate_list_${this.type}`,
						page: page + 1,
						genre,
					}),
				},
			];

			if (page > 1) {
				pagination.unshift({
					text: keypad.previous,
					callback_data: JSON.stringify({
						type: `paginate_list_${this.type}`,
						page: page - 1,
						genre,
					}),
				});
			}

			await this.bot
				.sendMessage(chat.id, `\u{1F4BF} <b>${paging.name}</b>`, {
					parse_mode: "html",
					reply_markup: JSON.stringify({
						inline_keyboard: [
							[
								{
									text: `${keypad.download} (${paging.size})`,
									url: paging.url,
								},
							],
							pagination,
						],
					}),
				})
				.then(msg => {
					pages.push({
						insertOne: {
							document: {
								_id: msg.message_id,
								type: this.type,
								user: msg.chat.id,
							},
						},
					});
				});
		} else {
			const keyboardLayout = data.map(gnr => ({
				text: gnr.name,
				callback_data: JSON.stringify({
					type: `list_${this.type}`,
					genre: gnr.name,
					page: 1,
				}),
			}));

			await this.bot.sendMessage(
				chat.id,
				"Select a genre to proceed \u{1F447}",
				{
					parse_mode: "html",
					reply_markup: JSON.stringify({
						inline_keyboard: _.chunk(keyboardLayout, 4),
					}),
				}
			);
		}

		await this.bot.deleteMessage(chat.id, message_id);
		await Paginator.bulkWrite(pages);
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
			keyboard
		);

		this.bot.sendChatAction(chat.id, "typing");
		const response = await axios.get(`${this.endpoint}/search`, { params });
		const data = response.data.data;

		if (data.length < 1) {
			await this.bot.deleteMessage(chat.id, message_id);
			await this.bot.sendMessage(
				chat.id,
				"\u{26A0} No results found.",
				keyboard
			);
			return;
		}

		const page = params.page;
		const pages = [],
			promises = [],
			paging = data.pop();

		_.map(data, music => {
			const options = { parse_mode: "html" };
			options.reply_markup = JSON.stringify({
				inline_keyboard: [
					[{ text: `${keypad.download} (${music.size})`, url: music.url }],
				],
			});

			promises.push(
				this.bot
					.sendMessage(chat.id, `\u{1F4BF} <b>${music.name}</b>`, options)
					.then(msg => {
						pages.push({
							insertOne: {
								document: {
									_id: msg.message_id,
									type: this.type,
									user: msg.chat.id,
								},
							},
						});
					})
			);
		});

		await Promise.all(promises);
		/*
		 * Ensure all messages are sent before pagination
		 */
		const pagination = [
			{
				text: keypad.next,
				callback_data: JSON.stringify({
					type: `paginate_search_${this.type}`,
					page: page + 1,
					query,
				}),
			},
		];

		if (page > 1) {
			pagination.unshift({
				text: keypad.previous,
				callback_data: JSON.stringify({
					type: `paginate_search_${this.type}`,
					page: page - 1,
					query,
				}),
			});
		}

		await this.bot
			.sendMessage(chat.id, `\u{1F4BF} <b>${paging.name}</b>`, {
				parse_mode: "html",
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[{ text: `${keypad.download} (${paging.size})`, url: paging.url }],
						pagination,
					],
				}),
			})
			.then(msg => {
				pages.push({
					insertOne: {
						document: {
							_id: msg.message_id,
							type: this.type,
							user: msg.chat.id,
						},
					},
				});
			});

		await this.bot.deleteMessage(chat.id, message_id);
		await Paginator.bulkWrite(pages);
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
				case `paginate_list_${this.type}`:
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
