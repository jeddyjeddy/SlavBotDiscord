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
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help heil` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
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
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***SIEG HEIL!***", {
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
        else if(args.toString().toLowerCase() == "avatar" || otherUser)
        {
            if(otherUser)
            {
                console.log(userID);
    
                message.channel.client.fetchUser(userID)
                 .then(user => {
                     if(user.avatarURL != undefined && user.avatarURL != null)
                        url = user.avatarURL;
                    else
                        url = "no user"
                 }, rejection => {
                        console.log(rejection.message);
                        url = "no user";
                 });
            }
            else
            {
                url = message.author.avatarURL;
            }
            Jimp.read("hitler.png").then(function (hitlerImage) {
                console.log("got image");
                if(url == "no user")
                {
                    message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                    return;
                }
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
                        if(error) { console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***SIEG HEIL!***", {
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
        }
    }
}

module.exports = HeilCommand;
