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
const Filter = require('node-image-filter');
function imageEffect(pixels) {
    return Filter.convolution(pixels,
           [-1, -1, -1,
            -1, 8.75, -1,
            -1, -1, -1], 1);
}
var CommandCounter = require("../../index.js")

class SharpenCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "sharpen",
            group: "imageshit",
            memberName: "sharpen",
            description: "Adds the Sharpen effect to your image. Use the last image uploaded, your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!sharpen`", "`!sharpen avatar`", "`!sharpen @User`"]
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
        console.log("sharpen");
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
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help sharpen` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read(url).then(function (userImage) {
                    console.log("got last image to sharpen");
                    var fileTemp = "";
                    if(userImage.getExtension() == "gif")
                    {
                        fileTemp = shortid.generate() + ".jpg"
                    }
                    else
                    {
                        fileTemp = shortid.generate() + "." + userImage.getExtension();
                    }
                    
                    userImage.write(fileTemp, function(error){
                        if(error) { console.log(error); return;};
                        console.log(fileTemp);

                        Filter.render(fileTemp, imageEffect, function(result)
                        {
                            var file = shortid.generate() + `.${result.type}`
                            result.data.pipe(fs.createWriteStream(file).on('finish', function(){
                                message.channel.send("***Sharpen***", {
                                    files: [file]
                                }).then(function(){
                                    
                                    fs.unlink(file, resultHandler);
                                    fs.unlink(fileTemp, resultHandler);
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message);
                                    
                                    fs.unlink(file, resultHandler);
                                    fs.unlink(fileTemp, resultHandler);
                                });
                                console.log("Message Sent");
                              }).on('error', function(err) {
                                console.log("Sharpen Error:" + err);
                                fs.unlink(fileTemp, resultHandler);
                                
                              }));
                        })
                    });
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
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
                url = message.author.avatarURL;
            }
            var wait = 0;

            if(otherUser)
            wait = 500;

            setTimeout(function(){
                if(url == "no user")
                {
                    message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                    return;
                }
                Jimp.read(url).then(function (userImage) {
                    console.log("got avatar");
                    var fileTemp = "";
                    if(userImage.getExtension() == "gif")
                    {
                        fileTemp = shortid.generate() + ".jpg"
                    }
                    else
                    {
                        fileTemp = shortid.generate() + "." + userImage.getExtension();
                    }
                    
                    userImage.write(fileTemp, function(error){
                        if(error) { console.log(error); return;};
                        console.log(fileTemp);

                        Filter.render(fileTemp, imageEffect, function(result)
                        {
                            var file = shortid.generate() + `.${result.type}`
                            result.data.pipe(fs.createWriteStream(file).on('finish', function(){
                                message.channel.send("***Sharpen***", {
                                    files: [file]
                                }).then(function(){
                                    
                                    fs.unlink(file, resultHandler);
                                    fs.unlink(fileTemp, resultHandler);
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message);
                                    
                                    fs.unlink(file, resultHandler);
                                    fs.unlink(fileTemp, resultHandler);
                                });
                                console.log("Message Sent");
                              }).on('error', function(err) {
                                console.log("Sharpen Error:" + err);
                                fs.unlink(fileTemp, resultHandler);
                                
                              }));
                        })
                    });
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                    console.log(err.message);
                    
                });     
            }, wait);
        }
    }
}

module.exports = SharpenCommand;
