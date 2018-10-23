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
        dbl.getStats(message.client.user.id).then(stats => {
            var guildSize = stats.server_count
            message.channel.send("<@" + message.author.id + "> Slav Bot is currently on " + numberWithCommas(guildSize) + " servers.").catch(error => console.log("Send Error - " + error));
        })
    }
}

module.exports = BotStatsCommand;