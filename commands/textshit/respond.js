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
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_CHANNELS") && !message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")){
            message.channel.send("<@" + message.author.id + "> This command is only available to admins and those with the manage channels or manage messages permissions.").catch(error => console.log("Send Error - " + error))
            return;
        }

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        var currentSetting = ResponseChange.getResponse(message.guild);
        console.log(currentSetting)
        if(args.toLowerCase() == "enable")
        {
            if(currentSetting === false)
            {
                ResponseChange.changeResponse(message.guild.id, true);
                message.channel.send("<@" + message.author.id + "> Responses enabled").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> Responses already enabled").catch(error => console.log("Send Error - " + error));
            }
        }
        else if (args.toLowerCase() == "disable")
        {
            if(currentSetting === true)
            {
                ResponseChange.changeResponse(message.guild.id, false);
                message.channel.send("<@" + message.author.id + "> Responses disabled").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> Responses already disabled").catch(error => console.log("Send Error - " + error));
            }
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No parameter given, use either `" + commandPrefix + "respond enable` or `" + commandPrefix + "respond disable`").catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = RespondCommand;