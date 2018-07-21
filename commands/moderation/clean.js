const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class CleanCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "clean",
            group: "moderation",
            memberName: "clean",
            description: "Delete a specified number of messages before the command. Default: 50 messages",
            examples: ["`!clean`", "`!clean <number>`", "`!clean 25`"]
        });
    }

    async run(message, args)
    {
        var commandPrefix= "!"
        if(message.guild == null)
        {
            return;
        }
        else
        {
            commandPrefix = message.guild.commandPrefix
        }

        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.client.user.id).hasPermission("MANAGE_MESSAGES")){
            message.reply("Slav Bot does not have the Administrator or Manage Messages Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")){
            message.reply("this command is only available to those with the Administrator or Manage Messages Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        message.channel.startTyping();
        CommandCounter.addCommandCounter()
        var number = 50;

        if(args.length > 0)
        {
            if(isNaN(args))
            {
                message.reply("invalid parameters. Use `" + commandPrefix + "help clean` for help.".catch(error => console.log("Send Error - " + error)));
                message.channel.stopTyping();
                return; 
            }
            else
            {
                if(parseInt(args) > 0)
                {
                    number = parseInt(args);
                }
                else
                {
                    message.reply("number should be greater than 0").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
            }
        }
        
        message.channel.fetchMessages({ before: message.id, limit: number })
        .then(messages => {
            message.channel.bulkDelete(messages, true)
            message.delete();
            message.channel.stopTyping();
        }).catch(function (err) {
            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
            console.log(err.message);
            message.channel.stopTyping();
        });
    }
}

module.exports = CleanCommand;
