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

class CaptionCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "caption",
            group: "imageshit",
            memberName: "caption",
            description: "Caption an image. This command requires the text parameter to be filled. This command takes the last image uploaded.",
            examples: ["`!caption <text>`", "`!caption uh oh`"]
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

        if(args.length > 0 && args.length <= 500)
        {
            var url = "";
            message.channel.fetchMessages({ around: message.id })
            .then(messages => {
                var messageID = "";
                messages.filter(msg => {
                    if(msg.attachments.last() != undefined)
                    {
                        var attachments = msg.attachments.array();
                        for(var i = attachments.length - 1; i > -1; i--)
                        {
                            if(attachments[i].height > 0)
                            {
                                if(messageID == "")
                                {
                                    messageID = msg.id;
                                    url = attachments[i].url;
                                }
                            }
                        }
                    }
                }); 

                if(messageID == "")
                {
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help caption` for help.").catch(error => {console.log("Send Error - " + error); });
                    return;
                }

                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                console.log("got image");
                Jimp.read(url).then(function (captionImage) { 
                    Jimp.read("blank.png").then(function (blankImage) {   
                        Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(function (font) {
                            var height = (Math.floor(args.length/40)+1)*75

                            if(height < 75)
                                height = 75;

                            var textImage = blankImage.resize(1500, height)
                            textImage.print(font, 25, 0, args.toString(), 1500);
                            
                            textImage.resize(captionImage.bitmap.width, Jimp.AUTO)
                            var finalImage = new Jimp(captionImage.bitmap.width, captionImage.bitmap.height + textImage.bitmap.height)
                            .composite(textImage, 0, 0).composite(captionImage, 0, textImage.bitmap.height)

                            const file = shortid.generate() + ".png";
                            finalImage.write(file, function(error){  
                                if(error) { console.log(error); return;};
                            message.channel.send("***Captioned***", {
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
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                        
                    });
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                    console.log(err.message);
                    
                });
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                console.log(err.message);
                
            });
            
        }
        else
        {
            if(args.length > 0)
                message.channel.send("<@" + message.author.id + "> Character limit for the text parameter is 500 characters, use `" + commandPrefix + "help caption` for help.").catch(error => {console.log("Send Error - " + error); });
            else
                message.channel.send("<@" + message.author.id + "> Text not given, use `" + commandPrefix + "help caption` for help.").catch(error => {console.log("Send Error - " + error); });
        }
    }
}

module.exports = CaptionCommand;