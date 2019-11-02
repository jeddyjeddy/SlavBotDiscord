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

class MomijiSaysCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "momijisays",
            group: "imageshit",
            memberName: "momijisays",
            description: "***MomijiSays weeb shit.*** This command only has a text parameter.",
            examples: ["`!momijisays <text>`", "`!momijisays this command is the ultimate form of degeneracy`"]
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

        if(args.length > 0 && args.length <= 60)
        {
            const file = "TempStorage/" + shortid.generate() + ".png";
            
                Jimp.read("momijisays.jpg").then(function (trumpImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                        var textWidth = 210;
                        var textHeight = 305;
                        var textX = 150;
                        var textY = 310;

                        var textImage = new Jimp(textWidth, textHeight);
                        textImage.print(font, 0, 0, args.toString(), textWidth);

                        trumpImage.composite(textImage, textX, textY).write(file, function(error){  
                            if(error) { console.log(error); return;};
                        message.channel.send("***Momiji Says***", {
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
             message.channel.send("<@" + message.author.id + "> Character limit for the text parameter is 60 characters, use `" + commandPrefix + "help momijisays` for help.").catch(error => {console.log("Send Error - " + error); });
            else
             message.channel.send("<@" + message.author.id + "> Text not given, use `" + commandPrefix + "help momijisays` for help.").catch(error => {console.log("Send Error - " + error); });
            
        }
    }
}

module.exports = MomijiSaysCommand;