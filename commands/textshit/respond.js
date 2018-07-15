const command = require("discord.js-commando");
var ResponseChange = require("../../index.js")

class RespondCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "respond",
            group: "util",
            memberName: "respond",
            description: "Allows you to Enable/Disable Slav Bot's responses to messages.",
            examples: ["`!respond disable`", "`!respond enable`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        var currentSetting = ResponseChange.getResponse(message.guild.id);
        if(args.toLowerCase() == "enable")
        {
            if(currentSetting == true)
            {
                ResponseChange.changeResponse(message.guild.id, true);
                message.reply("responses enabled").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.reply("responses already enabled").catch(error => console.log("Send Error - " + error));
            }
        }
        else if (args.toLowerCase() == "disable")
        {
            if(currentSetting == false)
            {
                ResponseChange.changeResponse(message.guild.id, false);
                message.reply("responses disabled").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.reply("responses already disabled").catch(error => console.log("Send Error - " + error));
            }
        }
        else
        {
            message.reply("no parameter given, use either `!respond enable` or `!respond disable`").catch(error => console.log("Send Error - " + error));
        }
        message.channel.stopTyping();
    }
}

module.exports = RespondCommand;