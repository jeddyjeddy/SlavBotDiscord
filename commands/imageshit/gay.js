const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class GayCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "gay",
            group: "imageshit",
            memberName: "gay",
            description: "Just another Gay command.",
            examples: ["`!gay`"]
        });
    }

    async run(message, args)
    {
CommandCounter.addCommandCounter(message.author.id)
        message.channel.send("No home of sexuals", {files: ["gay" + Math.floor(Math.random() * 5) + ".jpg"]}).then(function(){
        }).catch(function (err) {
            message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
            console.log(err.message);
        });;
    }
}

module.exports = GayCommand;