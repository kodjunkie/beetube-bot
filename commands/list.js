/*
 * Handle /list [whatever] command
 */
module.exports = bot => (message, match) => {
	const chatId = message.chat.id;
	bot.sendChatAction(chatId, "typing");
	const options = {
		parse_mode: "Markdown",
		reply_markup: JSON.stringify({
			keyboard: [
				["\u{1F3AC} Movies", "\u{1F3B5} Music"],
				["\u{1F4F9} Videos", "\u{1F30D} Torrent"],
			],
		}),
	};
	bot.sendMessage(
		chatId,
		"Here's a list of services we offer \u{2611}",
		options
	);
};
