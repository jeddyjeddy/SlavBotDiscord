const command = require("discord.js-commando");
var dogs = require('dogs')
var CommandCounter = require("../../index.js")

class DoggoCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "doggo",
            group: "textshit",
            memberName: "doggo",
            description: "Gives random doggo in ASCII art.",
            examples: ["`!doggo`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        var random = Math.floor(Math.random() * 3);
        if(random == 0)
            message.channel.send("", {embed: {color: 63487, description: "```" + dogs.snoopy() + "```"}}).catch(error => console.log("Send Error - " + error));
        if(random == 1)
            message.channel.send("", {embed: {color: 63487, description: "```" + dogs.dog() + "```"}}).catch(error => console.log("Send Error - " + error));
        if(random == 2)
            message.channel.send("", {embed: {color: 63487, description: "```" + dogs.bulldog() + "```"}}).catch(error => console.log("Send Error - " + error));
    }
}

module.exports = DoggoCommand;