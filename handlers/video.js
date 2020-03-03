/*
 * Handle [videos]
 */
module.exports = bot => message => {
	const chatId = message.chat.id;
	bot.sendChatAction(chatId, "typing");
	bot.sendMessage(chatId, "This feature will be available soon \u{1F6A7}", {
		parse_mode: "Markdown",
	});
};
