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
	 * @param  {} page=1
	 */
	async list({ chat }, page = 1) {
		await this.bot.sendMessage(
			chat.id,
			"\u{1F50D} We only support music search for now.",
			keyboardMarkup
		);
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

			const page = params.page;
			const query = params.query.replace(" ", "+");
			const response = await axios.get(`${this.endpoint}/search`, {
				params: { query, page },
			});
			const data = response.data.data;

			const options = { parse_mode: "html" };
			this.bot.sendChatAction(chat.id, "upload_voice");

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

			this.bot.deleteMessage(chat.id, message_id);
		} catch (error) {
			errorHandler(this.bot, chat.id, error);
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

		const listenerId = this.bot.onReplyToMessage(chatId, message_id, reply => {
			this.bot.removeReplyListener(listenerId);
			this.search(message, { query: reply.text, page });
		});
	}

	/**
	 * Task resolver
	 * @param  {} data
	 * @param  {} message
	 */
	resolve(data, message) {
		switch (data.type) {
			case "list_music":
				this.list(message);
				break;
			case "search_music":
				this.interactiveSearch(message, data.page);
				break;
			case "paginate_search_music":
				this.paginate(message, data, "search");
				break;
		}
	}
};
