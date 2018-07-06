// this module is used to create local conversations with your bot
module.exports = function localConversations(controller) {
    
    // simple example of single answer script
    // controller.hears('test', 'direct_message,live_chat,channel,private_channel', function (bot, message) {
    //     console.log(message)
    //     bot.send(message, 'I heard a test message');
    // });

    // simple example of implementing conversation
    controller.hears(['color'], 'direct_message,live_chat,channel,private_channel', function (bot, message) {
        bot.startConversation(message, function (err, convo) {
            convo.say('This is an example of using convo.ask with a single callback without use Botkit API.');
            convo.say('To remove-me please got to /components/local_conversations.js');
            convo.ask('What is your favorite color?', function (response, convo) {
                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();
            });
        });
    });
}
