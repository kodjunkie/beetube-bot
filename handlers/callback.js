/*
 * Handle callback queries
 */
const errorHandler = require("../utils/error-handler");

module.exports = bot => async cbq => {
	const chatId = cbq.message.chat.id;
	try {
		await bot.answerCallbackQuery(cbq.id);

		const data = JSON.parse(cbq.data);
		const name = data.type.match(/(movie|music|torrent|anime)$/)[0];
		if (name) {
			const Provider = require(`../providers/${name}`);
			await new Provider(bot).resolve(data, cbq.message);
		} else
			await bot.sendMessage(
				chatId,
				"\u{1F6A7} This feature will be available soon."
			);
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
