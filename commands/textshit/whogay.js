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
        message.channel.startTyping();
        CommandCounter.addCommandCounter()
        if(message.guild == null)
        {
            message.reply("u bige gay").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            var users = message.guild.members.array()
            var user = users[Math.floor(Math.random() * users.length)].id
            message.channel.send("", {embed: {title: "***Let's find out who bige gay***", description: "<@" + user + "> is bige gay.", color: 16711787}}).catch(error => console.log("Send Error - " + error));
        }
        message.channel.stopTyping();
    }
}

module.exports = WhogayCommand;