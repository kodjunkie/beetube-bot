const _ = require("lodash");
const Provider = require(".");
const axios = require("axios");
const Setting = require("../models/setting");
const Paginator = require("../models/paginator");
const errorHandler = require("../utils/error-handler");
const { keyboard, keypad } = require("../utils/bot-helper");

const env = process.env;

module.exports = class Music extends Provider {
	constructor(bot) {
		super(bot);
		this.type = "music";
		this.endpoint = env.RASPAR_API;
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

		if (data.length < 1) return this.emptyAPIResponse(chat.id, message_id);

		const genre = params.genre || false;
		const page = params.page;
		const pages = [];
		const settings = await Setting.findOne({ user: chat.id });

		if (genre) {
			const promises = [],
				pager = data.pop();

			_.map(data, music => {
				const options = { parse_mode: "html" };
				options.reply_markup = JSON.stringify({
					inline_keyboard: [this.getDlButton(music, settings)],
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
						type: `page_ls_${this.type}`,
						page: page + 1,
						genre,
					}),
				},
			];

			if ((!settings || settings.purge_old_pages) && page > 1) {
				pagination.unshift({
					text: keypad.previous,
					callback_data: JSON.stringify({
						type: `page_ls_${this.type}`,
						page: page - 1,
						genre,
					}),
				});
			}

			await this.bot
				.sendMessage(chat.id, `\u{1F4BF} <b>${pager.name}</b>`, {
					parse_mode: "html",
					reply_markup: JSON.stringify({
						inline_keyboard: [this.getDlButton(pager, settings), pagination],
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
					type: `ls_${this.type}`,
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
						inline_keyboard: _.chunk(_.uniqBy(keyboardLayout, "text"), 3),
					}),
				}
			);
		}

		await this.bot.deleteMessage(chat.id, message_id);
		if (genre && (!settings || settings.purge_old_pages))
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

		if (data.length < 1)
			return this.emptyAPIResponse(chat.id, message_id, "No results found.");

		const page = params.page;
		const pages = [],
			promises = [],
			pager = data.pop(),
			settings = await Setting.findOne({ user: chat.id });

		_.map(data, music => {
			const options = { parse_mode: "html" };
			options.reply_markup = JSON.stringify({
				inline_keyboard: [this.getDlButton(music, settings)],
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
					type: `page_srch_${this.type}`,
					page: page + 1,
					query,
				}),
			},
		];

		if ((!settings || settings.purge_old_pages) && page > 1) {
			pagination.unshift({
				text: keypad.previous,
				callback_data: JSON.stringify({
					type: `page_srch_${this.type}`,
					page: page - 1,
					query,
				}),
			});
		}

		await this.bot
			.sendMessage(chat.id, `\u{1F4BF} <b>${pager.name}</b>`, {
				parse_mode: "html",
				reply_markup: JSON.stringify({
					inline_keyboard: [this.getDlButton(pager, settings), pagination],
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
				await this.searchQueryValidator(reply, message, page);
			}
		);
	}

	/**
	 * Get the download button
	 * @param  {} music
	 * @param  {} settings
	 */
	getDlButton(music, settings) {
		const size = music.size;
		let button = { text: `${keypad.download} (${size})`, url: music.url };
		const supportedExts = ["mp3", "flac", "wma", "wav", "ogg", "aiff", "alac"];
		const ext = decodeURIComponent(music.url)
			.split(".")
			.pop();

		if (!size || !supportedExts.includes(ext.toLowerCase())) return [button];
		/*
		 * Ensure the size of the file is not more than 50MB
		 * @see https://core.telegram.org/bots/api#sendaudio
		 */
		if (settings && settings.chat_music_download && parseFloat(size) <= 50) {
			const url = new URL(music.url);
			button = {
				text: `${keypad.download} (${size})`,
				callback_data: JSON.stringify({
					type: `dl_${this.type}`,
					info: `${music.name
						.replace(/[^\w\s]/gi, "")
						.replace(/_/, "")
						.substr(0, 13)}_${url.host.split(".").shift()}_${music.key}`,
				}),
			};
		}

		return [button];
	}

	/**
	 * Send audio file to chat
	 * @param  {} message
	 * @param  {} data
	 */
	async download(message, data) {
		const chatId = message.chat.id;
		const { message_id } = await this.bot.sendMessage(
			chatId,
			"\u{2B07} Preparing the music for download",
			keyboard
		);

		let [name, sub, key] = data.info.split("_");
		name = name + " - " + key;

		const url = new URL(`https://${sub}.zippyshare.com/downloadAudio`);
		url.searchParams.append("key", key);
		url.searchParams.append("time", "");
		const music = await axios.get(url.href, { responseType: "stream" });

		await this.bot.sendAudio(
			chatId,
			music.data,
			{
				...keyboard,
				title: name,
				caption: `Downloaded via \u{1F41D} [${env.BOT_NAME} bot](https://t.me/${env.TG_BOT_NAME})`,
				reply_to_message_id: message.message_id,
				allow_sending_without_reply: true,
			},
			{
				filename: `${name}.m4a`,
				contentType: "audio/m4a",
			}
		);

		await this.bot.deleteMessage(chatId, message_id);
	}

	/**
	 * Task resolver
	 * @param  {} data
	 * @param  {} message
	 */
	async resolve(data, message) {
		try {
			switch (data.type) {
				case `ls_${this.type}`:
					await this.list(message, data);
					break;
				case `page_ls_${this.type}`:
					await this.paginate(message, data, "list");
					break;
				case `srch_${this.type}`:
					await this.interactiveSearch(message, data.page);
					break;
				case `page_srch_${this.type}`:
					await this.paginate(message, data, "search");
					break;
				case `dl_${this.type}`:
					await this.download(message, data);
			}
		} catch (error) {
			errorHandler(this.bot, message.chat.id, error);
		}
	}
};
