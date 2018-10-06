const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const ratings = ["Weeb", "Weeaboo", "Wapanese", "Gaijin", "Normie", "Functional Human Being", "Trash", "Otaku", "Hikikomori", "Fujoshi", "Wizard"]

class WeebTestCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "weebtest",
            group: "textshit",
            memberName: "weebtest",
            description: "Take the Weeb Test.",
            examples: ["`!weebtest`", "`!weebtest @User`"]
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
            message.channel.send("", {embed: {title: "***Weeb Test***", description: "<@" + user + "> The test results have come back -  you are a ***" + ratings[Math.floor(Math.random() * ratings.length)] + "***.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = WeebTestCommand;