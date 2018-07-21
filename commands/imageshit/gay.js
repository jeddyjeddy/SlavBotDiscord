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
        message.channel.startTyping();
CommandCounter.addCommandCounter()
        message.channel.send("No home of sexuals", {files: ["gay" + Math.floor(Math.random() * 5) + ".jpg"]}).then(function(){
            message.channel.stopTyping();
        }).catch(function (err) {
            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
            console.log(err.message);
            message.channel.stopTyping();
        });;
    }
}

module.exports = GayCommand;