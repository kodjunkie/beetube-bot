/*
 * Matches /start command
 */
module.exports = bot => message => {
	const chatId = message.chat.id;
	bot.sendChatAction(chatId, "typing");

	const user = message.from;
	const username = user.first_name
		? `[${user.first_name}](tg://user?id=${user.id}) ( @${user.username} )`
		: `@${user.username}`;

	const text = `Hello ${username} \u{1F680} \n\nWelcome to \u{1F41D} *Beetube* \u{1F41D} *Bot*, we offer free music, video, movie downloads and *more* \u{1F3B5} \u{1F3AC}`;

	bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
};
