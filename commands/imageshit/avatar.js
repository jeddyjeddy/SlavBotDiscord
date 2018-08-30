const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
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

class Avatarommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "avatar",
            group: "imageshit",
            memberName: "avatar",
            description: "Gives the avatar of the tagged user or your avatar if no tagged user is given. Putting the ID of any user works as well.",
            examples: ["`!avatar`", "`!avatar @User`", "`!avatar <user-id>`"]
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
        console.log(url);

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
            userID = message.author.id;
            url = message.author.avatarURL;
        }

        const ID = userID;
        Promise.all(promises).then(() => {
            Jimp.read(url).then(function (userImage) {
                console.log("got avatar");
                var file = shortid.generate() + "." + userImage.getExtension()
                userImage.write(file, function(error){
                    if(error) { console.log(error); return;};
                    console.log(file);
                    message.channel.send("Avatar for <@" + ID + ">", {
                        files: [file]
                    }).then(function(){
                        fs.unlink(file, resultHandler);
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                        fs.unlink(file, resultHandler);
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

module.exports = Avatarommand;
