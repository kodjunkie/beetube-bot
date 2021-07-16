/*
 * Handle list command
 */

const movieProvider = require("../providers/movie");
const musicProvider = require("../providers/music");
const errorHandler = require("../utils/error-handler");

module.exports = bot => (message, match) => {
	const chatId = message.chat.id;
	try {
		const provider = match.groups.Provider.trim();
		if (!provider) return;

		switch (provider) {
			case "Movies":
				new movieProvider(bot).list(message);
				break;
			case "Music":
				new musicProvider(bot).list(message);
				break;
		}
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
