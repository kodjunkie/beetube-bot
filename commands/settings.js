/*
 * Handle settings command
 */
const Paginator = require("../models/paginator");
const { settings } = require("../utils/bot-helper");
const errorHandler = require("../utils/error-handler");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	try {
		bot.sendChatAction(chatId, "typing");
		// Remove obsolete records
		await Paginator.removeObsoleteRecords();
		await bot.sendMessage(chatId, settings.text, settings.keyboard);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
