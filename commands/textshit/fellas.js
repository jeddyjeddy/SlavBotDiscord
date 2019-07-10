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
        CommandCounter.addCommandCounter(message.author.id)
        if(args.length > 0)
        {
            var stringToSend = args.toString()
            while(stringToSend.indexOf("@everyone") > -1)
            {
                stringToSend = stringToSend.replace(/@everyone/g, "everyone")
            }
    
            while(stringToSend.indexOf("@here") > -1)
            {
                stringToSend = stringToSend.replace(/@here/g, "here")
            }
            message.channel.send("<@" + message.author.id + "> asks: Fellas, is it gay to " + stringToSend).catch(error => console.log("Send Error - " + error));
            message.channel.send(":thinking:").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> Please provide text after the command.").catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = FellasCommand;