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

		const text = `Hello ${username} \u{1F680} \u{1F680} 
		\nWelcome to \u{1F41D} *${process.env.BOT_NAME}* \u{1F41D}\nwe offer free \u{1F3B5} music, \u{1F4C0} movies, torrent \u{1F30D} downloads and *more* \u{1F4E1}`;

		await bot.sendMessage(chatId, text, keyboardMarkup);
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
