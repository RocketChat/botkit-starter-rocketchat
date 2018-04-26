# botkit-starter-rocketchat
A starter kit for building a custom Rocket.Chat bot with Botkit Studio

This is a work in progress for the two communities to collaborate on to achieve the integration proposed in this issue on the main Rocket.Chat project: https://github.com/RocketChat/Rocket.Chat/issues/9937

It follows the example of other Botkit starter projects, like https://github.com/howdyai/botkit-starter-slack to provide a starting point for building bots for teams and communities on Rocket.Chat

This project will use the [`botkit-rocketchat-connector`](https://github.com/RocketChat/botkit-rocketchat-connector) dependency to provide the controller access to Rocket.Chat message streams, methods and events. Something like the following:

```
const Botkit = require('botkit')
const connector = require('botkit-rocketchat-connector')
const controller = connector(Botkit, options)
controller.startTicking()
```

When complete, this readme should be updated with usage and configuration docs, to help new users to either Botkit or Rocket.Chat with the end to end concerns.

It may also end up being moved to be maintained under the [howdyai](https://github.com/howdyai) organisation, depending on what makes sense for the contributors doing most of the maintenance.