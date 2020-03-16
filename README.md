<h1 align="center">:bee: Beetube :bee: Bot</h1>

<div align="center">

A telegram bot for music, video, movie downloads and more.

[![Beetube CI](https://github.com/kodjunkie/beetube-bot/workflows/Beetube%20CI/badge.svg)](https://github.com/kodjunkie/beetube-bot/actions) <a href="https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="18"></a>

[![https://github.com/kodjunkie/beetube-bot](https://img.shields.io/badge/💬%20Telegram-Channel-blue.svg?style=flat-square)](https://github.com/kodjunkie/beetube-bot)
[![https://github.com/kodjunkie/beetube-bot](https://img.shields.io/badge/💬%20Telegram-Group-blue.svg?style=flat-square)](https://github.com/kodjunkie/beetube-bot)

</div>

- [Beetube :bee:](#beetube)
  - [Installation](#installation)
  - [Todo](#todo)
  - [Contribution](#contribution)
  - [License (MIT)](#license-mit)

## Installation

1.  Create a new bot via [@BotFather](https://telegram.me/BotFather) and note the `token`
2.  Type `/setcommands`
3.  Select the bot you just created
4.  Copy and paste the below text as the bot's commands

```
  start - start a conversation with the bot
  search - search any category for results
  list - get results from a list of services
```

Lastly from you terminal, run the below commands

```bash
git clone https://github.com/kodjunkie/beetube-bot.git
cd beetube-bot
mv .env.example .env
# Update .env accordingly
npm install
# Start mongoDB daemon
npm start
```

## Deployed

Checkout the deployed version [here](https://t.me/Beetube_bot)

## Todo

- [ ] Increment tests
- [ ] Implement video (Youtube) search & download
- [ ] Implement music (search & download)
- [ ] Implement torrent (search & download `.torrent`)

## Contribution

All contributions of any kind are welcome.

## License (MIT)

This project is opened under the [MIT 2.0 License](https://github.com/kodjunkie/beetube-bot/blob/master/LICENSE) which allows very broad use for both academic and commercial purposes.
