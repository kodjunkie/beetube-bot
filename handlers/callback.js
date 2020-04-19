const movieProvider = require("../providers/movie");
const errorHandler = require("../utils/error-handler");

/*
 * Handle callback queries
 */
module.exports = bot => cbq => {
	const chatId = cbq.message.chat.id;
	const data = JSON.parse(cbq.data);
	const type = data.type;

	try {
		if (type.match(/_movies$/)) {
			const movie = new movieProvider(bot);
			movie.resolve(data, cbq.message);
		} else {
			bot.sendMessage(chatId, "This feature will be available soon \u{1F6A7}");
		}
	} catch (error) {
		errorHandler(bot, chatId, error);
	}

	bot.answerCallbackQuery(cbq.id);
};
