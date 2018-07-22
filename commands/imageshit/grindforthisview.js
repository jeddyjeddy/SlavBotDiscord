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

class GrindforthisviewCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "grindforthisview",
            group: "imageshit",
            memberName: "grindforthisview",
            description: "I had to grind for this view. Use the last image uploaded (required). You can also add your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!grindforthisview`", "`!grindforthisview avatar`", "`!grindforthisview @User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter(message.author.id)
        var otherUser = false;
        var userID = "";
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }
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
                    message.reply("no image found, use `" + commandPrefix + "help grindforthisview` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("grind.png").then(function (grindImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        
                        userImage.cover(grindImage.bitmap.width, grindImage.bitmap.height)
        
                        var mergedImage = userImage.composite(grindImage, 0, 0);
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) throw error;
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***I had to grind for this view***", {
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
            var profileURL = "";
            if(otherUser)
            {
                console.log("other grind");
                console.log(userID);
    
                message.channel.client.fetchUser(userID)
                 .then(user => {
                    profileURL = user.avatarURL;
                 }, rejection => {
                        console.log(rejection.message);
                 });
            }
            else
            {
                console.log("self grind");
                userID = message.author.id;
                profileURL = message.author.avatarURL;
            }
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
                    message.reply("no image found, use `" + commandPrefix + "help grindforthisview` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("grind.png").then(function (grindImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        Jimp.read(profileURL).then(function (profileImage) {
                        
                            userImage.cover(grindImage.bitmap.width, grindImage.bitmap.height)
            
                            var mergedImage = userImage.composite(grindImage, 0, 0);
                            profileImage.resize(140, 140)
                            mergedImage.composite(profileImage, 160, 160)
                            var file = shortid.generate() + ".png"
                            mergedImage.write(file, function(error){
                                if(error) throw error;
                                console.log("got merged image");
                                console.log(file);
                                message.channel.send("***I had to grind for this view***", {
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
}

module.exports = GrindforthisviewCommand;
