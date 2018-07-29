const command = require("discord.js-commando");
var Leaderboards = require("../../index.js")
var rankEmojis = [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":poop:"]
class LeaderboardsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "leaderboards",
            group: "util",
            memberName: "leaderboards",
            description: "Shows the global or local leaderboards for Slav Bot (Users are ranked based on the number of command requests they have sent).",
            examples: ["`!leaderboards`", "`!leaderboards local`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if(args.toLowerCase() == "local")
        {
            var members = message.guild.members.array();
            var IDs = [];
            for(var i = 0; i < members.length; i++)
            {
                IDs.push(members[i].id);
            }

            var localLeaderboards = Leaderboards.getLocalLeaderboards(IDs);

            var names = [];

            for(var userIndex = 0; userIndex < localLeaderboards.length; userIndex++)
            {
                for(var i = 0; i < members.length; i++)
                {
                    if(members[i].id == localLeaderboards[userIndex].key)
                    {
                        names.push(members[i].user.username);
                    }
                }
            }
            
            var descriptionList = "";

            for(var i = 0; i < localLeaderboards.length; i++)
            {
                descriptionList = descriptionList + (rankEmojis[i] + "``" + localLeaderboards[i].data.uses + "`` - **" + names[i] + "**\n");
            }

            var timestamp = (new Date(Date.now()).toJSON());
            message.channel.send("", {embed: {title: "**Local Leaderboard for _" + message.guild.name + "_ - Top 10 users :trophy:**",
            description: "**Rank** - CRS* - Name\n" + descriptionList + "\n*CRS = Command Requests Sent",
            color: 16757505,
            timestamp: timestamp,
            footer: {
              icon_url: message.client.user.avatarURL,
              text: "Sent on"
            }}}).catch(error => console.log("Send Error - " + error));
            message.channel.stopTyping();
        }
        else
        {
            var leaderboards = Leaderboards.getLeaderboards();

            var users = [];
            var userPromises = [];

            for(var i = 0; i < leaderboards.length; i++)
            {
                userPromises.push(message.client.fetchUser(leaderboards[i].key)
                .then(user => {
                    users.push(user);
                }, rejection => {
                        console.log(rejection.message);
                }));
            }
            
            Promise.all(userPromises)
            .then(() => {
                
                var names = [];
                for(var i = 0; i < leaderboards.length; i++)
                {
                    for(var userIndex = 0; userIndex < users.length; userIndex++)
                    {
                        if(users[userIndex].id == leaderboards[i].key)
                        {
                            names.push(users[userIndex].username)
                        }
                    }
                }

                var descriptionList = "";

                for(var i = 0; i < leaderboards.length; i++)
                {
                    descriptionList = descriptionList + (rankEmojis[i] + "``" + leaderboards[i].data.uses + "`` - **" + names[i] + "**\n");
                }

                var timestamp = (new Date(Date.now()).toJSON());
                message.channel.send("", {embed: {title: "**Global Leaderboard - Top 10 users :trophy:**",
                description: "**Rank** - CRS* - Name\n" + descriptionList + "\n*CRS = Command Requests Sent\n\nTo check the local leaderboard for your server, use `" + commandPrefix + "leaderboards local`",
                color: 16757505,
                timestamp: timestamp,
                footer: {
                icon_url: message.client.user.avatarURL,
                text: "Sent on"
                }}}).catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
            })
            .catch((e) => {
                console.log(e.message);
                message.reply("Error - " + e.message).catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
            });
        }
    }
}

module.exports = LeaderboardsCommand;