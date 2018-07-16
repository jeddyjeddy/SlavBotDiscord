const command = require("discord.js-commando");

class SteamCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "steam",
            group: "util",
            memberName: "steam",
            description: "Gives links for our custom Steam Skins.",
            examples: ["`!steam`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        message.channel.send("Dark Theme https://editor.steamcustomizer.com/w1bn4").catch(error => console.log("Send Error - " + error));
        message.channel.send("Light Theme https://editor.steamcustomizer.com/xLnMV").catch(error => console.log("Send Error - " + error));
        message.channel.stopTyping();
    }
}

module.exports = SteamCommand;