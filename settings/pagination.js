const Settings = require(".");
const errorHandler = require("../utils/error-handler");

module.exports = class PaginationSettings extends Settings {
	/**
	 * Pagination settings
	 * @param  {} {chat
	 * @param  {} message_id}
	 */
	async home({ chat, message_id }) {
		await this.bot.editMessageText(
			`\u{23E9} *Delete previous page results*
            \nBy default previous results are removed during pagination to ease chat scrolling, use this section to change this behaviour.`,
			{
				message_id,
				chat_id: chat.id,
				parse_mode: "Markdown",
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[
							{
								text: "\u{2705} Enabled",
								callback_data: JSON.stringify({
									type: "pagination_settings_false",
								}),
							},
						],
						[
							{
								text: "\u{1F519} Back",
								callback_data: JSON.stringify({
									type: "index_settings",
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
		try {
			switch (data.type) {
				case `pagination_${this.type}`:
					await this.home(message, data);
					break;
				default:
					if (data.type.match(/(true|false)$/)) {
						this.defaultReply(message.chat.id);
					}
			}
		} catch (error) {
			errorHandler(this.bot, message.chat.id, error);
		}
	}
};
