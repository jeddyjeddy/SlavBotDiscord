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

class SunriseCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "sunrise",
            group: "imageshit",
            memberName: "sunrise",
            description: "***It's beautiful.*** Use the last image uploaded (required).",
            examples: ["`!sunrise`"]
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
                message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help sunrise` for help.").catch(error => {console.log("Send Error - " + error); });
                
                return;
            }
            message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
            Jimp.read("sunrise.png").then(function (sunriseImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    
                    userImage.cover(sunriseImage.bitmap.width, sunriseImage.bitmap.height - 235)
                    var blank = new Jimp(sunriseImage.bitmap.width, sunriseImage.bitmap.height)
                    blank.composite(userImage, 0, 335);
                    var mergedImage = blank.composite(sunriseImage, 0, 0);
                    const file = "TempStorage/" + shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) { console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***It's beautiful***", {
                            files: [file]
                        }).then(function(){
                            

                            fs.remove(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.remove(file, resultHandler);
                        });
                        console.log("Message Sent");
                    });
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                    console.log(err.message);
                    
                });
            }).catch(function (err) {
                console.log(err.message);
                
            });
        }).catch(function (err) {
            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
            console.log(err.message);
            
        });
    }
}

module.exports = SunriseCommand;
