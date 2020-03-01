const botMock = {
	sendMessage: jest.fn(),
};

const botMsgMock = (input = "/start", type = "command") => {
	const message = {
		message_id: 105,
		from: {
			id: 12345,
			is_bot: false,
			first_name: "KØDJŪ∩KĪ3",
			username: "kodjunkie",
			language_code: "en",
		},
		chat: {
			id: 12345,
			first_name: "KØDJŪ∩KĪ3",
			username: "kodjunkie",
			type: "private",
		},
		date: 1583018575,
		text: input,
	};

	if (type === "command") {
		message.entities = [{ offset: 0, length: 6, type: "bot_command" }];
	}

	return message;
};

global.bot = botMock;
global.botMsg = botMsgMock;
