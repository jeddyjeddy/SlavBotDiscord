const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class Bigmojiommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "bigmoji",
            group: "imageshit",
            memberName: "bigmoji",
            description: "Gives a high res version of an emoji from any discord server the bot is on.",
            examples: ["`!bigmoji <emoji>`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        console.log(args);
    }
    
}

module.exports = Bigmojiommand;
