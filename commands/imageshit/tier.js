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

class TierCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "tier",
            group: "imageshit",
            memberName: "tier",
            description: "Gives a random Tier List of users from your server. Requires users with avatars.",
            examples: ["`!tier"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        
        message.guild.fetchMembers()
        .then(() => {
                message.channel.send("***generating tier list***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("tier.png").then(function (tierImage) { 
                    console.log("got image");

                    var promises = []
                    var avatars = []
                    var membersArray = message.guild.members.array()
                    var members = []
        
                    for(var i = 0; i < membersArray.length; i++)
                    {
                        if(membersArray[i].user.avatarURL != undefined && membersArray[i].user.avatarURL != null)
                        {
                            members.push(membersArray[i])
                        }
                    }
        
                    for(var i = 0; i < 7; i++)
                    {
                        var usersLength = 0;
        
                        if(avatars.length >= members.length)
                            usersLength = 0
                        else if(avatars.length > members.length - 8)
                            usersLength = Math.floor(Math.random() * (members.length - avatars.length)) + 1
                        else
                            usersLength = Math.floor(Math.random() * 8) + 1
        
                        for(var index = 0; index < usersLength; index++)
                        {
                            var user = members[Math.floor(Math.random() * members.length)]
                            var alreadyAdded = false;
                            for(var avatarIndex = 0; avatarIndex < avatars.length; avatarIndex++)
                            {
                                if(avatars[avatarIndex].id == user.id)
                                {
                                    alreadyAdded = true;
                                }
                            }
        
                            if(!alreadyAdded)
                            {
                                avatars.push({id: user.id, avatarURL: user.user.avatarURL, row: i, column: index})
                            }
                            else
                            {
                                index--
                            }
                        }
                    }
        
                    for(var i = 0; i < avatars.length; i++)
                    {
                        const data = avatars[i]
                        promises.push(Jimp.read(data.avatarURL).then(function(avatarImage){
                            var size = 62
                            var x = 93 + ((size * data.column) + 20)
                            var y = 10 + (70 * data.row)

                            avatarImage.resize(size, size)
                            tierImage.composite(avatarImage, x, y)
                        }))
                    }

                    Promise.all(promises).then(() => {
                        const file = "TempStorage/" + shortid.generate() + ".png"
                        tierImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log(file);
                            message.channel.send("***Tier List***", {
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
                    })  
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                console.log(err.message);
            })
        }).catch(function (err) {
            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
            console.log(err.message);
        });
    }
}

module.exports = TierCommand;
