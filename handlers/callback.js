const movieProvider = require("../providers/movie");
const errorHandler = require("../utils/error-handler");

/*
 * Handle callback queries
 */
module.exports = bot => cbq => {
	const data = JSON.parse(cbq.data);
	const chatId = cbq.message.chat.id;

	try {
		const movie = new movieProvider(bot);

		switch (data.type) {
			case "list_movies":
				movie.list(cbq.message);
				break;
			case "paginate_movies":
				movie.paginate(cbq.message, data.page);
				break;
			case "search_movies":
				movie.interactiveSearch(cbq.message);
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
