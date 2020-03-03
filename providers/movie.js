require("dotenv").config();
const _ = require("lodash");
const axios = require("axios");
const Provider = require(".");

module.exports = class Movie extends Provider {
	/**
	 * List items
	 * @param  {} message
	 */
	async list({ chat }) {
		const { data } = await axios.get(`${process.env.MOVIES_API}?list=1`);
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
								{ text: "Previous", callback_data: JSON.stringify({}) },
								{ text: "Next", callback_data: JSON.stringify({}) },
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
				isLastItem ? 1000 : 0
			);
		});
	}
};
