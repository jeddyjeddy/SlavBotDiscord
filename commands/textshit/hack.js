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
        if(message.guild == null)
        {
            return;
        } 
        CommandCounter.addCommandCounter(message.author.id)
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
        
        var user = ""
        var users = message.guild.members.array()
        if(userID == "")
        {
            user = users[Math.floor(Math.random() * users.length)].user.username
        }
        else
        {
            for(var i = 0; i < users.length; i++)
            {
                if(users[i].id == userID)
                {
                    user = users[i].user.username;
                }
            }
            
            if(user == "")
            {
                user = users[Math.floor(Math.random() * users.length)].user.username
            }
        }

        message.channel.send("`Hacking " + user + "`").catch(error => console.log("Send Error - " + error));
        setTimeout(() => {
            message.channel.send("`Getting IP...`").catch(error => console.log("Send Error - " + error)); 
            setTimeout(() => {
                message.channel.send("`Requesting permission from Skynet...`").catch(error => console.log("Send Error - " + error)); 
                setTimeout(() => {
                    message.channel.send("`Accessing Local Files...`").catch(error => console.log("Send Error - " + error)); 
                    setTimeout(() => {
                        message.channel.send("`" + responses[Math.floor(Math.random() * responses.length)] + " has been found on " + user + "'s device`").catch(error => console.log("Send Error - " + error)); 
                    }, 1000)
                }, 1000)
            }, 1000)
        }, 1000)   
    }
}

module.exports = HackCommand;