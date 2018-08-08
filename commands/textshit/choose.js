const command = require("discord.js-commando");
var responses = ["is the way to go", "is my choice", "would probably be better for you", "is the safest bet"];
var CommandCounter = require("../../index.js")

class ChooseCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "choose",
            group: "textshit",
            memberName: "choose",
            description: "Give Slav Bot options to choose from.",
            examples: ["`!choose <item-1>|<item-2>`", "`!choose <item-1>|<item-2>|<item-3>`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        if(args.length > 0)
        {
            var options = [];
            var option = "";
            
            for(var i = 0; i <= args.length; i++)
            {
                if(args[i] == "|" || i == args.length)
                {
                    options.push(option);
                    option = "";
                }
                else
                {
                    option = option + args[i];
                }
            }
            
            if(options.length <= 1)
            {
                message.channel.send("<@" + message.author.id + "> You need to give at least 2 options.").catch(error => console.log("Send Error - " + error));
                return;
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> " + options[Math.floor(Math.random() * options.length)] + " " + responses[Math.floor(Math.random() * responses.length)]).catch(error => console.log("Send Error - " + error))
            }
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No options given.").catch(error => console.log("Send Error - " + error))
        }
    }
}

module.exports = ChooseCommand;
