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

var responses = ["The police have arrived", "Here comes the popo", "Stop right there, criminal scum"]

class FCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "police",
            group: "imageshit",
            memberName: "police",
            description: "Is your server infested with degenerates? Call the police. This command takes the last image uploaded, your avatar or the avatar of the user you have mentioned after the command.",
            examples: ["`!police`", "`!police avatar`", "`!police @User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();

        var otherUser = false;
        var userID = "";

        if(args.length > 0)
        {
            console.log("args are present");
            var getUser = false;
            for(var i = 0; i < args.length; i++)
            {
                if(getUser)
                {
                    if(args[i].toString() == ">")
                    {
                        i = args.length;
                        otherUser = true;
                    }
                    else
                    {
                        if(args[i].toString() != "@" && !isNaN(args[i].toString()))
                        {
                            userID = userID + args[i].toString();
                        }
                    }
                }
                else
                {
                    if(args[i].toString() == "<")
                    {
                         getUser = true;
                    } 
                }
            }
        }
        
        var url = "";
        console.log(url);

        if(args.toString().toLowerCase() != "avatar" && !otherUser)
        {
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
                    message.reply("no image found, , use `!help police` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("police.jpg").then(function (FImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        
                        var x = 330
                        var y = 190
                        userImage.scaleToFit(150, 150)
                        if(userImage.bitmap.height < 150)
                        {
                            y = y + ((150 - userImage.bitmap.height) / 2);
                        }
                        if(userImage.bitmap.width < 150)
                        {
                            x = x + ((150 - userImage.bitmap.width) / 2)
                        }
        
                        var mergedImage = FImage.composite(userImage, x, y );
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) throw error;
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***" + responses[Math.floor(Math.random() * responses.length)] + "***", {
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
        else if(args.toString().toLowerCase() == "avatar" || otherUser)
        {
            if(otherUser)
            {
                console.log("other Police");
                console.log(userID);
    
                message.channel.client.fetchUser(userID)
                 .then(user => {
                        url = user.avatarURL;
                 }, rejection => {
                        console.log(rejection.message);
                 });
            }
            else
            {
                console.log("self police");
                userID = message.author.id;
                url = message.author.avatarURL;
            }
            Jimp.read("police.jpg").then(function (FImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");
                    userImage.resize(150, 150);
    
                    var x = 330
                    var y = 190
    
                    var mergedImage = FImage.composite(userImage, x, y );
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) throw error;
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("<@" + userID +"> ***has been arrested***", {
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
        }
    }
}

module.exports = FCommand;