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

class UberCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "uber",
            group: "imageshit",
            memberName: "uber",
            description: "***Wait. Where tf my uber driver taking me?*** Use the last image uploaded (required).",
            examples: ["`!uber`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
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
                if(msg.attachments.first() != undefined)
                {
                    if(msg.attachments.last().height > 0)
                    {
                        if(messageID == "")
                        {
                            messageID = msg.id;
                            url = msg.attachments.first().url;
                        }
                    }
                }
            });

            if(messageID == "")
            {
                message.reply("no image found, use `" + commandPrefix + "help uber` for help.").catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
                return;
            }
            message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
            Jimp.read("uber.png").then(function (uberImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    
                    userImage.cover(uberImage.bitmap.width, uberImage.bitmap.height)
    
                    var mergedImage = userImage.composite(uberImage, 0, 0);
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) throw error;
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***Wait. Where tf my driver taking me?***", {
                            files: [file]
                        }).then(function(){
                            message.channel.stopTyping();

                            setTimeout(function(){
                                fs.unlink(file, resultHandler);
                                console.log("Deleted " + file);
                            }, 10000);
                        }).catch(function (err) {
                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                            setTimeout(function(){
                                fs.unlink(file, resultHandler);
                                console.log("Deleted " + file);
                            }, 10000);
                        });
                        console.log("Message Sent");
                    });
                }).catch(function (err) {
                    message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                    console.log(err.message);
                    message.channel.stopTyping();
                });
            }).catch(function (err) {
                console.log(err.message);
                message.channel.stopTyping();
            });
        }).catch(function (err) {
            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
            console.log(err.message);
            message.channel.stopTyping();
        });
    }
}

module.exports = UberCommand;
