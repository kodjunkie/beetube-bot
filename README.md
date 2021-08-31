<div align="center">

<img src="./assets/icon-black.png" alt="Beetube" height="100" width="auto"></a>

</div>

<h2 align="center">Beetube :bee: Bot</h2>

<div align="center">

A telegram 🤖 bot for music, videos, movies, EDM tracks, torrent downloads, files and more.

[![https://t.me/beetube_bot](https://img.shields.io/badge/🤖%20Telegram-Bot-neon.svg)](https://t.me/beetube_bot) [![https://t.me/beetubers](https://img.shields.io/badge/💬%20Telegram-Channel-blue.svg)](https://t.me/beetubers) [![Beetube CI](https://github.com/kodjunkie/beetube-bot/workflows/Beetube%20CI/badge.svg)](https://github.com/kodjunkie/beetube-bot/actions) <a href="https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20"></a>

</div>

- [Beetube :bee:](#beetube)
  - [Features](#features)
  - [Installation](#installation)
    - [Telegram setup](#installation)
    - [Install on system](#installation)
    - [Install via docker](#installation)
  - [Deployed](#deployed)
  - [Tests](#tests)
  - [Contribution](#contribution)
  - [License (MIT)](#license)
  - [Credits](#credits)

## Features

- Browse, search and download `movies`, `music`, `anime` and `torrent`
- Ability to browse `music` sorted by genre
- Ability to download `music` directly from chat
- Ability to paginate all returned results
- Supports personalized settings

## Installation

**NOTE:** By default it's been setup for easy deployment on <a href="https://heroku.com/" target="_blank">Heroku</a>, you can select either Github or Heroku CLI deployment method.

### Requirements

- Nodejs >= `v14.x`
- MongoDB (database)

### Telegram Setup (required)

1.  Create a new bot via <a href="https://telegram.me/BotFather" target="_blank">@BotFather</a> and note the `token`
2.  Type `/setcommands`
3.  Select the bot you just created
4.  Copy and paste the texts below as the bot's commands

```
  start - start a conversation with the bot
  search - search through any category
  keyboard - show custom keyboard
  about - about this bot
```

### Install on Local Machine

```bash
$ git clone https://github.com/kodjunkie/beetube-bot.git
$ cd beetube-bot
$ cp .env.example .env # Update .env accordingly
$ npm install
# Start mongo db daemon
$ npm start
```

### Installation via Docker Compose

```bash
$ git clone https://github.com/kodjunkie/beetube-bot.git
$ cd beetube-bot
$ cp .env.example .env # Update .env accordingly

# To boot-up first time only
# Or whenever docker file is modified (builds the container)
$ docker compose up --build

# To boot-up without building the container (regular use)
$ docker compose up

# To shut-down
$ docker compose down
```

## Deployed

Checkout the deployed version <a href="https://t.me/Beetube_bot" target="_blank">here</a>

## Tests

```bash
$ npm test
```

## Contribution

All contributions of any kind are welcome.

## License

This project is opened under the <a href="https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE" target="_blank">MIT 2.0 License</a> which allows very broad use for both academic and commercial purposes.

## Credits

| External APIs                                                                                | Uses           |
| -------------------------------------------------------------------------------------------- | -------------- |
| <a href="https://github.com/kodjunkie/node-raspar" target="_blank">kodjunkie/node-raspar</a> | Music, Torrent |
| <a href="https://github.com/Go-phie/gophie" target="_blank">Go-phie/gophie</a>               | Movie, Anime   |
