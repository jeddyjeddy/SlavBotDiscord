const command = require("discord.js-commando");
const randomAnimals = require('random-animals')
var CommandCounter = require("../../index.js")

class RandomdoggoCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "randomdoggo",
            group: "imageshit",
            memberName: "randomdoggo",
            description: "Gives an image of a random doggo.",
            examples: ["`!randomdoggo`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        randomAnimals.dog().then(dog => message.channel.send("", {files: [dog]}).catch(error => {console.log("Send Error - " + error); message.channel.send(dog).catch(error => {console.log("Send Error 2 - " + error); message.channel.send("Error - " + errors).catch(error => {console.log("Send Error 3 - " + error); })}));
    }
}

module.exports = RandomdoggoCommand;