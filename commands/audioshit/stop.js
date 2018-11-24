const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class StopCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "stop",
            group: "audioshit",
            memberName: "stop",
            description: "Make Slav Bot stop playing a sound effect.",
            examples: ["`!stop`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }

        CommandCounter.addCommandCounter(message.author.id)

        if(!message.guild.voiceConnection)
        {
            message.channel.send("<@" + message.author.id + "> Slav Bot is not in any Voice Channel.").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            if(message.guild.voiceConnection.speaking)
            {
                message.channel.send("<@" + message.author.id + "> Slav Bot has stopped playing the sound effect.").catch(error => console.log("Send Error - " + error));
                message.guild.voiceConnection.dispatcher.end()
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> Slav Bot is not playing any sound effect.").catch(error => console.log("Send Error - " + error));
            }
        }
    }
}

module.exports = StopCommand;