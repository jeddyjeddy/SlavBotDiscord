const command = require("discord.js-commando");
const asciilib = require("asciilib")
const lib = asciilib.ordered;

class KaomojiCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "kaomoji",
            group: "textshit",
            memberName: "kaomoji",
            description: "Searches for and returns kaomojis based on your search parameter.",
            examples: ["`!kaomoji <search-param>`", "`!kaomoji shrug`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();

        if(args.length < 2)
        {
            if(args.length == 0)
            {
                message.reply("please give a search parameter after the command.").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.reply("the search parameter should have at least 2 characters.").catch(error => console.log("Send Error - " + error));
            }
        }
        else
        {
            var kaomojis = lib.filter(function (emoji) {
                return emoji.name.toLowerString().indexof(args.toString()) > -1
            });

            if(kaomojis.length > 5)
            {
                kaomojis.splice(5)
            }

            message.channel.send("Kaomoji results for ***" + args + "***").catch(error => console.log("Send Error - " + error));

            for(var i = 0; i < kaomojis.length; i++)
            {
                message.channel.send(kaomojis[i].entry).catch(error => console.log("Send Error - " + error));
            }
        }
        message.channel.stopTyping();
    }
}

module.exports = KaomojiCommand;