const command = require("discord.js-commando");
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}
var CommandCounter = require("../../index.js")

class ClassicCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "classic",
            group: "imageshit",
            memberName: "classic",
            description: "***Classic weeb shit.*** This command only has a text parameter.",
            examples: ["`!classic <text>`", "`!classic this command is the ultimate form of degeneracy`"]
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

        if(args.length > 0 && args.length <= 85)
        {
            var file = shortid.generate() + ".png";
            
                Jimp.read("classic.jpg").then(function (trumpImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(function (font) {
                        var textWidth = 480;
                        var textHeight = 425;
                        var textRot = -3;
                        var textX = 305;
                        var textY = 625;

                        var textImage = new Jimp(textWidth, textHeight);
                        textImage.print(font, 0, 0, args.toString(), textWidth);
                        textImage.rotate(textRot);

                        trumpImage.composite(textImage, textX, textY).write(file, function(error){  
                            if(error) { console.log(error); return;};
                        message.channel.send("***Classic***", {
                                    files: [file]
                        }).then(function(){
                            
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.unlink(file, resultHandler);
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
             message.channel.send("<@" + message.author.id + "> Character limit for the text parameter is 85 characters, use `" + commandPrefix + "help classic` for help.").catch(error => {console.log("Send Error - " + error); });
            else
             message.channel.send("<@" + message.author.id + "> Text not given, use `" + commandPrefix + "help classic` for help.").catch(error => {console.log("Send Error - " + error); });
            
        }
    }
}

module.exports = ClassicCommand;