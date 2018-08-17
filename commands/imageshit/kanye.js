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

class KanyeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "kanye",
            group: "imageshit",
            memberName: "kanye",
            description: "Have Kanye hold your image. This command takes the last image uploaded, your avatar or the avatar of the user you have mentioned after the command.",
            examples: ["`!kanye`", "`!kanye avatar`", "`!kanye @User`"]
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
                    message.channel.send("<@" + message.author.id + "> No image found, , use `" + commandPrefix + "help kanye` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("Kanye.png").then(function (KanyeImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        
                        var x = 218
                        var y = 500

                        userImage.cover(462, 560);
                        userImage.rotate(1);

                        var blank = new Jimp(KanyeImage.bitmap.width, KanyeImage.bitmap.height);
                        blank.composite(userImage, x, y)        
        
                        var mergedImage = blank.composite(KanyeImage, 0, 0);
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***Thank you Kanye, very cool!***", {
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
                console.log("other Kanye");
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
                console.log("self Kanye");
                userID = message.author.id;
                url = message.author.avatarURL;
            }
            Jimp.read("Kanye.png").then(function (KanyeImage) {
                console.log("got image");
                if(url == "no user")
                {
                    message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                    return;
                }
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");    
                    var x = 218
                    var y = 500

                    userImage.cover(462, 560);
                    userImage.rotate(1);

                    var blank = new Jimp(KanyeImage.bitmap.width, KanyeImage.bitmap.height);
                    blank.composite(userImage, x, y)        
    
                    var mergedImage = blank.composite(KanyeImage, 0, 0);
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) { console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***Thank you Kanye, very cool!***", {
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

module.exports = KanyeCommand;
