/*
 * Handle callback queries
 */
const errorHandler = require("../utils/error-handler");
const movieProvider = require("../providers/movie");

module.exports = bot => cb => {
	bot.answerCallbackQuery(cb.id);
	try {
		const data = JSON.parse(cb.data);
		switch (data.type) {
			case "movie":
				new movieProvider(bot).paginate(cb.message, data.list);
				break;
			default:
				console.log("Query Callback: ", cb);
		}
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
