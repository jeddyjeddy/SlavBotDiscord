const command = require("discord.js-commando");
var IndexRef = require("../../index.js")

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class TokensCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "tokens",
            group: "games",
            memberName: "tokens",
            description: "View how many tokens you or another user has. These tokens are used in many ways with Slav Bot, mainly in playing our games.",
            examples: ["`!tokens` (View your tokens)", "`!tokens @User` (View another user's tokens)"]
        });
    }

    async run(message, args)
    {
        if(!IndexRef.isInit)
            return;
            
        IndexRef.addCommandCounter(message.author.id);
        IndexRef.initTokens(message.author.id)

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        setImmediate(() => {
            var otherUser = false;
            var userID = "";

            var getUser = false;
            for(var index = 0; index < args.length; index++)
            {
                if(getUser)
                {
                    if(args[index].toString() == ">")
                    {
                        index = args.length;
                        otherUser = true;
                    }
                    else
                    {
                        if(args[index].toString() != "@" && (!isNaN(args[index].toString()) || args[index] == "&"))
                        {
                            userID = userID + args[index].toString();
                        }
                    }
                }
                else
                {
                    if(args[index].toString() == "<")
                    {
                        getUser = true;
                    } 
                }
            }

            if(otherUser && message.guild != null)
            {
                var user;
                var mentions = message.mentions.users.array()

                for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                {
                    if(mentions[mentionIndex].id == userID)
                    {
                        user = mentions[mentionIndex];
                    }
                }

                if(user != undefined && user != null)
                {
                    var thumbnail = "";

                    if(user.avatarURL != undefined && user.avatarURL != null)
                        thumbnail = user.avatarURL

                    var timestamp = (new Date(Date.now()).toJSON());
                    message.channel.send("", {embed: {title: "***Token Profile for " + user.username + "***", description: user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.\n\n\n***[Patreon supporters get weekly tokens.](https://www.patreon.com/merriemweebster)***\n\n***[You can also purchase war tokens on our website. Special Weekend Sales for War Tokens every Friday, Saturday and Sunday.](https://slavbot.com/shop)***\n\n***Use `" + commandPrefix + "dailyspin` to get more tokens for free.***\n\n***Vote every day to increase your voting streak and earn even more free tokens, use `" + commandPrefix + "vote` for more info.***", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> User not found on this server.").catch(error => console.log("Send Error - " + error));
                }
            }
            else
            {
                var thumbnail = "";

                if(message.author.avatarURL != undefined && message.author.avatarURL != null)
                    thumbnail = message.author.avatarURL

                var timestamp = (new Date(Date.now()).toJSON());
                message.channel.send("", {embed: {title: "***Tokens Profile for " + message.author.username + "***", description: "You currently have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.\n\n\n***[Patreon supporters get weekly tokens.](https://www.patreon.com/merriemweebster)***\n\n***[You can also purchase war tokens on our website. Special Weekend Sales for War Tokens every Friday, Saturday and Sunday.](https://slavbot.com/shop)***\n\n***Use `" + commandPrefix + "dailyspin` to get more tokens for free.***\n\n***Vote every day to increase your voting streak and earn even more free tokens, use `" + commandPrefix + "vote` for more info.***", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
            }
        })
    }
}

module.exports = TokensCommand;
