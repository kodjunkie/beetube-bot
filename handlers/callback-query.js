/*
 * Handle callback queries
 */
const errorHandler = require("../utils/error-handler");

module.exports = bot => async cbq => {
	const chatId = cbq.message.chat.id;
	try {
		bot.answerCallbackQuery(cbq.id);

		const data = JSON.parse(cbq.data);
		let name = data.type.match(/(movie|music|torrent|anime)$/);
		if (name && name[0]) {
			const Provider = require(`../providers/${name[0]}`);
			await new Provider(bot).resolve(data, cbq.message);
		} else if (data.type.match(/settings/)) {
			name = data.type.split("_settings")[0];
			const Settings = require(`../settings/${name}`);
			await new Settings(bot).resolve(data, cbq.message);
		} else
			await bot.sendMessage(
				chatId,
				"\u{1F6A7} This feature will be available soon."
			);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
