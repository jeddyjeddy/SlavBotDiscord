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

class AhShitCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "ahshit",
            group: "imageshit",
            memberName: "ahshit",
            description: "***Ah shit, here we go again.*** Use the last image uploaded (required). You can also add your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!ahshit`", "`!ahshit avatar`", "`!ahshit @User`"]
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
                        var attachments = msg.attachments.array();
                        for(var i = attachments.length - 1; i > -1; i--)
                        {
                            if(attachments[i].height > 0)
                            {
                                if(messageID == "")
                                {
                                    messageID = msg.id;
                                    url = attachments[i].url;
                                }
                            }
                        }
                    }
                });

                if(messageID == "")
                {
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help ahshit` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("ahshit.png").then(function (ahshitImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        
                        userImage.cover(ahshitImage.bitmap.width, ahshitImage.bitmap.height)
        
                        var mergedImage = userImage.composite(ahshitImage, 0, 0);
                        const file = "TempStorage/" + shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***Ah shit, here we go again.***", {
                                files: [file]
                            }).then(function(){
                                

                                fs.remove(file, resultHandler);
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                console.log(err.message);
                                
                                fs.remove(file, resultHandler);
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
            var profileURL = "";
            if(otherUser)
            {
                console.log("other ahshit");
                console.log(userID);
    
                promises.push(message.channel.client.fetchUser(userID)
                .then(user => {
                    if(user.avatarURL != undefined && user.avatarURL != null)
                        profileURL = user.avatarURL;
                   else
                        profileURL = "no user"
                }, rejection => {
                       console.log(rejection.message);
                       profileURL = "no user";
                }))
            }
            else
            {
                console.log("self ahshit");
                userID = message.author.id;
                profileURL = message.author.avatarURL;
            }
            message.channel.fetchMessages({ around: message.id })
            .then(messages => {
                var messageID = "";
                messages.filter(msg => {
                    if(msg.attachments.last() != undefined)
                    {
                        var attachments = msg.attachments.array();
                        for(var i = attachments.length - 1; i > -1; i--)
                        {
                            if(attachments[i].height > 0)
                            {
                                if(messageID == "")
                                {
                                    messageID = msg.id;
                                    url = attachments[i].url;
                                }
                            }
                        }
                    }
                });

                if(messageID == "")
                {
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help ahshit` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("ahshit.png").then(function (ahshitImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        
                        Promise.all(promises).then(() => {
                            Jimp.read(profileURL).then(function (profileImage) {
                            
                                userImage.cover(ahshitImage.bitmap.width, ahshitImage.bitmap.height)
                
                                var mergedImage = userImage.composite(ahshitImage, 0, 0);
                                profileImage.resize(150, 150)
                                mergedImage.composite(profileImage, 535, 100)
                                const file = "TempStorage/" + shortid.generate() + ".png"
                                mergedImage.write(file, function(error){
                                    if(error) { console.log(error); return;};
                                    console.log("got merged image");
                                    console.log(file);
                                    message.channel.send("***Ah shit, here we go again.***", {
                                        files: [file]
                                    }).then(function(){
                                        
        
                                        fs.remove(file, resultHandler);
                                    }).catch(function (err) {
                                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                        console.log(err.message);
                                        
                                        fs.remove(file, resultHandler);
                                    });
                                    console.log("Message Sent");
                                });
                            }).catch(function (err) {
                                if(profileURL == "no user")
                                {
                                    message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                                }
                                else
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                console.log(err.message);
                                
                            });
                        }).catch((e) => {
                            console.log("User Data Error - " + e.message);
                            message.channel.send("User data not found").catch(error => console.log("Send Error - " + error));
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
    }
}

module.exports = AhShitCommand;
