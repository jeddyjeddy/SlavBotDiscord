const command = require("discord.js-commando");
var catMe = require('cat-me')
var CommandCounter = require("../../index.js")

class BongoCatCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "bongocat",
            group: "textshit",
            memberName: "bongocat",
            description: "Sends a video of Slavic Bongo Cat. Credit goes to Nitro.iF on YouTube for making the video.",
            examples: ["`!bongocat`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        message.channel.send("***Slavic Bongo Cat.mp4***", {files: ["bongocat.mp4"]}).catch(error => console.log("Send Error - " + error));
    }
}

module.exports = BongoCatCommand;