const command = require("discord.js-commando");
const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "Cm", "C#m", "Dm", "D#m", "Em",
 "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"];
 var CommandCounter = require("../../index.js")

class KeyCommand extends command.Command
{
    constructor(client)
    {
        super(client, {
            name: "key",
            group: "textshit",
            memberName: "key",
            description: "Get a random music key.",
            examples: ["`!key`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter()
        message.reply("Random Key: " + keys[Math.floor(Math.random() * (keys.length))], {files: ["key.gif"]}).then(function(){
            message.channel.stopTyping();
        }).catch(function (err) {
            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
            console.log(err.message);
            message.channel.stopTyping();
        });
    }
}

module.exports = KeyCommand;