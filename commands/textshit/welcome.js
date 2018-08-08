const command = require("discord.js-commando");
var WelcomeChange = require("../../index.js")

class WelcomeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "welcome",
            group: "util",
            memberName: "welcome",
            description: "Allows you to set a channel as a welcome channel and Enable Slav Bot's welcome responses on it that will be sent every time a member joins or leaves (for admins only). The welcome channel can be changed at any time by sending the command on another channel. The welcome feature can be disabled again by using the disable parameter.",
            examples: ["`!welcome`", "`!welcome disable`"]
        });
    }

    async run(message, args)
    {
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")){
            message.channel.send("<@" + message.author.id + "> This command is only available to admins.").catch(error => console.log("Send Error - " + error))
            return;
        }

        if(!message.guild.member(message.client.user.id).hasPermission("SEND_MESSAGES")){
            return;
        }

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if (args.toLowerCase() == "disable")
        {
            if(WelcomeChange.disableWelcome(message.guild.id))
            {
                message.channel.send("<@" + message.author.id + "> Welcome feature disabled.").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> Welcome feature already disabled.").catch(error => console.log("Send Error - " + error));
            }
        }
        else
        {
            if(WelcomeChange.setWelcome(message.guild.id, message.channel.id))
            {
                message.channel.send("<@" + message.author.id + "> This channel has been set as the welcome channel.").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> This channel has already been set as the welcome channel.").catch(error => console.log("Send Error - " + error));
            }
        }
    }
}

module.exports = WelcomeCommand;