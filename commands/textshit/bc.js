const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class BcCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "bc",
            group: "textshit",
            memberName: "bc",
            description: "Call someone a bc. Replies to  you or any user that you have mentioned after the command.",
            examples: ["`!bc`", "`!bc @User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter()
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
        
        if(otherUser)
        {
            message.channel.send("<@" + userID + ">, BHENCHOOT").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.reply("BHENCHOOT").catch(error => console.log("Send Error - " + error));
        }

        message.channel.stopTyping();
    }
}

module.exports = BcCommand;