require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Commands
const startCommand = require("./commands/start");
const searchCommand = require("./commands/search");
const listCommand = require("./commands/list");

// Handlers
const callbackHandler = require("./handlers/callback");
const messageHandler = require("./handlers/message");
const movieHandler = require("./handlers/movie");

// Configurations
const bot = new TelegramBot(process.env.BOT_TOKEN, {
	polling: true,
	onlyFirstMatch: true,
});

// Commands
bot.onText(/\/start/i, startCommand(bot));
bot.onText(/(\/list)(.*)/i, listCommand(bot));
bot.onText(
	/^(?<Action>\/search)(?:\s+(?<Command>\w+)(?:\s+(?<Query>(?:\w|\s)+))?)?(?:\s+-(?<Engine>\w+))?$/i,
	searchCommand(bot)
);

// Handlers
bot.onText(/\s(movies)/i, movieHandler(bot));
bot.on("message", messageHandler(bot));
bot.on("callback_query", callbackHandler(bot));
