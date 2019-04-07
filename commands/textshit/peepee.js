const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const sizes = ["bige", "small", "non-existent"]

class PeePeeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "peepee",
            group: "textshit",
            memberName: "peepee",
            description: "PeePee Inspection.",
            examples: ["`!peepee`", "`!peepee @User`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)

        if(message.guild == null)
        {
            message.channel.send("<@" + message.author.id + "> you have a " + sizes[Math.floor(Math.random() * sizes.length)] + " peepee").catch(error => console.log("Send Error - " + error));
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
            message.channel.send("", {embed: {title: "***PeePee Inspection Time***", description: "<@" + user + "> has a " + sizes[Math.floor(Math.random() * sizes.length)] + " peepee.", color: 16711787, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = PeePeeCommand;
