const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const fs = require('fs');

class PlayCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "play",
            group: "audioshit",
            memberName: "play",
            description: "Plays the specified sound effect file. Use the command without a parameter to get the list of available sound effects.",
            examples: ["`!play (For Sound Effects List)`", "`!play <sound-effect>`", "`!play ouranthem`", "`!play nani`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }

        CommandCounter.addCommandCounter(message.author.id)

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if(args.length > 0)
        {
            if(!message.guild.voiceConnection)
            {
                if(message.member.voiceChannel)
                {
                    message.member.voiceChannel.join()
                    .then(connection => {
                        message.channel.send("<@" + message.author.id + "> Slav Bot has joined ***" + connection.channel.name + "***").catch(error => console.log("Send Error - " + error));

                        if(!connection.speaking)
                        {
                            fs.readdir("audio", (err, files) => {
                                var playing = false;
                                for(var i = 0; i < files.length; i++)
                                {
                                    if(files[i] == args.toLowerCase() + ".mp3")
                                    {
                                        playing = true;
                                        connection.playFile("audio/" + files[i])
                                    }
                                }

                                if(!playing)
                                {
                                    message.channel.send("<@" + message.author.id + "> There is no sound effect named ***" + args + "***. Use `" + commandPrefix + "play` to see a list of all sound effects.").catch(error => console.log("Send Error - " + error));
                                }
                            })
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> Slav Bot is already playing a sound effect.").catch(error => console.log("Send Error - " + error));
                        }
                    }).catch(error => message.channel.send("Connection Error - " + error));
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> You are not connected to a Voice Channel.").catch(error => console.log("Send Error - " + error));
                }        
            }    
            else
            {
                if(message.member.voiceChannel)
                {
                    if(message.member.voiceChannelID == message.guild.voiceConnection.channel.id)
                    {
                        if(!message.guild.voiceConnection.speaking)
                        {
                            fs.readdir("audio", (err, files) => {
                                var playing = false;
                                for(var i = 0; i < files.length; i++)
                                {
                                    if(files[i] == args.toLowerCase() + ".mp3")
                                    {
                                        playing = true;
                                        message.guild.voiceConnection.playFile("audio/" + files[i])
                                    }
                                }

                                if(!playing)
                                {
                                    message.channel.send("<@" + message.author.id + "> There is no sound effect named ***" + args + "***. Use `" + commandPrefix + "play` to see a list of all sound effects.").catch(error => console.log("Send Error - " + error));
                                }
                            })
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> Slav Bot is already playing a sound effect.").catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else
                    {
                        message.channel.send("<@" + message.author.id + "> You are not connected to the same Voice Channel as Slav Bot.").catch(error => console.log("Send Error - " + error));
                    }
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> You are not connected to the same Voice Channel as Slav Bot.").catch(error => console.log("Send Error - " + error));
                } 
            }
        }
        else
        {
            fs.readdir("audio", (err, files) => {
                var lists = []
                var item = ""
                for(var index = 0; index < files.length; index++)
                {
                    var text = files[index].replace(".mp3", "");

                    if((item + text + "\n").length < 2048)
                    {
                        item = item + text + "\n";
                    }
                    else
                    {
                        lists.push(item);
                        item = text;
                    }
                }

                if(item != "")
                {
                    lists.push(item)
                }

                var timestamp = (new Date(Date.now()).toJSON());
                for(var index = 0; index < lists.length; index++)
                {
                    message.channel.send("", {embed: {title: "***List of Sound Effects (" + (index + 1) + "/" + lists.length + ")***", description: lists[index], color: 65446, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                }
            })
        }
    }
}

module.exports = PlayCommand;