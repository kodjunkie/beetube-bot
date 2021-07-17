const MovieProvider = require("../providers/movie");
const MusicProvider = require("../providers/music");
const TorrentProvider = require("../providers/torrent");
const errorHandler = require("../utils/error-handler");

/*
 * Handle callback queries
 */
module.exports = bot => async cbq => {
	await bot.answerCallbackQuery(cbq.id);
	const chatId = cbq.message.chat.id;

	try {
		const data = JSON.parse(cbq.data);
		const type = data.type;

		if (type.match(/_movie$/)) {
			const movie = new MovieProvider(bot);
			await movie.resolve(data, cbq.message);
		} else if (type.match(/_music$/)) {
			const music = new MusicProvider(bot);
			await music.resolve(data, cbq.message);
		} else if (type.match(/_torrent$/)) {
			const torrent = new TorrentProvider(bot);
			await torrent.resolve(data, cbq.message);
		} else
			await bot.sendMessage(
				chatId,
				"\u{1F6A7} This feature will be available soon."
			);
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
