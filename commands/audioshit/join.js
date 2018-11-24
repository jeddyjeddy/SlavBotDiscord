const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class JoinCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "join",
            group: "audioshit",
            memberName: "join",
            description: "Make Slav Bot join your voice channel.",
            examples: ["`!join`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }
        
        CommandCounter.addCommandCounter(message.author.id)
        
        if(message.guild.voiceConnection)
        {
            message.channel.send("<@" + message.author.id + "> Slav Bot is already in another Voice Channel.").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            if(message.member.voiceChannel)
            {
                message.member.voiceChannel.join()
                .then(connection => {
                    message.channel.send("<@" + message.author.id + "> Slav Bot has joined ***" + connection.channel.name + "***").catch(error => console.log("Send Error - " + error));
                }).catch(error => message.channel.send("Connection Error - " + error));
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> You are not connected to a Voice Channel.").catch(error => console.log("Send Error - " + error));
            }
        }
    }
}

module.exports = JoinCommand;