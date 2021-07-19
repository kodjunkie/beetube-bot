/*
 * Handle list command
 */
const errorHandler = require("../utils/error-handler");

module.exports = bot => async (message, match) => {
	const chatId = message.chat.id;
	try {
		const provider = match.groups.Provider.trim();
		if (!provider) return;

		switch (provider) {
			case "Music":
				const MusicProvider = require("../providers/music");
				const music = new MusicProvider(bot);
				await music.list(message, { page: 1 });
				break;
			default:
				const Provider = require(`../providers/${provider.toLowerCase()}`);
				await new Provider(bot).list(message);
		}
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
