const command = require("discord.js-commando");

class ShareCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "support",
            group: "util",
            memberName: "support",
            description: "Gives the Invite Link for the support server.",
            examples: ["`!support`"]
        });
    }

    async run(message, args)
    {
        message.channel.send("Join the support server: https://discord.gg/2T259Pf").catch(error => console.log("Send Error - " + error));
    }
}

module.exports = ShareCommand;