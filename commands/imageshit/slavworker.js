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

class SlavWorkerCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "slavworker",
            group: "imageshit",
            memberName: "slavworker",
            description: "Slav Up an image. Merges the worker version of Slav Bot (from the support server) to the last image uploaded, your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!slavworker`", "`!slavworker avatar`","`!slavworker @User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        var otherUser = false;
        var userID = "";
        var currentPrefix= "!"
        if(message.guild != null)
        {
            currentPrefix = message.guild.commandPrefix
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
                    message.reply("no image found, use `" + commandPrefix + "help slav` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("slavworker.png").then(function (slavImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        if(userImage.bitmap.height > userImage.bitmap.width)
                        {
                            slavImage.resize(userImage.bitmap.width * 0.75, userImage.bitmap.width * 0.75);
                        }
                        else if (userImage.bitmap.width > userImage.bitmap.height)
                        {
                            slavImage.resize(userImage.bitmap.height * 0.75, userImage.bitmap.height * 0.75);
                        }
                        else
                        {
                            slavImage.resize(userImage.bitmap.width * 0.75, userImage.bitmap.height * 0.75);
                        }
                        var x = (Math.random() * (userImage.bitmap.width)) - (slavImage.bitmap.width / 2);
                        console.log(x);
                        var y = (Math.random() * (userImage.bitmap.height)) - (slavImage.bitmap.height / 2);
                        console.log(y);
        
                        if(Math.random() * 100 < 50)
                        {
                            if(Math.random() * 100 < 50)
                            {
                                if(y < userImage.bitmap.height / 4)
                                {
                                    if(Math.random() * 100 < 50)
                                    {
                                        slavImage.flip(false, true);
                                    }
                                    else
                                    {
                                        slavImage.flip(true, true);
                                    }
                                }
                                else
                                {
                                    if(Math.random() * 100 < 50)
                                    {
                                        slavImage.flip(false, false);
                                    }
                                    else
                                    {
                                        slavImage.flip(true, false);
                                    }
                                }
                            }
                            else
                            {
                                if(x < userImage.bitmap.width / 4)
                                {
                                    slavImage.rotate(90);
                                }
                                else if(x > userImage.bitmap.width / 4)
                                {
                                    slavImage.rotate(-90);
                                }
        
                                if(Math.random() * 100 < 50)
                                {
                                    slavImage.flip(false, false);
                                }
                                else
                                {
                                    slavImage.flip(false, true);
                                }
                            }
                        }
        
                        
                        var mergedImage = userImage.composite(slavImage, x, y );
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) throw error;
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("Slav'd", {
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
                console.log("other slav");
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
                console.log("self slav");
                url = message.author.avatarURL;
            }

            Jimp.read("slavworker.png").then(function (slavImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");
                    slavImage.resize(userImage.bitmap.width * 0.75, userImage.bitmap.height * 0.75);
    
                    var x = (Math.random() * (userImage.bitmap.width)) - (slavImage.bitmap.width / 2);
                    console.log(x);
                    var y = (Math.random() * (userImage.bitmap.height)) - (slavImage.bitmap.height / 2);
                    console.log(y);
    
                    if(Math.random() * 100 < 50)
                    {
                        if(Math.random() * 100 < 50)
                        {
                            if(y < userImage.bitmap.height / 4)
                            {
                                if(Math.random() * 100 < 50)
                                {
                                    slavImage.flip(false, true);
                                }
                                else
                                {
                                    slavImage.flip(true, true);
                                }
                            }
                            else
                            {
                                if(Math.random() * 100 < 50)
                                {
                                    slavImage.flip(false, false);
                                }
                                else
                                {
                                    slavImage.flip(true, false);
                                }
                            }
                        }
                        else
                        {
                            if(x < userImage.bitmap.width / 4)
                            {
                                slavImage.rotate(90);
                            }
                            else if(x > userImage.bitmap.width / 4)
                            {
                                slavImage.rotate(-90);
                            }
    
                            if(Math.random() * 100 < 50)
                            {
                                slavImage.flip(false, false);
                            }
                            else
                            {
                                slavImage.flip(false, true);
                            }
                        }
                    }
    
                    
                    var mergedImage = userImage.composite(slavImage, x, y );
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) throw error;
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("Slav'd", {
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

module.exports = SlavWorkerCommand;
