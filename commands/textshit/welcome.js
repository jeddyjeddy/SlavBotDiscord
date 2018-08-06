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
            description: "Allows you to set a channel as a welcome channel and Enable Slav Bot's welcome responses on it (for admins only). The welcome channel can be changed at any time by sending the command on another channel. The welcome feature can be disabled again by using the disable parameter.",
            examples: ["`!welcome`", "`!welcome disable`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")){
            message.reply("this command is only available to admins.").catch(error => console.log("Send Error - " + error))
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
                message.reply("welcome feature disabled.").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.reply("welcome feature already disabled.").catch(error => console.log("Send Error - " + error));
            }
        }
        else
        {
            if(WelcomeChange.setWelcome(message.guild.id, message.channel.id))
            {
                message.reply("this channel has been set as the welcome channel.").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                message.reply("this channel has already been set as the welcome channel.").catch(error => console.log("Send Error - " + error));
            }
        }
        message.channel.stopTyping();
    }
}

module.exports = WelcomeCommand;