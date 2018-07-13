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

class RipCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "rip",
            group: "imageshit",
            memberName: "rip",
            description: "Pay your respects to a dead user. Adds a gravestone to your avatar or the avatar of the user you have mentioned after the command.",
            examples: ["`!rip`", "`!rip @User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        var otherUser = false;
        var userID = "";

        if(args.length > 0)
        {
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
        
        if(otherUser)
        {
            message.channel.client.fetchUser(userID)
             .then(user => {
                Jimp.read("tombstone.png").then(function (tombImage) {
                    Jimp.read(user.avatarURL).then(function (userImage) {
                        tombImage.resize(userImage.bitmap.width / 2, userImage.bitmap.height / 2);
        
                        var x = userImage.bitmap.width - tombImage.bitmap.width;
                        var y = tombImage.bitmap.height;
                                
                        var mergedImage = userImage.composite(tombImage, x, y );
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) throw error;
                            message.channel.send("F <@" + user.id + ">", {
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
             }, rejection => {
                    console.log(rejection.message);
                    message.channel.stopTyping();
             });
        }
        else
        {
            Jimp.read("tombstone.png").then(function (tombImage) {
                Jimp.read(message.author.avatarURL).then(function (userImage) {
                    tombImage.resize(userImage.bitmap.width / 2, userImage.bitmap.height / 2);
    
                    var x = userImage.bitmap.width - tombImage.bitmap.width;
                    var y = tombImage.bitmap.height;
                            
                    var mergedImage = userImage.composite(tombImage, x, y );
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) throw error;
                        message.channel.send("F <@" + message.author.id + ">", {
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

module.exports = RipCommand;
