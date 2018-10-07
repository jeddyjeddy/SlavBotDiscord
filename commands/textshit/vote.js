const command = require("discord.js-commando");

class VoteCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "vote",
            group: "util",
            memberName: "support",
            description: "Gives the DBL vote link for Slav Bot.",
            examples: ["`!vote`"]
        });
    }

    async run(message, args)
    {
        message.channel.send("Vote for Slav Bot: https://discordbots.org/bot/319533843482673152/vote").catch(error => console.log("Send Error - " + error));
    }
}

module.exports = VoteCommand;