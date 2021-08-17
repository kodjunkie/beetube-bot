/*
 * Handle callback queries
 */
const errorHandler = require("../utils/error-handler");

module.exports = bot => async cbq => {
	const message = cbq.message;
	const chatId = message.chat.id;

	try {
		bot.answerCallbackQuery(cbq.id);

		const data = JSON.parse(cbq.data);
		let name = data.type.match(/(movie|music|torrent|anime)$/);
		if (name && name[0]) {
			const Provider = require(`../providers/${name[0]}`);
			await new Provider(bot).resolve(data, message);
		} else if (data.type.match(/setting/)) {
			name = data.type.split("_setting")[0];
			const Settings = require(`../settings/${name}`);
			await new Settings(bot).resolve(data, message);
		} else
			await bot.sendMessage(
				chatId,
				"\u{1F6A7} This feature is not available yet."
			);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
