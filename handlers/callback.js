const movieProvider = require("../providers/movie");
const musicProvider = require("../providers/music");
const errorHandler = require("../utils/error-handler");

/*
 * Handle callback queries
 */
module.exports = bot => cbq => {
	const chatId = cbq.message.chat.id;
	const data = JSON.parse(cbq.data);
	const type = data.type;

	try {
		if (type.match(/_movie$/)) {
			const movie = new movieProvider(bot);
			movie.resolve(data, cbq.message);
		} else if (type.match(/_music$/)) {
			const music = new musicProvider(bot);
			music.resolve(data, cbq.message);
		} else {
			bot.sendMessage(chatId, "\u{1F6A7} This feature will be available soon.");
		}
	} catch (error) {
		errorHandler(bot, chatId, error);
	}

	bot.answerCallbackQuery(cbq.id);
};
