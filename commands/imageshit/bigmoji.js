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
            description: "Gives a high res version of a custom emoji from any discord server the bot is on.",
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
                var localEmojis = message.client.emojis.array()
                var localEmoji = undefined
                for(var i = 0; i < localEmojis.length; i++)
                {
                    if(localEmojis[i].id == emojiID)
                    {
                        localEmoji = localEmojis[i];
                    }
                }

                if(localEmoji == undefined)
                {
                    message.channel.send("***Searching external shards for Emoji, this may take a while.***")
                    message.client.shard.broadcastEval('this.emojis.array()')
                    .then(results => {
                        var emoji = undefined;
    
                        for(var emojiIndex in results)
                        {
                            if(emoji == undefined)
                            {
                                var emojis = results[emojiIndex]
                                for(var i = 0; i < emojis.length; i++)
                                {
                                    if(emojis[i].id == emojiID)
                                    {
                                        emoji = emojis[i];
                                    }
                                }
                            }
                        }
        
                        if(emoji == undefined)
                        {
                            message.channel.send("<@" + message.author.id + "> The given emoji was not found on any of the servers this bot is on, use `" + commandPrefix + "help bigmoji` for help.").catch(error => {console.log("Send Error - " + error); });
                            return;
                        }
                        else
                        {
                            message.channel.send(`<:${emoji.name}:${emoji.id}>`, {files: [`https://cdn.discordapp.com/emojis/${emoji.id}.png`]}).catch(error => {console.log("Send Error - " + error); });
                        }
                    })
                    .catch(console.error);    
                }
                else
                {
                    message.channel.send(localEmoji.toString(), {files: [localEmoji.url]}).catch(error => {console.log("Send Error - " + error); });
                }        
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
