require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");
const mongoose = require("mongoose");

// Commands
const startCommand = require("./commands/start");
const searchCommand = require("./commands/search");
const listCommand = require("./commands/list");

// Handlers
const callbackHandler = require("./handlers/callback");
const messageHandler = require("./handlers/message");

// Configurations
const bot = new TelegramBot(process.env.BOT_TOKEN, config.bot);

mongoose
	.connect(process.env.MONGODB_URI, config.mongodb)
	.then(() => {
		// Commands
		bot.onText(/\/start/, startCommand(bot));
		bot.onText(/^(?<Action>\/list)(?:\s+(?<Provider>\w+))?$/, listCommand(bot));
		bot.onText(
			/^(?<Action>\/search)(?:\s+(?<Provider>\w+)(?:\s+(?<Query>(?:\w|\s)+))?)?(?:\s+-(?<Server>\w+))?$/,
			searchCommand(bot)
		);

		// Handlers
		bot.on("message", messageHandler(bot));
		bot.on("callback_query", callbackHandler(bot));
	})
	.catch(error => console.error(error));
