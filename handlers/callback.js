/*
 * Handle callback queries
 */
module.exports = bot => callbackQuery => {
	console.log("Query Callback");
	bot.answerCallbackQuery(callbackQuery.id, { info: "handled callback!" });
};
