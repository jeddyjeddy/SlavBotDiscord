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

class HeilCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "heil",
            group: "imageshit",
            memberName: "heil",
            description: "Adds Pink Hitler to the last image uploaded, your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!heil`", "`!heil avatar`", "`!heil @User`"]
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
                    message.reply("no image found, use `" + commandPrefix + "help heil` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("hitler.png").then(function (hitlerImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");

                        if(userImage.bitmap.height > userImage.bitmap.width)
                        {
                            hitlerImage.resize(userImage.bitmap.width * 0.75, userImage.bitmap.width * 0.75);
                        }
                        else if (userImage.bitmap.width > userImage.bitmap.height)
                        {
                            hitlerImage.resize(userImage.bitmap.height * 0.75, userImage.bitmap.height * 0.75);
                        }
                        else
                        {
                            hitlerImage.resize(userImage.bitmap.width * 0.75, userImage.bitmap.height * 0.75);
                        }
        
                        var x = (Math.random() * (userImage.bitmap.width)) - (hitlerImage.bitmap.width / 2);
                        console.log(x);
                        var y = (Math.random() * (userImage.bitmap.height)) - (hitlerImage.bitmap.height / 2);
                        console.log(y);
        
                        if(Math.random() * 100 < 50)
                        {
                            if(Math.random() * 100 < 50)
                            {
                                if(y < userImage.bitmap.height / 4)
                                {
                                    if(Math.random() * 100 < 50)
                                    {
                                        hitlerImage.flip(false, true);
                                    }
                                    else
                                    {
                                        hitlerImage.flip(true, true);
                                    }
                                }
                                else
                                {
                                    if(Math.random() * 100 < 50)
                                    {
                                        hitlerImage.flip(false, false);
                                    }
                                    else
                                    {
                                        hitlerImage.flip(true, false);
                                    }
                                }
                            }
                            else
                            {
                                if(x < userImage.bitmap.width / 4)
                                {
                                    hitlerImage.rotate(90);
                                }
                                else if(x > userImage.bitmap.width / 4)
                                {
                                    hitlerImage.rotate(-90);
                                }
        
                                if(Math.random() * 100 < 50)
                                {
                                    hitlerImage.flip(false, false);
                                }
                                else
                                {
                                    hitlerImage.flip(false, true);
                                }
                            }
                        }
        
                        
                        var mergedImage = userImage.composite(hitlerImage, x, y );
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) throw error;
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***SIEG HEIL!***", {
                                files: [file]
                            }).then(function(){
                                message.channel.stopTyping();
                                fs.unlink(file, resultHandler);
                            }).catch(function (err) {
                                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                console.log(err.message);
                                message.channel.stopTyping();
                                fs.unlink(file, resultHandler);
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
                url = message.author.avatarURL;
            }
            Jimp.read("hitler.png").then(function (hitlerImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");
                    hitlerImage.resize(userImage.bitmap.width * 0.75, userImage.bitmap.height * 0.75);
    
                    var x = (Math.random() * (userImage.bitmap.width)) - (hitlerImage.bitmap.width / 2);
                    console.log(x);
                    var y = (Math.random() * (userImage.bitmap.height)) - (hitlerImage.bitmap.height / 2);
                    console.log(y);
    
                    if(Math.random() * 100 < 50)
                    {
                        if(Math.random() * 100 < 50)
                        {
                            if(y < userImage.bitmap.height / 4)
                            {
                                if(Math.random() * 100 < 50)
                                {
                                    hitlerImage.flip(false, true);
                                }
                                else
                                {
                                    hitlerImage.flip(true, true);
                                }
                            }
                            else
                            {
                                if(Math.random() * 100 < 50)
                                {
                                    hitlerImage.flip(false, false);
                                }
                                else
                                {
                                    hitlerImage.flip(true, false);
                                }
                            }
                        }
                        else
                        {
                            if(x < userImage.bitmap.width / 4)
                            {
                                hitlerImage.rotate(90);
                            }
                            else if(x > userImage.bitmap.width / 4)
                            {
                                hitlerImage.rotate(-90);
                            }
    
                            if(Math.random() * 100 < 50)
                            {
                                hitlerImage.flip(false, false);
                            }
                            else
                            {
                                hitlerImage.flip(false, true);
                            }
                        }
                    }
    
                    
                    var mergedImage = userImage.composite(hitlerImage, x, y );
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) throw error;
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***SIEG HEIL!***", {
                            files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
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

module.exports = HeilCommand;
