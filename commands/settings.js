/*
 * Handle settings command
 */

const keyboardMarkup = require("../utils/keyboard");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	await bot.sendMessage(
		chatId,
		"\u{1F6A7} This feature will be available soon.",
		keyboardMarkup
	);
};
