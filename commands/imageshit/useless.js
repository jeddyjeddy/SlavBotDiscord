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
const selfResponses = [" you must have nothing better to do", " feel free to insult a bot if it makes you feel better about yourself", " your parents must be proud of you", " you’re about as useful as a screen door on a submarine", " how insecure must you be to call me worthless?"];

class UselessCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "useless",
            group: "imageshit",
            memberName: "useless",
            description: "Express how useless a user is.",
            examples: ["`!useless @User`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        var otherUser = false;
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
        var name = "";
        if(otherUser && userID != message.author.id)
        {
            console.log(userID);

             message.channel.client.fetchUser(userID)
                .then(user => {
                    if(user.avatarURL != undefined && user.avatarURL != null)
                    {
                        url = user.avatarURL;
                        name = user.username;
                    }
                   else
                       url = "no user"
                }, rejection => {
                       console.log(rejection.message);
                       url = "no user";
                });
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> Please tag another user after the command.").catch(error => {console.log("Send Error - " + error); });
            
            return;
        }

        console.log(url);
        Jimp.read("useless.jpg").then(function (uselessImage) {
            console.log("got image");
                if(url == "no user")
                {
                    message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                    return;
                }
                Jimp.read(url).then(function (userImage) {
                    var fontType = Jimp.FONT_SANS_16_BLACK;
                    var textY = 105;

                    if(name.length > 8)
                    {
                        fontType = Jimp.FONT_SANS_8_BLACK;
                        textY = 110;
                    }
                    Jimp.loadFont(fontType).then(function (font) {
                        console.log("got avatar");
                        userImage.resize(100, 100);
                        var x = 220
                        var y = 40
                        var mergedImage = uselessImage.composite(userImage, x, y);
                        mergedImage.print(font, 135, textY, name)
                        var file = shortid.generate() + ".png"
                       
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("<@" + userID + ">", {
                                files: [file]
                            }).then(function(){
                                if(userID == message.client.user.id)
                                {
                                    message.channel.send("<@" + message.author.id + ">" + selfResponses[Math.floor(Math.random() * (selfResponses.length))]).catch(error => {console.log("Send Error - " + error); });
                                }
                                fs.unlink(file, resultHandler);
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                console.log(err.message);
                                
                                fs.unlink(file, resultHandler);
                            });
                            console.log("Message Sent");
                    });
                    
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

module.exports = UselessCommand;
