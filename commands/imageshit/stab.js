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

const selfResponses = [" I have a bigger knife", ", they won't find your body",  " I know where you live", " can you do *anything* properly?", " you're not stabbing me, *I'm* stabbing you"," you have just turned all of the gopniks against you, blyat", " you will hear hardbass in your sleep"];

class StabCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "stab",
            group: "imageshit",
            memberName: "stab",
            description: "Stab another user.",
            examples: ["`!stab @User`"]
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
            message.channel.send("<@" + message.author.id + "> Please tag another user after the command.").catch(error => {console.log("Send Error - " + error); });
            
            return;
        }

        console.log(url);
        Jimp.read("stab.jpg").then(function (kidnapImage) {
            console.log("got image");
            Jimp.read(message.author.avatarURL).then(function (authorImage) {
                Jimp.read(url).then(function (userImage) {
                
                    console.log("got avatar");
                    userImage.resize(90, 90);
                    authorImage.resize(80, 80);
                    var xKidnapper = 160
                    var yKidnapper = 160
                    var x = 400
                    var y = 50
                    var mergedImageKidnapper = kidnapImage.composite(authorImage, xKidnapper, yKidnapper );
                    var mergedImage = mergedImageKidnapper.composite(userImage, x, y);
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) { console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("<@" + message.author.id+ "> ***stabbed*** <@" + userID + ">", {
                            files: [file]
                        }).then(function(){
                            
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.unlink(file, resultHandler);
                        });
                        console.log("Message Sent");
                       
                        if(userID == message.client.user.id)
                        {
                            setTimeout(function(){
                                message.channel.send("<@" + message.author.id + ">" + selfResponses[Math.floor(Math.random() * (selfResponses.length))]).catch(error => {console.log("Send Error - " + error); });
                            }, 1000);
                        }
                       
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

module.exports = StabCommand;
