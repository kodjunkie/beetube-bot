/*
 * Handle "/search [service] [whatever] -[service engine]"
 */
module.exports = bot => (message, match) => {
	// console.log(match.groups);

	bot.sendMessage(
		message.chat.id,
		"```json\n" + JSON.stringify(match.groups) + "```",
		{ parse_mode: "Markdown" }
	);
};
