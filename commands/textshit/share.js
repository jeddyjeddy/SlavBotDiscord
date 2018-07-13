const command = require("discord.js-commando");

class ShareCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "share",
            group: "util",
            memberName: "share",
            description: "Gives the DBL link for Slav Bot. Share Slav Bot on other servers using this link.",
            examples: ["`!share`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        message.reply("https://discordbots.org/bot/319533843482673152").catch(error => console.log("Send Error - " + error));
        message.channel.stopTyping();
    }
}

module.exports = ShareCommand;