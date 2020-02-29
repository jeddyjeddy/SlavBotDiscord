const command = require("discord.js-commando");
var IndexRef = require("../../index.js")

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var firebase = require("firebase");
var signedIntoFirebase = false;
var listening = false;
var blackList = []

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signedIntoFirebase = true;

        if(!listening)
        {
            firebase.database().ref("warblacklist").on("value", function(snapshot) {
                if(snapshot.val() != null)
                    blackList = JSON.parse(snapshot.val());  
                else
                    blackList = [];
            })

            listening = true;
        }
    } 
    else
    {
        signedIntoFirebase = false;
    }
  });

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

        for(var i = 0; i < blackList.length; i++)
        {
            if(blackList[i] == message.author.id)
            {
                message.channel.send("You have been banned from the use of war games. You may contact the admins/owner if you believe this to be unfair.").catch((error) => {console.log("Send Error - " + error)})
                return;
            }
            var userFound = false;
            var mentions = message.mentions.users.array()

            for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
            {
                if(mentions[mentionIndex].id == blackList[i])
                {
                    user = true;
                }
            }

            if(userFound)
            {
                message.channel.send("Pinging banned users in war game commands is restricted. No commands will be executed on banned users.").catch((error) => {console.log("Send Error - " + error)})
                return;
            }
        }
            
        IndexRef.addCommandCounter(message.author.id);
        IndexRef.initTokens(message.author.id)

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if((message.author.id == message.client.owners[0].id || message.author.id == message.client.owners[1].id || message.author.id == message.client.owners[2].id) && args.startsWith("blacklist"))
        {
            var userID = "";
            var getUser = false;
            for(var i = 0; i < args.length; i++)
            {
                if(getUser)
                {
                    if(args[i].toString() == ">")
                    {
                        i = args.length;
                    }
                    else
                    {
                        if(args[i].toString() != "@" && (!isNaN(args[i].toString()) || args[i] == "&"))
                        {
                            userID = userID + args[i].toString();
                        }
                    }
                }
                else
                {
                    if(args[i].toString() == "<")
                    {
                        getUser = true;
                    } 
                }
            }
            
            var alreadyBlackListed = false;

            for(var i = 0; i < blackList.length; i++)
            {
                if(blackList[i] == userID)
                {
                    alreadyBlackListed = true;
                }
            }

            if(alreadyBlackListed)
            {
                if(args.startsWith("blacklist remove"))
                {
                    for(var i = 0; i < blackList.length; i++)
                    {
                        if(blackList[i] == userID)
                        {
                            blackList.splice(i, 1);
                            firebase.database().ref("warblacklist").set(JSON.stringify(blackList))
                            message.channel.send("<@" + userID + "> is no longer blacklisted").catch(error => console.log("Send Error - " + error));
                        }
                    }
                }
                else
                    message.channel.send("User already blacklisted").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                blackList.push(userID.toString());
                firebase.database().ref("warblacklist").set(JSON.stringify(blackList))
                message.channel.send("<@" + userID + "> has been blacklisted").catch(error => console.log("Send Error - " + error));
            }
            return;
        }

        if((message.author.id == message.client.owners[0].id || message.author.id == message.client.owners[1].id || message.author.id == message.client.owners[2].id) && args.toLowerCase().startsWith("generate"))
        {
            var endIndex = -1;
            var users = []
            var getUser = false;
            var userID = "";
            for(var index = 0; index < args.length; index++)
            {
                if(getUser)
                {
                    if(args[index].toString() == ">")
                    {
                        users.push(userID);
                        userID = "";
                        getUser = false;
                    }
                    else
                    {
                        if(args[index].toString() != "@" && !isNaN(args[index].toString()))
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
                        if(endIndex == -1)
                            endIndex = index 
                    } 
                }
            }

            var options = ""

            for(var index = 0; index < endIndex; index++)
            {
                options = options + args[index];
            }

            options = options.replace(/,/g, "")
            var amountText = options.match(/\d+/g);
            var amount = []
            if(amountText != null)
            {
                amount = amountText.map(Number);
            }
            
            if(amount.length > 0)
            {
                amount = amount[0]
                if(users.length > 0)
                {
                    for(var userIndex = 0; userIndex < users.length; userIndex++)
                    {
                        IndexRef.addTokens(users[userIndex], amount)
                        message.channel.send("<@" + users[userIndex] + "> has been given " + numberWithCommas(amount) + " tokens").catch(error => {console.log("Send Error - " + error); });   
                    }
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => {console.log("Send Error - " + error); });   
                }
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> No amount given.").catch(error => {console.log("Send Error - " + error); });   
            }

            
            return;
        }
        else if((message.author.id == message.client.owners[0].id || message.author.id == message.client.owners[1].id || message.author.id == message.client.owners[2].id) && args.toLowerCase().startsWith("reset"))
        {
            var options = ""

            for(var index = 0; index < args.length; index++)
            {
                options = options + args[index];
            }
            options = options.replace(/,/g, "")
            var amountText = options.match(/\d+/g);
            var amount = []
            if(amountText != null)
            {
                amount = amountText.map(Number);
            }

            if(amount.length > 0)
            {
                amount = amount[0]
            }
            else
            {
                amount = 100000000000000
            }

            IndexRef.resetTokens(amount)
            message.channel.send("<@" + message.author.id + "> Tokens have been globally reset.").catch(error => console.log("Send Error - " + error));
            return;
        }
        else if((message.author.id == message.client.owners[0].id || message.author.id == message.client.owners[1].id || message.author.id == message.client.owners[2].id) && args.toLowerCase().startsWith("remove"))
        {
            var endIndex = -1;
            var users = []
            var getUser = false;
            var userID = "";
            for(var index = 0; index < args.length; index++)
            {
                if(getUser)
                {
                    if(args[index].toString() == ">")
                    {
                        users.push(userID);
                        userID = "";
                        getUser = false;
                    }
                    else
                    {
                        if(args[index].toString() != "@" && !isNaN(args[index].toString()))
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
                        if(endIndex == -1)
                            endIndex = index 
                    } 
                }
            }

            var options = ""

            for(var index = 0; index < endIndex; index++)
            {
                options = options + args[index];
            }
            options = options.replace(/,/g, "")
            var amountText = options.match(/\d+/g);
            var amount = []
            if(amountText != null)
            {
                amount = amountText.map(Number);
            }

            if(amount.length > 0)
            {
                amount = amount[0]
                if(users.length > 0)
                {
                    for(var userIndex = 0; userIndex < users.length; userIndex++)
                    {
                        if(IndexRef.getTokens(users[userIndex]) < amount)
                        {
                            IndexRef.subtractTokens(users[userIndex], IndexRef.getTokens(users[userIndex]))
                        }
                        else
                        {
                            IndexRef.subtractTokens(users[userIndex], amount)
                        }

                        message.channel.send(numberWithCommas(amount) + " tokens have been removed from " + "<@" + users[userIndex] + ">").catch(error => {console.log("Send Error - " + error); });   
                    }
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => {console.log("Send Error - " + error); });   
                }
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> No amount given.").catch(error => {console.log("Send Error - " + error); });   
            }
            
            return;
        }
        else if((message.author.id == message.client.owners[0].id || message.author.id == message.client.owners[1].id || message.author.id == message.client.owners[2].id) && args.toLowerCase().startsWith("view"))
        {
            var endIndex = -1;
            var users = []
            var getUser = false;
            var userID = "";
            for(var index = 0; index < args.length; index++)
            {
                if(getUser)
                {
                    if(args[index].toString() == ">")
                    {
                        users.push(userID);
                        userID = "";
                        getUser = false;
                    }
                    else
                    {
                        if(args[index].toString() != "@" && !isNaN(args[index].toString()))
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
                        if(endIndex == -1)
                            endIndex = index 
                    } 
                }
            }

            for(var userIndex = 0; userIndex < users.length; userIndex++)
            {
                message.channel.send("<@" + users[userIndex] + "> has " + numberWithCommas(IndexRef.getTokens(users[userIndex])) + " tokens.").catch(error => {console.log("Send Error - " + error); });   
            }
            
            return;
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
