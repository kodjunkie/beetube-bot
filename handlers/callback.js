/*
 * Handle callback queries
 */
const errorHandler = require("../utils/error-handler");
const movieProvider = require("../providers/movie");

module.exports = bot => callbackQuery => {
	try {
		const data = JSON.parse(callbackQuery.data);
		switch (data.type) {
			case "movie":
				const movie = new movieProvider(bot);
				movie.paginate(callbackQuery.message, data.page);
				break;
			default:
				console.log("Query Callback: ", callbackQuery);
		}
	} catch (error) {
		errorHandler(bot, callbackQuery.message.chat.id, error);
	}
	bot.answerCallbackQuery(callbackQuery.id);
};
