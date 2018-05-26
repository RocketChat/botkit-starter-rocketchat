/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var env = require('node-env-file');
env(__dirname + '/.env');

if(!process.env.HOST || !process.env.BOT_USER || !process.env.BOT_PASS 
    || !process.env.SSL || !process.env.ROOMS) {
        usage_tip();
}

var Botkit = require('botkit-rocketchat-connector');
var debug = require('debug')('botkit:main');

// The environment variables from RocketChat is passed in bot_options
//because the module it's external, so haven't access to .env file
var bot_options = { 
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
    studio_stats_uri: process.env.studio_command_uri,
    replyWithTyping: true,
    rocketchat_host: process.env.HOST,
    rocketchat_bot_user: process.env.BOT_USER,
    rocketchat_bot_pass: process.env.BOT_PASS,
    rocketchat_ssl: process.env.SSL,
    rocketchat_rooms: process.env.ROOMS,
};

// Store in a JSON file local to the app.
//bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit({}, bot_options);

// var normalizedPath = require("path").join(__dirname, "skills");
//     require("fs").readdirSync(normalizedPath).forEach(function(file) {
//     require("./skills/" + file)(controller);
// });


// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Studio Starter Kit');
    console.log('You problably forget to update your environment variables');
    console.log('Execute your bot application like this:');
    console.log('HOST=<MY HOST> BOT_USER=<MY BOT NAME> BOT_PASS=<MY BOT PASSWORD> SSL=<BOOLEAN> ROOMS=<CHANNELS> node bot.js');
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/');
    console.log('~~~~~~~~~~');
}
