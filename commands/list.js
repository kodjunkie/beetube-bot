/*
 * Handle /list command
 */

const movieProvider = require("../providers/movie");
const musicProvider = require("../providers/music");
const errorHandler = require("../utils/error-handler");

module.exports = bot => (message, match) => {
	const matches = match.groups;
	const chatId = message.chat.id;
	const options = { parse_mode: "Markdown" };
	bot.sendChatAction(chatId, "typing");

	try {
		if (!matches.Provider) {
			options.reply_markup = JSON.stringify({
				inline_keyboard: [
					[
						{
							text: "\u{1F3AC} Movies",
							callback_data: JSON.stringify({
								type: "list_movie",
							}),
						},
						{
							text: "\u{1F3B5} Music",
							callback_data: JSON.stringify({
								type: "list_music",
							}),
						},
					],
					[
						{
							text: "\u{1F4F9} Videos",
							callback_data: JSON.stringify({
								type: "list_video",
							}),
						},
						{
							text: "\u{1F30D} Torrent",
							callback_data: JSON.stringify({
								type: "list_torrent",
							}),
						},
					],
				],
			});

			bot.sendMessage(
				chatId,
				"Please select the service category \u{1F447}",
				options
			);

			return;
		}

		switch (matches.Provider) {
			case "movie":
				const movie = new movieProvider(bot);
				movie.list(message);
				break;
			case "music":
				const music = new musicProvider(bot);
				music.list(message);
				break;
			default:
				bot.sendMessage(
					chatId,
					"\u{1F6AB} You can only request for a list of the services we offer."
				);
		}
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
