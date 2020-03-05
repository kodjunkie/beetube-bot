const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const config = require("./config");
const mongoose = require("mongoose");

// Commands
const startCommand = require("./commands/start");
const searchCommand = require("./commands/search");
const listCommand = require("./commands/list");

// Handlers
const callbackHandler = require("./handlers/callback");
const messageHandler = require("./handlers/message");
const movieHandler = require("./handlers/movie");
const musicHandler = require("./handlers/music");
const videoHandler = require("./handlers/video");
const torrentHandler = require("./handlers/torrent");

// Configurations
const bot = new TelegramBot(process.env.BOT_TOKEN, config.bot);

mongoose
	.connect(process.env.MONGODB_URI, config.mongodb)
	.then(() => {
		// Commands
		bot.onText(/\/start/, startCommand(bot));
		bot.onText(/\/list/, listCommand(bot));
		bot.onText(
			/^(?<Action>\/search)(?:\s+(?<Command>\w+)(?:\s+(?<Query>(?:\w|\s)+))?)?(?:\s+-(?<Engine>\w+))?$/,
			searchCommand(bot)
		);

		// Handlers
		bot.onText(/\s(movies)/i, movieHandler(bot));
		bot.onText(/\s(music)/i, musicHandler(bot));
		bot.onText(/\s(videos)/i, videoHandler(bot));
		bot.onText(/\s(torrent)/i, torrentHandler(bot));
		bot.on("message", messageHandler(bot));
		bot.on("callback_query", callbackHandler(bot));
	})
	.catch(error => console.error(error));
