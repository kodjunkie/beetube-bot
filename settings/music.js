const Settings = require(".");
const errorHandler = require("../utils/error-handler");

module.exports = class MusicSettings extends Settings {
	/**
	 * Music settings
	 * @param  {} {chat
	 * @param  {} message_id}
	 */
	async home({ chat, message_id }) {
		await this.bot.editMessageText(
			`\u{2B07} <b>Download music from chat</b>
            \nEnabling this will allow you download music directly from chat (<em>experimental</em>)`,
			{
				message_id,
				chat_id: chat.id,
				parse_mode: "html",
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[
							{
								text: "\u{274C} Disabled",
								callback_data: JSON.stringify({
									type: "music_settings_false",
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
				case `music_${this.type}`:
					await this.home(message);
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
