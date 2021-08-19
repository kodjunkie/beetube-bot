const Base = require(".");
const Setting = require("../models/setting");
const errorHandler = require("../utils/error-handler");

module.exports = class MusicSetting extends Base {
	/**
	 * Music settings
	 * @param  {} {chat
	 * @param  {} message_id}
	 */
	async setting({ chat, message_id }) {
		const settings = await Setting.findOne({ user: chat.id });
		const value = settings.chat_music_download ? 1 : 0;

		await this.bot.editMessageText(
			`\u{2B07} <b>Download music from chat</b>
            \nEnabling this will allow you download music directly from chat (<em>experimental</em>)
			\n\u{2705} Supported extensions
			- \t .mp3
			- \t .flac
			- \t .wma
			- \t .wav
			- \t .ogg
			- \t .aiff
			- \t .alac`,
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
									type: `music_setting_${value}`,
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
				case `music_${this.type}`:
					await this.setting(message);
					break;
				default:
					/* const match = data.type.match(/\d$/);
					if (!match || !match[0]) return;
					await Setting.updateOne(
						{ user: chatId },
						{ $set: { chat_music_download: !Boolean(parseInt(match[0])) } }
					);
					await this.setting(message); */
					await this.defaultReply(chatId);
			}
		} catch (error) {
			errorHandler(this.bot, chatId, error);
		}
	}
};
