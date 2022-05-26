const AbstractSettings = require(".");
const Setting = require("../models/setting");
const errorHandler = require("../utils/error-handler");

module.exports = class PageSettings extends AbstractSettings {
	/**
	 * Pagination settings
	 * @param  {} {chat
	 * @param  {} message_id}
	 */
	async settings({ chat, message_id }) {
		const settings = await Setting.findOne({ user: chat.id });
		const value = settings.purge_old_pages ? 1 : 0;

		await this.bot.editMessageText(
			`\u{23E9} <b>Auto delete old messages</b>
            \nBy default previous messages are deleted during pagination to ease chat scrolling, use this section to change this behaviour.`,
			{
				message_id,
				chat_id: chat.id,
				parse_mode: "html",
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[
							{
								text: this.toggleFeedbackText(value),
								callback_data: JSON.stringify({
									type: `page_setting_${value}`,
								}),
							},
						],
						[
							{
								text: "\u{1F519} Back",
								callback_data: JSON.stringify({
									type: "index_setting",
								}),
							},
						],
					],
				}),
			}
		);
	}

	/**
	 * Task resolver
	 * @param  {} data
	 * @param  {} message
	 */
	async resolve(data, message) {
		const chatId = message.chat.id;
		try {
			switch (data.type) {
				case `page_${this.type}`:
					await this.settings(message);
					break;
				default:
					const match = data.type.match(/\d$/);
					if (!match || !match[0]) return;
					await Setting.updateOne(
						{ user: chatId },
						{ $set: { purge_old_pages: !Boolean(parseInt(match[0])) } }
					);
					await this.settings(message);
			}
		} catch (error) {
			errorHandler(this.bot, chatId, error);
		}
	}
};
