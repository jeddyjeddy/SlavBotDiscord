const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class UserStatsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "userstats",
            group: "util",
            memberName: "userstats",
            description: "Returns the number of command requests sent by a user to Slav Bot (Excluding Utility Commands).",
            examples: ["`!userstats`"]
        });
    }

    async run(message, args)
    {
        var otherUser = false;
        var userID = "";

        if(args.length > 0)
        {
            var getUser = false;
            for(var i = 0; i < args.length; i++)
            {
                if(getUser)
                {
                    if(args[i].toString() == ">")
                    {
                        i = args.length;
                        otherUser = true;
                    }
                    else
                    {
                        if(args[i].toString() != "@" && (!isNaN(args[i].toString()) || args[i] == "&"))
                        {
                            userID = userID + args[i].toString();
                        }
                    }
                }
                else
                {
                    if(args[i].toString() == "<")
                    {
                         getUser = true;
                    } 
                }
            }
        }

        if(otherUser && userID != message.author.id)
        {
            var count = CommandCounter.getCommandCounter(userID);
            message.channel.send("<@" + userID + "> has sent " + numberWithCommas(count) + " command requests to Slav Bot.").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            var count = CommandCounter.getCommandCounter(message.author.id);
            message.channel.send("<@" + message.author.id + "> You have sent " + numberWithCommas(count) + " command requests to Slav Bot.").catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = UserStatsCommand;