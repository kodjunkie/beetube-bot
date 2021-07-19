/*
 * Handle settings command
 */
const Paginator = require("../models/paginator");
const keyboardMarkup = require("../utils/keyboard");
const errorHandler = require("../utils/error-handler");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	try {
		await bot.sendChatAction(chatId, "typing");

		// Remove obsolete db records
		await Paginator.removeObsoleteRecords();

		await bot.sendMessage(
			chatId,
			"\u{1F6A7} This feature will be available soon.",
			keyboardMarkup
		);
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
