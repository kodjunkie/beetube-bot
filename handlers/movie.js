/*
 * Handle [movies]
 */
const movieProvider = require("../providers/movie");
const errorHandler = require("../utils/error-handler");

module.exports = bot => message => {
	const chatId = message.chat.id;
	bot.sendChatAction(chatId, "upload_video");

	try {
		const movie = new movieProvider(bot);
		movie.list(message);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
