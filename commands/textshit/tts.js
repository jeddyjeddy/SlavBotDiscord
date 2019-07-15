const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class TTSCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "tts",
            group: "textshit",
            memberName: "tts",
            description: "A simple TTS command. Slav Bot will repeat whatever you tell it to with a tts message.",
            examples: ["`!tts <text>`"]
        });
    }

    async run(message, args)
    {
        if(args.length > 0)
        {
            CommandCounter.addCommandCounter(message.author.id)
            var sayText = args.toString();

            while(sayText.indexOf("@everyone") > -1)
            {
                sayText = sayText.replace(/@everyone/g, "everyone")
            }

            while(sayText.indexOf("@here") > -1)
            {
                sayText = sayText.replace(/@here/g, "here")
            }

            message.channel.send(sayText, {tts: true}).then(() => {
                if(message.guild != null)
                {
                    if(message.guild.member(message.client.user.id).hasPermission("MANAGE_MESSAGES")){
                        message.delete().catch(error => console.log("Delete Error - " + error))
                    }
                }
            }).catch(error => {console.log("Send Error - " + error); message.channel.send("Send Error - " + error);}); 
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No text given for command.").catch(error => console.log("Send Error - " + error))
        }
    }
}

module.exports = TTSCommand;