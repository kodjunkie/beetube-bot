const errorHandler = require("../utils/error-handler");

/*
 * Handle search command"
 */
module.exports = bot => async message => {
	const chatId = message.chat.id;

	try {
		const options = {
			parse_mode: "Markdown",
			reply_markup: JSON.stringify({
				inline_keyboard: [
					[
						{
							text: "\u{1F3AC} Movies",
							callback_data: JSON.stringify({
								type: "search_movie",
							}),
						},
						{
							text: "\u{1F4C0} Music",
							callback_data: JSON.stringify({
								type: "search_music",
							}),
						},
						{
							text: "\u{1F30D} Torrent",
							callback_data: JSON.stringify({
								type: "search_torrent",
							}),
						},
					],
				],
			}),
		};

		await bot.sendChatAction(chatId, "typing");
		await bot.sendMessage(chatId, "Select a category \u{1F447}", options);
	} catch (error) {
		await errorHandler(bot, chatId, error);
	}
};
