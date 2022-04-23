exports.keyboard = {
	parse_mode: "Markdown",
	reply_markup: JSON.stringify({
		resize_keyboard: true,
		keyboard: [
			[
				{ text: "\u{1F3AC} Movie" },
				{ text: "\u{1F4C0} Music" },
				{ text: "\u{1F30D} Torrent" },
			],
			[{ text: "\u{1F3A1} Anime" }, { text: "\u{1F50D} Global Search" }],
			[{ text: "\u{2699} Settings" }, { text: "\u{1F4CC} About" }],
		],
	}),
};

exports.keypad = {
	share: "Share",
	download: "Download",
	next: "Next \u{27A1}",
	previous: "\u{2B05} Previous",
};

exports.settings = {
	text: `\u{2699} *Settings*
	\nUse this section to apply personalized custom tweaks to \u{1F41D} ${process.env.BOT_NAME}`,
	keyboard: {
		parse_mode: "Markdown",
		reply_markup: JSON.stringify({
			inline_keyboard: [
				[
					{
						text: "\u{23E9} Pagination",
						callback_data: JSON.stringify({
							type: "page_setting",
						}),
					},
					{
						text: "\u{1F4C0} Music Download",
						callback_data: JSON.stringify({
							type: "music_setting",
						}),
					},
				],
			],
		}),
	},
};
