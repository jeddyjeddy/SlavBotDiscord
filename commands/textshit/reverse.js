const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class ReverseCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "reverse",
            group: "textshit",
            memberName: "reverse",
            description: "Reverse what you say. Slav Bot will repeat whatever you tell it to in reverse.",
            examples: ["`!reverse <text>`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)

        if(args.length > 0)
        {
            var reversedText = "";
            for(var i = args.length - 1; i >= 0; i--)
            {
                reversedText = reversedText + args[i]
            }

            while(reversedText.indexOf("@everyone") > -1)
            {
                reversedText = reversedText.replace(/@everyone/g, "everyone")
            }

            while(reversedText.indexOf("@here") > -1)
            {
                reversedText = reversedText.replace(/@here/g, "here")
            }

            message.channel.send(reversedText).catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No text given for command.").catch(error => console.log("Send Error - " + error))
        }
    }
}

module.exports = ReverseCommand;