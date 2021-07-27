/*
 * Handle start command
 */
const User = require("../models/user");
const { keyboard } = require("../utils/bot-helper");
const errorHandler = require("../utils/error-handler");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	try {
		bot.sendChatAction(chatId, "typing");

		const from = message.from;
		await User.firstOrCreate(from);

		const botName = process.env.BOT_NAME;
		const botChannel = process.env.BOT_CHANNEL;
		const username = from.first_name
			? `[${from.first_name}](tg://user?id=${from.id})`
			: `@${from.username}`;

		const text = `Hi ${username} \u{1F680} \u{1F680} 
		\nWelcome to \u{1F41D} ${botName} bot\n\`we offer free \u{1F4C0} music, \u{1F3AC} movies, \u{1F30D} torrent, \u{1F3B5} EDM tracks, \u{1F4F9} anime downloads and more...\`
		\nTo stay updated on new *updates*, *features* and *bugfixes* happening on \u{1F41D} ${botName} join
		\nOfficial channel: [@${botChannel}](https://t.me/${botChannel})`;

		await bot.sendMessage(chatId, text, keyboard);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
