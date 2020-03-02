/*
 * Matches [movies]
 */
const movieProvider = require("../providers/movie");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	bot.sendChatAction(chatId, "typing");

	try {
		new movieProvider(bot).list(message);
	} catch (error) {
		bot.sendMessage(chatId, `\u{26A0} An error occurred, try again \u{1F503}`, {
			parse_mode: "Markdown",
		});
	}
};
