/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
var env = require('node-env-file')
env(__dirname + '/.env')

if (!process.env.ROCKETCHAT_URL || !process.env.ROCKETCHAT_USER || !process.env.ROCKETCHAT_PASS) {
  usageTip()
}

var Botkit = require('botkit-rocketchat-connector')
var debug = require('debug')('botkit:main')

// the environment variables from RocketChat is passed in bot_options
// because the module it's external, so haven't access to .env file
var botOptions = {
  debug: true,
  studio_token: process.env.studio_token,
  apiai_token: process.env.apiai_token,
  studio_command_uri: process.env.studio_command_uri,
  studio_stats_uri: process.env.studio_command_uri,
  rocketchat_host: process.env.ROCKETCHAT_URL,
  rocketchat_bot_user: process.env.ROCKETCHAT_USER,
  rocketchat_bot_pass: process.env.ROCKETCHAT_PASSWORD,
  rocketchat_ssl: process.env.ROCKETCHAT_USE_SSL,
  rocketchat_bot_rooms: process.env.ROCKETCHAT_ROOM,
  rocketchat_bot_mention_rooms: process.env.MENTION_ROOMS,
  rocketchat_bot_direct_messages: process.env.RESPOND_TO_DM,
  rocketchat_bot_live_chat: process.env.RESPOND_TO_LIVECHAT,
  rocketchat_bot_edited: process.env.RESPOND_TO_EDITED
}

// create the Botkit controller with the configurations of the RocketChatBot
var controller = Botkit({}, botOptions)

// imports local conversations to use bot without the botkit api
require(__dirname + '/components/local_conversations.js')(controller)

controller.startBot()

controller.startTicking()

var normalizedPath = require('path').join(__dirname, 'skills')
require('fs').readdirSync(normalizedPath).forEach(function (file) {
  require('./skills/' + file)(controller)
})

if (!process.env.studio_token) {
  console.log('~~~~~~~~~~')
  console.log('NOTE: Botkit Studio functionality has not been enabled')
  console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/')
};

if (!process.env.apiai_token) {
  console.log('~~~~~~~~~~')
  console.log('NOTE: Dialogflow with apiai functionality has not been enabled')
  console.log('To enable, pass in a apiai_token parameter with a token from the Dialogflow console')
};


// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
if (process.env.studio_token) {
  console.log('-------------')
  console.log('Botkit Studio functionality has been enabled')
  // TODO: configure the EVENTS here
  controller.on(['direct_message', 'live_chat', 'channel', 'mention', 'message'], function (bot, message) {
    controller.studio.runTrigger(bot, message.text, message.user, message.channel, message).then(function (convo) {
      if (!convo) {
        // no trigger was matched
        // If you want your botbot to respond to every message,
        // define a 'fallback' script in Botkit Studio
        // and uncomment the line below.
        // controller.studio.run(bot, 'fallback', message.user, message.channel);
      } else {
        // set variables here that are needed for EVERY script
        // use controller.studio.before('script') to set variables specific to a script
        convo.setVar('current_time', new Date())
      }
    }).catch(function (err) {
      bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err)
      debug('Botkit Studio: ', err)
    })
  })
// EAR> use else if for apiai token
} else if (process.env.apiai_token) {
    console.log('-------------')
    console.log('Dialogflows apiai functionality has been enabled')


    const dialogflowMiddleware = require('botkit-middleware-dialogflow')({
        token: process.env.apiai_token, version: 'v1'
      });

    controller.middleware.receive.use(dialogflowMiddleware.receive);

    controller.middleware.format.use(function (bot, message, platform_message, next) {
        console.log("\n*Inside middleware.format.use")
        console.log(message)
        platform_message['text'] = message.fulfillment.speech

        var messages = message.fulfillment.messages
        for (var i = 0; i < messages.length; i++) {
                if (messages[i].payload && messages[i].payload.attachments) {
                    platform_message['attachments'] = messages[i].payload.attachments
                }
        }

        if (!platform_message.type) {
            platform_message.type = 'message';
        }
        next();
    });

    controller.on(['direct_message', 'live_chat', 'channel', 'mention', 'message'], function (bot, message) {
        bot.reply(message, message, bot);
    });
}

function usageTip () {
  console.log('~~~~~~~~~~')
  console.log('Botkit Studio Starter Kit')
  console.log('You problably forgot to update your environment variables')
  console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
  console.log('~~~~~~~~~~')
}
