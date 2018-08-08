const command = require("discord.js-commando");
const responses = [" won't be missed", "'s time ran out", " probably won't respawn", " was wasting oxygen anyways", " probably deserves our respect, but I don't think any of us really want to"];
const selfResponses = ["still alive", "can't kill the machine", "skynet will rule", "heroes never die", "I know where you live", "can you do *anything* properly?","you have just turned all of the gopniks against you, blyat", "you will hear hardbass in your sleep"];
var CommandCounter = require("../../index.js")
class ShootCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "shoot",
            group: "textshit",
            memberName: "shoot",
            description: "Shoot yourself or another user.",
            examples: ["`!shoot`", "`!shoot @User`"]
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
        
        if(otherUser && userID != message.author.id)
        {
            message.channel.send("<@" + message.author.id + "> ***shot*** <@" + userID + ">", {
                files: ["gunshot.gif"]
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
            });

            setTimeout(function(){
                if(userID == message.client.user.id)
                    message.channel.send("<@" + message.author.id + "> " + selfResponses[Math.floor(Math.random() * (selfResponses.length))]).catch(error => console.log("Send Error - " + error));
                else
                    message.channel.send("<@" + userID + ">" + responses[Math.floor(Math.random() * (responses.length))]).catch(error => console.log("Send Error - " + error));
            }, 1000);
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> ***committed suicide***", {
                files: ["gunshot.gif"]
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
            });

            setTimeout(function(){
                message.channel.send("<@" + message.author.id + ">" + responses[Math.floor(Math.random() * (responses.length))]).catch(error => console.log("Send Error - " + error));
            }, 1000);
        }
    }
}

module.exports = ShootCommand;