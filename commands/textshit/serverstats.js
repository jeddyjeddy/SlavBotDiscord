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
            memberName: "botstats",
            description: "Shows the name, owner, number of members, number of custom emojis and icon of the server.",
            examples: ["`!serverstats`"]
        });
    }

    async run(message, args)
    {
        if(message.guild != null)
            message.channel.send("Server Name: ***" + message.guild.name + "***\nServer Owner: ***" + message.guild.owner.user.username + "***\nNumber of Members: ***" + numberWithCommas(message.guild.memberCount) + " Members***\nNumber of Custom Emojis: ***" + numberwithCommas(message.guild.emojis.size()) + "***", {files: [message.guild.iconURL]}).catch(error => console.log("Send Error - " + error));
    }
}

module.exports = ServerStatsCommand;