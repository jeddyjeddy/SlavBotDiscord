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

class LeaderCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "leader",
            group: "imageshit",
            memberName: "leader",
            description: "Adds our leader on an image. Use the last image uploaded (required).",
            examples: ["`!leader`"]
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
                    if(msg.attachments.last().height > 0)
                    {
                        if(messageID == "")
                        {
                            messageID = msg.id;
                            url = msg.attachments.last().url;
                        }
                    }
                }
                else if(msg.embeds[msg.embeds.length - 1] != undefined)
                {
                    if(msg.embeds[msg.embeds.length - 1].image.height > 0)
                    {
                        if(messageID == "")
                        {
                            messageID = msg.id;
                            url = msg.embeds[msg.embeds.length - 1].image.url;
                        }
                    }
                }
            });

            if(messageID == "")
            {
                message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help leader` for help.").catch(error => {console.log("Send Error - " + error); });
                
                return;
            }
            message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
            Jimp.read("putin.png").then(function (leaderImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    
                    userImage.cover(leaderImage.bitmap.width, leaderImage.bitmap.height)
    
                    var mergedImage = userImage.composite(leaderImage, 0, 0);
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) { console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***Our Leader***", {
                            files: [file]
                        }).then(function(){
                            

                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.unlink(file, resultHandler);
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

module.exports = LeaderCommand;
