/*
 * Handle list command
 */
const MovieProvider = require("../providers/movie");
const MusicProvider = require("../providers/music");
const TorrentProvider = require("../providers/torrent");
const errorHandler = require("../utils/error-handler");

module.exports = bot => async (message, match) => {
	const chatId = message.chat.id;
	try {
		const provider = match.groups.Provider.trim();
		if (!provider) return;

		switch (provider) {
			case "Movies":
				const movie = new MovieProvider(bot);
				await movie.list(message);
				break;
			case "Music":
				const music = new MusicProvider(bot);
				await music.list(message, { page: 1 });
				break;
			case "Torrent":
				const torrent = new TorrentProvider(bot);
				await torrent.list(message);
				break;
		}
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
