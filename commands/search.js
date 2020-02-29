/*
 * Matches "/search [whatever]"
 */
module.exports = bot => (message, match) => {
	bot.sendMessage(message.chat.id, match[1]);
};
