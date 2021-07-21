/*
 * Handle settings command
 */
const Paginator = require("../models/paginator");
const { keyboard } = require("../utils/bot-helper");
const errorHandler = require("../utils/error-handler");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	try {
		await bot.sendChatAction(chatId, "typing");

		// Remove obsolete db records
		await Paginator.removeObsoleteRecords();

		await bot.sendMessage(
			chatId,
			`\u{1F41D} You need to join [@${process.env.BOT_CHANNEL}](https://t.me/beetubers) to use this feature, it is exclusive only to our channel subscribers.
			\nBeing a part of the community makes you aware of new *updates*, *features* and *bugfixes* happening on \`${process.env.BOT_NAME}\` bot \u{1F680} \u{1F680}`,
			keyboard
		);
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
