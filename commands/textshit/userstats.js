const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class UserStatsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "userstats",
            group: "util",
            memberName: "userstats",
            description: "Returns the number of command requests sent by a user to Slav Bot (Excluding Utility Commands).",
            examples: ["`!userstats`"]
        });
    }

    async run(message, args)
    {
        var count = CommandCounter.getCommandCounter(message.author.id);
        message.channel.send("<@" + message.author.id + "> You have sent " + numberWithCommas(count) + " command requests to Slav Bot.").catch(error => console.log("Send Error - " + error));
    }
}

module.exports = UserStatsCommand;