const command = require("discord.js-commando");

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
        message.reply("u bige gay").catch(error => console.log("Send Error - " + error));
        message.channel.stopTyping();
    }
}

module.exports = WhogayCommand;