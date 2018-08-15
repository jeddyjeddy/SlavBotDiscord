const command = require("discord.js-commando");
const responses = ["Time to bust a move, comrades", "Show them true Slavic might", "No Western spy can do this"];
const selfResponses = ["Even bots dance too", "My Slavic might is second to none"];
var CommandCounter = require("../../index.js")
class DanceCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "dance",
            group: "textshit",
            memberName: "dance",
            description: "Dance by yourself or with another user.",
            examples: ["`!dance`", "`!dance @User`"]
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
            message.channel.send("<@" + message.author.id + "> ***and*** <@" + userID + "> ***dance together***\n***SLAV HARDBASS DANCE PARTY***", {
                files: ["danceduo.gif"]
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
            });

            setTimeout(function(){
                if(userID == message.client.user.id)
                    message.channel.send("<@" + message.author.id + "> " + selfResponses[Math.floor(Math.random() * (selfResponses.length))]).catch(error => console.log("Send Error - " + error));
                else
                    message.channel.send("<@" + userID + "> " + responses[Math.floor(Math.random() * (responses.length))]).catch(error => console.log("Send Error - " + error));
            }, 1000);
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> ***dances***", {
                files: ["dance.gif"]
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
            });

            setTimeout(function(){
                message.channel.send("<@" + message.author.id + "> " + responses[Math.floor(Math.random() * (responses.length))]).catch(error => console.log("Send Error - " + error));
            }, 1000);
        }
    }
}

module.exports = DanceCommand;