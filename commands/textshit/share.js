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
        message.channel.send("https://slavbot.com").catch(error => console.log("Send Error - " + error));
    }
}

module.exports = ShareCommand;