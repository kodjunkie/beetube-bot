const AbstractSettings = require(".");
const Setting = require("../models/setting");
const errorHandler = require("../utils/error-handler");

module.exports = class MusicSettings extends AbstractSettings {
	/**
	 * Music settings
	 * @param  {} {chat
	 * @param  {} message_id}
	 */
	async settings({ chat, message_id }) {
		const settings = await Setting.findOne({ user: chat.id });
		const value = settings.chat_music_download ? 1 : 0;

		await this.bot.editMessageText(
			`\u{2B07} <b>Download music via chat</b> \u{1F6A7}
            \nEnabling this will allow you download music directly from chat.
			\n<b>Note:</b> The actual size is compressed and you can't download a music file of more than <em>200Mb</em> via chat.
			\n\u{2705} Supported formats
			- \t MPEG-1/2 Audio Layer III (MP3)
			- \t Free Lossless Audio Codec (FLAC)
			- \t Windows Media Audio (WMA)
			- \t Waveform Audio (WAV)
			- \t Ogg Vorbis Audio (OGG)
			- \t Audio Interchange File Format (AIFF)
			- \t Apple Lossless Audio Codec (ALAC)`,
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
					await this.settings(message);
					break;
				default:
					const match = data.type.match(/\d$/);
					if (!match || !match[0]) return;
					await Setting.updateOne(
						{ user: chatId },
						{ $set: { chat_music_download: !Boolean(parseInt(match[0])) } }
					);
					await this.settings(message);
			}
		} catch (error) {
			errorHandler(this.bot, chatId, error);
		}
	}
};
