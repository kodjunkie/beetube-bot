const TelegramBot = require("node-telegram-bot-api");
TelegramBot.Promise = require("bluebird").config({
	cancellation: true,
});
require("dotenv").config();
const botErrorHandler = require("./handlers/bot-error");
const callbackQueryHandler = require("./handlers/callback-query");
const config = require("./config");
const mongoose = require("mongoose");

const env = process.env;
const commands = require("./commands");

const bot = new TelegramBot(env.BOT_TOKEN, config.bot);

mongoose
	.connect(env.MONGODB_URI, config.mongodb)
	.then(() => {
		// Commands
		bot.onText(/\/start/, commands.start(bot));
		bot.onText(/about$/i, commands.about(bot));
		bot.onText(/search$/i, commands.search(bot));
		bot.onText(/settings$/i, commands.settings(bot));
		bot.onText(/\/keyboard/, commands.keyboard(bot));
		bot.onText(/(?<Provider>(Movie|Music|Torrent|Anime)$)/, commands.list(bot));

		// Handlers
		bot.on("callback_query", callbackQueryHandler(bot));
		bot.on("polling_error", botErrorHandler);
		bot.on("error", botErrorHandler);

		// Successful connection
		console.log(`\u{1F41D} ${env.BOT_NAME} started successfully`);
	})
	.catch(error => console.error(error));
