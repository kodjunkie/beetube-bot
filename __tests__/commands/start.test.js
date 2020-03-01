const startCommand = require("../../commands/start");

describe("/start", () => {
	it("responds to command", () => {
		startCommand(bot)(botMsg());
		expect(bot.sendMessage.mock.calls.length).toBe(1);
	});
});
