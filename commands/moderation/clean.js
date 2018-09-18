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
            description: "Delete a specified number of messages before the command. Default: 50 messages. Max: 100 messages.",
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
            message.channel.send("<@" + message.author.id + "> Slav Bot does not have the Administrator or Manage Messages Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_MESSAGES") && message.author.id != message.guild.owner.id){
            message.channel.send("<@" + message.author.id + "> This command is only available to the owner, or those with the Administrator or Manage Messages Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        CommandCounter.addCommandCounter(message.author.id)
        var number = 50;

        if(args.length > 0)
        {
            if(isNaN(args))
            {
                message.channel.send("<@" + message.author.id + "> Invalid parameters. Use `" + commandPrefix + "help clean` for help.".catch(error => console.log("Send Error - " + error)));
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
                    message.channel.send("<@" + message.author.id + "> Number should be greater than 0").catch(error => console.log("Send Error - " + error));
                    return;
                }
            }
        }
        
        if(number > 100)
        {
            message.channel.send("<@" + message.author.id + "> Max number of messages is 100").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.channel.fetchMessages({ before: message.id, limit: number })
            .then(messages => {
                message.channel.bulkDelete(messages, true)
                message.delete();
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
            });
        }
    }
}

module.exports = CleanCommand;
