<div align="center">

<img src="./assets/icon-black.png" alt="Beetube" height="100" width="auto"></a>

</div>

<h1 align="center">Beetube :bee: Bot</h1>

<div align="center">

A telegram bot :robot: for music, videos, movies, EDM tracks, torrent downloads and more.

[![https://t.me/beetubers](https://img.shields.io/badge/💬%20Telegram-Channel-blue.svg?style=flat-square)](https://t.me/beetubers) [![Beetube CI](https://github.com/kodjunkie/beetube-bot/workflows/Beetube%20CI/badge.svg)](https://github.com/kodjunkie/beetube-bot/actions) <a href="https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20"></a>

</div>

- [Beetube :bee:](#beetube)
  - [Features](#features)
  - [Installation](#installation)
    - [Telegram setup](#installation)
    - [Install on system](#installation)
    - [Install via docker](#installation)
  - [Tests](#tests)
  - [Deployed](#deployed)
  - [Contribution](#contribution)
  - [License (MIT)](#license)
  - [Credits](#credits)

## Features

- Search, list and download all kinds of `movies`
- Search, list and download all kinds of `anime`
- Browse, list and download all types of `music` and supports using genre
- Search, list and download `torrent` files
- Ability to paginate list / search results
- Supports personalized configurations

## Installation

**NOTE:** By default it's been setup for easy deployment on [Heroku](https://heroku.com/), you can select either Github or [Heroku](https://heroku.com/) CLI deployment method.

### Requirements

- Node >= `v14.x`
- Mongo DB

### Telegram Setup (required)

1.  Create a new bot via [@BotFather](https://telegram.me/BotFather) and note the `token`
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

### Installation via Docker

```bash
$ git clone https://github.com/kodjunkie/beetube-bot.git
$ cd beetube-bot
$ cp .env.example .env # Update .env accordingly

# To boot-up first time only or whenever docker file is modified (builds the container)
$ docker compose up --build

# To boot-up without building the container (regular use)
$ docker compose up

# To shut-down
$ docker compose down
```

## Tests

```bash
$ npm test
```

## Deployed

Checkout the deployed version [here](https://t.me/Beetube_bot)

## Contribution

All contributions of any kind are welcome.

## License

This project is opened under the [MIT 2.0 License](https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE) which allows very broad use for both academic and commercial purposes.

## Credits

| External APIs                                                     | Uses           |
| ----------------------------------------------------------------- | -------------- |
| [kodjunkie/node-raspar](https://github.com/kodjunkie/node-raspar) | Music, Torrent |
| [Go-phie/gophie](https://github.com/Go-phie/gophie)               | Movie, Anime   |
