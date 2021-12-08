/*
 * Handle start command
 */
const User = require("../models/user");
const { keyboard } = require("../utils/bot-helper");
const errorHandler = require("../utils/error-handler");

module.exports = bot => async message => {
	const chatId = message.chat.id;
	try {
		bot.sendChatAction(chatId, "typing");
		// Activate / create a new user
		const tgUser = message.from;
		const user = await User.firstOrCreate(tgUser);
		if (user.status === "blocked") {
			user.status = "active";
			await user.save();
		}

		const botName = process.env.BOT_NAME;
		const botChannel = process.env.BOT_CHANNEL;
		const username = tgUser.first_name
			? `[${tgUser.first_name}](tg://user?id=${tgUser.id})`
			: `@${tgUser.username}`;

		const text = `Hi ${username} \u{1F680}
		\n\u{1F41D} ${botName} offers free music, movies, anime, torrent, EDM tracks, series downloads, files, and more.
		\nTo stay up to date on new *features*, *bug fixes*, and *enhancements* happening here, join our official channel [@${botChannel}](https://t.me/${botChannel})`;

		await bot.sendMessage(chatId, text, keyboard);
	} catch (error) {
		errorHandler(bot, chatId, error);
	}
};
