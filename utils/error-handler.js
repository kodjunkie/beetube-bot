/**
 * @param bot
 * @param chatId
 * @param error
 */
module.exports = async (bot, chatId, error) => {
	if (error && process.env.NODE_ENV !== "production") {
		console.error(error);
	}

	await bot.sendMessage(
		chatId,
		"\u{1F6AB} An error occurred, try again later."
	);
};
