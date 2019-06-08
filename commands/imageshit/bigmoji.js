const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class Bigmojiommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "bigmoji",
            group: "imageshit",
            memberName: "bigmoji",
            description: "Gives a high res version of a custom emoji from any discord server.",
            examples: ["`!bigmoji <emoji>`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        
        var emojiID = "";
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }
        
        if(args.length > 0)
        {
            console.log("args are present " + args);
            var getEmoji = false;
            var waitForEnd = false;
            for(var i = 0; i < args.length; i++)
            {
                if(getEmoji)
                {
                    if(args[i].toString() == ">")
                    {
                        i = args.length;
                    }
                    else
                    {
                        if(waitForEnd)
                        {
                            if(!isNaN(args[i].toString()))
                            {
                                emojiID = emojiID + args[i].toString();
                            }
                        }
                        else
                        {
                            if(args[i].toString() == ":")
                            {
                                waitForEnd = true;
                            }
                        }
                    }
                }
                else
                {
                    if(args[i].toString() == "<")
                    {
                        if(args.length > i + 2)
                        {
                            if(args[i + 1].toString() == ":" || (args[i + 1].toString() + args[i + 2].toString()) == "a:")
                            {
                                getEmoji = true;
                                i = i++;
                            }
                        }
                        else if(args.length > i + 1)
                        {
                            if(args[i + 1].toString() == ":")
                            {
                                getEmoji = true;
                                i = i++;
                            }
                        }
                    } 
                }
            }

            if(emojiID == "")
            {
                message.channel.send("<@" + message.author.id + "> No custom emoji found, use `" + commandPrefix + "help bigmoji` for help.").catch(error => {console.log("Send Error - " + error); });
                return;
            }
            else
            {
                message.channel.send(`Emoji Found`, {files: [`https://cdn.discordapp.com/emojis/${emojiID}.png`]}).catch(error => { 
                        message.channel.send("<@" + message.author.id + "> The given emoji was not found, use `" + commandPrefix + "help bigmoji` for help.").catch(error => {console.log("Send Error - " + error); 
                    });
                });  
            }
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No custom emoji given, use `" + commandPrefix + "help bigmoji` for help.").catch(error => {console.log("Send Error - " + error); });
            return;
        }
    }
    
}

module.exports = Bigmojiommand;
