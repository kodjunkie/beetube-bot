/*
 * Handle search command"
 */

module.exports = bot => async message => {
	const chatId = message.chat.id;
	const options = {
		parse_mode: "Markdown",
		reply_markup: JSON.stringify({
			inline_keyboard: [
				[
					{
						text: "\u{1F3AC} Movie",
						callback_data: JSON.stringify({
							type: "srch_movie",
						}),
					},
					{
						text: "\u{1F4C0} Music",
						callback_data: JSON.stringify({
							type: "srch_music",
						}),
					},
				],
				[
					{
						text: "\u{1F30D} Torrent",
						callback_data: JSON.stringify({
							type: "srch_torrent",
						}),
					},
					{
						text: "\u{1F3A1} Anime",
						callback_data: JSON.stringify({
							type: "srch_anime",
						}),
					},
				],
			],
		}),
	};

	bot.sendChatAction(chatId, "typing");
	await bot.sendMessage(
		chatId,
		"Select a category to proceed \u{1F447}",
		options
	);
};
