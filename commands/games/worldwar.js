const command = require("discord.js-commando");
var IndexRef = require("../../index.js")
var wars = [{key: "Key", countries: [{key: "Key", ruler: "", value: 500}], ended: false, ranks: [{key: "Key", wins: 0}]}]
var countries = require('country-list')();
var allCountries = countries.getNames();
var firebase = require("firebase");
var signedIntoFirebase = false;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signedIntoFirebase = true;
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
    if (a.tokens < b.tokens)
        return 1;
    if (a.tokens > b.tokens)
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
            description: "Play the World War, where users in a server fight to conquer the world and get higher on the local leaderboards. Once a game has started, it will not end until someone conquers every single country there is. Users can conquer countries using War Tokens. Users can also take countries from others with tokens (the value of countries increase based on the number of times it has been conquered). Users can gather resources to earn War Tokens (the tokens can be used in WW games on other servers) that can be used to conquer different countries. These tokens can also be earned by voting for Slav Bot on discordbots.org or by participating in token giveaways on the support server.",
            examples: ["`!ww start` (Start Game)", "`!ww ranks` (Check Local Leaderboards)", "`!ww profile [@User (optional)]` (Check how many tokens you or another user have and which countries you or another user have conquered)", "`!ww collect` (Gather Resources)", "`!ww list` (List out all countries)", "`!ww buy <country-name>` (Conquer a country)",]
        });
    }

    async run(message, args)
    {
        if(!signedIntoFirebase || message.guild == null)
            return;
            
        IndexRef.addCommandCounter(message.author.id);
        
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
                    wars.push(war)
                }
            }))
        }

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        Promise.all(promises).then(() => {
            for(var i = 0; i < wars.length; i++)
            {
                if(wars[i].key == message.guild.id)
                {
                    if(message.author.id == message.client.owners[0].id && args.toLowerCase().startsWith("generate"))
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

                        var amount = options.match(/\d+/g).map(Number);
                        
                        if(amount.length > 0)
                        {
                            amount = amount[0]
                        }
                        else
                        {
                            return;
                        }

                        if(users.length > 0)
                        {
                            for(var userIndex = 0; userIndex < users.length; userIndex++)
                            {
                                IndexRef.addTokens(users[userIndex], amount)
                                message.channel.send("<@" + users[userIndex] + "> has been given " + numberWithCommas(amount) + " tokens").catch(error => {console.log("Send Error - " + error); });   
                            }
                        }
                        return;
                    }
                    else if(message.author.id == message.client.owners[0].id && args.toLowerCase() == "end")
                    {
                        wars[i].ended = true;
                        message.channel.send("<@" + message.author.id + "> Ended WW Session").catch(error => {console.log("Send Error - " + error); });
                        return;
                    }

                    if(wars[i].ended)
                    {
                        if(args.toLowerCase() == "start")
                        {
                            wars[i].countries = [];
                            wars[i].ended = false;
                            var timestamp = (new Date(Date.now()).toJSON());
                            message.channel.send("", {embed: {title: "***World War***", description: "New WW session has started.\n\n***Guide:***\nFight to conquer the world. Now that a game has started, it will not end until someone conquers every single country there is.\n\nUsers can conquer countries using War Tokens. Users can also take countries from others with tokens (the value of countries increase based on the number of times it has been conquered).\n\nUsers can gather resources using `" + commandPrefix + "ww collect` to earn War Tokens (the tokens can be used in WW games on other servers) that can be used to conquer different countries. These tokens can also be earned by voting for Slav Bot on discordbots.org (use `" + commandPrefix + "vote` to get the link) or by participating in token giveaways on the support server (use `" + commandPrefix + "support` to get the invite link).\n\nYou can conquer any country by using `" + commandPrefix + "ww buy <country-name>`, you can get a list of all the countries using `" + commandPrefix + "ww list`.\n\nDon't be surprised if this game lasts for weeks, no one said you can conquer the world in a day. You can check your profile using `" + commandPrefix + "ww profile` to see how many tokens you have and which countries you have conquered. You can also check the local leaderboards for WW Games using `" + commandPrefix + "ww ranks`.\n\nGood luck everyone, may the best of you win.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Started on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                        else if(args.toLowerCase() == "ranks")
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
                                var localLeaderboards = wars[i].ranks.sort(rankAscending);
                                var members = message.guild.members.array();
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
                    
                                var length = localLeaderboards.length;

                                if(length > 10)
                                {
                                    length = 10;
                                }

                                for(var i = 0; i < length; i++)
                                {
                                    descriptionList = descriptionList + (rankEmojis[i] + "``" + numberWithCommas(localLeaderboards[i].tokens) + "`` - **" + names[i] + "**\n");
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
                        else if(args.toLowerCase() == "profile")
                        {
                            var otherUser = false;
                            var userID = "";

                            if(args.length > 0)
                            {
                                var getUser = false;
                                for(var i = 0; i < args.length; i++)
                                {
                                    if(getUser)
                                    {
                                        if(args[i].toString() == ">")
                                        {
                                            i = args.length;
                                            otherUser = true;
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
    
                                var thumbnail = "";
    
                                if(user.avatarURL != undefined && user.avatarURL != null)
                                    thumbnail = user.avatarURL
    
                                var timestamp = (new Date(Date.now()).toJSON());
                                message.channel.send("", {embed: {title: "***Profile for " + user.username + "***", description: user.username + " currently has " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.\n" + user.username + " has won " + numberWithCommas(winCount) + " times on ***" + message.guild.name + "***.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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
                        if(args.toLowerCase() == "collect")
                        {  
                            const date = new Date(IndexRef.getCooldown(message.author.id))

                            if(date.getTime() <= (new Date()).getTime())
                            {
                                var collected = Math.floor(Math.random() * 2000) + 1
                                var timestamp = (new Date(Date.now()).toJSON());

                                IndexRef.addTokens(message.author.id, collected)
                                IndexRef.setCooldown(message.author.id, (new Date((new Date).getTime() + 120000)))

                                message.channel.send("", {embed: {title: "***Resources Collected***", description: "<@" + message.author.id + "> You have collected " + numberWithCommas(collected) + " tokens.", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Collected on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                message.channel.send("", {embed: {title: "***Cooldown***", description: "<@" + message.author.id + "> You cannot collect more resources until the 2 minute cooldown is over.", color: 65339, timestamp: IndexRef.getCooldown(message.author.id), footer: {icon_url: message.client.user.avatarURL,text: "Cooldown until"}}}).catch(error => console.log("Send Error - " + error));
                            }
                                
                            
                        }
                        else if(args.toLowerCase() == "list")
                        {
                            var lists = []
                            var item = "Country - Ruler - Value\n\n"
                            for(var index = 0; index < allCountries.length; index++)
                            {
                                var text = ":flag_" + countries.getCode(allCountries[index]).toLowerCase() + ": " + allCountries[index];
                                var ruledTimes = 0;
                                var ruled = false;
                                for(var countryIndex = 0; countryIndex < wars[i].countries.length; countryIndex++)
                                {
                                    if(wars[i].countries[countryIndex].key == allCountries[index].toLowerCase())
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
                                    item = "Country - Ruler - Value\n\n" + text + "\n";
                                }
                            }

                            if(item != "")
                            {
                                lists.push(item)
                            }

                            var timestamp = (new Date(Date.now()).toJSON());
                            for(var index = 0; index < lists.length; index++)
                            {
                                message.channel.send("", {embed: {title: "***List of Countries (" + (index + 1) + "/" + lists.length + ")***", description: lists[index], color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else if (args.toLowerCase().startsWith("buy "))
                        {
                            var countryName = args.toLowerCase().replace(/buy /g, "")
                            var notFound = true;
                            var canBuy = true;
                            var timestamp = (new Date(Date.now()).toJSON());
                            for(var countryIndex = 0; countryIndex < allCountries.length; countryIndex++)
                            {
                                if(allCountries[countryIndex].toLowerCase() == countryName)
                                {
                                    notFound = false;
                                    var value = 500;
                                    var previousRuler = ""
                                    for(var index = 0; index < wars[i].countries.length; index++)
                                    {
                                        if(wars[i].countries[index].key == allCountries[countryIndex].toLowerCase())
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
                                                if(wars[i].countries[warCountryIndex].key == allCountries[countryIndex].toLowerCase())
                                                {
                                                    countryFound = false;
                                                    wars[i].countries[warCountryIndex].value = wars[i].countries[warCountryIndex].value + 500;
                                                    wars[i].countries[warCountryIndex].ruler = message.author.id;
                                                }
                                            }
    
                                            if(countryFound)
                                            {
                                                wars[i].countries.push({key: allCountries[countryIndex].toLowerCase(), ruler: message.author.id, value: 1000}) 
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
                                message.channel.send("<@" + message.author.id + "> Country not found. Please check the country list and ensure that the name you have given is spelt correctly.").catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else if(args.toLowerCase() == "ranks")
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
                                var localLeaderboards = wars[i].ranks.sort(rankAscending);
                                var members = message.guild.members.array();
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
                    
                                var length = localLeaderboards.length;

                                if(length > 10)
                                {
                                    length = 10;
                                }

                                for(var i = 0; i < length; i++)
                                {
                                    descriptionList = descriptionList + (rankEmojis[i] + "``" + numberWithCommas(localLeaderboards[i].tokens) + "`` - **" + names[i] + "**\n");
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
                        else if(args.toLowerCase() == "profile")
                        {
                            var otherUser = false;
                            var userID = "";

                            if(args.length > 0)
                            {
                                var getUser = false;
                                for(var i = 0; i < args.length; i++)
                                {
                                    if(getUser)
                                    {
                                        if(args[i].toString() == ">")
                                        {
                                            i = args.length;
                                            otherUser = true;
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
    
                                var thumbnail = "";
    
                                if(user.avatarURL != undefined && user.avatarURL != null)
                                    thumbnail = user.avatarURL
    
                                var timestamp = (new Date(Date.now()).toJSON());
                                message.channel.send("", {embed: {title: "***Profile for " + user.username + "***", description: user.username + " currently has " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.\n " + user.username + " has conquered " + count + " countries out of " + allCountries.length + ".\n" + user.username + " has won " + numberWithCommas(winCount) + " times on ***" + message.guild.name + "***.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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

                        if(wars[i].countries.length == allCountries.length)
                        {
                            var userID = wars[i].countries[0].key;
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
                                    wars[i].ranks[index].push({key: userID, wins: 1})
                                }

                                message.client.fetchUser(userID)
                                .then(user => {
                                    var thumbnail = "";

                                    if(user.avatarURL != undefined && user.avatarURL != null)
                                        thumbnail = user.avatarURL
        
                                    var timestamp = (new Date(Date.now()).toJSON());
                                    message.channel.send("", {embed: {title: "***Game Over***", description: user.username + " has won the game.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }, rejection => {
                                        console.log(rejection.message);
                                        var timestamp = (new Date(Date.now()).toJSON());
                                        message.channel.send("", {embed: {title: "***Game Over***", description: "<@" + userID + "> has won the game.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                });
                            }
                        }
                    }
                    firebase.database().ref("serversettings/" + message.guild.id + "/wars").set(JSON.stringify(wars[i]))
                }
            }
        })
    }
}

module.exports = WWCommand;