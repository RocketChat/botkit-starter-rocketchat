# botkit-starter-rocketchat
A starter kit for building a custom Rocket.Chat bot with Botkit Studio.

This is a work in progress for the two communities to collaborate on to achieve the integration proposed in this issue on the main Rocket.Chat project: https://github.com/RocketChat/Rocket.Chat/issues/9937

It follows the example of other Botkit starter projects, like https://github.com/howdyai/botkit-starter-slack to provide a starting point for building bots for teams and communities on Rocket.Chat

This project use the [`botkit-rocketchat-connector`](https://github.com/RocketChat/botkit-rocketchat-connector) dependency to provide the controller access to Rocket.Chat message streams, methods and events.

When complete, this readme should be updated with usage and configuration docs, to help new users to either Botkit or Rocket.Chat with the end to end concerns.

It may also end up being moved to be maintained under the [howdyai](https://github.com/howdyai) organisation, depending on what makes sense for the contributors doing most of the maintenance.

## Overview

The [botkit-starter-rocketchat](https://github.com/RocketChat/botkit-starter-rocketchat) use the [botkit-rocketchat-connector](https://github.com/RocketChat/botkit-rocketchat-connector), this repository it's a easy way to configure and use botkit inside RocketChat.

The image bellow exemplify this integration.

![Integration](https://github.com/RocketChat/botkit-starter-rocketchat/wiki/integration.png)

## Usage

* Clone this repository:

`git clone https://github.com/RocketChat/botkit-starter-rocketchat`

* Install dependencies:

`npm install`

* Update .env file with your configuration:

```
studio_token=<YOUR TOKEN>
HOST=<ROCKETCHAT HOST>
BOT_USER=<BOTKIT USER NAME>
BOT_PASS=<BOTKIT USER PASS>
SSL=<SSL USAGE>
ROOMS=<ROCKETCHAT CHANNEL>
```	

* Run your starter:

`node .`
