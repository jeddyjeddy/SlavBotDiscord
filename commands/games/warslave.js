const command = require("discord.js-commando");
var IndexRef = require("../../index.js")
var slaves = [{key: "Key", users: [{id: "", owner: "", price: 0}]}];
var firebase = require("firebase");
var signedIntoFirebase = false;
var listening = false;
var patrons = [{userID: "", type: 0}];

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signedIntoFirebase = true;

        if(!listening)
        {
            firebase.database().ref("patrons").on("child_added", function(snapshot){
                patrons.push({userID: snapshot.key, type: snapshot.val()})
            })
            
            firebase.database().ref("patrons").on("child_removed", function(snapshot){
                for(var i = 0; i < patrons.length; i++)
                {
                    if(patrons[i] == snapshot.key)
                    {
                        patrons[i].userID = ""
                    }
                }
            })

            firebase.database().ref("patrons").on("child_changed", function(snapshot){
                for(var i = 0; i < patrons.length; i++)
                {
                    if(patrons[i] == snapshot.key)
                    {
                        patrons[i].type = snapshot.val()
                    }
                }
            })

            listening = true;
        }
    } 
    else
    {
        signedIntoFirebase = false;
    }
  });
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class WarSlaveCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "warslave",
            group: "games",
            memberName: "warslave",
            description: "Play the War Slave Game where you purchase other users on your server as slaves. Buy other users as slaves, gift them war tokens to increase their value so that no one else can buy them. Sell your slaves to earn back your tokens. These tokens can also be earned by voting for Slav Bot on discordbots.org or by participating in token giveaways on the support server. You can also earn tokens by buying roles on the support server or becoming a patreon supporter and get tokens weekly.",
            examples: ["`!warslave profile [@User (optional)]` (Check how many tokens/slaves you or another user have and other info)", "`!warslave collect` (Gather Slave Trading Resources)", "`!warslave buy @User` (Buy a slave)", "`!warslave buy freedom` (Buy your freedom if you are owned by someone, freedom cost is x10 your slave price)", "`!warslave sell @User` (Sell a slave)", "`!warslave gift <amount> @User1 @User2` (Gift tokens to your slaves to increase their value)", "`!warslave give <amount> @User1 @User2` (Give your tokens to another user)", "`!warslave list` (Gives a list of slaves you own)"]
        });
    }

    async run(message, args)
    {
        if(!signedIntoFirebase || message.guild == null)
            return;
            
        IndexRef.addCommandCounter(message.author.id);
        
        var existingData = false;
        for(var i = 0; i < slaves.length; i++)
        {
            if(slaves[i].key == message.guild.id)
            {
                existingData = true;
            }
        }

        var promises = []

        if(!existingData)
        {
            promises.push(firebase.database().ref("serversettings/" + message.guild.id + "/slaves").once('value').then(function(snapshot){
                if(snapshot.val() == null)
                {
                    var slave = {key: message.guild.id, users: []}
                    slaves.push(slave);
                    firebase.database().ref("serversettings/" + message.guild.id + "/slaves").set(JSON.stringify(slave))
                }
                else
                {
                    var slave = JSON.parse(snapshot.val())
                   
                    if(slave.key != message.guild.id)
                    {
                        slave.key = message.guild.id;
                        firebase.database().ref("serversettings/" + message.guild.id + "/slaves").set(JSON.stringify(slave))
                    }

                    if(slave.users.length > 0)
                    {
                        var copies = false;
                        for(var slaveIndex = 0; slaveIndex < slave.users.length; slaveIndex++)
                        {
                            for(var slaveIndex2 = 0; slaveIndex2 < slave.users.length; slaveIndex2++)
                            {
                                if(slave.users[slaveIndex].id == slave.users[slaveIndex2].id && slaveIndex2 != slaveIndex)
                                {
                                    slave.users.splice(slaveIndex2, 1)
                                    copies = true;
                                }
                                else if(slave.users[slaveIndex].owner == slave.users[slaveIndex2].id && slave.users[slaveIndex].id == slave.users[slaveIndex2].owner && slave.users[slaveIndex].owner != "")
                                {
                                    slave.users[slaveIndex].owner = ""
                                    copies = true;
                                }
                            }

                        }

                        if(copies)
                            firebase.database().ref("serversettings/" + message.guild.id + "/slaves").set(JSON.stringify(slave))
                        
                    }

                    slaves.push(slave)
                }
            }))
        }

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        setImmediate(() => {
            Promise.all(promises).then(() => {
                for(var i = 0; i < slaves.length; i++)
                {
                    if(slaves[i].key == message.guild.id)
                    {
                        if(args.toLowerCase().startsWith("collect"))
                        {  
                            var cooldown = IndexRef.getCooldown(message.author.id)
                            var date = new Date(IndexRef.getCooldown(message.author.id))

                            if(cooldown == null || cooldown == undefined || cooldown == "")
                            {
                                date = new Date()
                            }

                            if(date.getTime() <= (new Date()).getTime())
                            {
                                var maxValue = 2000;
                                var maxPercInc = 0;
                                var collectedValInc = 0;

                                for(var index = 0; index < slaves[i].users.length; index++)
                                {
                                    if(slaves[i].users[index].owner == message.author.id)
                                    {
                                        if(slaves[i].users[index].price > 1000)
                                        {
                                            const amountRef = slaves[i].users[index].price - 1000
                                            maxPercInc = maxPercInc + Math.floor(amountRef / 500)
                                        }
                                    }
                                }

                                for(var index = 0; index < patrons.length; index++)
                                {
                                    if(patrons[index].userID == message.author.id)
                                    {
                                        if(patrons[index].type == 0)
                                        {
                                            collectedValInc = 50;
                                        }
                                        else if(patrons[index].type == 1)
                                        {
                                            collectedValInc = 100;
                                        }
                                    }
                                }

                                if(maxPercInc > 1000)
                                    maxPercInc = 1000;

                                maxValue = Math.floor(2000 * ((maxPercInc/100) + 1))

                                var collected = Math.floor(Math.random() * maxValue) + 1
                                collected = Math.floor(collected * ((collectedValInc/100) + 1))

                                var timestamp = (new Date(Date.now()).toJSON());

                                IndexRef.addTokens(message.author.id, collected)
                                IndexRef.setCooldown(message.author.id, (new Date((new Date).getTime() + 120000)))

                                message.channel.send("", {embed: {title: "***Slave Trading Resources Collected***", description: "<@" + message.author.id + "> You have collected ***" + numberWithCommas(collected) + " tokens***\n\n***Max value increase of " + numberWithCommas(maxPercInc) + "%*** _(current max value: " + numberWithCommas(maxValue) + ")_ - Increase the max amount of tokens you can collect by owning slaves with a value greater than 1,000 tokens.\n\n***Collected Value Increase of " + collectedValInc + "%*** - You can increase the value of tokens you have collected. This is only available to those ***[supporting us on Patreon](https://www.patreon.com/merriemweebster)***.", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Collected on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                message.channel.send("", {embed: {title: "***Cooldown***", description: "<@" + message.author.id + "> You cannot collect more slave trading resources until the 2 hour cooldown is over.", color: 65339, timestamp: IndexRef.getCooldown(message.author.id), footer: {icon_url: message.client.user.avatarURL,text: "Cooldown until"}}}).catch(error => console.log("Send Error - " + error));
                            }
                                
                            
                        }
                        else if(args.toLowerCase().startsWith("give"))
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
    
                            var amountText = options.match(/\d+/g);
                            var amount = []
                            if(amountText != null)
                            {
                                amount = amountText.map(Number);
                            }

                            if(amount.length > 0)
                            {
                                amount = amount[0]

                                if(amount > 0)
                                {
                                    if(users.length > 0)
                                    {
                                        for(var userIndex = 0; userIndex < users.length; userIndex++)
                                        {
                                            if(IndexRef.getTokens(message.author.id) < amount)
                                            {
                                                message.channel.send("<@" + message.author.id + "> You do not have " + numberWithCommas(amount) + " tokens to give to another user.").catch(error => {console.log("Send Error - " + error); });   
                                            }
                                            else
                                            {
                                                var mentions = message.mentions.users.array()
                                                var isBot = false;
                                                for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                                                {
                                                    if(mentions[mentionIndex].id == users[userIndex])
                                                    {
                                                        isBot = mentions[mentionIndex].bot
                                                    }
                                                }
    
                                                if(users[userIndex] == message.author.id || isBot)
                                                {
                                                    message.channel.send("<@" + message.author.id + "> tag another user.").catch(error => {console.log("Send Error - " + error); });   
                                                }
                                                else
                                                {
                                                    IndexRef.subtractTokens(message.author.id, amount)
                                                    IndexRef.addTokens(users[userIndex], amount)
                                                    message.channel.send("<@" + message.author.id + "> has given " + numberWithCommas(amount) + " token(s) to <@" + users[userIndex] + ">").catch(error => {console.log("Send Error - " + error); });   
                                                }
                                            }
                                            
                                        }
                                    }
                                    else
                                    {
                                        message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => {console.log("Send Error - " + error); });   
                                    }
                                }
                                else
                                {
                                    message.channel.send("<@" + message.author.id + "> Amount should be greater than 0.").catch(error => {console.log("Send Error - " + error); });   
                                }
                            }
                            else
                            {
                                message.channel.send("<@" + message.author.id + "> No amount given.").catch(error => {console.log("Send Error - " + error); });   
                            }
                        }
                        else if(args.toLowerCase().startsWith("gift"))
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
    
                            var amountText = options.match(/\d+/g);
                            var amount = []
                            if(amountText != null)
                            {
                                amount = amountText.map(Number);
                            }

                            if(amount.length > 0)
                            {
                                amount = amount[0]

                                if(amount > 0)
                                {
                                    if(users.length > 0)
                                    {
                                        for(var userIndex = 0; userIndex < users.length; userIndex++)
                                        {
                                            if(IndexRef.getTokens(message.author.id) < amount)
                                            {
                                                message.channel.send("<@" + message.author.id + "> You do not have " + numberWithCommas(amount) + " tokens to gift to your slave.").catch(error => {console.log("Send Error - " + error); });   
                                            }
                                            else
                                            {
                                                var mentions = message.mentions.users.array()
                                                var isBot = false;
                                                var thumbnail = "";
                                                        
                                                for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                                                {
                                                    if(mentions[mentionIndex].id == users[userIndex])
                                                    {
                                                        isBot = mentions[mentionIndex].bot
                                                        
                                                        if(mentions[mentionIndex].avatarURL != undefined && mentions[mentionIndex].avatarURL != null)
                                                            thumbnail = mentions[mentionIndex].avatarURL
                                                    }
                                                }
    
                                                var owner = false;
    
                                                for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                                {
                                                    if(slaves[i].users[slaveIndex].owner == message.author.id)
                                                    {
                                                        owner = true;
                                                    }
                                                }
    
                                                if(users[userIndex] == message.author.id || isBot || !owner)
                                                {
                                                    message.channel.send("<@" + message.author.id + "> tag a slave you own.").catch(error => {console.log("Send Error - " + error); });   
                                                }
                                                else
                                                {
                                                    var priceAdd = Math.floor((Math.random() * amount) + 1)
                                                    IndexRef.subtractTokens(message.author.id, amount)
                                                    IndexRef.addTokens(users[userIndex], priceAdd)
                                                    var newPrice = 0;
    
                                                    for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                                    {
                                                        if(slaves[i].users[slaveIndex].id == users[userIndex])
                                                        {
                                                            newPrice = slaves[i].users[slaveIndex].price + priceAdd
                                                            slaves[i].users[slaveIndex].price = newPrice
                                                        }
                                                    }
    
                                                    var timestamp = (new Date(Date.now()).toJSON());
                                                    
    
                                                    message.channel.send("<@" + message.author.id + "> has has sent a gift of " + numberWithCommas(amount) + " token(s) to their slave. <@" + users[userIndex] + "> ended up receiving " + numberWithCommas(priceAdd) + " token(s) and now has a value of " + numberWithCommas(newPrice) + " war token(s).", 
                                                    {embed: {title: "***Gift Given To Slave***", description: "<@" + message.author.id + "> has sent a gift of " + numberWithCommas(amount) + " token(s) to their slave. <@" + users[userIndex] + "> ended up receiving " + numberWithCommas(priceAdd) + " token(s) and now has a value of " + numberWithCommas(newPrice) + " war token(s).", color: 65339, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Given on"}}}).catch(error => {console.log("Send Error - " + error); });                                                   
                                                }
                                            }
                                            
                                        }
                                    }
                                    else
                                    {
                                        message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => {console.log("Send Error - " + error); });   
                                    }
                                }
                                else
                                {
                                    message.channel.send("<@" + message.author.id + "> Amount should be greater than 0.").catch(error => {console.log("Send Error - " + error); });   
                                }
                            }
                            else
                            {
                                message.channel.send("<@" + message.author.id + "> No amount given.").catch(error => {console.log("Send Error - " + error); });   
                            }
                        }
                        else if (args.toLowerCase().startsWith("buy freedom"))
                        {
                            
                            var timestamp = (new Date(Date.now()).toJSON());
                            var selfOwner = "none"

                            for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                            {
                                if(slaves[i].users[slaveIndex].id == message.author.id)
                                {
                                    if(slaves[i].users[slaveIndex].owner != "")
                                    {
                                        selfOwner = slaves[i].users[slaveIndex].owner
                                    }
                                }
                            }

                            if(selfOwner == "none")
                            {
                                message.channel.send("", {embed: {title: "***No Owner***", description: "<@" + message.author.id + "> You are not owned by anyone.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                {
                                    if(slaves[i].users[slaveIndex].id == message.author.id)
                                    {
                                        var value = slaves[i].users[slaveIndex].price;
                                        var freedomValue = value * 10;

                                        if(!IndexRef.subtractTokens(message.author.id, freedomValue))
                                        {
                                            message.channel.send("", {embed: {title: "***Failed To Buy Freedom***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase your freedom. You need " + numberWithCommas(freedomValue) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens. Your freedom price is x10 your slave price.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else
                                        {                                                
                                            message.channel.send("Freedom Bought for " + numberWithCommas(freedomValue) + " tokens! You are now worth " + numberWithCommas(freedomValue) + " tokens! <@" + selfOwner + "> has been given " + numberWithCommas(value) + " tokens back. You have a 2 hour freedom cooldown period in which no one can purchase you.", {embed: {title: "***Freedom Bought***", description: "<@" + message.author.id + "> You are now free and have no owner. You are now worth " + numberWithCommas(freedomValue) + " tokens! <@" + selfOwner + "> has been given " + numberWithCommas(value) + " tokens back. You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.\n\nYou have a 2 hour freedom cooldown period in which no one can purchase you.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            IndexRef.addTokens(selfOwner, value)
                                            slaves[i].users[slaveIndex].owner = "";
                                            slaves[i].users[slaveIndex].price = freedomValue;
                                            slaves[i].users[slaveIndex].cooldown = (new Date((new Date).getTime() + 7200000)).toJSON()
                                        }
                                    }
                                }
                            }
                        }
                        else if (args.toLowerCase().startsWith("buy"))
                        {
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

                            var timestamp = (new Date(Date.now()).toJSON());
                            var mentions = message.mentions.users.array()
                            var isBot = false;
                            for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                            {
                                if(mentions[mentionIndex].id == userID)
                                {
                                    isBot = mentions[mentionIndex].bot
                                }
                            }

                            if(otherUser && userID != message.author.id && !isBot)
                            {
                                var slaveFound = false;
                                var selfOwner = "none"

                                for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                {
                                    if(slaves[i].users[slaveIndex].id == message.author.id)
                                    {
                                        if(slaves[i].users[slaveIndex].owner != "")
                                        {
                                            selfOwner = slaves[i].users[slaveIndex].owner
                                        }
                                    }
                                }

                                for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                {
                                    if(slaves[i].users[slaveIndex].id == userID)
                                    {
                                        slaveFound = true;
                                        var value = slaves[i].users[slaveIndex].price;
    
                                        if(slaves[i].users[slaveIndex].owner == message.author.id)
                                        {
                                            message.channel.send("", {embed: {title: "***Slave Already Owned***", description: "<@" + message.author.id + "> You already own <@" + userID + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else if(slaves[i].users[slaveIndex].id == selfOwner)
                                        {
                                            message.channel.send("", {embed: {title: "***Cannot Own Your Master***", description: "<@" + slaves[i].users[slaveIndex].id + "> owns you.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else if(slaves[i].users[slaveIndex].owner != "")
                                        {
                                            message.channel.send("", {embed: {title: "***Slave Already Owned***", description: "<@" + slaves[i].users[slaveIndex].owner + "> owns <@" + userID + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else
                                        {
                                            var freedomCooldownOver = true;
                                            var cooldownTimestamp = "";
                                            if(slaves[i].users[slaveIndex].cooldown != null && slaves[i].users[slaveIndex].cooldown != undefined && slaves[i].users[slaveIndex].cooldown != "")
                                            {
                                                var time = new Date(slaves[i].users[slaveIndex].cooldown)

                                                if((new Date()).getTime() < time.getTime())
                                                {
                                                    freedomCooldownOver = false;
                                                    cooldownTimestamp = slaves[i].users[slaveIndex].cooldown;
                                                }
                                            }

                                            if(freedomCooldownOver)
                                            {
                                                if(!IndexRef.subtractTokens(message.author.id, value))
                                                {
                                                    message.channel.send("", {embed: {title: "***Failed To Buy Slave***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase <@" + userID + ">. You need " + numberWithCommas(value) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                                else
                                                {                                                
                                                    message.channel.send("", {embed: {title: "***Successfully Purchased Slave***", description: "<@" + message.author.id + "> You have purchased <@" + userID + ">. You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                    
                                                    slaves[i].users[slaveIndex].owner = message.author.id;
                                                }
                                            }
                                            else
                                            {
                                                message.channel.send("", {embed: {title: "***Freedom Cooldown Not Over***", description: "<@" + message.author.id + "> You are unable to purchase <@" + userID + "> until their 2 hour freedom cooldown is over.", color: 16711680, timestamp: cooldownTimestamp, footer: {icon_url: message.client.user.avatarURL,text: "Cooldown until"}}}).catch(error => console.log("Send Error - " + error));
                                            }
                                        }
                                    }
                                }

                                if(!slaveFound)
                                {
                                    var value = 500;
    
                                    
                                    if(userID == selfOwner)
                                    {
                                        message.channel.send("", {embed: {title: "***Cannot Own Your Master***", description: "<@" + userID + "> owns you.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                    else
                                    {
                                        if(!IndexRef.subtractTokens(message.author.id, value))
                                        {
                                            message.channel.send("", {embed: {title: "***Failed To Buy Slave***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase <@" + userID + ">. You need " + numberWithCommas(value) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            slaves[i].users.push({id: userID,  owner: "", price: 500})
                                        }
                                        else
                                        {                                                
                                            message.channel.send("", {embed: {title: "***Successfully Purchased Slave***", description: "<@" + message.author.id + "> You have purchased <@" + userID + ">. You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            slaves[i].users.push({id: userID,  owner: message.author.id, price: 500})
                                        }
                                    }
                                }
                            }
                            else
                            {
                                message.channel.send("", {embed: {title: "***No Slaves Tagged***", description: "<@" + message.author.id + "> You must mention a slave to buy them.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else if (args.toLowerCase().startsWith("sell"))
                        {
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

                            var timestamp = (new Date(Date.now()).toJSON());
                            var mentions = message.mentions.users.array()
                            var isBot = false;
                            for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                            {
                                if(mentions[mentionIndex].id == userID)
                                {
                                    isBot = mentions[mentionIndex].bot
                                }
                            }

                            if(otherUser && userID != message.author.id && !isBot)
                            {
                                var slaveFound = false;
                                for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                {
                                    if(slaves[i].users[slaveIndex].id == userID)
                                    {
                                        slaveFound = true;
                                        var value = slaves[i].users[slaveIndex].price;
    
                                        if(slaves[i].users[slaveIndex].owner == message.author.id)
                                        {
                                            IndexRef.addTokens(message.author.id, slaves[i].users[slaveIndex].price)
                                            message.channel.send("", {embed: {title: "***Successfully Sold Slave***", description: "<@" + message.author.id + "> You have sold <@" + userID + "> for " + numberWithCommas(slaves[i].users[slaveIndex].price) + " tokens. You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            slaves[i].users[slaveIndex].owner = ""
                                            slaves[i].users[slaveIndex].price = slaves[i].users[slaveIndex].price + 500;
                                        }
                                        else
                                        {
                                            message.channel.send("", {embed: {title: "***Slave Not Owned***", description: "<@" + message.author.id + "> You do not own <@" + userID + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                    }
                                }

                                if(!slaveFound)
                                {
                                    message.channel.send("", {embed: {title: "***Slave Not Owned***", description: "<@" + message.author.id + "> You do not own <@" + userID + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    slaves[i].users.push({id: userID,  owner: "", price: 500})
                                }
                            }
                            else
                            {
                                message.channel.send("", {embed: {title: "***No Slaves Tagged***", description: "<@" + message.author.id + "> You must mention a slave to buy them.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else if(args.toLowerCase().startsWith("profile"))
                        {
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
                            
        
                            if(otherUser)
                            {
                                var slaveFound = false;
                                var timestamp = (new Date(Date.now()).toJSON());
                                var count = 0;
                                for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                {
                                    if(slaves[i].users[slaveIndex].owner == userID)
                                    {
                                        count++;
                                    }
                                }

                                var user;
                                var mentions = message.mentions.users.array()

                                for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                                {
                                    if(mentions[mentionIndex].id == userID)
                                    {
                                        user = mentions[mentionIndex];
                                    }
                                }

                                var thumbnail = "";
    
                                if(user.avatarURL != undefined && user.avatarURL != null)
                                    thumbnail = user.avatarURL

                                for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                {
                                    if(slaves[i].users[slaveIndex].id == userID)
                                    {
                                        var price = slaves[i].users[slaveIndex].price;
                                        slaveFound = true
                                        var ownerText = ""

                                        if(slaves[i].users[slaveIndex].owner != "")
                                        {
                                            ownerText = "\n\nThis slave is owned by <@" + slaves[i].users[slaveIndex].owner + ">"
                                        }
                                        else
                                        {
                                            ownerText = "\n\nThis slave is not owned by anyone."
                                        }

                                        message.channel.send("", {embed: {title: "***Slave Profile for" + user.username + "***", description: user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.\n" + user.username + " owns " + numberWithCommas(count) +" slave(s).\n" + user.username + " is worth " + numberWithCommas(price) + " war tokens." + ownerText, color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }

                                if(!slaveFound)
                                {
                                    message.channel.send("", {embed: {title: "***Slave Profile for" + user.username + "***", description: user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.\n" + user.username + " owns " + numberWithCommas(count) +" slave(s).\n" + user.username + " is worth 500 war tokens.\n\nThis slave is not owned by anyone.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    slaves[i].users.push({id: userID,  owner: "", price: 500})
                                }
                            }
                            else
                            {
                                var count = 0;
                                var price = 500;
                                var slaveFound = false;
                                var ownerText = ""
                                
                                for(var slaveIndex = 0; slaveIndex < slaves[i].users.length; slaveIndex++)
                                {
                                    if(slaves[i].users[slaveIndex].owner == message.author.id)
                                    {
                                        count++;
                                    }

                                    if(slaves[i].users[slaveIndex].id == message.author.id)
                                    {
                                        price = slaves[i].users[slaveIndex].price;
                                        slaveFound = true;
                                        
                                        if(slaves[i].users[slaveIndex].owner != "")
                                        {
                                            ownerText = "\n\You are owned by <@" + slaves[i].users[slaveIndex].owner + ">"
                                        }
                                        else
                                        {
                                            ownerText = "\n\nYou are not owned by anyone."
                                        }
                                    }
                                }

                                if(!slaveFound)
                                {
                                    slaves[i].users.push({id: message.author.id,  owner: "", price: 500})
                                }
    
                                var thumbnail = "";
    
                                if(message.author.avatarURL != undefined && message.author.avatarURL != null)
                                    thumbnail = message.author.avatarURL
    
                                var timestamp = (new Date(Date.now()).toJSON());
                                message.channel.send("", {embed: {title: "***Slave Profile for " + message.author.username + "***", description: "You currently have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.\nYou own " + numberWithCommas(count) + " slave(s).\nYou are worth " + numberWithCommas(price) + " war tokens." + ownerText, color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));    
                            }
                        }
                        else if(args.toLowerCase().startsWith("list"))
                        {

                            var lists = []
                            var item = ""
                            var users = []
                            for(var index = 0; index < slaves[i].users.length; index++)
                            {
                                if(slaves[i].users[index].owner == message.author.id)
                                {
                                    users.push(slaves[i].users[index].id)
                                }
                            }

                            for(var index = 0; index < users.length; index++)
                            {
                                var text = "<@" + users[index] + ">"
                                if((item + text + "\n").length < 2048)
                                {
                                    item = item + text + "\n";
                                }
                                else
                                {
                                    lists.push(item);
                                }
                            }

                            if(item != "")
                            {
                                lists.push(item)
                            }
                            else if(lists.length == 0)
                            {
                                lists.push("No Slaves Owned")
                            }

                            var timestamp = (new Date(Date.now()).toJSON());
                            for(var index = 0; index < lists.length; index++)
                            {
                                message.channel.send("<@" + message.author.id + ">", {embed: {title: "***List of Slaves You Own (" + (index + 1) + "/" + lists.length + ")***", description: lists[index], color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> No parameter given. Use `" + commandPrefix + "help warslave` for help.").catch(error => {console.log("Send Error - " + error); });
                        }
                    
                        firebase.database().ref("serversettings/" + message.guild.id + "/slaves").set(JSON.stringify(slaves[i]))
                        return;
                    }
                }
            })
        })
    }
}

module.exports = WarSlaveCommand;