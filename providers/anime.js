const _ = require("lodash");
const Provider = require(".");
const {
	message: { textLimit },
} = require("../config");
const axios = require("axios");
const Setting = require("../models/setting");
const Paginator = require("../models/paginator");
const { keyboard, keypad } = require("../utils/bot-helper");

const botTGname = process.env.TG_BOT_NAME;

module.exports = class Anime extends Provider {
	constructor(bot) {
		super(bot);
		this.type = "anime";
		this.endpoint = process.env.GOPHIE_API;
	}

	/**
	 * List anime
	 * @param  {} message
	 * @param  {} page=1
	 */
	async list({ chat }, page = 1) {
		const { message_id } = await this.bot.sendMessage(
			chat.id,
			"\u{1F4E1} Fetching latest anime",
			keyboard
		);

		this.bot.sendChatAction(chat.id, "typing");
		const { data } = await axios.get(`${this.endpoint}/list`, {
			params: { page, engine: "animeout" },
		});

		if (data.length < 1) {
			return this.emptyAPIResponse(chat.id, message_id);
		}

		const pages = [],
			promises = [],
			pager = data.pop();

		_.map(data, anime => {
			const options = { parse_mode: "html" };
			options.reply_markup = JSON.stringify({
				inline_keyboard: [
					[
						{ text: keypad.download, url: anime.DownloadLink },
						{
							text: keypad.share,
							url: `https://t.me/share/url?url=${encodeURIComponent(
								anime.DownloadLink
							)}&text=Downloaded%20via%20@${botTGname}`,
						},
					],
				],
			});

			promises.push(
				this.bot
					.sendMessage(chat.id, this.getText(anime), options)
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
					type: `page_ls_${this.type}`,
					page: page + 1,
				}),
			},
		];

		const settings = await Setting.findOne({ user: chat.id });
		if ((!settings || settings.purge_old_pages) && page > 1) {
			pagination.unshift({
				text: keypad.previous,
				callback_data: JSON.stringify({
					type: `page_ls_${this.type}`,
					page: page - 1,
				}),
			});
		}

		await this.bot
			.sendMessage(chat.id, this.getText(pager), {
				parse_mode: "html",
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[
							{ text: keypad.download, url: pager.DownloadLink },
							{
								text: keypad.share,
								url: `https://t.me/share/url?url=${encodeURIComponent(
									pager.DownloadLink
								)}&text=Downloaded%20via%20@${botTGname}`,
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

		await this.bot.deleteMessage(chat.id, message_id);
		if (!settings || settings.purge_old_pages) await Paginator.bulkWrite(pages);
	}

	/**
	 * Search for anime
	 * @param  {} message
	 * @param  {} params
	 */
	async search({ chat }, params) {
		const { message_id } = await this.bot.sendMessage(
			chat.id,
			`\u{1F4E1} Searching for \`${params.query}\``,
			keyboard
		);

		this.bot.sendChatAction(chat.id, "typing");
		const { data } = await axios.get(`${this.endpoint}/search`, {
			params: {
				query: params.query.replace(" ", "+"),
				engine: "animeout",
			},
		});

		if (data.length < 1) {
			return this.emptyAPIResponse(chat.id, message_id, "No results found.");
		}

		_.map(data, async anime => {
			const options = { parse_mode: "html" };
			options.reply_markup = JSON.stringify({
				inline_keyboard: [
					[
						{ text: keypad.download, url: anime.DownloadLink },
						{
							text: keypad.share,
							url: `https://t.me/share/url?url=${encodeURIComponent(
								anime.DownloadLink
							)}&text=Downloaded%20via%20@${botTGname}`,
						},
					],
				],
			});

			await this.bot.sendMessage(chat.id, this.getText(anime), options);
		});

		await this.bot.deleteMessage(chat.id, message_id);
	}

	/**
	 * Interactive search
	 * @param  {} message
	 */
	async interactiveSearch(message) {
		const chatId = message.chat.id;
		const { message_id } = await this.bot.sendMessage(
			chatId,
			"\u{1F50D} Tell me the title of the anime you want",
			{ reply_markup: JSON.stringify({ force_reply: true }) }
		);

		const listenerId = this.bot.onReplyToMessage(
			chatId,
			message_id,
			async reply => {
				this.bot.removeReplyListener(listenerId);
				await this.searchQueryValidator(reply, message);
			}
		);
	}

	/**
	 * @param  {} anime
	 */
	getText(anime) {
		let description = anime.Description;
		if (description) {
			if (description.length > textLimit)
				description = `\n\n<b>Description:</b> <em>${description.substr(
					0,
					textLimit
				)}...</em>`;
			else description = `\n\n<b>Description:</b> <em>${description}</em>`;
		} else description = "";

		return `<a href="${anime.CoverPhotoLink}">\u{1F3A1}</a> <b>${anime.Title}</b>${description}`;
	}
};
