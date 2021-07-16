/*
 * Handle keyboard command
 */

const keyboardMarkup = require("../utils/keyboard");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	await bot.sendMessage(
		chatId,
		"\u{2328} Keyboard is enabled.",
		keyboardMarkup
	);
};
