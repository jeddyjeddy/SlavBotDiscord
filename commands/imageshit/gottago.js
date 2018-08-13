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

var responses = ["Gotta go", "I'm out", "Goodbye", "Never mind", "Uh, sorry", "On second thought", "Let's forget this ever happened", "Let's not see each other ever again"]
var CommandCounter = require("../../index.js")

class GottagoCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "gottago",
            group: "imageshit",
            memberName: "gottago",
            description: "***Gotta go.*** This command takes the last image uploaded, your avatar or the avatar of the user you have mentioned after the command.",
            examples: ["`!gottago`", "`!gottago avatar`", "`!gottago @User`"]
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
                    message.channel.send("<@" + message.author.id + "> No image found, , use `" + commandPrefix + "help gottago` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.channel.send("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("gottago.png").then(function (GottaGoImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        
                        var x = 80
                        var y = 350

                        userImage.cover(185, 215);
                        userImage.rotate(10);

                        var blank = new Jimp(GottaGoImage.bitmap.width, GottaGoImage.bitmap.height);
                        blank.composite(userImage, x, y)        
        
                        var mergedImage = blank.composite(GottaGoImage, 0, 0);
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) {message.channel.stopTyping(); console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***" + responses[Math.floor(Math.random() * responses.length)] + "***", {
                                files: [file]
                            }).then(function(){
                                message.channel.stopTyping();
                                fs.unlink(file, resultHandler);
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                console.log(err.message);
                                message.channel.stopTyping();
                                fs.unlink(file, resultHandler);
                            });
                            console.log("Message Sent");
                        });
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                        console.log(err.message);
                        message.channel.stopTyping();
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    message.channel.stopTyping();
                });
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
                message.channel.stopTyping();
            });
        }
        else if(args.toString().toLowerCase() == "avatar" || otherUser)
        {
            if(otherUser)
            {
                console.log("other GottaGo");
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
                console.log("self GottaGo");
                userID = message.author.id;
                url = message.author.avatarURL;
            }
            Jimp.read("gottago.png").then(function (GottaGoImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");    
                    var x = 80
                    var y = 350

                    userImage.cover(185, 215);
                    userImage.rotate(10);

                    var blank = new Jimp(GottaGoImage.bitmap.width, GottaGoImage.bitmap.height);
                    blank.composite(userImage, x, y)        
    
                    var mergedImage = blank.composite(GottaGoImage, 0, 0);
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) {message.channel.stopTyping(); console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***" + responses[Math.floor(Math.random() * responses.length)] + "***", {
                            files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        });
                        console.log("Message Sent");
                    });
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
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

module.exports = GottagoCommand;