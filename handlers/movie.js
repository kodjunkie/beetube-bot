/*
 * Handle [movies]
 */
const movieProvider = require("../providers/movie");
const errorHandler = require("../utils/error-handler");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	bot.sendChatAction(chatId, "typing");

	try {
		new movieProvider(bot).list(message);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
