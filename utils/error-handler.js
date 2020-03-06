module.exports = (bot, chatId, error) => {
	if (error && process.env.NODE_ENV !== "production") {
		console.error(error);
	}

	bot.sendMessage(chatId, `\u{26A0} An error occurred, try again \u{26A0}`, {
		parse_mode: "Markdown",
	});
};
