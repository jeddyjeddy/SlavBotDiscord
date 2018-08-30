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

class DoItToEmCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "doittoem",
            group: "imageshit",
            memberName: "doittoem",
            description: "***You know I had to do it to em.*** Use the last image uploaded (required). You can also add your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!doittoem`", "`!doittoem avatar`", "`!doittoem @User`"]
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
                    else if(msg.embeds[msg.embeds.length - 1] != undefined)
                    {
                        if(msg.embeds[msg.embeds.length - 1].image != null)
                        {
                            if(messageID == "")
                            {
                                messageID = msg.id;
                                url = msg.embeds[msg.embeds.length - 1].image.url;
                            }
                        }
                    }
                });

                if(messageID == "")
                {
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help doittoem` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("doittoem.png").then(function (doittoemImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        
                        userImage.cover(doittoemImage.bitmap.width, doittoemImage.bitmap.height)
        
                        var mergedImage = userImage.composite(doittoemImage, 0, 0);
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***You know I had to do it to em***", {
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
            var profileURL = "";
            if(otherUser)
            {
                console.log("other doittoem");
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
                console.log("self doittoem");
                userID = message.author.id;
                profileURL = message.author.avatarURL;
            }
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
                    else if(msg.embeds[msg.embeds.length - 1] != undefined)
                    {
                        if(msg.embeds[msg.embeds.length - 1].image != null)
                        {
                            if(messageID == "")
                            {
                                messageID = msg.id;
                                url = msg.embeds[msg.embeds.length - 1].image.url;
                            }
                        }
                    }
                });

                if(messageID == "")
                {
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help doittoem` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("doittoem.png").then(function (doittoemImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        
                        Promise.all(promises).then(() => {
                            Jimp.read(profileURL).then(function (profileImage) {
                            
                                userImage.cover(doittoemImage.bitmap.width, doittoemImage.bitmap.height)
                
                                var mergedImage = userImage.composite(doittoemImage, 0, 0);
                                profileImage.resize(90, 90)
                                mergedImage.composite(profileImage, 200, 8)
                                var file = shortid.generate() + ".png"
                                mergedImage.write(file, function(error){
                                    if(error) { console.log(error); return;};
                                    console.log("got merged image");
                                    console.log(file);
                                    message.channel.send("***You know I had to do it to em***", {
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

module.exports = DoItToEmCommand;
