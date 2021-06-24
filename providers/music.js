const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const errorHandler = require("../utils/error-handler");

module.exports = class Music extends Provider {
	// API endpoint
	get musicApi() {
		return process.env.MOVIE_API;
	}

	/**
	 * List music
	 * @param  {} message
	 * @param  {} page=1
	 */
	async list({ chat }, page = 1) {
		await this.bot.sendMessage(
			chat.id,
			"\u{1F50D} We only support music search for now."
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
				`\u{1F504} Searching for \`${params.query}\` \u{1F4E1}`
			);

			const { data } = await axios.get(`${this.musicApi}/search`, {
				params: {
					query: params.query.replace(" ", "+"),
					engine: params.server || "myfreemp3",
				},
			});

			const options = { parse_mode: "Markdown" };
			this.bot.sendChatAction(chat.id, "upload_voice");

			_.map(data, async music => {
				if (music.download_link) {
					options.reply_markup = JSON.stringify({
						inline_keyboard: [
							[
								{
									text: `Download (${music.duration})`,
									url: music.download_link,
								},
							],
						],
					});

					this.bot.sendMessage(
						chat.id,
						`\u{2139} ${music.artiste} \n\u{1F4C0} ${music.title}`,
						options
					);
				}
			});

			this.bot.deleteMessage(chat.id, message_id);
		} catch (error) {
			errorHandler(this.bot, chat.id, error);
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
			"\u{1F50D} Tell me the music title or artiste name",
			{ reply_markup: JSON.stringify({ force_reply: true }) }
		);

		const listenerId = this.bot.onReplyToMessage(chatId, message_id, reply => {
			this.bot.removeReplyListener(listenerId);
			this.search(message, { query: reply.text });
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
				this.interactiveSearch(message);
				break;
		}
	}
};
