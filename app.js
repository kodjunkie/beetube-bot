require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Commands
const startCommand = require("./commands/start");
const searchCommand = require("./commands/search");

// Handlers
const callbackHandler = require("./handlers/callback");
const messageHandler = require("./handlers/message");

// Configurations
const bot = new TelegramBot(process.env.BOT_TOKEN, {
	polling: true,
	onlyFirstMatch: true,
});

// Commands
bot.onText(/\/start/, startCommand(bot));
bot.onText(/\/search (.+)/, searchCommand(bot));

// Handlers
bot.on("message", messageHandler(bot));
bot.on("callback_query", callbackHandler(bot));
