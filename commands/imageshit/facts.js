const command = require("discord.js-commando");
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs-extra');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}
var CommandCounter = require("../../index.js")

class FactsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "facts",
            group: "imageshit",
            memberName: "facts",
            description: "***Facts.*** This command only has a text parameter.",
            examples: ["`!facts <text>`", "`!facts if you have an anime profile pic your opinion doesn't count`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }        

        if(args.length > 0 && args.length <= 140)
        {
            const file = shortid.generate() + ".png";
            
                Jimp.read("facts.png").then(function (factsImage) {
                    Jimp.loadFont("Arial_24.fnt").then(function (font) {
                        var textWidth = 165;
                        var textHeight = 145;
                        var textRot = 15;
                        var textX = 20;
                        var textY = 325;

                        var textImage = new Jimp(textWidth, textHeight);
                        textImage.print(font, 0, 0, args.toString(), textWidth).invert();
                        textImage.rotate(textRot);

                        factsImage.composite(textImage, textX, textY).write(file, function(error){  
                            if(error) { console.log(error); return;};
                        message.channel.send("***Facts***", {
                                    files: [file]
                        }).then(function(){
                            
                            fs.remove(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.remove(file, resultHandler);
                        });
                            });
                    });
                 }).catch(function (err) {
                    console.log(err.message);
                    
                });
        }
        else
        {
            if(args.length > 0)
             message.channel.send("<@" + message.author.id + "> Character limit for the text parameter is 140 characters, use `" + commandPrefix + "help facts` for help.").catch(error => {console.log("Send Error - " + error); });
            else
             message.channel.send("<@" + message.author.id + "> Text not given, use `" + commandPrefix + "help facts` for help.").catch(error => {console.log("Send Error - " + error); });
            
        }
    }
}

module.exports = FactsCommand;