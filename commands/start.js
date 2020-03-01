/*
 * Matches /start command
 */
module.exports = bot => message => {
	const options = {
		parse_mode: "Markdown",
		reply_markup: JSON.stringify({
			keyboard: [
				["Nice", "Good", "Flat", "Tall"],
				["Nice", "Good", "Flat", "Tall"],
			],
		}),
	};
	const response = `Hello [${message.from.first_name}](tg://user?id=${message.from.id}) \n\nWelcome to \u{1F41D} *Beetube* \u{1F41D} *Bot*, we offer free music, videos, movies download and more. directly from __telegram__.`;

	bot.sendMessage(message.chat.id, response, options);
};
