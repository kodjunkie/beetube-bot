/*
 * Handle "/search [provider] [whatever] -[server]"
 */

const movieProvider = require("../providers/movie");

module.exports = bot => (message, match) => {
	const chatId = message.chat.id;
	const matches = match.groups;
	bot.sendChatAction(chatId, "typing");

	switch (matches.Provider) {
		case "movies":
			const params = { query: matches.Query, server: matches.Server || null };
			const movie = new movieProvider(bot);
			movie.search(message, params);
			break;
		default:
			bot.sendMessage(chatId, "This feature will be available soon \u{1F6A7}");
	}
};
