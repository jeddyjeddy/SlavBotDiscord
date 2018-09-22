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

const responses = ["They will turn the world red again.", "May God protect them from the capitalist and nationalist pigs.",  "A new era shall begin.", "The ultimate alliance has been formed.", "True comrades.","Aiming towards one mutual goal."];

class AllyCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "ally",
            group: "imageshit",
            memberName: "ally",
            description: "Form an alliance with another user.",
            examples: ["`!ally @User`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
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
        
        var promises = []
        var url = "";
        if(userID != message.author.id && userID != "")
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

                
            Jimp.read("ally.jpg").then(function (allyImage) {
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
                            userImage.resize(90, 90);
                            authorImage.resize(80, 80);
                            var xAuthor = 80
                            var yAuthor= 45
                            var x = 450
                            var y = 20
                            var mergedImageKidnapper = allyImage.composite(authorImage, xAuthor, yAuthor );
                            var mergedImage = mergedImageKidnapper.composite(userImage, x, y);
                            const file = shortid.generate() + ".png"
                            mergedImage.write(file, function(error){
                                if(error) { console.log(error); return;};
                                console.log("got merged image");
                                console.log(file);
                                message.channel.send("<@" + message.author.id+ "> ***has formed an alliance with*** <@" + userID + ">", {
                                    files: [file]
                                }).then(function(){
                                     message.channel.send(responses[Math.floor(Math.random() * (responses.length))]).catch(error => {console.log("Send Error - " + error); });
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
        else
        {
            message.channel.send("<@" + message.author.id + "> Please tag another user.").catch(error => {console.log("Send Error - " + error); });
        }
    }
}

module.exports = AllyCommand;
