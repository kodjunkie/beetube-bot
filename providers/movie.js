require("dotenv").config();
const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");

module.exports = class Movie extends Provider {
	/**
	 * List items
	 * @param  {} message
	 * @param  {} list=1
	 */
	async list({ chat }, list = 1) {
		const { data } = await axios.get(`${process.env.MOVIES_API}?list=${list}`);
		const options = { parse_mode: "Markdown" };

		_.map(data, (movie, i) => {
			const isLastItem = data.length - 1 === i;
			/*
			 * Used setTimeout as a hack to ensure
			 * all messages are sent before pagination
			 */
			setTimeout(
				() => {
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

					this.bot.sendMessage(
						chat.id,
						`[\u{1F4CC}](${movie.CoverPhotoLink}) *${movie.Title}*`,
						options
					);
				},
				isLastItem ? 2000 : 0
			);
		});
	}

	/**
	 * Handle pagination
	 * @param  {} message
	 * @param  {} list
	 */
	async paginate(message, list) {
		if (list === 0) return;
		this.list(message, list);
	}
};
