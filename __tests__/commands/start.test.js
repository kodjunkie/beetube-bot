const startCommand = require("../../commands/start");

describe("/start", () => {
	it("response to command", () => {
		startCommand(bot)(botMsg());
		expect(bot.sendMessage.mock.calls.length).toBe(1);
	});
});
