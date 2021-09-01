require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
TelegramBot.Promise = require("bluebird").config({
	cancellation: true,
});

const config = require("./config");
const mongoose = require("mongoose");

const listCommand = require("./commands/list");
const aboutCommand = require("./commands/about");
const startCommand = require("./commands/start");
const searchCommand = require("./commands/search");
const keyboardCommand = require("./commands/keyboard");
const settingsCommand = require("./commands/settings");

const botErrorHandler = require("./handlers/bot-error");
const callbackQueryHandler = require("./handlers/callback-query");

// Configurations
const bot = new TelegramBot(process.env.BOT_TOKEN, config.bot);

mongoose
	.connect(process.env.MONGODB_URI, config.mongodb)
	.then(() => {
		// Commands
		bot.onText(/\/start/, startCommand(bot));
		bot.onText(/about$/i, aboutCommand(bot));
		bot.onText(/search$/i, searchCommand(bot));
		bot.onText(/settings$/i, settingsCommand(bot));
		bot.onText(/\/keyboard/, keyboardCommand(bot));
		bot.onText(/(?<Provider>(Movie|Music|Torrent|Anime)$)/, listCommand(bot));

		// Handlers
		bot.on("callback_query", callbackQueryHandler(bot));
		bot.on("polling_error", botErrorHandler);
		bot.on("error", botErrorHandler);

		// On successful connection
		console.log("\u{1F41D} Listening for commands");
	})
	.catch(error => console.error(error));
