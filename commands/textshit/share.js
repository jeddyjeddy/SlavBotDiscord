const command = require("discord.js-commando");

class ShareCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "share",
            group: "util",
            memberName: "share",
            description: "Gives the link to the Slav Bot website. Share Slav Bot on other servers using this link.",
            examples: ["`!share`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        message.reply("https://merriemweebster.github.io/SlavBot").catch(error => console.log("Send Error - " + error));
        message.channel.stopTyping();
    }
}

module.exports = ShareCommand;