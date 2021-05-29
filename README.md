<div align="center">

<img src="./assets/icon-black.png" alt="Beetube" height="100" width="auto"></a>

</div>

<h1 align="center">Beetube :bee: Bot</h1>

<div align="center">

A telegram bot for music, video, movie downloads and more.

[![https://github.com/kodjunkie/beetube-bot](https://img.shields.io/badge/💬%20Telegram-Channel-blue.svg?style=flat-square)](https://github.com/kodjunkie/beetube-bot) [![Beetube CI](https://github.com/kodjunkie/beetube-bot/workflows/Beetube%20CI/badge.svg)](https://github.com/kodjunkie/beetube-bot/actions) <a href="https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20"></a>

</div>

- [Beetube :bee:](#beetube)
  - [Installation](#installation)
    - [Telegram setup](#installation)
    - [Install on system](#installation)
    - [Install via docker](#installation)
  - [Tests](#tests)
  - [Deployed](#deployed)
  - [Todo](#todo)
  - [Contribution](#contribution)
  - [License (MIT)](#license)
  - [Credits](#credits)

## Installation

**NOTE:** By default it's been setup for easy deployment on [Heroku](https://heroku.com/), you can select either Github or [Heroku](https://heroku.com/) CLI deployment method.

### Requirements

- Node >= `v14.x`
- Mongo DB

### Telegram Setup (required)

1.  Create a new bot via [@BotFather](https://telegram.me/BotFather) and note the `token`
2.  Type `/setcommands`
3.  Select the bot you just created
4.  Copy and paste the below text as the bot's commands

```
  start - start a conversation with the bot
  search - search any category for results
  list - get results from a list of services
```

### Install on Local Machine

```bash
$ git clone https://github.com/kodjunkie/beetube-bot.git
$ cd beetube-bot
$ cp .env.example .env # Update .env accordingly
$ npm install
# Start mongoDB daemon
$ npm start
```

### Installation via Docker

```bash
$ git clone https://github.com/kodjunkie/beetube-bot.git
$ cd beetube-bot
$ cp .env.example .env # Update .env accordingly

# To boot-up first time only or whenever docker file is modified (builds the container)
$ docker-compose up --build

# To boot-up without building the container (regular use)
$ docker-compose up

# To shut-down
$ docker-compose down
```

**NOTE:** The command `docker-compose` can be used as `docker compose` depending on your docker version.

## Tests

```bash
$ npm test
```

## Deployed

Checkout the deployed version [here](https://t.me/Beetube_bot)

## Todo

- [ ] Increment tests
- [ ] Implement video (Youtube) search & download
- [x] Implement music (search & download)
- [ ] Implement torrent (search & download `.torrent`)

## Contribution

All contributions of any kind are welcome.

## License

This project is opened under the [MIT 2.0 License](https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE) which allows very broad use for both academic and commercial purposes.

## Credits

| Tools                                                                         | Uses         |
| ----------------------------------------------------------------------------- | ------------ |
| [yagop/node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) | Telegram API |
| [Go-phie/gophie](https://github.com/Go-phie/gophie)                           | Movies       |
| [Go-phie/mythra](https://github.com/Go-phie/mythra)                           | Music        |
