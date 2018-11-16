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

class DearLiberalsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "dearliberals",
            group: "imageshit",
            memberName: "dearliberals",
            description: "***Dear Liberals.*** This command only has a text parameter.",
            examples: ["`!dearliberals <text>`", "`!dearliberals facts and logic`"]
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
            
                Jimp.read("dearliberals.png").then(function (dearliberalsImage) {
                    Jimp.loadFont("Arial_24.fnt").then(function (font) {
                        var textWidth = 250;
                        var textHeight = 165;
                        var textRot = 13;
                        var textX = 150;
                        var textY = 290;

                        var textImage = new Jimp(textWidth, textHeight);
                        textImage.print(font, 0, 0, args.toString(), textWidth).invert();
                        textImage.rotate(textRot);

                        dearliberalsImage.composite(textImage, textX, textY).write(file, function(error){  
                            if(error) { console.log(error); return;};
                        message.channel.send("***Dear Liberals***", {
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
             message.channel.send("<@" + message.author.id + "> Character limit for the text parameter is 140 characters, use `" + commandPrefix + "help dearliberals` for help.").catch(error => {console.log("Send Error - " + error); });
            else
             message.channel.send("<@" + message.author.id + "> Text not given, use `" + commandPrefix + "help dearliberals` for help.").catch(error => {console.log("Send Error - " + error); });
            
        }
    }
}

module.exports = DearLiberalsCommand;