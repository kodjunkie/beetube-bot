/*
 * Handle about command
 */

const keyboardMarkup = require("../utils/keyboard");

module.exports = bot => message => {
	const chatId = message.chat.id;
	bot.sendMessage(
		chatId,
		"\u{1F6A7} This feature will be available soon.",
		keyboardMarkup
	);
};
