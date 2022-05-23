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
		`\u{2139} *About this bot*
		\n\u{1F41D} \`${env.BOT_NAME}\` is an open source telegram bot developed to give users access to unlimited free downloads within telegram. 
		\n\`If you find this bot useful, feel free to give us a \u{2B50} on Github.\`
		\nWant to contribute to the development of this project? PRs are always welcome.
		\nOfficial channel: @${env.BOT_CHANNEL}\nGithub: [kodjunkie/beetube-bot](${homepage})\nFor bug report create an [issue](${bugs.url})`,
		keyboard
	);
};
