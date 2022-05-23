/*
 * Handle settings command
 */
const Setting = require("../models/setting");
const Paginator = require("../models/paginator");
const { settings } = require("../utils/bot-helper");
const errorHandler = require("../utils/error-handler");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	try {
		bot.sendChatAction(chatId, "typing");

		// Remove obsolete page records
		// TODO: Refactor into a separate script
		// Can be run periodically using supervisor / cron
		await Paginator.removeObsoleteRecords();

		// Create user settings if it doesn't exists
		await Setting.firstOrCreate(chatId);
		// Reply with settings
		await bot.sendMessage(chatId, settings.text, settings.keyboard);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
