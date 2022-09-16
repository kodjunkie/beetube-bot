require("dotenv").config();
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
TelegramBot.Promise = require("bluebird").config({
	cancellation: true,
});
const env = process.env;
const config = require("./config");
const command = require("./commands");
const handler = require("./handlers");

const bot = new TelegramBot(env.BOT_TOKEN, config.bot);

mongoose
	.connect(env.MONGODB_URI, config.mongodb)
	.then(() => {
		// Commands
		bot.onText(/\/start/, command.start(bot));
		bot.onText(/about$/i, command.about(bot));
		bot.onText(/search$/i, command.search(bot));
		bot.onText(/settings$/i, command.settings(bot));
		bot.onText(/\/keyboard/, command.keyboard(bot));
		bot.onText(/(?<provider>(Movie|Music|Torrent|Anime)$)/, command.list(bot));

		// Handlers
		bot.on("callback_query", handler.callbackQuery(bot));
		bot.on("polling_error", handler.botError);
		bot.on("error", handler.botError);

		console.info(`\u{1F41D} ${env.BOT_NAME} started successfully`);
	})
	.catch(error => console.error(error));
