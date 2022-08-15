/*
 * Handle about command
 */
const { homepage, bugs } = require("../package.json");
const { keyboard } = require("../utils/bot-helper");

const env = process.env;

module.exports = bot => async message => {
	const chatId = message.chat.id;
	await bot.sendMessage(
		chatId,
		`\u{2139} *About*
		\n${env.BOT_NAME} is an open source bot developed to give users access to unlimited free downloads from within telegram. 
		\nOfficial channel: @${env.BOT_CHANNEL}\nGithub: [kodjunkie/beetube-bot](${homepage})\nFor bug report create an [issue](${bugs.url})
		\n\`If you find this bot useful, feel free to give us a \u{2B50}\`
		\nWant to contribute to the development of this project? PRs are welcomed.`,
		keyboard
	);
};
