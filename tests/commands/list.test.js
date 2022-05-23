const listCommand = require("../../commands/list");

it("responds to /list command", async () => {
	expect.assertions(1);
	const response = await listCommand(bot)(bot.message(), {
		groups: { Provider: "" },
	});
	expect(response).toBe(undefined);
});
