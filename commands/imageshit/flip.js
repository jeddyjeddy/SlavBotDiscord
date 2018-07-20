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

class FlipCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "flip",
            group: "imageshit",
            memberName: "flip",
            description: "Flips an image. Flip the last image uploaded, your avatar or the avatar of the user you mentioned after the command.",
            examples: ["`!flip <option> `", "`!flip vertical `", "`!flip horizontal|avatar`", "`!flip vertical| @User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        var otherUser = false;
        var userID = "";
        var option = "";
        var imageOption = "";

        var currentPrefix= "!"
        if(message.guild != null)
        {
            currentPrefix = message.guild.commandPrefix
        }

        if(args.length > 0)
        {
            if(args.indexOf("|") > -1)
            {
                option = args.toLowerCase().slice(0, args.indexOf("|"))
                if(args.length > args.indexOf("|") + 1)
                {
                    imageOption = args.toLowerCase().slice(args.indexOf("|") + 1)
                }
            }
            else
            {
                option = args.toLowerCase();
            }

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
        console.log("flip");
        console.log(url);


        if(option != "horizontal" && option != "vertical")
        {
            message.reply("no option in parameter, use either \"horizontal\" or \"vertical\". Use `" + commandPrefix + "help flip` for help.").catch(error => console.log("Send Error - " + error));
            message.channel.stopTyping();
            return;
        }
        
        if(imageOption != "avatar" && !otherUser)
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
                    message.reply("no image found, use `" + commandPrefix + "help flip` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
                message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
                Jimp.read(url).then(function (userImage) {
                    console.log("got last image to flip");
        
                    if(option == "horizontal")
                        userImage.flip(true, false);
                    else if (option == "vertical")
                        userImage.flip(false, true);
    
                    var file = shortid.generate() + ".png";
                    userImage.write(file, function(error){
                        if(error) throw error;
                        console.log(file);
                        message.channel.send("***Flipped***", {
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
        else if(imageOption == "avatar" || otherUser)
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
                    
                    if(option == "horizontal")
                        userImage.flip(true, false);
                    else if (option == "vertical")
                        userImage.flip(false, true);
    
                    var file = shortid.generate() + ".png"
                    userImage.write(file, function(error){
                        if(error) throw error;
                        console.log(file);
                        message.channel.send("***Flipped***", {
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

module.exports = FlipCommand;
