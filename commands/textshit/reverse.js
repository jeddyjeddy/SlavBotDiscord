const command = require("discord.js-commando");

class ReverseCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "reverse",
            group: "textshit",
            memberName: "reverse",
            description: "Reverse what you say. Slav Bot will repeat whatever you tell it to in reverse.",
            examples: ["`!reverse` <text>"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();

        if(args.length > 0)
        {
            var reversedText = "";
            for(var i = args.length - 1; i >= 0; i--)
            {
                reversedText = reversedText + args[i]
            }

            message.channel.send(reversedText).catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.reply("no text given for command.").catch(error => console.log("Send Error - " + error))
        }

        message.channel.stopTyping();
    }
}

module.exports = ReverseCommand;