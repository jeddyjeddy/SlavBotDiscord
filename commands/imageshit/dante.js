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

class DanteCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "dante",
            group: "imageshit",
            memberName: "dante",
            description: "***Featuring Dante from the Devil May Cry™ Series.*** This command takes the last image uploaded. This command also has an optional position parameter (1-4).",
            examples: ["`!dante`", "`!dante <position-parameter>`","`!dante 3`"]
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

        var position = 0;
        
        if(args.length > 0)
        {
            if(!isNaN(args))
            {
                position = parseInt(args);

                if(position < 1 || position > 4)
                {
                    message.channel.send("The position parameter must be a number from 1 to 4 (1 = Top Left, 2 = Top Right, 3 = Bottom Left, 4 = Bottom Right).").catch(function (err) {
                        console.log(err.message);
                        
                    });
                    
                    return;
                }
            }
            else
            {
                message.channel.send("The position parameter must be a number from 1 to 4 (1 = Top Left, 2 = Top Right, 3 = Bottom Left, 4 = Bottom Right).").catch(function (err) {
                    console.log(err.message);
                    
                });
                
                return;
            }
        }

        if(position == 0)
        {
            position = Math.floor(Math.random() * 4) + 1;
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
                    if(msg.embeds[msg.embeds.length - 1].image != null)
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
                message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help dante` for help.").catch(error => {console.log("Send Error - " + error); });
                
                return;
            }
            message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
            Jimp.read("dante.png").then(function (danteImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");
                    if(userImage.bitmap.height > userImage.bitmap.width)
                        danteImage.resize(Jimp.AUTO, userImage.bitmap.height * 0.5);
                    else
                        danteImage.resize(userImage.bitmap.height * 0.5, Jimp.AUTO);
                    

                    var x = 0;
                    var y = 0;
    
                    if(position == 1)
                    {
                        x = 0;
                        y = 0;
                    }
                    else if(position == 2)
                    {
                        x = userImage.bitmap.width - danteImage.bitmap.width;
                        y = 0;
                    }
                    else if(position == 3)
                    {
                        x = 0;
                        y = userImage.bitmap.height - danteImage.bitmap.height;
                    }
                    else if(position == 4)
                    {
                        x = userImage.bitmap.width - danteImage.bitmap.width;
                        y = userImage.bitmap.height - danteImage.bitmap.height;
                    }
    
                    
                    var mergedImage = userImage.composite(danteImage, x, y );
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) { console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***Featuring Dante from the Devil May Cry™ Series***", {
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

module.exports = DanteCommand;
