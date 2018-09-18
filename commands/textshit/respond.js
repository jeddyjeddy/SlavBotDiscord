const command = require("discord.js-commando");
var ResponseChange = require("../../index.js")

class RespondCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "respond",
            group: "util",
            memberName: "respond",
            description: "Allows you to Enable/Disable Slav Bot's responses to messages on the entire server or specific channels.",
            examples: ["`!respond disable` (Disables the respond system on all channels and any new channel created)", "`!respond enable` (Enables the respond system on all channels and any new channel created)", "`!respond disable #channel1 #channel2` (Disables the respond system on specific channels)", "`!respond enable #channel1 #channel2` (Enables the respond system on specific channels)", "`!respond details` (Shows whether the respond system is enabled or disabled and also shows which channels have overwrited the setting)"]
        });
    }

    async run(message, args)
    {
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_CHANNELS") && !message.guild.member(message.author).hasPermission("MANAGE_MESSAGES") && message.author.id != message.guild.owner.id){
            message.channel.send("<@" + message.author.id + "> This command is only available to the owner, admins and those with the manage channels or manage messages permissions.").catch(error => console.log("Send Error - " + error))
            return;
        }

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        var channels = [];

        if(args.length > 0)
        {
            console.log("args are present");
            var getChannel = false;
            var channelID = "";
            var firstIndex = -1;

            for(var i = 0; i < args.length; i++)
            {
                if(getChannel)
                {
                    if(args[i].toString() == ">")
                    {
                        channels.push(channelID);
                        channelID = "";
                        getChannel = false;
                    }
                    else
                    {
                        if(args[i].toString() != "#" && !isNaN(args[i].toString()))
                        {
                            channelID = channelID + args[i].toString();
                        }
                    }
                }
                else
                {
                    if(args[i].toString() == "<")
                    {
                        if(firstIndex == -1)
                        {
                            firstIndex = i;
                        }
                        getChannel = true;
                    } 
                }
            }
        }
          
        var currentSetting = ResponseChange.getResponse(message.guild);
        var hasOverwrite = ResponseChange.hasOverwrite(message.guild);
        if(args.toLowerCase().startsWith("enable"))
        {
            if(channels.length == 0)
            {
                if(currentSetting === false || hasOverwrite)
                {
                    ResponseChange.changeResponse(message.guild.id, true, null);
                    message.channel.send("<@" + message.author.id + "> Responses enabled on all channels").catch(error => console.log("Send Error - " + error));
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> Responses already enabled on all channels").catch(error => console.log("Send Error - " + error));
                }
            }
            else
            {
                for(var i = 0; i < channels.length; i++)
                {
                    var overwriteSetting = ResponseChange.getOverwrite(message.guild, channels[i])
                    if(currentSetting)
                    {
                        if(overwriteSetting)
                        {
                            ResponseChange.changeResponse(message.guild.id, true, channels[i]);
                            message.channel.send("<@" + message.author.id + "> Enabled <#" + channels[i] + ">").catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> <#" + channels[i] + "> is already enabled.").catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else
                    {
                        if(!overwriteSetting)
                        {
                            ResponseChange.changeResponse(message.guild.id, true, channels[i]);
                            message.channel.send("<@" + message.author.id + "> Enabled <#" + channels[i] + ">").catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> <#" + channels[i] + "> is already enabled.").catch(error => console.log("Send Error - " + error));
                        }
                    }
                }
            }
        }
        else if (args.toLowerCase().startsWith("disable"))
        {
            if(channels.length == 0)
            {
                if(currentSetting === true || hasOverwrite)
                {
                    ResponseChange.changeResponse(message.guild.id, false, null);
                    message.channel.send("<@" + message.author.id + "> Responses disabled on all channels").catch(error => console.log("Send Error - " + error));
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> Responses already disabled on all channels").catch(error => console.log("Send Error - " + error));
                }
            }
            else
            {
                for(var i = 0; i < channels.length; i++)
                {
                    var overwriteSetting = ResponseChange.getOverwrite(message.guild, channels[i])
                    if(!currentSetting)
                    {
                        if(overwriteSetting)
                        {
                            ResponseChange.changeResponse(message.guild.id, false, channels[i]);
                            message.channel.send("<@" + message.author.id + "> Disabled <#" + channels[i] + ">").catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> <#" + channels[i] + "> is already disabled.").catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else
                    {
                        if(!overwriteSetting)
                        {
                            ResponseChange.changeResponse(message.guild.id, false, channels[i]);
                            message.channel.send("<@" + message.author.id + "> Disabled <#" + channels[i] + ">").catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> <#" + channels[i] + "> is already disabled.").catch(error => console.log("Send Error - " + error));
                        }
                    }
                }
            }
        }
        else if (args.toLowerCase() == "details")
        {
            var responseMessage = ""
            if(currentSetting)
            {
                responseMessage = "Responses are Enabled. All new channels will have the response system enabled."
            }
            else
            {
                responseMessage = "Responses are Disabled. All new channels will have the response system disabled."
            }

            var overwrites = ResponseChange.getAllOverwrite(message.guild);

            if(overwrites != null)
            {
                responseMessage = responseMessage + "\n***Overwrites:***"
                var settingText = "";

                if(!currentSetting)
                {
                    settingText = "enabled."
                }
                else
                {
                    settingText = "disabled."
                }

                for(var i = 0; i < overwrites.length; i++)
                {
                    responseMessage = responseMessage + "\nThe channel <#" + overwrites[i] + "> is " + settingText;
                }
            }

            message.channel.send(responseMessage).catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No parameter given, use either `" + commandPrefix + "respond enable` or `" + commandPrefix + "respond disable`").catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = RespondCommand;