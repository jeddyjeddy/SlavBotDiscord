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

class HomeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "home",
            group: "imageshit",
            memberName: "home",
            description: "***Let me guess, your home? It was... and it was beautiful.*** Use the last 2 images uploaded (required).",
            examples: ["`!home`"]
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
            var messageID2 = "";
            var url, url2;
            var arrayMessages = messages.array();
            for(var i = 0; i < arrayMessages.length; i++)
            {
                if(arrayMessages[i].attachments.first() != undefined)
                {
                    for(var i2 = arrayMessages[i].attachments.array().length - 1; i2 > -1; i2--)
                    {
                        if(arrayMessages[i].attachments.array()[i2].height > 0)
                        {
                            if(messageID == "")
                            {
                                messageID = arrayMessages[i].id;
                                url2 = arrayMessages[i].attachments.array()[i2].url;
                            }
                            else if(messageID2 == "")
                            {
                                messageID2 = arrayMessages[i].id;
                                url = arrayMessages[i].attachments.array()[i2].url;
                            }
                        }
                    }
                }
            }

            if(messageID == "" || messageID2 == "")
            {
                message.channel.send("<@" + message.author.id + "> 2 images not found, use `" + commandPrefix + "help home` for help.").catch(error => {console.log("Send Error - " + error); });
                
                return;
            }
            message.channel.send("***taking images***").catch(error => {console.log("Send Error - " + error); });
            Jimp.read("home.png").then(function (homeImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    Jimp.read(url2).then(function (userImage2) {
                    
                        var panel = userImage.cover(homeImage.bitmap.width, 209)
                        var finalPanel = userImage2.cover(homeImage.bitmap.width - 172, 209)

                        var mergedImage = new Jimp(homeImage.bitmap.width, homeImage.bitmap.height).composite(panel, 0, 0).composite(panel, 0, 208).composite(panel, 0, 417).composite(finalPanel, 172, 417).composite(homeImage, 0, 0);
                        const file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***Let me guess, your home? It was... and it was beautiful.***", {
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

module.exports = HomeCommand;
