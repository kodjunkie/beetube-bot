const movieProvider = require("../providers/movie");
const musicProvider = require("../providers/music");
const errorHandler = require("../utils/error-handler");

/*
 * Handle "/search [provider] [whatever] -[server]"
 */
module.exports = bot => (message, match) => {
	const chatId = message.chat.id;
	const matches = match.groups;
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
								type: "search_movie",
							}),
						},
						{
							text: "\u{1F3B5} Music",
							callback_data: JSON.stringify({
								type: "search_music",
							}),
						},
					],
					[
						{
							text: "\u{1F4F9} Videos",
							callback_data: JSON.stringify({
								type: "search_video",
							}),
						},
						{
							text: "\u{1F30D} Torrent",
							callback_data: JSON.stringify({
								type: "search_torrent",
							}),
						},
					],
				],
			});

			bot.sendMessage(
				chatId,
				"Please select the search type \u{1F447}",
				options
			);

			return;
		}

		const params = { query: matches.Query, server: matches.Server || null };
		switch (matches.Provider) {
			case "movie":
				const movie = new movieProvider(bot);
				movie.search(message, params);
				break;
			case "music":
				const music = new musicProvider(bot);
				music.search(message, params);
				break;
			default:
				bot.sendMessage(
					chatId,
					"\u{1F6A7} This feature will be available soon."
				);
		}
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
