const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class SayCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "say",
            group: "textshit",
            memberName: "say",
            description: "A simple Say command. Slav Bot will repeat whatever you tell it to.",
            examples: ["`!say <text>`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter(message.author.id)
        if(args.length > 0)
        {
            message.channel.send(args.toString()).catch(error => console.log("Send Error - " + error));

            if(message.guild.member(message.client.user.id).hasPermission("MANAGE_MESSAGES")){
                message.delete().catch(error => console.log("Delete Error - " + error))
            }
        }
        else
        {
            message.reply("no text given for command.").catch(error => console.log("Send Error - " + error))
        }

        message.channel.stopTyping();
    }
}

module.exports = SayCommand;