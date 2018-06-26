/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var env = require('node-env-file');
env(__dirname + '/.env');

if(!process.env.HOST || !process.env.BOT_USER || !process.env.BOT_PASS) {
        usage_tip();
}

var Botkit = require('botkit-rocketchat-connector');
var debug = require('debug')('botkit:main');

// the environment variables from RocketChat is passed in bot_options
// because the module it's external, so haven't access to .env file
var bot_options = { 
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
    studio_stats_uri: process.env.studio_command_uri,
    rocketchat_host: process.env.HOST,
    rocketchat_bot_user: process.env.BOT_USER,
    rocketchat_bot_pass: process.env.BOT_PASS,
    rocketchat_ssl: process.env.SSL,
    rocketchat_bot_room: process.env.ROOM,
    rocketchat_bot_direct_messages: process.env.DIRECT_MESSAGES,
    rocketchat_bot_live_chat: process.env.LIVE_CHAT,
    rocketchat_bot_edited: process.env.EDITED,    
};

// create the Botkit controller with the configurations of the RocketChatBot
var controller = Botkit({}, bot_options);

controller.startBot();

controller.startTicking();  

var normalizedPath = require("path").join(__dirname, "skills");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./skills/" + file)(controller);
});


// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate
if (process.env.studio_token) {
    // TODO: configure the EVENTS here
    controller.on('message_received', function(bot, message) {        
        console.log("\ninside bot.js controller.on")
        controller.studio.runTrigger(bot, message.text, message.user, message.channel, message).then(function(convo) {
            console.log("\ninside bot.js controller.studio.runTrigger")
            if (!convo) {
                console.log("\ninside bot.js controller.studio.runTrigger IF")
                // no trigger was matched
                // If you want your botbot to respond to every message,
                // define a 'fallback' script in Botkit Studio
                // and uncomment the line below.
                controller.studio.run(bot, 'fallback', message.user, message.channel);
            } else {
                console.log("\ninside bot.js controller.studio.runTrigger ELSE")
                // set variables here that are needed for EVERY script
                // use controller.studio.before('script') to set variables specific to a script
                convo.setVar('current_time', new Date());
            }
        }).catch(function(err) {
            bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
            debug('Botkit Studio: ', err);
        });
    });
} else {
    console.log('~~~~~~~~~~');
    console.log('NOTE: Botkit Studio functionality has not been enabled');
    console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/');
}

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Studio Starter Kit');
    console.log('You problably forget to update your environment variables');
    console.log('Execute your bot application like this:');
    console.log('HOST=<MY HOST> BOT_USER=<MY BOT NAME> BOT_PASS=<MY BOT PASSWORD> SSL=<BOOLEAN> ROOMS=<CHANNELS> node bot.js');
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/');
    console.log('~~~~~~~~~~');
}
