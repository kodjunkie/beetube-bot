const errorHandler = require("../utils/error-handler");
const { firstOrCreate } = require("../utils/user-helper");
const { removeObsoleteRecords } = require("../utils/db-optimizer");

/*
 * Handle /start command
 */
module.exports = bot => async message => {
	const chatId = message.chat.id;
	try {
		// Remove obsolete db records
		removeObsoleteRecords();

		const from = message.from;
		await firstOrCreate(from);

		bot.sendChatAction(chatId, "typing");

		const username = from.first_name
			? `[${from.first_name}](tg://user?id=${from.id})`
			: `@${from.username}`;

		const text = `Hello ${username} \u{1F680} \u{1F680} \n\nWelcome to \u{1F41D} *Beetube* \u{1F41D} *Bot*, we offer free music, video, movie downloads and *more* \u{1F3B5} \u{1F3AC} \u{1F4C0}`;

		bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
