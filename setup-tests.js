/*
 * A Mock of the node-telegram-bot-api object
 */
const botMock = {
	sendMessage: jest.fn(),
	sendChatAction: jest.fn(),

	/**
	 * Bot sample response by type
	 * @param  {} input="/start"
	 * @param  {} type="command"
	 * TODO : Refactor this function to something cleaner
	 */
	message: (input = "/start", type = "command") => {
		const message = {
			message_id: 105,
			from: {
				id: 12345,
				is_bot: false,
				first_name: "Lawrence",
				username: "kodjunkie",
				language_code: "en",
			},
			chat: {
				id: 12345,
				first_name: "Lawrence",
				username: "kodjunkie",
				type: "private",
			},
			date: 1583018575,
			text: input,
		};

		// Command "/anything"
		if (type === "command") {
			message.entities = [{ offset: 0, length: 6, type: "bot_command" }];
		}

		// inline_keyboard
		if (type === "text_mention") {
			message.entities = [
				{
					offset: 6,
					length: 9,
					type: "text_mention",
					user: {
						id: 12345,
						is_bot: false,
						first_name: "Lawrence",
						username: "kodjunkie",
						language_code: "en",
					},
				},
				{ offset: 32, length: 7, type: "bold" },
				{ offset: 43, length: 3, type: "bold" },
			];
		}

		return message;
	},
};

global.bot = botMock;
