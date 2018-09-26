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
        console.log("deepfry");
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
                    message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help deepfry` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read(url).then(function (userImage) {
        
                    var orgWidth = userImage.bitmap.width, orgHeight = userImage.bitmap.height;
                    
                    
                    userImage.resize(userImage.bitmap.width / 6, userImage.bitmap.height / 6);
                                        
                    userImage.color([
                        { apply: 'saturate', params: [ 100 ] },
                        { apply: 'red', params: [ 50 ] }
                    ]) 
                                        
                    userImage.contrast(1);
                                        
                    userImage.resize(orgWidth, orgHeight);
                        
                    const file = shortid.generate() + ".png"
                    userImage.write(file, function(error){
                        if(error) { console.log(error); return;};
                        console.log(file);
                        message.channel.send("***Deep Fried***", {
                            files: [file]
                        }).then(function(){
                            
                            fs.remove(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.remove(file, resultHandler);
                        });
                        console.log("Message Sent");
                    })
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
                    var orgWidth = userImage.bitmap.width, orgHeight = userImage.bitmap.height;
        
                    userImage.resize(userImage.bitmap.width * (1/10), userImage.bitmap.height * (1/10));
                    userImage.resize(orgWidth, orgHeight);
          
                    userImage.color([
                        { apply: 'saturate', params: [ 100 ] },
                        { apply: 'red', params: [ 50 ] }
                    ]); 
                    userImage.contrast(1);
    
                    const file = shortid.generate() + ".png"
                        userImage.write(file, function(error){
                        if(error) {{ console.log(error); return;}; };
                        console.log(file);
                        message.channel.send("***Deep Fried***", {
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
        }
    }
}

module.exports = DeepfryCommand;
