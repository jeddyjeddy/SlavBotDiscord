const command = require("discord.js-commando");
const responses = ["It is certain", "It is decidedly so", "Without a doubt", "Yes - definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy, try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"]
var CommandCounter = require("../../index.js")

class Magic8BallCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "magic8ball",
            group: "games",
            memberName: "magic8ball",
            description: "The magical 8-ball answers all of your close-ended questions.",
            examples: ["`!magic8ball <question>`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter();
        if(args.length > 0)
        {
            message.channel.send("<@" + message.author.id + "> " + responses[Math.floor(Math.random() * responses.length)]).catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.reply("please ask a question.").catch(error => console.log("Send Error - " + error));
        }

        message.channel.stopTyping();
    }
}

module.exports = Magic8BallCommand;