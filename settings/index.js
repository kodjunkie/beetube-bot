const errorHandler = require("../utils/error-handler");
const { settings, keyboard } = require("../utils/bot-helper");

module.exports = class Settings {
	constructor(bot) {
		this.bot = bot;
		this.type = "settings";
	}

	/**
	 * Settings
	 * @param  {} {chat
	 * @param  {} message_id}
	 */
	async home({ chat, message_id }) {
		await this.bot.editMessageText(settings.text, {
			...settings.keyboard,
			message_id,
			chat_id: chat.id,
		});
	}

	/**
	 * @param  {} chatId
	 */
	defaultReply(chatId) {
		const botChannel = process.env.BOT_CHANNEL;
		this.bot.sendMessage(
			chatId,
			`\u{1F41D} You need to join [@${botChannel}](https://t.me/${botChannel}) to use this feature, it is exclusive only to our channel subscribers.
			\nBeing a part of the community makes you aware of new *updates*, *features* and *bugfixes* happening on \`${process.env.BOT_NAME}\` bot \u{1F680} \u{1F680}`,
			keyboard
		);
	}

	/**
	 * Task resolver
	 * @param  {} data
	 * @param  {} message
	 */
	async resolve(data, message) {
		try {
			switch (data.type) {
				case `index_${this.type}`:
					await this.home(message);
					break;
			}
		} catch (error) {
			errorHandler(this.bot, message.chat.id, error);
		}
	}
};
