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

const selfResponses = [" I have a knife", ", they won't find your body",  "I know where you live", " can you do *anything* properly?", " you're not kidnapping me, *I'm* kidnapping you"," you have just turned all of the gopniks against you, blyat", " you will hear hardbass in your sleep"];

class KidnapCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "kidnap",
            group: "imageshit",
            memberName: "kidnap",
            description: "Kidnap another user.",
            examples: ["`!kidnap @User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
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
        if(otherUser && userID != message.author.id)
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
            message.channel.send("<@" + message.author.id + "> Please tag another user after the command.").catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
            message.channel.stopTyping();
            return;
        }

        console.log(url);
        Jimp.read("kidnap.jpg").then(function (kidnapImage) {
            console.log("got image");
            Jimp.read(message.author.avatarURL).then(function (authorImage) {
                Jimp.read(url).then(function (userImage) {
                
                    console.log("got avatar");
                    userImage.resize(140, 140);
                    userImage.rotate(-45);
                    authorImage.resize(180, 180);
                    var xKidnapper = 460
                    var yKidnapper = 100
                    var x = 150
                    var y = 160
                    var mergedImageKidnapper = kidnapImage.composite(authorImage, xKidnapper, yKidnapper );
                    var mergedImage = mergedImageKidnapper.composite(userImage, x, y);
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) {message.channel.stopTyping(); console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("<@" + message.author.id+ "> ***kidnapped*** <@" + userID + ">", {
                            files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                            console.log(err.message);
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        });
                        console.log("Message Sent");
                       
                        setTimeout(function(){
                            if(userID == message.client.user.id)
                            {
                                message.channel.send("<@" + message.author.id + ">" + selfResponses[Math.floor(Math.random() * (selfResponses.length))]).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                            }
                        }, 1000);
                    });
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                    console.log(err.message);
                    message.channel.stopTyping();
                });
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                console.log(err.message);
                message.channel.stopTyping();
            });
        }).catch(function (err) {
            console.log(err.message);
            message.channel.stopTyping();
        });
    }
}

module.exports = KidnapCommand;
