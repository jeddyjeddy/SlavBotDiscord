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

class SurpriseCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "surprise",
            group: "imageshit",
            memberName: "surprise",
            description: "***Here's Johnny!*** This command takes the last image uploaded, your avatar or the avatar of the user you have mentioned after the command.",
            examples: ["`!surprise`", "`!surprise avatar`", "`!surprise @User`"]
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
                    message.channel.send("<@" + message.author.id + "> No image found, , use `" + commandPrefix + "help surprise` for help.").catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                    message.channel.stopTyping();
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                Jimp.read("surprise.png").then(function (surpriseImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        
                        var x = 150
                        var y = 370
    
                        userImage.cover(300, 430);

                        var blank = new Jimp(surpriseImage.bitmap.width, surpriseImage.bitmap.height);
                        blank.composite(userImage, x, y)        
        
                        var mergedImage = blank.composite(surpriseImage, 0, 0);
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) {message.channel.stopTyping(); console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***Here's Johnny!***", {
                                files: [file]
                            }).then(function(){
                                message.channel.stopTyping();
                                fs.unlink(file, resultHandler);
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                                console.log(err.message);
                                message.channel.stopTyping();
                                fs.unlink(file, resultHandler);
                            });
                            console.log("Message Sent");
                        });
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                        console.log(err.message);
                        message.channel.stopTyping();
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    message.channel.stopTyping();
                });
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                console.log(err.message);
                message.channel.stopTyping();
            });
        }
        else if(args.toString().toLowerCase() == "avatar" || otherUser)
        {
            if(otherUser)
            {
                console.log("other surprise");
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
                console.log("self surprise");
                userID = message.author.id;
                url = message.author.avatarURL;
            }
            Jimp.read("surprise.png").then(function (surpriseImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");    
                    var x = 150
                    var y = 370

                    userImage.cover(300, 430);

                    var blank = new Jimp(surpriseImage.bitmap.width, surpriseImage.bitmap.height);
                    blank.composite(userImage, x, y)        
    
                    var mergedImage = blank.composite(surpriseImage, 0, 0);
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) {message.channel.stopTyping(); console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***Here's Johnny!***", {
                            files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                            console.log(err.message);
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        });
                        console.log("Message Sent");
                    });
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
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

module.exports = SurpriseCommand;
