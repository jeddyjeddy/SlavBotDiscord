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
                    if(msg.attachments.last() != undefined)
                    {
                        if(msg.attachments.last().height > 0)
                        {
                            if(messageID == "")
                            {
                                messageID = msg.id;
                                url = msg.attachments.last().url;
                            }
                        }
                    }
                });

                if(messageID == "")
                {
                    message.channel.send("<@" + message.author.id + "> No image found, , use `" + commandPrefix + "help gottago` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
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
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***" + responses[Math.floor(Math.random() * responses.length)] + "***", {
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
            var promises = []
            if(otherUser)
            {
                console.log("other GottaGo");
                console.log(userID);
    
                promises.push(message.channel.client.fetchUser(userID)
                 .then(user => {
                     if(user.avatarURL != undefined && user.avatarURL != null)
                        url = user.avatarURL;
                    else
                        url = "no user"
                 }, rejection => {
                        console.log(rejection.message);
                        url = "no user";
                 }))
            }
            else
            {
                console.log("self GottaGo");
                userID = message.author.id;
                url = message.author.avatarURL;
            }

            Promise.all(promises).then(() => {
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
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***" + responses[Math.floor(Math.random() * responses.length)] + "***", {
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
                        if(url == "no user")
                        {
                            message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                        }
                        else
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                        
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    
                });
            }).catch((e) => {
                console.log("User Data Error - " + e.message);
                message.channel.send("User data not found").catch(error => console.log("Send Error - " + error));
            });
            
        }
    }
}

module.exports = GottagoCommand;
