<div align="center">
  <img src="./assets/logo.png" alt="Beetube" height="100" width="auto"></a>
</div>

<div align="center">

<h2>Beetube Bot</h2>

A telegram 🤖 bot for music, videos, movies, EDM tracks, torrent downloads, files and more.

[![https://t.me/beetube_bot](https://img.shields.io/badge/🤖%20Telegram-Bot-neon.svg)](https://t.me/beetube_bot) [![https://t.me/beetubers](https://img.shields.io/badge/💬%20Telegram-Channel-blue.svg)](https://t.me/beetubers) [![Beetube CI](https://github.com/kodjunkie/beetube-bot/workflows/Beetube%20CI/badge.svg)](https://github.com/kodjunkie/beetube-bot/actions) <a href="https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20"></a>

</div>

- [Beetube :bee:](#beetube)
  - [Features](#features)
  - [Installation](#installation)
    - [Telegram setup](#telegram+setup)
    - [Install on system](#install+system)
    - [Install via docker](#install+docker)
  - [Deployed](#deployed)
  - [Liked it?](#liked+it)
  - [Tests](#tests)
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

<a name="telegram+setup"></a>

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

<a name="install+system"></a>

### Install on Local Machine

```bash
$ git clone https://github.com/kodjunkie/beetube-bot.git
$ cd beetube-bot
$ cp .env.example .env # Update .env accordingly
$ npm install
# Start mongo db daemon
$ npm start
```

<a name="install+docker"></a>

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

The deployed version can be found on telegram as <a href="https://t.me/beetube_bot" target="_blank">@beetube_bot</a>

<a name="liked+it"></a>

## Liked it?

Hope you liked this project, don't forget to give it a star ⭐

<div align="center">
  <a href="https://starchart.cc/kodjunkie/beetube-bot">
    <img src="https://starchart.cc/kodjunkie/beetube-bot.svg" width="600px">
  </a>
</div>

## Tests

```bash
$ npm test
```

## License

This project is opened under the <a href="https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE" target="_blank">MIT 2.0 License</a> which allows very broad use for both academic and commercial purposes.

## Credits

Here's a list of the third-party APIs used to build this awesome project ❤️

| External APIs                                                                                | Uses           |
| -------------------------------------------------------------------------------------------- | -------------- |
| <a href="https://github.com/kodjunkie/node-raspar" target="_blank">kodjunkie/node-raspar</a> | Music, Torrent |
