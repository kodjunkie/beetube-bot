/*
 * Handle about command
 */

const keyboardMarkup = require("../utils/keyboard");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	await bot.sendMessage(
		chatId,
		`\u{2139} *About this bot*
		\n\u{1F41D} \`${process.env.BOT_NAME}\` is an open source telegram bot developed to give users access to unlimited free downloads from within telegram. 
		\n\`If you find this bot useful, feel free to give us \u{2B50}\u{2B50}\u{2B50}\u{2B50}\u{2B50}\`
		\nWant to contribute to the development of this project? PRs are always welcome.
		\nChannel: @${process.env.BOT_CHANNEL}\nGithub: [kodjunkie/beetube-bot](https://github.com/kodjunkie/beetube-bot)`,
		keyboardMarkup
	);
};
