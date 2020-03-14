const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");
const Paginator = require("../models/paginator");

module.exports = class Movie extends Provider {
	/**
	 * List items
	 * @param  {} message
	 * @param  {} list=1
	 */
	async list({ chat }, list = 1) {
		const { message_id } = await this.bot.sendMessage(
			chat.id,
			"\u{1F504} Fetching movies \u{1F4E1}"
		);

		const { data } = await axios.get(`${process.env.MOVIES_API}?list=${list}`);
		const options = { parse_mode: "Markdown" };

		_.map(data, (movie, i) => {
			const isLastItem = data.length - 1 === i;
			/*
			 * Used setTimeout to ensure all messages are sent before pagination
			 */
			setTimeout(
				async () => {
					const downloadLink = `${movie.DownloadLink.Scheme}://${movie.DownloadLink.Host}${movie.DownloadLink.Path}?${movie.DownloadLink.RawQuery}`;

					const pagination = isLastItem
						? [
								{
									text: "Previous",
									callback_data: JSON.stringify({
										type: "movie",
										list: list - 1,
									}),
								},
								{
									text: "Next",
									callback_data: JSON.stringify({
										type: "movie",
										list: list + 1,
									}),
								},
						  ]
						: [];

					options.reply_markup = JSON.stringify({
						inline_keyboard: [
							[{ text: `Download ${movie.Size}`, url: downloadLink }],
							pagination,
						],
					});

					const msg = await this.bot.sendMessage(
						chat.id,
						`[\u{1F4C0}](${movie.CoverPhotoLink}) *${movie.Title}*`,
						options
					);

					await new Paginator({
						_id: msg.message_id,
						type: "movie",
						user: msg.chat.id,
					}).save();
				},
				isLastItem ? 2500 : 0
			);
		});

		this.bot.deleteMessage(chat.id, message_id);
	}

	/**
	 * Handle pagination
	 * @param  {} message
	 * @param  {} list
	 */
	async paginate(message, list) {
		if (list === 0) return;
		const chatId = message.chat.id;
		const results = await Paginator.find({
			user: chatId,
			type: "movie",
			createdAt: { $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
		});

		const IDs = [];
		_.map(results, result => {
			IDs.push(result._id);
			this.bot.deleteMessage(chatId, result._id);
		});

		await this.list(message, list);
		await Paginator.deleteMany({ _id: { $in: IDs } });
	}
};
