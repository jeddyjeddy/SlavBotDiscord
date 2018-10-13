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

class DeusCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "deus",
            group: "imageshit",
            memberName: "deus",
            description: "***Deus vult.*** Use the last 2 images uploaded or the avatar of another user along with your own.",
            examples: ["`!deus`", "`!deus @User`"]
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

                
            Jimp.read("deus.png").then(function (deusImage) {
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
                            authorImage.scaleToFit(100, 100);
                            userImage.scaleToFit(220, 120);

                            var x = 150
                            x = x + ((100 - authorImage.bitmap.width) / 2)
                            var y = 100

                            var x2 = 120
                            x2 = x2 + ((220 - userImage.bitmap.width) / 2)
                            var y2 = 380
                            var mergedImage = deusImage.composite(authorImage, x, y).composite(userImage, x2, y2);
                            const file = shortid.generate() + ".png"
                            mergedImage.write(file, function(error){
                                if(error) { console.log(error); return;};
                                console.log("got merged image");
                                console.log(file);
                                message.channel.send("***Deus vult***", {
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
                    message.channel.send("<@" + message.author.id + "> 2 images not found, use `" + commandPrefix + "help deus` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }

                message.channel.send("***taking images***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read(url).then(function (userImage) {
                    Jimp.read(url2).then(function (userImage2) {
                        Jimp.read("deus.png").then(function (deusImage) {     
                            userImage.scaleToFit(100, 100);
                            userImage2.scaleToFit(220, 120);

                            var x = 150
                            x = x + ((100 - userImage.bitmap.width) / 2)
                            var y = 100

                            var x2 = 120
                            x2 = x2 + ((220 - userImage2.bitmap.width) / 2)
                            var y2 = 380
                            var mergedImage = deusImage.composite(userImage, x, y).composite(userImage2, x2, y2);
                            const file = shortid.generate() + ".png"
                            mergedImage.write(file, function(error){
                                if(error) { console.log(error); return;};
                                console.log("got merged image");
                                console.log(file);
                                message.channel.send("***Deus vult***", {
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

module.exports = DeusCommand;
