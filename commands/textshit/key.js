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
        CommandCounter.addCommandCounter(message.author.id)
        message.channel.send("<@" + message.author.id + "> Random Key: " + keys[Math.floor(Math.random() * (keys.length))], {files: ["key.gif"]}).then(function(){
        }).catch(function (err) {
            message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
            console.log(err.message);
        });
    }
}

module.exports = KeyCommand;