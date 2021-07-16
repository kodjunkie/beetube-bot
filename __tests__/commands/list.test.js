const listCommand = require("../../commands/list");

it("responds to /list command", () => {
	expect.assertions(1);
	const response = listCommand(bot)(bot.message(), {
		groups: { Provider: "" },
	});
	expect(response).toBe(undefined);
});
