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
		bot.on("callback_query", callbackHandler(bot));

		// Success notification message
		console.log("\u{1F41D} Listening for commands \u{1F680}");
	})
	.catch(error => console.error(error));
