module.exports = {
	parse_mode: "Markdown",
	reply_markup: JSON.stringify({
		resize_keyboard: true,
		keyboard: [
			[
				{ text: "\u{1F3AC} Movies" },
				{ text: "\u{1F4C0} Music" },
				{ text: "\u{1F30D} Torrent" },
			],
			[{ text: "\u{1F4E1} Search for anything" }],
			[{ text: "\u{2699} Settings" }, { text: "\u{1F4CC} About" }],
		],
	}),
};
