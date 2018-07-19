const command = require("discord.js-commando");
var catMe = require('cat-me')

class CadeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "cade",
            group: "textshit",
            memberName: "cade",
            description: "Gives random cade in ASCII art.",
            examples: ["`!cade`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        message.channel.send("", {embed: {color: 63487, description: "```" + catMe() + "```"}}).catch(error => console.log("Send Error - " + error));
        message.channel.stopTyping();
    }
}

module.exports = CadeCommand;