const MovieProvider = require("../providers/movie");
const MusicProvider = require("../providers/music");
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
			const movie = new MovieProvider(bot);
			movie.resolve(data, cbq.message);
		} else if (type.match(/_music$/)) {
			const music = new MusicProvider(bot);
			music.resolve(data, cbq.message);
		} else {
			bot.sendMessage(chatId, "\u{1F6A7} This feature will be available soon.");
		}
	} catch (error) {
		errorHandler(bot, chatId, error);
	}

	bot.answerCallbackQuery(cbq.id);
};
