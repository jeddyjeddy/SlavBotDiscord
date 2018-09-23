const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const responses = ["A 1 TB homework folder", "The USSR anthem", "A 2 hour documentary on tanks", "Hitler's final speech",
 "A PDF version of The Communist Manifesto", "A folder full of strange webcam videos", "A folder dedicated to smug anime girls",
  "Half Life 3", "Every video by Life of Boris so far", "A folder full of images of various tanks"]

class HackCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "hack",
            group: "textshit",
            memberName: "hack",
            description: "Hack someone.",
            examples: ["`!hack`", "`!hack @User`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        var otherUser = false;
        var userID = "";

        if(args.length > 0)
        {
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
                        if(args[i].toString() != "@" && (!isNaN(args[i].toString()) || args[i] == "&"))
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
        
        if(userID == "")
        {
            var users = message.guild.members.array()
            userID = users[Math.floor(Math.random() * users.length)].id
        }

        message.channel.send("`Hacking <@" + userID + ">`").catch(error => console.log("Send Error - " + error));
        setTimeout(() => {
            message.channel.send("`Getting IP...`").catch(error => console.log("Send Error - " + error)); 
            setTimeout(() => {
                message.channel.send("`Requesting permission from Skynet...`").catch(error => console.log("Send Error - " + error)); 
                setTimeout(() => {
                    message.channel.send("`Accessing Local Files...`").catch(error => console.log("Send Error - " + error)); 
                    setTimeout(() => {
                        message.channel.send("`" + responses[Math.floor(Math.random() * responses.length)] + " has been found on <@" + userID + ">'s device`").catch(error => console.log("Send Error - " + error)); 
                    }, 1000)
                }, 1000)
            }, 1000)
        }, 1000)   
    }
}

module.exports = HackCommand;