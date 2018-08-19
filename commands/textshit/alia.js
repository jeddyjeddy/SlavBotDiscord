const command = require("discord.js-commando");
var catMe = require('cat-me')
var CommandCounter = require("../../index.js")

class AliACommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "alia",
            group: "textshit",
            memberName: "alia",
            description: "Sends the base boosted version of the Ali-A intro. I don't know why I made this command, or why I saved the entire video, plz help me.",
            examples: ["`!alia`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        message.channel.send("***Ali-A Intro Base Boosted.mp4***", {files: ["intro.mp4"]}).catch(error => console.log("Send Error - " + error));
    }
}

module.exports = AliACommand;