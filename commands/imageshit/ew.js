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
const selfResponses = [" you must have nothing better to do", " feel free to insult a bot if it makes you feel better about yourself", " your parents must be proud of you", " how insecure must you be to insult a bot?"," you have just turned all of the gopniks against you, blyat", " you will hear hardbass in your sleep"];
var CommandCounter = require("../../index.js")

class EwCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "ew",
            group: "imageshit",
            memberName: "ew",
            description: "Looks like you stepped in shit. This command takes the last image uploaded, your avatar or the avatar of the user you have mentioned after the command.",
            examples: ["`!ew`", "`!ew avatar`", "`!ew @User`"]
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
                    message.reply("no image found, , use `" + commandPrefix + "help ew` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read("ew.png").then(function (EwImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        
                        var x = 200
                        var y = 730

                        userImage.resize(Jimp.AUTO, 240)
                        x = x + ((240 - userImage.bitmap.width) / 2)
                        
                        
        
        
                        var mergedImage = EwImage.composite(userImage, x, y );
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) throw error;
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***Ew***", {
                                files: [file]
                            }).then(function(){
                                message.channel.stopTyping();
                                fs.unlink(file, resultHandler);
                            }).catch(function (err) {
                                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                console.log(err.message);
                                message.channel.stopTyping();
                                fs.unlink(file, resultHandler);
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
                console.log("other Ew");
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
                console.log("self Ew");
                userID = message.author.id;
                url = message.author.avatarURL;
            }
            Jimp.read("ew.png").then(function (EwImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");
    
                    var x = 190
                     var y = 740

                    userImage.resize(240, 240)
    
                    var mergedImage = EwImage.composite(userImage, x, y );
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) throw error;
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***Ew*** <@" + userID + ">", {
                            files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            setTimeout(function(){
                                if(userID == message.client.user.id)
                                {
                                    message.channel.send("<@" + message.author.id + ">" + selfResponses[Math.floor(Math.random() * (selfResponses.length))]).catch(error => console.log("Send Error - " + error));
                                }
                            }, 1000);
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
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
        }
    }
}

module.exports = EwCommand;
