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
		switch (type) {
			case type.match(/_movies$/).input:
				const movie = new movieProvider(bot);
				movie.resolve(data, cbq.message);
				break;
			default:
				bot.sendMessage(
					chatId,
					"This feature will be available soon \u{1F6A7}"
				);
		}
	} catch (error) {
		errorHandler(bot, chatId, error);
	}

	bot.answerCallbackQuery(cbq.id);
};
