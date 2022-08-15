const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
TelegramBot.Promise = require("bluebird").config({
	cancellation: true,
});
require("dotenv").config();
const env = process.env;
const config = require("./config");
const commands = require("./commands");
const handlers = require("./handlers");

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
		bot.onText(/(?<provider>(Movie|Music|Torrent|Anime)$)/, commands.list(bot));

		// Handlers
		bot.on("callback_query", handlers.callbackQuery(bot));
		bot.on("polling_error", handlers.botError);
		bot.on("error", handlers.botError);

		console.info(`\u{1F41D} ${env.BOT_NAME} started successfully`);
	})
	.catch(error => console.error(error));
