const command = require("discord.js-commando");
var IndexRef = require("../../index.js")
var wars = [{key: "Key", countries: [{key: -1, ruler: "", value: 500}], ended: false, ranks: [{key: "Key", wins: 0}], listTimestamp: null}]
const countries = require('country-list');
const allCountries = countries.getNames();
var firebase = require("firebase");
var signedIntoFirebase = false;
var listening = false;
var patrons = [{userID: "", type: 0}];
var blackList = []
const rankEmojis = [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":poop:"]
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

            firebase.database().ref("patrons").on("child_added", function(snapshot){
                var added = false;
                for(var i = 0; i < patrons.length; i++)
                {
                    if(patrons[i] == snapshot.key)
                    {
                        added = true;
                        patrons[i].type = snapshot.val()
                    }
                }

                if(!added)
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

function rankAscending(a, b)
{
    if (a.wins < b.wins)
        return 1;
    if (a.wins > b.wins)
        return -1;
    return 0;
}

class WWCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "ww",
            group: "games",
            memberName: "ww",
            description: "Play the World War, where users in a server fight to conquer the world and get higher on the local leaderboards. Once a game has started, it will not end until someone conquers every single country there is. Users can conquer countries using War Tokens. Users can also take countries from others with tokens (the value of countries increase based on the number of times it has been conquered). Users can gather resources to earn War Tokens (the tokens can be used in WW games on other servers) that can be used to conquer different countries. These tokens can also be earned by voting for Slav Bot on discordbots.org or by participating in token giveaways on the support server. You can also earn tokens by buying roles on the support server or becoming a patreon supporter and get tokens weekly. The server owner can end a session at any time.",
            examples: ["`!ww start` (Start Game)", "`!ww ranks` (Check Local Leaderboards)", "`!ww profile [@User (optional)]` (Check how many tokens you or another user have and which countries you or another user have conquered)", "`!ww collect` (Gather Resources)", "`!ww list` (List out all countries)", "`!ww buy <country-name/country-id>` (Conquer a country)", "`!ww give <amount> @User1 @User2` (Give your tokens to another user)", "`!ww info <country-name/country-id>` (Get info of a country)", "`!ww end` (Server owner only)"]
        });
    }

    async run(message, args)
    {
        if(!signedIntoFirebase || !IndexRef.isInit || message.guild == null)
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
                    userFound = true;
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
        
        var existingData = false;
        for(var i = 0; i < wars.length; i++)
        {
            if(wars[i].key == message.guild.id)
            {
                existingData = true;
            }
        }

        var promises = []

        if(!existingData)
        {
            promises.push(firebase.database().ref("serversettings/" + message.guild.id + "/wars").once('value').then(function(snapshot){
                if(snapshot.val() == null)
                {
                    var war = {key: message.guild.id, countries: [], ended: true, ranks: []}
                    wars.push(war);
                    firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(war))
                }
                else
                {
                    var war = JSON.parse(snapshot.val())
                    if(war.ended == true && war.countries != [])
                    {
                        war.countries = []
                        firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(war))
                    }
                    if(war.key != message.guild.id)
                    {
                        war.key = message.guild.id;
                        firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(war))
                    }

                    if(war.countries.length > 0)
                    {
                        if(isNaN(war.countries[0].key))
                        {
                            for(var i = 0; i < war.countries.length; i++)
                            {
                                for(var countryIndex = 0; countryIndex < allCountries.length; countryIndex++)
                                {
                                    if(allCountries[countryIndex].toLowerCase() == war.countries[i].key)
                                    {
                                        war.countries[i].key = countryIndex;
                                    }
                                }
                            }
                            firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(war))
                        }
                    }

                    if(war.ranks.length > 0)
                    {
                        var changesMade = false;
                        for(var i = 0; i < war.ranks.length; i++)
                        {
                            for(var copyIndex = 0; copyIndex < war.ranks.length; copyIndex++)
                            {
                                if(war.ranks[copyIndex].key == war.ranks[i].key && i != copyIndex)
                                {
                                    changesMade = true;
                                    if(war.ranks[copyIndex].wins < war.ranks[i].wins)
                                    {
                                        war.ranks.splice(copyIndex, 1)
                                    }
                                    else
                                    {
                                        war.ranks.splice(i, 1)
                                    }
                                }
                            }
                        }

                        if(changesMade)
                            firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(war))
                    }

                    if(war.listTimestamp == undefined || war.listTimestamp == null || war.listTimestamp == "")
                    {
                        console.log("TIMESTAMP ERROR FOUND")

                        war.listTimestamp = (new Date(Date.now()).toJSON());
                        firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(war))
                    }

                    wars.push(war)
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
                for(var i = 0; i < wars.length; i++)
                {
                    if(wars[i].key == message.guild.id)
                    {
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
                        else if((message.author.id == message.client.owners[0].id || message.author.id == message.client.owners[1].id || message.author.id == message.client.owners[2].id) && args.toLowerCase().startsWith("reset tokens"))
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
                        else if((message.author.id == message.guild.ownerID || message.author.id == message.client.owners[0].id) && args.toLowerCase().startsWith("end"))
                        {
                            wars[i].ended = true;
                            message.channel.send("<@" + message.author.id + "> Ended WW Session").catch(error => {console.log("Send Error - " + error); });
                            firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(wars[i]))
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
    
                        if(wars[i].ended)
                        {
                            if(args.toLowerCase().startsWith("start"))
                            {
                                wars[i].countries = [];
                                wars[i].ended = false;
                                var timestamp = (new Date(Date.now()).toJSON());
                                wars[i].listTimestamp = timestamp
                                message.channel.send("", {embed: {title: "***World War***", description: "New WW session has started.\n\n***Guide:***\nFight to conquer the world. Now that a game has started, it will not end until someone conquers every single country there is.\n\nUsers can conquer countries using War Tokens. Users can also take countries from others with tokens (the value of countries increase based on the number of times it has been conquered).\n\nUsers can gather resources using `" + commandPrefix + "ww collect` to earn War Tokens (the tokens can be used in WW games on other servers) that can be used to conquer different countries. These tokens can also be earned by voting for Slav Bot on discordbots.org (use `" + commandPrefix + "vote` to get the link) or by participating in token giveaways on the support server (use `" + commandPrefix + "support` to get the invite link).\n\nYou can also earn tokens by buying roles on the support server or becoming a patreon supporter and get tokens weekly (use `" + commandPrefix + "patreon` for the patreon link).\n\nYou can also win tokens by using `" + commandPrefix + "dailyspin`.\n\nYou can get info on a country using `" + commandPrefix + "ww info <country-name/country-id>` and conquer any country by using `" + commandPrefix + "ww buy <country-name/country-id>`, you can get a list of all the countries using `" + commandPrefix + "ww list`.\n\nYou can also give your tokens to other users by using `" + commandPrefix + "ww give <amount> @User1 @User2`.\n\nDon't be surprised if this game lasts for weeks, no one said you can conquer the world in a day. You can check your profile using `" + commandPrefix + "ww profile [@User (optional)]` to see how many tokens you or another user have and which countries you or another user have conquered. You can also check the local leaderboards for WW Games using `" + commandPrefix + "ww ranks`.\n\nThe server owner can end a session at any time by using `" + commandPrefix + "ww end`.\n\nGood luck everyone, may the best of you win.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Started on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else if(args.toLowerCase().startsWith("ranks"))
                            {
                                if(wars[i].ranks.length == 0)
                                {
                                    var timestamp = (new Date(Date.now()).toJSON());
                                    message.channel.send("", {embed: {title: "**Local World War Leaderboard for _" + message.guild.name + "_ - Top 10 players :trophy:**",
                                    description: "No winners yet.",
                                    color: 16757505,
                                    timestamp: timestamp,
                                    footer: {
                                      icon_url: message.client.user.avatarURL,
                                      text: "Sent on"
                                    }}}).catch(error => console.log("Send Error - " + error));
                                }
                                else
                                {
                                    var localLeaderboards = wars[i].ranks;
                                    localLeaderboards.sort(rankAscending);
                                    var members = message.guild.members.array();
                                    var names = [];
                        
                                    for(var userIndex = 0; userIndex < localLeaderboards.length; userIndex++)
                                    {
                                        for(var index = 0; index < members.length; index++)
                                        {
                                            if(members[index].id == localLeaderboards[userIndex].key)
                                            {
                                                names.push({name: members[index].user.tag, wins: localLeaderboards[userIndex].wins});
                                            }
                                        }
                                    }
                                    
                                    var descriptionList = "";
                        
                                    var length = names.length;
    
                                    if(length > 10)
                                    {
                                        length = 10;
                                    }
    
                                    for(var rankIndex = 0; rankIndex < length; rankIndex++)
                                    {
                                        descriptionList = descriptionList + (rankEmojis[rankIndex] + "``" + numberWithCommas(names[rankIndex].wins) + "`` - **" + names[rankIndex].name + "**\n");
                                    }
                        
                                    var timestamp = (new Date(Date.now()).toJSON());
                                    message.channel.send("", {embed: {title: "**Local World War Leaderboard for _" + message.guild.name + "_ - Top 10 players :trophy:**",
                                    description: "**Rank** - Wins - Name\n" + descriptionList,
                                    color: 16757505,
                                    timestamp: timestamp,
                                    footer: {
                                      icon_url: message.client.user.avatarURL,
                                      text: "Sent on"
                                    }}}).catch(error => console.log("Send Error - " + error));
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
                                    var winCount = 0
                                
                                    for(var index = 0; index < wars[i].ranks.length; index++)
                                    {
                                        if(wars[i].ranks[index].key == userID)
                                        {
                                            winCount = wars[i].ranks[index].wins;
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
        
                                    if(user != undefined && user != null)
                                    {
                                        var thumbnail = "";
        
                                        if(user.avatarURL != undefined && user.avatarURL != null)
                                            thumbnail = user.avatarURL
            
                                        var timestamp = (new Date(Date.now()).toJSON());
                                        message.channel.send("", {embed: {title: "***Profile for " + user.username + "***", description: user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.\n" + user.username + " has won " + numberWithCommas(winCount) + " times on ***" + message.guild.name + "***.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                    else
                                    {
                                        message.channel.send("<@" + message.author.id + "> User not found on this server.").catch(error => console.log("Send Error - " + error));
                                    }
                                }
                                else
                                {
                                    var winCount = 0
                                
                                    for(var index = 0; index < wars[i].ranks.length; index++)
                                    {
                                        if(wars[i].ranks[index].key == message.author.id)
                                        {
                                            winCount = wars[i].ranks[index].wins;
                                        }
                                    }
                                    
        
                                    var thumbnail = "";
        
                                    if(message.author.avatarURL != undefined && message.author.avatarURL != null)
                                        thumbnail = message.author.avatarURL
        
                                    var timestamp = (new Date(Date.now()).toJSON());
                                    message.channel.send("", {embed: {title: "***Profile for " + message.author.username + "***", description: "You currently have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.\nYou have won " + numberWithCommas(winCount) + " times on ***" + message.guild.name + "***.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                            }
                            else
                            {
                                message.channel.send("<@" + message.author.id + "> There is no on-going WW session. Use `" + commandPrefix + "ww start` to start a new one.").catch(error => {console.log("Send Error - " + error); });
                            }
                        }
                        else
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

                                    for(var index = 0; index < wars[i].countries.length; index++)
                                    {
                                        if(wars[i].countries[index].ruler == message.author.id)
                                        {
                                            if(wars[i].countries[index].value > 1000)
                                            {
                                                const amountRef = wars[i].countries[index].value - 1000
                                                maxPercInc = maxPercInc + (amountRef / 500)
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
    
                                    message.channel.send("", {embed: {title: "***Resources Collected***", description: "<@" + message.author.id + "> You have collected ***" + numberWithCommas(collected) + " tokens***\n\n***Max value increase of " + numberWithCommas(maxPercInc) + "%*** _(current max value: " + numberWithCommas(maxValue) + " tokens)_ - Increase the max amount of tokens you can collect by conquering countries with a value greater than 1,000 tokens.\n\n***Collected Value Increase of " + collectedValInc + "%*** - You can increase the value of tokens you have collected. This is only available to those ***[supporting us on Patreon](https://www.patreon.com/merriemweebster)***.\n\n\n***[Patreon supporters get weekly tokens.](https://www.patreon.com/merriemweebster)***\n\n***[You can also purchase war tokens on our website. Special Weekend Sales for War Tokens every Friday, Saturday and Sunday.](https://slavbot.com/shop)***\n\n***Use `" + commandPrefix + "dailyspin` to get more tokens for free.***\n\n***Vote every day to increase your voting streak and earn even more free tokens, use `" + commandPrefix + "vote` for more info.***", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Collected on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                                else
                                {
                                    message.channel.send("", {embed: {title: "***Cooldown***", description: "<@" + message.author.id + "> You cannot collect more resources until the 2 minute cooldown is over.", color: 65339, timestamp: IndexRef.getCooldown(message.author.id), footer: {icon_url: message.client.user.avatarURL,text: "Cooldown until"}}}).catch(error => console.log("Send Error - " + error));
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
                                                    var isBot = false, notValid = true;
                                                    for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                                                    {
                                                        if(mentions[mentionIndex].id == users[userIndex])
                                                        {
                                                            isBot = mentions[mentionIndex].bot
                                                            notValid = false;
                                                        }
                                                    }
    
                                                    if(users[userIndex] == message.author.id || isBot || notValid)
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
                            else if(args.toLowerCase().startsWith("list"))
                            {
                                var date = new Date(wars[i].listTimestamp)
                                if(wars[i].listTimestamp == null || wars[i].listTimestamp == undefined || wars[i].listTimestamp == "")
                                {
                                    date = new Date()
                                }

                                if(date.getTime() <= (new Date()).getTime())
                                {
                                    var timestamp =  (new Date((new Date).getTime() + 120000));
                                    wars[i].listTimestamp = timestamp.toJSON();

                                    var lists = []
                                    var item = "Country ID - Country - Ruler - Value\n\n"
                                    for(var index = 0; index < allCountries.length; index++)
                                    {
                                        var text = (index + 1) + " - :flag_" + countries.getCode(allCountries[index]).toLowerCase() + ": " + allCountries[index];
                                        var ruledTimes = 0;
                                        var ruled = false;
                                        for(var countryIndex = 0; countryIndex < wars[i].countries.length; countryIndex++)
                                        {
                                            if(wars[i].countries[countryIndex].key == index)
                                            {
                                                if(ruledTimes > 0)
                                                {
                                                    wars[i].countries.splice(countryIndex, 1)
                                                }
                                                else
                                                {
                                                    ruled = true;
                                                    ruledTimes += 1;
                                                    text = text + " - Conquered by <@" +  wars[i].countries[countryIndex].ruler + "> - " + numberWithCommas(wars[i].countries[countryIndex].value) + " tokens"
                                                }
                                            }
                                        }
        
                                        if(!ruled)
                                        {
                                            text = text + " - Not Conquered - 500 tokens"
                                        }
        
                                        if((item + text + "\n").length < 2048)
                                        {
                                            item = item + text + "\n";
                                        }
                                        else
                                        {
                                            lists.push(item);
                                            item = "Country ID - Country - Ruler - Value\n\n" + text + "\n";
                                        }
                                    }
        
                                    if(item != "")
                                    {
                                        lists.push(item)
                                    }
        
                                    var timestamp = (new Date(Date.now()).toJSON());

                                    var members = message.guild.members.array()
                                    for(var memberIndex = 0; memberIndex < members.length; memberIndex++)
                                    {
                                        for(var index = 0; index < lists.length; index++)
                                        {
                                            lists[index] = lists[index].replace(RegExp("<@" + members[memberIndex].id + ">", "g"), members[memberIndex].user.tag)
                                        }
                                    }

                                    for(var index = 0; index < lists.length; index++)
                                    {
                                        message.channel.send("", {embed: {title: "***List of Countries (" + (index + 1) + "/" + lists.length + ")***", description: lists[index], color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }
                                else
                                {
                                    message.channel.send("", {embed: {title: "***List Cooldown***", description: "<@" + message.author.id + "> You cannot request the Country List until the 2 minute cooldown is over. This is to prevent spam during game sessions.", color: 16711680, timestamp: wars[i].listTimestamp, footer: {icon_url: message.client.user.avatarURL,text: "Cooldown until"}}}).catch(error => console.log("Send Error - " + error));
                                } 
                            }
                            else if (args.toLowerCase().startsWith("info "))
                            {
                                var countryName = args.toLowerCase().replace(/info /g, "")
                                var notFound = true;
                                var timestamp = (new Date(Date.now()).toJSON());
                                var countryNumber = -1;
    
                                if(!isNaN(countryName))
                                {
                                    countryNumber = parseInt(countryName) - 1
                                }
    
                                for(var countryIndex = 0; countryIndex < allCountries.length; countryIndex++)
                                {
                                    if(allCountries[countryIndex].toLowerCase() == countryName || countryIndex == countryNumber)
                                    {
                                        notFound = false;
                                        var value = 500;
                                        var ruler = ""
                                        for(var index = 0; index < wars[i].countries.length; index++)
                                        {
                                            if(wars[i].countries[index].key == countryIndex)
                                            {
                                                value = wars[i].countries[index].value;
                                                ruler = wars[i].countries[index].ruler;
                                            }
                                        }
    
                                        if(ruler == "")
                                        {
                                            message.channel.send("", {embed: {title: "***" + allCountries[countryIndex] + "*** :flag_" + countries.getCode(allCountries[countryIndex]).toLowerCase() + ":", description: allCountries[countryIndex] + " has a value of " + numberWithCommas(value) + " tokens.\n" + allCountries[countryIndex] + " has not yet been conquered.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else
                                        {
                                            message.channel.send("", {embed: {title: "***" + allCountries[countryIndex] + "*** :flag_" + countries.getCode(allCountries[countryIndex]).toLowerCase() + ":", description: allCountries[countryIndex] + " has a value of " + numberWithCommas(value) + " tokens.\n" + allCountries[countryIndex] + " has been conquered by <@" + ruler + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                            
                                    }
                                }
    
                                if(notFound)
                                {
                                    message.channel.send("<@" + message.author.id + "> Country not found. Please check the country list and ensure that the Country ID is valid or the name you have given is spelt correctly.").catch(error => console.log("Send Error - " + error));
                                }
                            }
                            else if (args.toLowerCase().startsWith("buy "))
                            {
                                var countryName = args.toLowerCase().replace(/buy /g, "")
                                var notFound = true;
                                var canBuy = true;
                                var timestamp = (new Date(Date.now()).toJSON());
                                var countryNumber = -1;
    
                                if(!isNaN(countryName))
                                {
                                    countryNumber = parseInt(countryName) - 1
                                }
                           
                                for(var countryIndex = 0; countryIndex < allCountries.length; countryIndex++)
                                {
                                    if(allCountries[countryIndex].toLowerCase() == countryName || countryIndex == countryNumber)
                                    {
                                        notFound = false;
                                        var value = 500;
                                        var previousRuler = ""
                                        for(var index = 0; index < wars[i].countries.length; index++)
                                        {
                                            if(wars[i].countries[index].key == countryIndex)
                                            {
                                                value = wars[i].countries[index].value;
                                                if(wars[i].countries[index].ruler == message.author.id)
                                                {
                                                    canBuy = false;
                                                }
                                                else
                                                {
                                                    previousRuler = wars[i].countries[index].ruler
                                                }
                                            }
                                        }
    
                                        if(!canBuy)
                                        {
                                            message.channel.send("", {embed: {title: "***Already Conquered " + allCountries[countryIndex] + "*** :flag_" + countries.getCode(allCountries[countryIndex]).toLowerCase() + ":", description: "<@" + message.author.id + "> You have already conquered " + allCountries[countryIndex], color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else
                                        {
                                            if(!IndexRef.subtractTokens(message.author.id, value))
                                            {
                                                message.channel.send("", {embed: {title: "***Failed to Conquer " + allCountries[countryIndex] + "*** :flag_" + countries.getCode(allCountries[countryIndex]).toLowerCase() + ":", description: "<@" + message.author.id + "> You do not have enough tokens to conquer " + allCountries[countryIndex] + ". You need " + numberWithCommas(value) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            }
                                            else
                                            {
                                                var prevMessage = ""
    
                                                if(previousRuler != "")
                                                {
                                                    prevMessage = " from <@" + previousRuler + ">"
                                                }
                                                
                                                message.channel.send("", {embed: {title: "***Successfully Conquered " + allCountries[countryIndex] + "*** :flag_" + countries.getCode(allCountries[countryIndex]).toLowerCase() + ":", description: "<@" + message.author.id + "> You have conquered " + allCountries[countryIndex] + prevMessage + ". You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                
                                                var countryFound = true;
                                                for(var warCountryIndex = 0; warCountryIndex < wars[i].countries.length; warCountryIndex++)
                                                {
                                                    if(wars[i].countries[warCountryIndex].key == countryIndex)
                                                    {
                                                        countryFound = false;
                                                        wars[i].countries[warCountryIndex].value = wars[i].countries[warCountryIndex].value + 500;
                                                        wars[i].countries[warCountryIndex].ruler = message.author.id;
                                                    }
                                                }
        
                                                if(countryFound)
                                                {
                                                    wars[i].countries.push({key: countryIndex, ruler: message.author.id, value: 1000}) 
                                                }
    
                                                if(previousRuler == "")
                                                {
                                                    if(wars[i].countries.length == allCountries.length)
                                                    {
                                                        message.channel.send("", {embed: {title: "***Last Ruler Standing***", description: "All countries have been conquered. First one to take them all wins.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
    
                                if(notFound)
                                {
                                    message.channel.send("<@" + message.author.id + "> Country not found. Please check the country list and ensure that the Country ID is valid or the name you have given is spelt correctly.").catch(error => console.log("Send Error - " + error));
                                }
                            }
                            else if(args.toLowerCase().startsWith("ranks"))
                            {
                                if(wars[i].ranks.length == 0)
                                {
                                    var timestamp = (new Date(Date.now()).toJSON());
                                    message.channel.send("", {embed: {title: "**Local World War Leaderboard for _" + message.guild.name + "_ - Top 10 players :trophy:**",
                                    description: "No winners yet.",
                                    color: 16757505,
                                    timestamp: timestamp,
                                    footer: {
                                      icon_url: message.client.user.avatarURL,
                                      text: "Sent on"
                                    }}}).catch(error => console.log("Send Error - " + error));
                                }
                                else
                                {
                                    var localLeaderboards = wars[i].ranks;
                                    localLeaderboards.sort(rankAscending);
                                    var members = message.guild.members.array();
                                    var names = [];
                        
                                    for(var userIndex = 0; userIndex < localLeaderboards.length; userIndex++)
                                    {
                                        for(var index = 0; index < members.length; index++)
                                        {
                                            if(members[index].id == localLeaderboards[userIndex].key)
                                            {
                                                names.push({name: members[index].user.tag, wins: localLeaderboards[userIndex].wins});
                                            }
                                        }
                                    }
                                    
                                    var descriptionList = "";
                        
                                    var length = names.length;
    
                                    if(length > 10)
                                    {
                                        length = 10;
                                    }
    
                                    for(var index = 0; index < length; index++)
                                    {
                                        descriptionList = descriptionList + (rankEmojis[index] + "``" + numberWithCommas(names[index].wins) + "`` - **" + names[index].name + "**\n");
                                    }
                        
                                    var timestamp = (new Date(Date.now()).toJSON());
                                    message.channel.send("", {embed: {title: "**Local World War Leaderboard for _" + message.guild.name + "_ - Top 10 players :trophy:**",
                                    description: "**Rank** - Wins - Name\n" + descriptionList,
                                    color: 16757505,
                                    timestamp: timestamp,
                                    footer: {
                                      icon_url: message.client.user.avatarURL,
                                      text: "Sent on"
                                    }}}).catch(error => console.log("Send Error - " + error));
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
                                    var count = 0
    
                                    for(var index = 0; index < wars[i].countries.length; index++)
                                    {
                                        if(wars[i].countries[index].ruler == userID)
                                        {
                                            count += 1;
                                        }
                                    }
    
                                    var winCount = 0
                                
                                    for(var index = 0; index < wars[i].ranks.length; index++)
                                    {
                                        if(wars[i].ranks[index].key == userID)
                                        {
                                            winCount = wars[i].ranks[index].wins;
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
        
                                    if(user != undefined && user != null)
                                    {
                                        var thumbnail = "";
        
                                        if(user.avatarURL != undefined && user.avatarURL != null)
                                            thumbnail = user.avatarURL
            
                                        var timestamp = (new Date(Date.now()).toJSON());
                                        message.channel.send("", {embed: {title: "***Profile for " + user.username + "***", description: user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.\n " + user.username + " has conquered " + count + " countries out of " + allCountries.length + ".\n" + user.username + " has won " + numberWithCommas(winCount) + " times on ***" + message.guild.name + "***.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                    else
                                    {
                                        message.channel.send("<@" + message.author.id + "> User not found on this server.").catch(error => console.log("Send Error - " + error));
                                    }
                                }
                                else
                                {
                                    var count = 0
    
                                    for(var index = 0; index < wars[i].countries.length; index++)
                                    {
                                        if(wars[i].countries[index].ruler == message.author.id)
                                        {
                                            count += 1;
                                        }
                                    }
        
                                    var winCount = 0
        
                                    for(var index = 0; index < wars[i].ranks.length; index++)
                                    {
                                        if(wars[i].ranks[index].key == message.author.id)
                                        {
                                            winCount = wars[i].ranks[index].wins;
                                        }
                                    }
        
                                    var thumbnail = "";
        
                                    if(message.author.avatarURL != undefined && message.author.avatarURL != null)
                                        thumbnail = message.author.avatarURL
        
                                    var timestamp = (new Date(Date.now()).toJSON());
                                    message.channel.send("", {embed: {title: "***Profile for " + message.author.username + "***", description: "You currently have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.\nYou have conquered " + count + " countries out of " + allCountries.length + ".\nYou have won " + numberWithCommas(winCount) + " times on ***" + message.guild.name + "***.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));    
                                }
                            }
                            else
                            {
                                message.channel.send("<@" + message.author.id + "> No parameter given. Use `" + commandPrefix + "help ww` for help.").catch(error => {console.log("Send Error - " + error); });
                            }
    
                            if(wars[i].countries.length >= allCountries.length)
                            {
                                var userID = wars[i].countries[0].ruler;
                                var hasEnded = true;
                                for(var index = 0; index < wars[i].countries.length; index++)
                                {
                                    if(userID != wars[i].countries[index].ruler)
                                    {
                                        hasEnded = false;
                                    }
                                }
    
                                if(hasEnded)
                                {
                                    wars[i].ended = true;
                                    wars[i].countries = [];
                                    var noData = true;
                                    for(var index = 0; index < wars[i].ranks.length; index++)
                                    {
                                        if(userID == wars[i].ranks[index].key)
                                        {
                                            noData = false;
                                            wars[i].ranks[index].wins = wars[i].ranks[index].wins + 1;
                                        }
                                    }
    
                                    if(noData)
                                    {
                                        wars[i].ranks.push({key: userID, wins: 1})
                                    }
    
                                    message.client.fetchUser(userID)
                                    .then(user => {
                                        var thumbnail = "";
    
                                        if(user.avatarURL != undefined && user.avatarURL != null)
                                            thumbnail = user.avatarURL
            
                                        var timestamp = (new Date(Date.now()).toJSON());
                                        message.channel.send("", {embed: {title: "***Game Over***", description: user.tag + " has won the game.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }, rejection => {
                                            console.log(rejection.message);
                                            var timestamp = (new Date(Date.now()).toJSON());
                                            message.channel.send("", {embed: {title: "***Game Over***", description: "<@" + userID + "> has won the game.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    });
                                }  
                            }
                        }
                        firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(wars[i]))
                        return;
                    }
                }

                console.log("WORLD WAR ERROR\n\n\n\n\n\n\n\n\n\nWORLD WAR ERROR")
            })
        })
    }
}

module.exports = WWCommand;