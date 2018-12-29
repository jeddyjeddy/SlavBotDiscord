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

const selfResponses = [" I have a knife", ", they won't find your body",  " I know where you live", " can you do *anything* properly?", " you're not kidnapping me, *I'm* kidnapping you"," you have just turned all of the gopniks against you, blyat", " you will hear hardbass in your sleep"];

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
        var promises = []
        if(otherUser && userID != message.author.id)
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
            message.channel.send("<@" + message.author.id + "> Please tag another user after the command.").catch(error => {console.log("Send Error - " + error); });
            
            return;
        }

        console.log(url);
        Jimp.read("kidnap.jpg").then(function (kidnapImage) {
            console.log("got image");
            if(message.author.avatarURL == undefined || message.author.avatarURL == null)
            {
                message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                return;
            }
            Jimp.read(message.author.avatarURL).then(function (authorImage) {
                Promise.all(promises).then(() => {
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
                        const file = "TempStorage/" + shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("<@" + message.author.id+ "> ***kidnapped*** <@" + userID + ">", {
                                files: [file]
                            }).then(function(){
                                if(userID == message.client.user.id)
                                {
                                    message.channel.send("<@" + message.author.id + ">" + selfResponses[Math.floor(Math.random() * (selfResponses.length))]).catch(error => {console.log("Send Error - " + error); });
                                }
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
                
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                console.log(err.message);
                
            });
        }).catch(function (err) {
            console.log(err.message);
            
        });
    }
}

module.exports = KidnapCommand;
