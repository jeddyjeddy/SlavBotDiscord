const command = require("discord.js-commando");

class PatreonCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "patreon",
            group: "util",
            memberName: "patreon",
            description: "Gives the link for Slav Bot's Patreon.",
            examples: ["`!patreon`"]
        });
    }

    async run(message, args)
    {
        message.channel.send("Support Slav Bot on Patreon: https://www.patreon.com/merriemweebster").catch(error => console.log("Send Error - " + error));
    }
}

module.exports = PatreonCommand;