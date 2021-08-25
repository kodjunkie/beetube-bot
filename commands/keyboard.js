/*
 * Handle keyboard command
 */
const { keyboard } = require("../utils/bot-helper");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	await bot.sendMessage(chatId, "\u{2328} Keyboard enabled.", keyboard);
};
