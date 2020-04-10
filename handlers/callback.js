/*
 * Handle callback queries
 */
const errorHandler = require("../utils/error-handler");
const movieProvider = require("../providers/movie");

module.exports = bot => cbq => {
	const chatId = cbq.message.chat.id;
	const data = JSON.parse(cbq.data);

	try {
		const movie = new movieProvider(bot);

		switch (data.type) {
			case "list_movies":
				movie.list(cbq.message);
				break;
			case "paginate_movies":
				movie.paginate(cbq.message, data.page);
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
