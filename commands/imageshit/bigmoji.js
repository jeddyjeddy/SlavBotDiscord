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

            var addData = false
            var dataFetched = false;
            for(var i = 0; i < args.length; i++)
            {
                if(!dataFetched)
                {
                    if(addData)
                    {
                        if(args[i] == ">")
                            dataFetched = true
                        else
                            emojiID = emojiID + args[i].toString()
                    }
                    else
                    {
                        if(args[i] == "<")
                        {
                            addData = true;
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
                while(emojiID.indexOf(":") > -1 && emojiID.length > 1)
                {
                    var newID = ""
                    for(var i = emojiID.indexOf(":") + 1; i < emojiID.length; i++)
                    {
                        newID = newID + emojiID[i]
                    }
                    emojiID = newID;
                }

                console.log("Emoji ID - " + emojiID)

                message.channel.send(`Emoji Found`, {files: [`https://cdn.discordapp.com/emojis/${emojiID}.gif`]}).catch(error => { 
                    message.channel.send(`Emoji Found`, {files: [`https://cdn.discordapp.com/emojis/${emojiID}.png`]}).catch(error => { 
                        message.channel.send("<@" + message.author.id + "> The given emoji was not found, use `" + commandPrefix + "help bigmoji` for help.").catch(error => {console.log("Send Error - " + error); 
                        });
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
