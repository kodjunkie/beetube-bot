const errorHandler = require("../utils/error-handler");
const { firstOrCreate } = require("../utils/user-helper");
const { removeObsoleteRecords } = require("../utils/db-optimizer");
const keyboardMarkup = require("../utils/keyboard");

/*
 * Handle /start command
 */
module.exports = bot => async message => {
	const chatId = message.chat.id;
	try {
		// Remove obsolete db records
		await removeObsoleteRecords();

		const from = message.from;
		await firstOrCreate(from);

		await bot.sendChatAction(chatId, "typing");

		const username = from.first_name
			? `[${from.first_name}](tg://user?id=${from.id})`
			: `@${from.username}`;

		const text = `Hi ${username} \u{1F680} \u{1F680} 
		\nWelcome to \u{1F41D} ${process.env.BOT_NAME} bot\n\`we offer free \u{1F4C0} music, \u{1F3AC} movies, \u{1F30D} torrent, \u{1F3B5} EDM tracks, \u{1F4F9} video downloads and more...\`
		\nJoin our channel: @${process.env.BOT_CHANNEL}`;

		await bot.sendMessage(chatId, text, keyboardMarkup);
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
