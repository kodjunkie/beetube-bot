/*
 * Matches [movies]
 * TODO improve and decouple code
 * Make the pagination show only on the last item
 */
require("dotenv").config();
const axios = require("axios");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	bot.sendChatAction(chatId, "typing");

	const { data } = await axios.get(`${process.env.MOVIES_API}?list=0`);
	const options = { parse_mode: "Markdown" };

	if (!data) {
		bot.sendMessage(
			chatId,
			`\u{26A0} An error occurred, try again \u{1F503}`,
			options
		);
		return;
	}

	const totalMovies = data.length - 1;
	data.map((movie, index) => {
		const downloadLink = `${movie.DownloadLink.Scheme}://${movie.DownloadLink.Host}${movie.DownloadLink.Path}?${movie.DownloadLink.RawQuery}`;

		const pagination = [];
		if (totalMovies === index) {
			pagination.push({ text: "Previous", callback_data: JSON.stringify({}) });
			pagination.push({ text: "Next", callback_data: JSON.stringify({}) });
		}

		options.reply_markup = JSON.stringify({
			inline_keyboard: [[{ text: "Download", url: downloadLink }], pagination],
		});

		bot.sendMessage(
			chatId,
			`Title: ${movie.Title} \nSize: ${movie.Size} \n[Download Cover](${movie.CoverPhotoLink})`,
			options
		);
	});
};
