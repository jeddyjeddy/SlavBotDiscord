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

class DeepfryCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "deepfry",
            group: "imageshit",
            memberName: "deepfry",
            description: "Deep Fry an image. Deep Fry the last image uploaded or Deep Fry your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!deepfry`", "`!deepfry avatar`", "`!deepfry @User`"]
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
        console.log("deepfry");
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
                    message.reply("no image found, use `" + commandPrefix + "help deepfry` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read(url).then(function (userImage) {
                    console.log("got last image to deepfry");
        
                    var orgWidth = userImage.bitmap.width, orgHeight = userImage.bitmap.height;
                    
                    userImage.resize(userImage.bitmap.width / 6, userImage.bitmap.height / 6);
                    userImage.color([
                        { apply: 'saturate', params: [ 100 ] },
                        { apply: 'red', params: [ 50 ] }
                    ]) 
                    userImage.contrast(1);
                    userImage.resize(orgWidth, orgHeight);
    
                    var file = shortid.generate() + ".png"
                    userImage.write(file, function(error){
                        if(error) throw error;
                        console.log(file);
                        message.channel.send("***Deep Fried***", {
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
                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
                message.channel.stopTyping();
            });
        }
        else if(args.toString().toLowerCase() == "avatar" || otherUser)
        {
            if(otherUser)
            {
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
                url = message.author.avatarURL;
            }
            var wait = 0;

            if(otherUser)
            wait = 500;

            setTimeout(function(){
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");
                    var orgWidth = userImage.bitmap.width, orgHeight = userImage.bitmap.height;
        
                    userImage.resize(userImage.bitmap.width * (1/10), userImage.bitmap.height * (1/10));
                    userImage.resize(orgWidth, orgHeight);
          
                    userImage.color([
                        { apply: 'saturate', params: [ 100 ] },
                        { apply: 'red', params: [ 50 ] }
                    ]); 
                    userImage.contrast(1);
    
                    var file = shortid.generate() + ".png"
                        userImage.write(file, function(error){
                        if(error) throw error;
                        console.log(file);
                        message.channel.send("***Deep Fried***", {
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
            }, wait);
        }
    }
}

module.exports = DeepfryCommand;
