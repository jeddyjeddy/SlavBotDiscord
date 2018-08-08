const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class WhogayCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "whogay",
            group: "textshit",
            memberName: "whogay",
            description: "Find out who bige gaye.",
            examples: ["`!whogay`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        if(message.guild == null)
        {
            message.channel.send("<@" + message.author.id + "> u bige gay").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            var users = message.guild.members.array()
            var user = users[Math.floor(Math.random() * users.length)].id
            var timestamp = (new Date(Date.now()).toJSON());
            message.channel.send("", {embed: {title: "***Let's find out who bige gay***", description: "<@" + user + "> is bige gay.", color: 16711787, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = WhogayCommand;