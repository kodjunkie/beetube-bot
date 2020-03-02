/*
 * Handle callback queries
 */
module.exports = bot => callbackQuery => {
	console.log("Query Callback: ", callbackQuery);
	bot.answerCallbackQuery(callbackQuery.id, { info: "handled callback!" });
};
