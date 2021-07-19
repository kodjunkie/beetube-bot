const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");
const keyboardMarkup = require("../utils/keyboard");
const errorHandler = require("../utils/error-handler");

module.exports = class Torrent extends Provider {
	constructor(bot) {
		super(bot);
		this.type = "torrent";
		this.endpoint = process.env.TORRENT_API;
	}

	/**
	 * List torrent
	 * @param  {} message
	 * @param  {} params
	 */
	async list({ chat }) {
		const { message_id } = await this.bot.sendMessage(
			chat.id,
			"\u{1F504} Fetching torrent \u{1F4E1}",
			keyboardMarkup
		);

		await this.bot.sendChatAction(chat.id, "typing");
		const response = await axios.get(`${this.endpoint}/list`, {
			params: { driver: "1337x" },
		});
		const data = response.data.data;
		const options = { parse_mode: "html" };

		_.map(data, async torrent => {
			options.reply_markup = JSON.stringify({
				inline_keyboard: [
					[
						{
							text: `\u{1F9F2} Download (${torrent.size})`,
							url: torrent.url,
						},
					],
				],
			});

			const description = torrent.description
				? "<b>Description:</b> " + torrent.description
				: `<em>${torrent.magnetic_link}</em>`;

			await this.bot.sendMessage(
				chat.id,
				`\u{1F30D} ${torrent.name}
					\n\u{2B06} Seeds: ${torrent.seeds} \u{2B07} leeches: ${torrent.leeches}
					\n${description}`,
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
			`\u{1F504} Searching for \`${query}\` \u{1F4E1}`,
			keyboardMarkup
		);

		await this.bot.sendChatAction(chat.id, "typing");
		const response = await axios.get(`${this.endpoint}/search`, {
			params: { ...params, driver: "1337x" },
		});
		const data = response.data.data;
		const page = params.page;
		const options = { parse_mode: "html" };

		_.map(data, (torrent, i) => {
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
									text: `\u{1F9F2} Download (${torrent.size})`,
									url: torrent.url,
								},
							],
							pagination,
						],
					});

					const description = torrent.description
						? "<b>Description:</b> " + torrent.description
						: `<em>${torrent.magnetic_link}</em>`;

					const msg = await this.bot.sendMessage(
						chat.id,
						`\u{1F30D} ${torrent.name}
							\n\u{2B06} Seeds: ${torrent.seeds} \u{2B07} leeches: ${torrent.leeches}
							\n${description}`,
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
			await errorHandler(this.bot, message.chat.id, error);
		}
	}
};
