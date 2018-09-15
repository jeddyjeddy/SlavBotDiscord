const command = require("discord.js-commando");
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class ServerStatsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "serverstats",
            group: "util",
            memberName: "serverstats",
            description: "Shows the name, owner, number of members and the number of custom emojis on the server.",
            examples: ["`!serverstats`"]
        });
    }

    async run(message, args)
    {
        if(message.guild != null)
            message.channel.send("Server Name: ***" + message.guild.name + "***\nServer Owner: ***" + message.guild.owner.user.username + "***\nNumber of Members: ***" + numberWithCommas(message.guild.memberCount) + " Members***\nNumber of Custom Emojis: ***" + numberWithCommas(message.guild.emojis.array().length) + "***").catch(error => console.log("Send Error - " + error));
    }
}

module.exports = ServerStatsCommand;