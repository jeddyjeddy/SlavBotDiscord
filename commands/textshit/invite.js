const command = require("discord.js-commando");

class InviteCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "invite",
            group: "util",
            memberName: "invite",
            description: "Gives the Invite Link for Slav Bot.",
            examples: ["`!invite`"]
        });
    }

    async run(message, args)
    {
        message.channel.send("Add Slav Bot to your server: https://discordapp.com/api/oauth2/authorize?client_id=319533843482673152&permissions=8&scope=bot").catch(error => console.log("Send Error - " + error));
    }
}

module.exports = InviteCommand;