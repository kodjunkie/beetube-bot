require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");
const mongoose = require("mongoose");

// Commands
const listCommand = require("./commands/list");
const aboutCommand = require("./commands/about");
const startCommand = require("./commands/start");
const searchCommand = require("./commands/search");
const keyboardCommand = require("./commands/keyboard");
const settingsCommand = require("./commands/settings");

// Handlers
const callbackHandler = require("./handlers/callback");

// Configurations
const bot = new TelegramBot(process.env.BOT_TOKEN, config.bot);

mongoose
	.connect(process.env.MONGODB_URI, config.mongodb)
	.then(() => {
		// Commands
		bot.onText(/\/start/, startCommand(bot));
		bot.onText(/about$/i, aboutCommand(bot));
		bot.onText(/Search/i, searchCommand(bot));
		bot.onText(/Settings$/, settingsCommand(bot));
		bot.onText(/\/keyboard/, keyboardCommand(bot));
		bot.onText(/(?<Provider>(Movies|Music|Torrent|Anime)$)/, listCommand(bot));

		// Handlers
		bot.on("callback_query", callbackHandler(bot));

		// Successful connection
		console.log("\u{1F41D} Listening for commands \u{1F680}");
	})
	.catch(error => console.error(error));
