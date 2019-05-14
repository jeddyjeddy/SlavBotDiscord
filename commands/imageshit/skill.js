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
const skills = ["alchemy", "alteration", "archery", "block", "conjuration", "destruction", "enchanting", "heavy armor", "illusion", "light armor", "lockpicking", "one-handed", "pickpocket", "restoration", "smithing", "sneak", "speech", "two-handed"]

var CommandCounter = require("../../index.js")

class SkillCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "skill",
            group: "imageshit",
            memberName: "skill",
            description: "Allows you to add a custom skyrim skill. This command takes the last image uploaded.",
            examples: ["`!skill <name-of-skill>`","`!skill observe`"]
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
        
        if(args.length == 0)
        {
            message.channel.send("You must give text for the command. Use `" + commandPrefix + "help skill`.").catch(function (err) {
                console.log(err.message);
                
            });
            
            return;
        }
        
        var url = "";

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
                message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help skill` for help.").catch(error => {console.log("Send Error - " + error); });
                
                return;
            }
            message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
            Jimp.read(url).then(function (skyrimImage) {
                console.log("got image");
                Jimp.read("customskyrim.png").then(function (skillImage) { 
                    Jimp.loadFont("skyrimskill.fnt").then(function (skillFont) {
                        var x = 50 + ((440 - (args.length * 50)) / 2)
                        skillImage.print(skillFont, x, 110, args.toUpperCase(), 440).resize(skyrimImage.bitmap.width, Jimp.AUTO);
                        const addHeight = skyrimImage.bitmap.height;
                        var finalImage = (new Jimp(skyrimImage.bitmap.width, skyrimImage.bitmap.height + skillImage.bitmap.height)).composite(skyrimImage, 0, 0).composite(skillImage, 0, addHeight);
    
                        const file = "TempStorage/" + shortid.generate() + ".png"
                        finalImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("***Skill Created***", {
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
                console.log(err.message);
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
            });
        }).catch(function (err) {
            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
            console.log(err.message);
            
        });
    }
}

module.exports = SkillCommand;
