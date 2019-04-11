const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class SpurdoCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "spurdo",
            group: "textshit",
            memberName: "spurdo",
            description: "Translates text to spurdo.",
            examples: ["`!spurdo <text>`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)

        if(args.length > 0)
        {
            var finalText = args.toString().toLowerCase().replace(/c/g, "g").replace(/k/g, "g").replace(/p/g, "b").replace(/t/g, "d")
            .replace(/x/g, "gs").replace(/z/g, "s");
    
            var indexes = []
    
            for(var i = 0; i < finalText.length; i++)
            {
                if(i < finalText.length && i > 1)
                {
                    if(finalText[i - 2] != " " && finalText[i] == "d" && finalText[i - 1] == "e")
                    {
                        if(i == finalText.length - 1)
                            indexes.push(i + 1)
                        else
                        {
                            if(finalText[i + 1] == " ")
                                indexes.push(i + 1)
                        }
                    }
                }
            }
    
            var endSmile = false;
            if(indexes[indexes.length - 1] == finalText.length)
            {
                endSmile = true;
            }
    
            for(var i = finalText.length - 1; i >= 0; i--)
            {
                for(var index = indexes.length - 1; index >= 0; index--)
                {
                    if(indexes[index] == i)
                    {
                        finalText = [finalText.slice(0, i), " :DD", finalText.slice(i)].join('')
                    }
                }
            }
    
            if(endSmile)
            {
                finalText = finalText + " :DD"
            }

            message.channel.send(finalText).catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> Please provide text after the command.").catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = SpurdoCommand;