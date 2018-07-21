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

class CNNCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "cnn",
            group: "imageshit",
            memberName: "cnn",
            description: "***Breaking News!*** Merges the cnn breaking news template to the last image uploaded.",
            examples: ["`!cnn <headline-text>|<ticker-text>`", "`!cnn NASA Announces Despacito 3|Luis Fonsi - \"It had to be done\"`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter(message.author.id)
        var headline = "";
        var ticker = "";

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if(args.length > 0)
        {
            var nextLine = false;

            for(var i = 0; i < args.length; i++)
            {
                if (nextLine)
                {
                     ticker = ticker + args[i];
                }
                else
                {
                    if(args[i] == "|")
                    {
                        nextLine = true;
                    }
                    else
                    {
                        headline = headline + args[i];
                    }
                }
            }
        }

        var url = "";

        if(headline == "" && ticker == "")
        {
            message.reply("all parameters not filled. Use `" + commandPrefix + "help cnn` for help.").catch(error => console.log("Send Error - " + error))
        }
        console.log(headline.toUpperCase())
        console.log(ticker.toUpperCase())
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
                    message.reply("no image found, use `!help cnn` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("cnn.png").then(function (cnnImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("Readin font 72")
                        Jimp.loadFont("mentone_72.fnt").then(function (headlineFont) {
                            console.log("Readin font 20")
                            Jimp.loadFont("mentone_32_black.fnt").then(function (tickerFont) {
                                Jimp.loadFont("mentone_32_white.fnt").then(function (timeFont) {
                                    console.log("got avatar");
                
                                    cnnImage.print(headlineFont, 100, 525, headline.toUpperCase());
                                    cnnImage.print(tickerFont, 200, 632, ticker.toUpperCase());

                                    var hours = Math.floor(Math.random() * 24);
                                    var mins = Math.floor(Math.random() * 60);

                                    if(hours < 10)
                                    {
                                        hours = "0" + hours.toString();
                                    }

                                    if(mins < 10)
                                    {
                                        mins = "0" + mins.toString();
                                    }

                                    cnnImage.print(timeFont, 90, 632, hours.toString() + ":" + mins.toString());

                                    userImage.cover(1280, 720);
                                    
                                    var mergedImage = userImage.composite(cnnImage, 0, 0 );
                                    var file = shortid.generate() + ".png"
                                    mergedImage.write(file, function(error){
                                        if(error) throw error;
                                        console.log("got merged image cnn");
                                        console.log(file);
                                        message.channel.send("***Breaking News***", {
                                            files: [file]
                                        }).then(function(){
                                            setTimeout(function(){
                                                message.channel.stopTyping();
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
                                });
                            });
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

module.exports = CNNCommand;
