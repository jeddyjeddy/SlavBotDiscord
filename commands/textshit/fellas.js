const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class FellasCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "fellas",
            group: "textshit",
            memberName: "fellas",
            description: "Allows you to ask life's biggest questions.",
            examples: ["`!fellas <statement/question>`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter(message.author.id)
        if(args.length > 0)
        {
            message.channel.send("<@" + message.author.id + "> asks: Fellas, is it gay to " + args.toString()).catch(error => console.log("Send Error - " + error));
            message.channel.send(":thinking:").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.reply("please provide text after the command.").catch(error => console.log("Send Error - " + error));
        }

        message.channel.stopTyping();
    }
}

module.exports = FellasCommand;