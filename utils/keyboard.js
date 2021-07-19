module.exports = {
	parse_mode: "Markdown",
	reply_markup: JSON.stringify({
		resize_keyboard: true,
		keyboard: [
			[
				{ text: "\u{1F3AC} Movie" },
				{ text: "\u{1F4C0} Music" },
				{ text: "\u{1F30D} Torrent" },
			],
			[{ text: "\u{1F50D} Search" }, { text: "\u{1F3A1} Anime" }],
			[{ text: "\u{2699} Settings" }, { text: "\u{1F4CC} About" }],
		],
	}),
};
