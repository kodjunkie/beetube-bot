const listCommand = require("../../commands/list");

it("responds to /list command", () => {
	expect.assertions(3);
	const message = bot.message();
	listCommand(bot)(message);
	expect(bot.sendChatAction.mock.calls.length).toBe(1);
	expect(bot.sendChatAction).toBeCalledWith(message.chat.id, "typing");
	expect(bot.sendMessage.mock.calls.length).toBe(1);
});
