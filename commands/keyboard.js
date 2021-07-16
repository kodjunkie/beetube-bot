/*
 * Handle keyboard command
 */

const keyboardMarkup = require("../utils/keyboard");

module.exports = bot => message => {
	const chatId = message.chat.id;
	bot.sendMessage(chatId, "\u{2328} Keyboard is enabled.", keyboardMarkup);
};
