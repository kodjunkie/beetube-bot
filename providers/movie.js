const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");
const { keyboard, keypad } = require("../utils/bot-helper");

module.exports = class Movie extends Provider {
	constructor(bot) {
		super(bot);
		this.type = "movie";
		this.endpoint = process.env.GOPHIE_API;
	}

	/**
	 * List movies
	 * @param  {} message
	 * @param  {} page=1
	 */
	async list({ chat }, page = 1) {
		const { message_id } = await this.bot.sendMessage(
			chat.id,
			"\u{1F4E1} Fetching latest movies",
			keyboard
		);

		this.bot.sendChatAction(chat.id, "typing");
		const { data } = await axios.get(`${this.endpoint}/list`, {
			params: { page, engine: "fzmovies" },
		});

		if (data.length < 1) {
			await this.bot.deleteMessage(chat.id, message_id);
			await this.bot.sendMessage(
				chat.id,
				"\u{26A0} You've reached the end of the list.",
				keyboard
			);
			return;
		}

		const pages = [],
			promises = [],
			paging = data.pop();

		_.map(data, movie => {
			const options = { parse_mode: "html" };
			options.reply_markup = JSON.stringify({
				inline_keyboard: [
					[
						{
							text: `${keypad.download} (${movie.Size})`,
							url: movie.DownloadLink,
						},
					],
				],
			});

			promises.push(
				this.bot
					.sendMessage(
						chat.id,
						`<a href="${movie.CoverPhotoLink}">\u{1F3AC}</a> <b>${
							movie.Title
						}</b>${
							movie.Description
								? `\n\n<b>Description:</b> <em>${movie.Description.slice(
										0,
										-6
								  )}</em>`
								: ""
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
					type: `paginate_list_${this.type}`,
					page: page + 1,
				}),
			},
		];

		if (page > 1) {
			pagination.unshift({
				text: keypad.previous,
				callback_data: JSON.stringify({
					type: `paginate_list_${this.type}`,
					page: page - 1,
				}),
			});
		}

		await this.bot
			.sendMessage(
				chat.id,
				`<a href="${paging.CoverPhotoLink}">\u{1F3AC}</a> <b>${
					paging.Title
				}</b>${
					paging.Description
						? `\n\n<b>Description:</b> <em>${paging.Description.slice(
								0,
								-6
						  )}</em>`
						: ""
				}`,
				{
					parse_mode: "html",
					reply_markup: JSON.stringify({
						inline_keyboard: [
							[
								{
									text: `${keypad.download} (${paging.Size})`,
									url: paging.DownloadLink,
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
	 * Search for movies
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
				engine: "fzmovies",
			},
		});

		if (data.length < 1) {
			await this.bot.deleteMessage(chat.id, message_id);
			await this.bot.sendMessage(
				chat.id,
				"\u{26A0} No results found.",
				keyboard
			);
			return;
		}

		_.map(data, async movie => {
			if (movie.Size && movie.CoverPhotoLink) {
				const options = { parse_mode: "html" };
				options.reply_markup = JSON.stringify({
					inline_keyboard: [
						[
							{
								text: `${keypad.download} (${movie.Size})`,
								url: movie.DownloadLink,
							},
						],
					],
				});

				await this.bot.sendMessage(
					chat.id,
					`<a href="${movie.CoverPhotoLink}">\u{1F3AC}</a> <b>${
						movie.Title
					}</b>${
						movie.Description
							? `\n\n<b>Description:</b> <em>${movie.Description.slice(
									0,
									-6
							  )}</em>`
							: ""
					}`,
					options
				);
			}
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
			"\u{1F50D} Tell me the title of the movie you want",
			{ reply_markup: JSON.stringify({ force_reply: true }) }
		);

		const listenerId = this.bot.onReplyToMessage(
			chatId,
			message_id,
			async reply => {
				this.bot.removeReplyListener(listenerId);
				await this.search(message, { query: reply.text });
			}
		);
	}
};
