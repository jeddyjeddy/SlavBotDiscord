const command = require("discord.js-commando");
var dogs = require('dogs')

class DogoCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "dogo",
            group: "textshit",
            memberName: "dogo",
            description: "Gives random dogo in ASCII art.",
            examples: ["`!dogo`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        var random = Math.floor(Math.random() * 3);
        if(random == 0)
            message.channel.send("", {embed: {description: dogs.snoopy()}}).catch(error => console.log("Send Error - " + error));
        if(random == 1)
            message.channel.send("", {embed: {description: dogs.dog()}}).catch(error => console.log("Send Error - " + error));
        if(random == 2)
            message.channel.send("", {embed: {description: dogs.bulldog()}}).catch(error => console.log("Send Error - " + error));
            
        message.channel.stopTyping();
    }
}

module.exports = DogoCommand;