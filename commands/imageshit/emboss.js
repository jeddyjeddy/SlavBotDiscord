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
           [-4, -2, 0,
            -2, 2, 2,
            0, 2, 3], 1);
}
var CommandCounter = require("../../index.js")

class EmbossCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "emboss",
            group: "imageshit",
            memberName: "emboss",
            description: "Adds the Emboss effect to your image. Use the last image uploaded, your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!emboss`", "`!emboss avatar`", "`!emboss @User`"]
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
        console.log("emboss");
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
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help emboss` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read(url).then(function (userImage) {
                    console.log("got last image to emboss");
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
                                message.channel.send("***Emboss***", {
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
                                console.log("emboss Error:" + err);
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
            var promises = []
            if(otherUser)
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
            }
            else
            {
                url = message.author.avatarURL;
            }

            Promise.all(promises).then(() => {
                
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
                                message.channel.send("***Emboss***", {
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
                                console.log("Emboss Error:" + err);
                                fs.unlink(fileTemp, resultHandler);
                                
                              }));
                        })
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
        }
    }
}

module.exports = EmbossCommand;
