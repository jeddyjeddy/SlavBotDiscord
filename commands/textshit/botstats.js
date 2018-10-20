const command = require("discord.js-commando");
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class BotStatsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "botstats",
            group: "util",
            memberName: "botstats",
            description: "Shows the number of servers Slav Bot is on.",
            examples: ["`!botstats`"]
        });
    }

    async run(message, args)
    {
        message.client.shard.fetchClientValues('guilds.size')
        .then(results => {
            var guildSize = results.reduce((prev, val) => prev + val, 0);
            message.channel.send("<@" + message.author.id + "> Slav Bot is currently on " + numberWithCommas(guildSize) + " servers.").catch(error => console.log("Send Error - " + error));
        })
        .catch(console.error);
    }
}

module.exports = BotStatsCommand;