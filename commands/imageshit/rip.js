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
        
        CommandCounter.addCommandCounter(message.author.id)
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
                    if(user.avatarURL == undefined || user.avatarURL == null)
                    {
                        message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                        return;
                    }
                    Jimp.read(user.avatarURL).then(function (userImage) {
                        tombImage.resize(userImage.bitmap.width / 2, userImage.bitmap.height / 2);
        
                        var x = userImage.bitmap.width - tombImage.bitmap.width;
                        var y = tombImage.bitmap.height;
                                
                        var mergedImage = userImage.composite(tombImage, x, y );
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            message.channel.send("F <@" + user.id + ">", {
                                files: [file]
                            }).then(function(){
                                
                                fs.remove(file, resultHandler);
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                console.log(err.message);
                                
                                fs.remove(file, resultHandler);
                            });
                        });
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                        
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    
                });   
             }, rejection => {
                    console.log(rejection.message);
                    
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
                        if(error) { console.log(error); return;};
                        message.channel.send("F <@" + message.author.id + ">", {
                            files: [file]
                        }).then(function(){
                            
                            fs.remove(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.remove(file, resultHandler);
                        });
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

module.exports = RipCommand;
