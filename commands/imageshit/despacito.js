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

class DespacitoCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "despacito",
            group: "imageshit",
            memberName: "despacito",
            description: "Get despacito'd. Merge the despacito cover with the last image uploaded or merge it with your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!despacito`", "`!despacito avatar`", "`!despacito @User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter()
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
                    message.reply("no image found, use `" + commandPrefix + "help despacito` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("despacito.png").then(function (despacitoImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        if(userImage.bitmap.height > userImage.bitmap.width)
                        {
                            var y = (userImage.bitmap.height - userImage.bitmap.width) / 2
                            userImage.crop(0, y, userImage.bitmap.width, userImage.bitmap.width);
                        }
                        else if (userImage.bitmap.width > userImage.bitmap.height)
                        {
                            var x = (userImage.bitmap.width - userImage.bitmap.height) / 2
                            userImage.crop(x, 0, userImage.bitmap.height, userImage.bitmap.height);
                        }

                        despacitoImage.resize(userImage.bitmap.width, userImage.bitmap.height);
        
                        var mergedImage = userImage.composite(despacitoImage, 0, 0 );
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) throw error;
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("Oh shit, you just got despacito'd", {
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
                            console.log("Message Sent");
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
            }).catch(function (err) {
                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
                message.channel.stopTyping();
            });
        }
        else if(args.toString().toLowerCase() == "avatar" || otherUser)
        {
            if(otherUser)
            {
                console.log("other despacito");
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
                console.log("self despacito");
                userID = message.author.id;
                url = message.author.avatarURL;
            }
            Jimp.read("despacito.png").then(function (despacitoImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");
                    despacitoImage.resize(userImage.bitmap.width, userImage.bitmap.height);
    
                    var mergedImage = userImage.composite(despacitoImage, 0, 0 );
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) throw error;
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("Oh shit, <@" + userID + "> got despacito'd", {
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
                        console.log("Message Sent");
                    })
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

module.exports = DespacitoCommand;
