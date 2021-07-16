const errorHandler = require("../utils/error-handler");

/*
 * Handle search command"
 */
module.exports = bot => message => {
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
							text: "\u{1F3B5} Music",
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

		bot.sendChatAction(chatId, "typing");
		bot.sendMessage(chatId, "Please select the category \u{1F447}", options);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
