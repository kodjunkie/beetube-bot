/**
 * @param bot
 * @param chatId
 * @param error
 */
module.exports = (bot, chatId, error) => {
	// Log errors in development mode
	if (error && process.env.NODE_ENV.includes("dev")) {
		console.error(error);
	}
	bot.sendMessage(chatId, "\u{1F6AB} An error occurred, try again later.");
};
