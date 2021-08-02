const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");
const errorHandler = require("../utils/error-handler");
const { keyboard, keypad } = require("../utils/bot-helper");

module.exports = class Torrent extends Provider {
	constructor(bot) {
		super(bot);
		this.type = "torrent";
		this.endpoint = process.env.RASPAR_API;
	}

	/**
	 * List torrent
	 * @param  {} message
	 * @param  {} params
	 */
	async list({ chat }) {
		const { message_id } = await this.bot.sendMessage(
			chat.id,
			"\u{1F4E1} Fetching latest torrents",
			keyboard
		);

		this.bot.sendChatAction(chat.id, "typing");
		const response = await axios.get(`${this.endpoint}/list`, {
			params: { driver: "1337x" },
		});
		const data = response.data.data;

		if (data.length < 1) {
			return this.emptyAPIResponse(chat.id, message_id);
		}

		_.map(data, async torrent => {
			const options = { parse_mode: "html" };
			options.reply_markup = JSON.stringify({
				inline_keyboard: [
					[
						{
							text: `\u{1F9F2} ${keypad.download} (${torrent.size})`,
							url: torrent.url,
						},
					],
				],
			});

			await this.bot.sendMessage(
				chat.id,
				`\u{1F30D} <b>${torrent.name}</b>
					\n\u{2B06} Seeds: ${torrent.seeds} \u{2B07} leeches: ${torrent.leeches}
					\n${
						torrent.description
							? `<b>Description:</b> <em>${torrent.description.substr(
									0,
									400
							  )}...</em>`
							: `<em>${torrent.magnetic_link}</em>`
					}`,
				options
			);
		});

		await this.bot.deleteMessage(chat.id, message_id);
	}

	/**
	 * Search for torrent
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
		const response = await axios.get(`${this.endpoint}/search`, {
			params: { ...params, driver: "1337x" },
		});
		const data = response.data.data;

		if (data.length < 1) {
			return this.emptyAPIResponse(chat.id, message_id, "No results found.");
		}

		const page = params.page;
		const pages = [],
			promises = [],
			paging = data.pop();

		_.map(data, torrent => {
			const options = { parse_mode: "html" };
			options.reply_markup = JSON.stringify({
				inline_keyboard: [
					[
						{
							text: `\u{1F9F2} ${keypad.download} (${torrent.size})`,
							url: torrent.url,
						},
					],
				],
			});

			promises.push(
				this.bot
					.sendMessage(
						chat.id,
						`\u{1F30D} <b>${torrent.name}</b>
					\n\u{2B06} Seeds: ${torrent.seeds} \u{2B07} leeches: ${torrent.leeches}
					\n${
						torrent.description
							? `<b>Description:</b> <em>${torrent.description.substr(
									0,
									400
							  )}...</em>`
							: `<em>${torrent.magnetic_link}</em>`
					}`,
						options
					)
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
			.sendMessage(
				chat.id,
				`\u{1F30D} <b>${paging.name}</b>
					\n\u{2B06} Seeds: ${paging.seeds} \u{2B07} leeches: ${paging.leeches}
					\n${
						paging.description
							? `<b>Description:</b> <em>${paging.description}</em>`
							: `<em>${paging.magnetic_link}</em>`
					}`,
				{
					parse_mode: "html",
					reply_markup: JSON.stringify({
						inline_keyboard: [
							[
								{
									text: `\u{1F9F2} ${keypad.download} (${paging.size})`,
									url: paging.url,
								},
							],
							pagination,
						],
					}),
				}
			)
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
			"\u{1F50D} Tell me the torrent name or title",
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
					await this.list(message);
					break;
				case `search_${this.type}`:
					await this.interactiveSearch(message, data.page);
					break;
				case `paginate_search_${this.type}`:
					await this.paginate(message, data, "search");
					break;
			}
		} catch (error) {
			errorHandler(this.bot, message.chat.id, error);
		}
	}
};
