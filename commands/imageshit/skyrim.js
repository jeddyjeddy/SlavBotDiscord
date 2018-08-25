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
const skills = ["alchemy", "alteration", "archery", "block", "conjuration", "destruction", "enchanting", "heavy armor", "illusion", "light armor", "lockpicking", "one-handed", "pickpocket", "restoration", "smithing", "sneak", "speech", "two-handed"]

var CommandCounter = require("../../index.js")

class SkyrimCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "skyrim",
            group: "imageshit",
            memberName: "skyrim",
            description: "Allows you to add any of the 18 skills from Skyrim to an image. A full list of the skills is given with the examples. This command takes the last image uploaded.",
            examples: ["`!skyrim`", "`!skyrim <name-of-skill>`","`!skyrim sneak`", "!skyrim sneak|speech|block", "!skyrim alchemy|alteration|archery|block|conjuration|destruction|enchanting|heavy armor|illusion|light armor|lockpicking|one-handed|pickpocket|restoration|smithing|sneak|speech|two-handed"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        var usedSkills = [];
        
        if(args.length > 0)
        {
            var givenSkills = args.split("|");

            for(var i = 0; i < givenSkills.length; i++)
            {
                for(var skillIndex = 0; skillIndex < skills.length; skillIndex++)
                {
                    if(givenSkills[i].toLowerCase() == skills[skillIndex])
                    {
                        var add = true;
                        for(var repeatCheck = 0; repeatCheck < usedSkills.length; repeatCheck++)
                        {
                            if(usedSkills[repeatCheck] == skills[skillIndex])
                            {
                                add = false;
                            }
                        }

                        if(add)
                        {
                            usedSkills.push(skills[skillIndex]);
                        }
                    }
                }
            }
        }

        if(usedSkills.length == 0)
        {
            message.channel.send("You must give at least 1 skill to add to the image. Use " + commandPrefix + "help skyrim for a list of skills.").catch(function (err) {
                console.log(err.message);
                
            });
            
            return;
        }
        
        var url = "";

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
                message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help skyrim` for help.").catch(error => {console.log("Send Error - " + error); });
                
                return;
            }
            message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
            Jimp.read(url).then(function (userImage) {
                console.log("got image");

                var skyrimImage = userImage;

                var promises = [];

                for(var i = 0; i < givenSkills.length; i++)
                {
                    promises.push(Jimp.read("skyrim/" + givenSkills[i] + ".jpg").then(function (skillImage) {                    
                        skillImage.resize(skyrimImage.bitmap.width, Jimp.AUTO)
                        const addHeight = skyrimImage.bitmap.height;
                        skyrimImage = (new Jimp(skyrimImage.bitmap.width, skyrimImage.bitmap.height + skillImage.bitmap.height)).composite(skyrimImage, 0, 0).composite(skillImage, 0, addHeight);
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                    }))
                }

                Promises.all(promises).then(() => {                    
                    var file = shortid.generate() + ".png"
                    skyrimImage.write(file, function(error){
                        if(error) { console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***Skills Added***", {
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
                }).catch((e) => {
                    console.log(e.message);
                    message.channel.send("Error - " + e.message).catch(error => console.log("Send Error - " + error));
                });
            }).catch(function (err) {
                console.log(err.message);
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
            });
        }).catch(function (err) {
            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
            console.log(err.message);
            
        });
    }
}

module.exports = SkyrimCommand;
