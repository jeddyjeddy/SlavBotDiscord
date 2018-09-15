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

const selfResponses = [" I have a bigger bat", ", they won't find your body",  " I know where you live", " can you do *anything* properly?", " I can slam even harder"," you have just turned all of the gopniks against you, blyat", " you will hear hardbass in your sleep"];

class SlamCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "slam",
            group: "imageshit",
            memberName: "slam",
            description: "***Slammed.*** Use the last 2 images uploaded or the avatar of another user along with your own.",
            examples: ["`!slam`", "`!slam @User`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        var userID = "";

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
        
        var promises = []
        var url = "";
        if(userID != "")
        {
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

                
            Jimp.read("slam.jpg").then(function (slamImage) {
                console.log("got image");
                if(message.author.avatarURL == undefined || message.author.avatarURL == null)
                {
                    message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                    return;
                }
                
                Jimp.read(message.author.avatarURL).then(function (authorImage) {
                    
                    Promise.all(promises).then(() => {
                        Jimp.read(url).then(function (userImage) {
                            console.log("got avatar");
                            authorImage.scaleToFit(150, 150);
                            userImage.scaleToFit(220, 190);
                            var x = 20
                            x = x + ((150 - authorImage.bitmap.width) / 2)
                            var y = 300
                            var x2 = 440
                            x2 = x2 + ((220 - userImage.bitmap.width) / 2)
                            var y2 = 330
                            var mergedImage = slamImage.composite(authorImage, x, y).composite(userImage, x2, y2);
                            const file = shortid.generate() + ".png"
                            mergedImage.write(file, function(error){
                                if(error) { console.log(error); return;};
                                console.log("got merged image");
                                console.log(file);
                                message.channel.send("<@" + message.author.id+ "> ***Slammed*** <@" + userID + ">", {
                                    files: [file]
                                }).then(function(){
                                    if(userID == message.client.user.id)
                                    {
                                        message.channel.send("<@" + message.author.id + ">" + selfResponses[Math.floor(Math.random() * (selfResponses.length))]).catch(error => {console.log("Send Error - " + error); });
                                    }
                                    fs.remove(file, resultHandler);
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message);
                                    
                                    fs.remove(file, resultHandler);
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
        }
        else
        {
            var commandPrefix= "!"
            if(message.guild != null)
            {
                commandPrefix = message.guild.commandPrefix
            }
            message.channel.fetchMessages({ around: message.id })
            .then(messages => {
                var messageID = "";
                var messageID2 = "";
                var url, url2;
                var arrayMessages = messages.array();
                for(var i = 0; i < arrayMessages.length; i++)
                {
                    if(arrayMessages[i].attachments.first() != undefined)
                    {
                        for(var i2 = arrayMessages[i].attachments.array().length - 1; i2 > -1; i2--)
                        {
                            if(arrayMessages[i].attachments.array()[i2].height > 0)
                            {
                                if(messageID == "")
                                {
                                    messageID = arrayMessages[i].id;
                                    url2 = arrayMessages[i].attachments.array()[i2].url;
                                }
                                else if(messageID2 == "")
                                {
                                    messageID2 = arrayMessages[i].id;
                                    url = arrayMessages[i].attachments.array()[i2].url;
                                }
                            }
                        }
                    }
                }

                if(messageID == "" || messageID2 == "")
                {
                    message.channel.send("<@" + message.author.id + "> 2 images not found, use `" + commandPrefix + "help slam` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }

                Jimp.read(url).then(function (userImage) {
                    Jimp.read(url2).then(function (userImage2) {
                        Jimp.read("slam.jpg").then(function (slamImage) {     
                            userImage.scaleToFit(150, 150);
                            userImage2.scaleToFit(220, 190);
                            var x = 20
                            x = x + ((150 - userImage.bitmap.width) / 2)
                            var y = 300
                            var x2 = 440
                            x2 = x2 + ((220 - userImage2.bitmap.width) / 2)
                            var y2 = 330
                            var mergedImage = slamImage.composite(userImage, x, y).composite(userImage2, x2, y2);
                            const file = shortid.generate() + ".png"
                            mergedImage.write(file, function(error){
                                if(error) { console.log(error); return;};
                                console.log("got merged image");
                                console.log(file);
                                message.channel.send("***Slammed***", {
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
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
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

module.exports = SlamCommand;
