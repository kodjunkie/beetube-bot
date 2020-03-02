/*
 * Matches "/search [service] [whatever] [service engine]"
 */
module.exports = bot => (message, match) => {
	bot.sendMessage(
		message.chat.id,
		`command: ${match[1]} \nservice: ${match[2]} \nquery: ${match[3]} \nengine: ${match[4]}`
	);
};
