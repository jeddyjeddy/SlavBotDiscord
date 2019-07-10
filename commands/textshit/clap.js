const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class ClapCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "clap",
            group: "textshit",
            memberName: "clap",
            description: "Replaces spaces with clap emojis.",
            examples: ["`!clap <text>`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
       
        if(args.length > 0)
        {
            var stringToSend = args.toString().replace(/ /g, ":clap:")
            while(stringToSend.indexOf("@everyone") > -1)
            {
                stringToSend = stringToSend.replace(/@everyone/g, "everyone")
            }
    
            while(stringToSend.indexOf("@here") > -1)
            {
                stringToSend = stringToSend.replace(/@here/g, "here")
            }
            message.channel.send(stringToSend).catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> Please provide text after the command.").catch(error => console.log("Send Error - " + error));
        }

    }
}

module.exports = ClapCommand;