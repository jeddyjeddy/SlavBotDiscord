const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const ratings = ["Western Hostile", "Western Spy", "Lover of Trotsky", "Lover of Lenin", "Western Citizen", "Slavaboo", "Communist Ally", "Gopnik", "Slav", "Strong Slav", "True Slav", "Lover of Stalin"]

class SlavTestCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "slavtest",
            group: "textshit",
            memberName: "slavtest",
            description: "Take the Slav Test.",
            examples: ["`!slavtest`", "`!slavtest @User`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)

        if(message.guild == null)
        {
            message.channel.send("<@" + message.author.id + "> The test results have come back - you are a ***" + ratings[Math.floor(Math.random() * ratings.length)] + "***").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            var user = "";

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
                                user = user + args[i].toString();
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
            
            if(user == "")
            {
                var users = message.guild.members.array()
                user = users[Math.floor(Math.random() * users.length)].id
            }

            var timestamp = (new Date(Date.now()).toJSON());
            message.channel.send("", {embed: {title: "***Slav Test***", description: "<@" + user + "> The test results have come back -  you are a ***" + ratings[Math.floor(Math.random() * ratings.length)] + "***.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = SlavTestCommand;