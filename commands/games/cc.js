const command = require("discord.js-commando");
var IndexRef = require("../../index.js")
var characters = [{id: "", bronze: [{id: "", amount: 0}], silver: [], gold: [], platinum: [], trades: [{user: "", send: {rank: "", id: ""}, take: {rank: "", id: ""}}]}];
var firebase = require("firebase");
var signedIntoFirebase = false;
var listening = false;
var patrons = [{userID: "", type: 0}];
const rankEmojis = [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":poop:"]
var dataInit = false;

var database = []
const fs = require('fs')
database = JSON.parse(fs.readFileSync("characters.json"))

const bronzePrice = 10000, silverPrice = 100000, goldPrice = 1000000, platinumPrice = 10000000;

function rankAscending(a, b)
{
    if (a.characterCount < b.characterCount)
        return 1;
    if (a.characterCount > b.characterCount)
        return -1;
    return 0;
}

function rankAscendingIDs(a, b)
{
    if (parseInt(a.id) > parseInt(b.id))
        return 1;
    if (parseInt(a.id) < parseInt(b.id))
        return -1;
    return 0;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signedIntoFirebase = true;

        if(!listening)
        {
            characters = []
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

            firebase.database().ref("characters").on('child_added', function(snapshot){
                if(snapshot.val() != null)
                {
                    var character = JSON.parse(snapshot.val())
                    characters.push(character)
                }
            })

            firebase.database().ref("characters").on('child_changed', function(snapshot){
                if(snapshot.val() != null)
                {
                    for(var i = 0; i < characters.length; i++)
                    {
                        if(characters[i].id == snapshot.key)
                        {
                            characters[i] = JSON.parse(snapshot.val())
                        }
                    }
                }
            })

            firebase.database().ref("characters").on('child_removed', function(snapshot){
                for(var i = 0; i < characters.length; i++)
                {
                    if(characters[i].id == snapshot.key)
                    {
                        characters.splice(i, 1)
                    }
                }
            })

            firebase.database().ref("characters").on('value', function(snapshot){
                dataInit = true;
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

const maxID = 731;

class CCCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "cc",
            group: "games",
            memberName: "cc",
            description: "Play Calmaity Cards, where you purchase various characters of different ranks, including heroes and villains from various universes such as the Marvel and DC universes. Buy character packs to collect all the unique characters. Try your best to get as many platinum characters as you can to increase your rank. Sell your characters to earn tokens. These tokens can also be earned by voting for Slav Bot on discordbots.org or by participating in token giveaways on the support server. You can also earn tokens by buying roles on the support server or becoming a patreon supporter and get tokens weekly.",
            examples: ["`!cc profile` (Check your profile and various stats)", "`!cc collect` (Gather Card Trading Resources)", "`!cc profile @User` (Check another user's profile and various stats)", "`!cc buy <package-rank>` (Buy character packs for various card ranks - Bronze, Silver, Gold and Platinum)", "`!cc buy platinum <character-id>` (Buy a Platinum character, for more info use `!cc buy`)", "`!cc sell <character-rank> <character-id>` (Sell a character from your inventory)", "`!cc send <character-rank> <character-id> @User` (Send a character from your inventory to another user)", "`!cc info <character-id>` (View details on a character)", "`!cc ranks` (Check Global Leaderboards)", "`!cc give <amount> @User1 @User2` (Give your tokens to another user)", "`!cc list` (Gives a list of characters you own)"]
        });
    }

    async run(message, args)
    {
        if(!signedIntoFirebase)
            return;

        if(!dataInit)
        {
            message.channel.send("Slav Bot recently restarted, Calamity Cards is loading.").catch((error) => {console.log("Send Error - " + error)})
            return;
        }

        var existingData = false;

        for(var i = 0; i < characters.length; i++)
        {
            if(characters[i].id == message.author.id)
            {
                existingData = true;
            }
        }

        if(!existingData)
        {
            characters.push({id: message.author.id, bronze: [], silver: [], gold: [], platinum: [], trades: []})
        }
            
        IndexRef.addCommandCounter(message.author.id);

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        setImmediate(() => {
            for(var i = 0; i < characters.length; i++)
            {
                if(characters[i].id == message.author.id)
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
                        IndexRef.resetTokens(100000000000)
                        message.channel.send("<@" + message.author.id + "> Tokens have been globally reset.")
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

                            for(var charIndex = 0; charIndex < characters[i].bronze.length; charIndex++)
                            {
                                maxPercInc = maxPercInc + 1
                            }

                            for(var charIndex = 0; charIndex < characters[i].silver.length; charIndex++)
                            {
                                maxPercInc = maxPercInc + 10
                            }

                            for(var charIndex = 0; charIndex < characters[i].gold.length; charIndex++)
                            {
                                maxPercInc = maxPercInc + 100
                            }

                            for(var charIndex = 0; charIndex < characters[i].platinum.length; charIndex++)
                            {
                                maxPercInc = maxPercInc + 1000
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
                            IndexRef.setCooldown(message.author.id, (new Date((new Date()).getTime() + 120000)))

                            message.channel.send("", {embed: {title: "***Calamity Card Trading Resources Collected***", description: "<@" + message.author.id + "> You have collected ***" + numberWithCommas(collected) + " tokens***\n\n***Max value increase of " + numberWithCommas(maxPercInc) + "%*** _(current max value: " + numberWithCommas(maxValue) + " tokens)_ - Increase the max amount of tokens you can collect by collecting more characters. Higher ranking cards means more resources.\n\n***Collected Value Increase of " + collectedValInc + "%*** - You can increase the value of tokens you have collected. This is only available to those ***[supporting us on Patreon](https://www.patreon.com/merriemweebster)***.\n\n\n***[Patreon supporters get weekly tokens.](https://www.patreon.com/merriemweebster)***\n\n***[You can also purchase war tokens on our website. Special Weekend Sales for War Tokens every Friday, Saturday and Sunday.](https://slavbot.com/shop)***\n\n***Use `" + commandPrefix + "dailyspin` to get more tokens for free.***\n\n***Vote every day to increase your voting streak and earn even more free tokens, use `" + commandPrefix + "vote` for more info.***", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Collected on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            message.channel.send("", {embed: {title: "***Cooldown***", description: "<@" + message.author.id + "> You cannot collect more calamity card trading resources until the 2 minute cooldown is over.", color: 65339, timestamp: IndexRef.getCooldown(message.author.id), footer: {icon_url: message.client.user.avatarURL,text: "Cooldown until"}}}).catch(error => console.log("Send Error - " + error));
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
                   /* else if (args.toLowerCase().startsWith("trade"))
                    {
                        var timestamp = (new Date(Date.now()).toJSON());

                        if(args.toLowerCase().startsWith("trade accept"))
                        {
                            var mentions = message.mentions.users.array()
                            var requestUser = ""
                            for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                            {
                                if(!mentions[mentionIndex].isBot && mentions[mentionIndex].id != message.author.id)
                                {
                                    for(var characterIndex = 0; characterIndex < characters[i].users.length; characterIndex++)
                                    {
                                        if(characters[i].users[characterIndex].id == mentions[mentionIndex].id)
                                        {
                                            if(requestUser == "")
                                            {
                                                requestUser = characters[i].users[characterIndex].id
                                            }
                                        }
                                    }
                                }
                            }

                            if(requestUser == "")
                            {
                                message.channel.send("", {embed: {title: "***No User Tagged***", description: "<@" + message.author.id + "> Please tag a user who has sent a request to you.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                for(var characterIndex = 0; characterIndex < characters[i].users.length; characterIndex++)
                                {
                                    if(characters[i].users[characterIndex].id == message.author.id)
                                    {
                                        if(characters[i].users[characterIndex].requests == null || characters[i].users[characterIndex].requests == undefined)
                                        {
                                            message.channel.send("", {embed: {title: "***No Trade Requests Given***", description: "<@" + message.author.id + "> You do not have any trade requests from other users.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else
                                        {
                                            var requestFound = false;
                                            var notValid = false;
                                            var indexToRemove = -1;
                                            for(var requestIndex = 0; requestIndex < characters[i].users[characterIndex].requests.length; requestIndex++)
                                            {
                                                if(characters[i].users[characterIndex].requests[requestIndex].user == requestUser)
                                                {
                                                    requestFound = true;

                                                    for(var characterIndex2 = 0; characterIndex2 < characters[i].users.length; characterIndex2++)
                                                    {
                                                        if(characters[i].users[characterIndex2].id == characters[i].users[characterIndex].requests[requestIndex].characterGiven)
                                                        {
                                                            if(characters[i].users[characterIndex2].owner != requestUser)
                                                                notValid = true;
                                                        }
                                                        else if(characters[i].users[characterIndex2].id == characters[i].users[characterIndex].requests[requestIndex].characterTaken)
                                                        {
                                                            if(characters[i].users[characterIndex2].owner != message.author.id)
                                                                notValid = true;
                                                        }
                                                    }

                                                    if(notValid)
                                                    {
                                                        message.channel.send("<@" + message.author.id + "> The trade request is no longer valid.", {embed: {title: "***Trade Request Invalid***", description: "The trade request of <@" + requestUser + "> is invalid as the owners of one or more of the characters have changed.", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                    }
                                                    else
                                                    {
                                                        for(var characterIndex2 = 0; characterIndex2 < characters[i].users.length; characterIndex2++)
                                                        {
                                                            if(characters[i].users[characterIndex2].id == characters[i].users[characterIndex].requests[requestIndex].characterGiven)
                                                            {
                                                                characters[i].users[characterIndex2].owner = message.author.id
                                                            }
                                                            else if(characters[i].users[characterIndex2].id == characters[i].users[characterIndex].requests[requestIndex].characterTaken)
                                                            {
                                                                characters[i].users[characterIndex2].owner = requestUser
                                                            }
                                                        }
                                                        message.channel.send("<@" + requestUser + "> now owns <@" + characters[i].users[characterIndex].requests[requestIndex].characterTaken + ">\n<@" + message.author.id + "> now owns <@" + characters[i].users[characterIndex].requests[requestIndex].characterGiven + ">", {embed: {title: "***Trade Request Accepted***", description: "<@" + message.author.id + "> has accepted the trade request of <@" + requestUser + ">", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                    }
                                                    
                                                    indexToRemove = requestIndex
                                                }
                                            }

                                            if(!requestFound)
                                                message.channel.send("", {embed: {title: "***No Trade Request Found***", description: "<@" + message.author.id + "> You do not have any trade requests from <@" + requestUser + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            else
                                            {
                                                var newRequests = []
                                                for(var requestIndex = 0; requestIndex < characters[i].users[characterIndex].requests.length; requestIndex++)
                                                {
                                                    if(requestIndex != indexToRemove)
                                                    {
                                                        newRequests.push(characters[i].users[characterIndex].requests[requestIndex])
                                                    }
                                                }

                                                characters[i].users[characterIndex].requests = newRequests
                                            }
                                        }
                                    }
                                } 
                            }
                        }
                        else if(args.toLowerCase().startsWith("trade decline"))
                        {
                            var mentions = message.mentions.users.array()
                            var requestUser = ""
                            for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                            {
                                if(!mentions[mentionIndex].isBot && mentions[mentionIndex].id != message.author.id)
                                {
                                    for(var characterIndex = 0; characterIndex < characters[i].users.length; characterIndex++)
                                    {
                                        if(characters[i].users[characterIndex].id == mentions[mentionIndex].id)
                                        {
                                            if(requestUser == "")
                                            {
                                                requestUser = characters[i].users[characterIndex].id
                                            }
                                        }
                                    }
                                }
                            }

                            if(requestUser == "")
                            {
                                message.channel.send("", {embed: {title: "***No User Tagged***", description: "<@" + message.author.id + "> Please tag a user who has sent a request to you.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                for(var characterIndex = 0; characterIndex < characters[i].users.length; characterIndex++)
                                {
                                    if(characters[i].users[characterIndex].id == message.author.id)
                                    {
                                        if(characters[i].users[characterIndex].requests == null || characters[i].users[characterIndex].requests == undefined)
                                        {
                                            message.channel.send("", {embed: {title: "***No Trade Requests Given***", description: "<@" + message.author.id + "> You do not have any trade requests from other users.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else
                                        {
                                            var requestFound = false;
                                            var indexToRemove = -1;

                                            for(var requestIndex = 0; requestIndex < characters[i].users[characterIndex].requests.length; requestIndex++)
                                            {
                                                if(characters[i].users[characterIndex].requests[requestIndex].user == requestUser)
                                                {
                                                    requestFound = true;
                                                    message.channel.send("<@" + requestUser + ">", {embed: {title: "***Trade Request Denied***", description: "<@" + message.author.id + "> has denied the trade request of <@" + requestUser + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                    indexToRemove = requestIndex
                                                }
                                            }

                                            if(!requestFound)
                                                message.channel.send("", {embed: {title: "***No Trade Request Found***", description: "<@" + message.author.id + "> You do not have any trade requests from <@" + requestUser + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            else
                                            {
                                                var newRequests = []
                                                for(var requestIndex = 0; requestIndex < characters[i].users[characterIndex].requests.length; requestIndex++)
                                                {
                                                    if(requestIndex != indexToRemove)
                                                    {
                                                        newRequests.push(characters[i].users[characterIndex].requests[requestIndex])
                                                    }
                                                }

                                                characters[i].users[characterIndex].requests = newRequests
                                            }
                                        }
                                    }
                                } 
                            }
                        }
                        else if(args.toLowerCase().startsWith("trade list"))
                        {
                            if(characters[i].trades == null || characters[i].trades == undefined || characters[i].trades.length == 0)
                            {
                                message.channel.send("", {embed: {title: "***No Trade Requests Given***", description: "<@" + message.author.id + "> You do not have any trade requests from other users.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                var lists = []
                                var item = ""

                                var name = "ID - " + ID
                                for(var index = 0; index < database.length; index++)
                                {
                                    if(database[index].id == ID)
                                    {
                                        name = database[index].name
                                    }
                                }

                                for(var requestIndex = 0; requestIndex < characters[i].trades.length; requestIndex++)
                                {
                                    var text = "***Trade Request No." + (requestIndex + 1) + "***\n<@" + characters[i].trades[requestIndex].user + "> has requested to trade a " + characters[i].trades[requestIndex].send.rank + " " + characters[i].trades[requestIndex].send.id + " for <@" + characters[i].users[characterIndex].requests[requestIndex].characterGiven + ">"
                                    if((item + text + "\n\n").length < 2048)
                                    {
                                        item = item + text + "\n\n";
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
                                
                                if(lists.length == 0)
                                {
                                    message.channel.send("", {embed: {title: "***No Trade Requests Given***", description: "<@" + message.author.id + "> You do not have any trade requests from other users.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                                else
                                {
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
                                        message.channel.send("<@" + message.author.id + ">", {embed: {title: "***List of Trade Requests (" + (index + 1) + "/" + lists.length + ")***", description: lists[index], color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }
                            }
                        }
                        else
                        {
                            var mentions = message.mentions.users.array()
                            var selfcharacter = "", othercharacter = "", othercharacterOwner = ""

                            for(var mentionIndex = 0; mentionIndex < mentions.length; mentionIndex++)
                            {
                                if(!mentions[mentionIndex].isBot)
                                {
                                    for(var characterIndex = 0; characterIndex < characters[i].users.length; characterIndex++)
                                    {
                                        if(characters[i].users[characterIndex].id == mentions[mentionIndex].id)
                                        {
                                            if(characters[i].users[characterIndex].owner == message.author.id && selfcharacter == "")
                                                selfcharacter = characters[i].users[characterIndex].id

                                            if(characters[i].users[characterIndex].owner != message.author.id 
                                                && characters[i].users[characterIndex].owner != "" && othercharacter == "")
                                            {
                                                othercharacter = characters[i].users[characterIndex].id; 
                                                othercharacterOwner = characters[i].users[characterIndex].owner;
                                            }  
                                        }
                                    }
                                }
                            }

                            if(selfcharacter == "" || othercharacter == "" || selfcharacter == othercharacterOwner)
                            {
                                message.channel.send("", {embed: {title: "***Trade Details Not Given***", description: "<@" + message.author.id + "> You must tag a character you own, then another characterd owned by another user in order to send a trade request.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                for(var characterIndex = 0; characterIndex < characters[i].users.length; characterIndex++)
                                {
                                    if(characters[i].users[characterIndex].id == othercharacterOwner)
                                    {
                                        if(characters[i].users[characterIndex].requests == null || characters[i].users[characterIndex].requests == undefined)
                                        {
                                            characters[i].users[characterIndex].requests = [{user: message.author.id, characterGiven: selfcharacter, characterTaken: othercharacter}]
                                        }
                                        else
                                        {
                                            var notReplaced = true;
                                            for(var requestIndex = 0; requestIndex < characters[i].users[characterIndex].requests.length; requestIndex++)
                                            {
                                                if(characters[i].users[characterIndex].requests[requestIndex].user == message.author.id)
                                                {
                                                    notReplaced = false;
                                                    characters[i].users[characterIndex].requests[requestIndex] = {user: message.author.id, characterGiven: selfcharacter, characterTaken: othercharacter}
                                                }
                                            }

                                            if(notReplaced)
                                                characters[i].users[characterIndex].requests.push({user: message.author.id, characterGiven: selfcharacter, characterTaken: othercharacter})
                                        }
                                    }
                                }
                                message.channel.send(`<@${message.author.id}> has sent a trade request to <@${othercharacterOwner}>`, {embed: {title: "***Trade Request Sent***", description: "<@" + othercharacterOwner + "> You have been sent a trade request from <@" + message.author.id + "> to trade your character <@" + othercharacter + "> for <@" + selfcharacter + ">\n\nTo accept this trade, use the command `" + commandPrefix + "cc accept @" + message.author.tag + "` and to decline, use the command `" + commandPrefix + "cc decline @" + message.author.tag + "`\n\nThis trade request is undoable and can be accepted/denied by the receiver at any moment.", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                    }*/
                    else if (args.toLowerCase().startsWith("buy bronze"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());
                        
                        if(!IndexRef.subtractTokens(message.author.id, bronzeAmount))
                        {
                            message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Failed To Buy Bronze Pack***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase a Bronze Character Pack. You need " + numberWithCommas(bronzeAmount) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {                                                
                            var ID = (Math.floor(Math.random() * maxID) + 1).toString();
                            var name = "ID - " + ID
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    name = database[index].name
                                }
                            }

                            var added = false;
                            for(var characterIndex = 0; characterIndex < characters[i].bronze.length; characterIndex++)
                            {
                                if(characters[i].bronze[characterIndex].id == ID)
                                {
                                    added = true;
                                    characters[i].bronze[characterIndex].amount = characters[i].bronze[characterIndex].amount + 1;
                                }
                            }

                            if(!added)
                                characters[i].bronze.push({id: ID, amount: 1});

                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    var details = "";
                                    var bronzeAmount = 0, silverAmount = 0, goldAmount = 0, platinumAmount = 0;

                                    for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                    {
                                        if(characters[i].bronze[cIndex].id == ID)
                                        {
                                            bronzeAmount = characters[i].bronze[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                    {
                                        if(characters[i].silver[cIndex].id == ID)
                                        {
                                            silverAmount = characters[i].silver[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                    {
                                        if(characters[i].gold[cIndex].id == ID)
                                        {
                                            goldAmount = characters[i].gold[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                    {
                                        if(characters[i].platinum[cIndex].id == ID)
                                        {
                                            platinumAmount = characters[i].platinum[cIndex].amount
                                        }
                                    }

                                    details = "Bronze Versions Owned: " + numberWithCommas(bronzeAmount) 
                                    + "\nSilver Versions Owned: " + numberWithCommas(silverAmount)
                                    + "\nGold Versions Owned: " + numberWithCommas(goldAmount) 
                                    + "\n Platinum Versions Owned: " + numberWithCommas(platinumAmount) + "\n\nFor more detailed info on this character, use `" + commandPrefix + "cc info " + ID + "`."

                                    message.channel.send("<@" + message.author.id + "> ***Bronze Character Pack Purchased***", {embed: {title: "***You Have Found A Bronze Ranked " + database[index].name + " - " + database[index].id + "***", description: details, color: 13070337, timestamp: timestamp, image: {url: database[index].image.url}, thumbnail: {url: database[index].image.url}, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                            }
                        }
                    }
                    else if (args.toLowerCase().startsWith("buy silver"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());
                        
                        if(!IndexRef.subtractTokens(message.author.id, silverAmount))
                        {
                            message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Failed To Buy Silver Pack***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase a Silver Character Pack. You need " + numberWithCommas(silverAmount) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {                                                
                            var ID = (Math.floor(Math.random() * maxID) + 1).toString();
                            var name = "ID - " + ID
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    name = database[index].name
                                }
                            }

                            var added = false;
                            for(var characterIndex = 0; characterIndex < characters[i].silver.length; characterIndex++)
                            {
                                if(characters[i].silver[characterIndex].id == ID)
                                {
                                    added = true;
                                    characters[i].silver[characterIndex].amount = characters[i].silver[characterIndex].amount + 1;
                                }
                            }

                            if(!added)
                                characters[i].silver.push({id: ID, amount: 1});

                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    var details = "";
                                    var bronzeAmount = 0, silverAmount = 0, goldAmount = 0, platinumAmount = 0;

                                    for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                    {
                                        if(characters[i].bronze[cIndex].id == ID)
                                        {
                                            bronzeAmount = characters[i].bronze[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                    {
                                        if(characters[i].silver[cIndex].id == ID)
                                        {
                                            silverAmount = characters[i].silver[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                    {
                                        if(characters[i].gold[cIndex].id == ID)
                                        {
                                            goldAmount = characters[i].gold[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                    {
                                        if(characters[i].platinum[cIndex].id == ID)
                                        {
                                            platinumAmount = characters[i].platinum[cIndex].amount
                                        }
                                    }

                                    details = "Bronze Versions Owned: " + numberWithCommas(bronzeAmount) 
                                    + "\nSilver Versions Owned: " + numberWithCommas(silverAmount)
                                    + "\nGold Versions Owned: " + numberWithCommas(goldAmount) 
                                    + "\n Platinum Versions Owned: " + numberWithCommas(platinumAmount) + "\n\nFor more detailed info on this character, use `" + commandPrefix + "cc info " + ID + "`."

                                    message.channel.send("<@" + message.author.id + "> ***Silver Character Pack Purchased***", {embed: {title: "***You Have Found A Silver Ranked " + database[index].name + " - " + database[index].id + "***", description: details, color: 7566195, timestamp: timestamp, image: {url: database[index].image.url}, thumbnail:{url: database[index].image.url}, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                            }
                        }
                    }
                    else if (args.toLowerCase().startsWith("buy gold"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());
                        
                        if(!IndexRef.subtractTokens(message.author.id, goldAmount))
                        {
                            message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Failed To Buy Gold Pack***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase a Gold Character Pack. You need " + numberWithCommas(goldAmount) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {                                                
                            var ID = (Math.floor(Math.random() * maxID) + 1).toString();
                            var name = "ID - " + ID
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    name = database[index].name
                                }
                            }

                            var added = false;
                            for(var characterIndex = 0; characterIndex < characters[i].gold.length; characterIndex++)
                            {
                                if(characters[i].gold[characterIndex].id == ID)
                                {
                                    added = true;
                                    characters[i].gold[characterIndex].amount = characters[i].gold[characterIndex].amount + 1;
                                }
                            }

                            if(!added)
                                characters[i].gold.push({id: ID, amount: 1});

                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    var details = "";
                                    var bronzeAmount = 0, silverAmount = 0, goldAmount = 0, platinumAmount = 0;

                                    for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                    {
                                        if(characters[i].bronze[cIndex].id == ID)
                                        {
                                            bronzeAmount = characters[i].bronze[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                    {
                                        if(characters[i].silver[cIndex].id == ID)
                                        {
                                            silverAmount = characters[i].silver[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                    {
                                        if(characters[i].gold[cIndex].id == ID)
                                        {
                                            goldAmount = characters[i].gold[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                    {
                                        if(characters[i].platinum[cIndex].id == ID)
                                        {
                                            platinumAmount = characters[i].platinum[cIndex].amount
                                        }
                                    }

                                    details = "Bronze Versions Owned: " + numberWithCommas(bronzeAmount) 
                                    + "\nSilver Versions Owned: " + numberWithCommas(silverAmount)
                                    + "\nGold Versions Owned: " + numberWithCommas(goldAmount) 
                                    + "\n Platinum Versions Owned: " + numberWithCommas(platinumAmount) + "\n\nFor more detailed info on this character, use `" + commandPrefix + "cc info " + ID + "`."

                                    message.channel.send("<@" + message.author.id + "> ***Gold Character Pack Purchased***", {embed: {title: "***You Have Found A Gold Ranked " + database[index].name + " - " + database[index].id + "***", description: details, color: 16436562, timestamp: timestamp, thumbnail:{url: database[index].image.url}, image: {url: database[index].image.url}, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                            }
                        }
                    }
                    else if (args.toLowerCase().startsWith("buy platinum"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());

                        var options = args.toString().replace(/,/g, "")
                        var amountText = options.match(/\d+/g);
                        var amount = []
                        var ID = "";
                        if(amountText != null)
                        {
                            amount = amountText.map(Number);
                        }

                        var validID = false;

                        if(amount.length > 0)
                        {
                            ID = amount[0].toString()

                            if(ID >= 1 && ID <= maxID)
                                validID = true;
                        }

                        if(validID)
                        {
                            var bronzeFound = false, silverFound = false, goldFound = false;

                            for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                            {
                                if(characters[i].bronze[cIndex].id == ID)
                                {
                                    if(characters[i].bronze[cIndex].amount > 0)
                                        bronzeFound = true;
                                }
                            }

                            for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                            {
                                if(characters[i].silver[cIndex].id == ID)
                                {
                                    if(characters[i].silver[cIndex].amount > 0)
                                        silverFound = true;
                                }
                            }

                            for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                            {
                                if(characters[i].gold[cIndex].id == ID)
                                {
                                    if(characters[i].gold[cIndex].amount > 0)
                                        goldFound = true;
                                }
                            }

                            var name = "Character No." + ID
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    name = database[index].name
                                }
                            }

                            if(bronzeFound && silverFound && goldFound)
                            {
                                if(!IndexRef.subtractTokens(message.author.id, platinumAmount))
                                {
                                    message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Failed To Buy Platinum Character***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase a Platinum Ranked Character. You need " + numberWithCommas(platinumAmount) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                                else
                                {                                                
                                    var added = false;
                                    for(var characterIndex = 0; characterIndex < characters[i].platinum.length; characterIndex++)
                                    {
                                        if(characters[i].platinum[characterIndex].id == ID)
                                        {
                                            added = true;
                                            characters[i].platinum[characterIndex].amount = characters[i].platinum[characterIndex].amount + 1;
                                        }
                                    }

                                    if(!added)
                                        characters[i].platinum.push({id: ID, amount: 1});

                                    for(var index = 0; index < database.length; index++)
                                    {
                                        if(database[index].id == ID)
                                        {
                                            var details = "";
                                            var bronzeAmount = 0, silverAmount = 0, goldAmount = 0, platinumAmount = 0;

                                            for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                            {
                                                if(characters[i].bronze[cIndex].id == ID)
                                                {
                                                    bronzeAmount = characters[i].bronze[cIndex].amount
                                                }
                                            }

                                            for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                            {
                                                if(characters[i].silver[cIndex].id == ID)
                                                {
                                                    silverAmount = characters[i].silver[cIndex].amount
                                                }
                                            }

                                            for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                            {
                                                if(characters[i].gold[cIndex].id == ID)
                                                {
                                                    goldAmount = characters[i].gold[cIndex].amount
                                                }
                                            }

                                            for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                            {
                                                if(characters[i].platinum[cIndex].id == ID)
                                                {
                                                    platinumAmount = characters[i].platinum[cIndex].amount
                                                }
                                            }

                                            details = "Bronze Versions Owned: " + numberWithCommas(bronzeAmount) 
                                            + "\nSilver Versions Owned: " + numberWithCommas(silverAmount)
                                            + "\nGold Versions Owned: " + numberWithCommas(goldAmount) 
                                            + "\n Platinum Versions Owned: " + numberWithCommas(platinumAmount) + "\n\nFor more detailed info on this character, use `" + commandPrefix + "cc info " + ID + "`."

                                            message.channel.send("<@" + message.author.id + "> ***Platinum Character Purchased***", {embed: {title: "***You Purchased A Platinum Ranked " + database[index].name + " - " + database[index].id + "***", description: details, color: 13487565, timestamp: timestamp, thumbnail:{url: database[index].image.url}, image: {url: database[index].image.url}, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                    }
                                }
                            }
                            else
                            {
                                message.channel.send("", {embed: {title: "***Failed To Buy Platinum Character***", description: "<@" + message.author.id + "> You must own at least one Bronze, Silver and Gold version of " + name + " to get the Platinum Rank. They will be taken along with " + numberWithCommas(platinumAmount) + " tokens to complete the purchase.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else
                        {
                            message.channel.send("", {embed: {title: "***No Character ID Given***", description: "<@" + message.author.id + "> You must give a valid Character ID for the Platinum Character you want. The ID can range from 1 to " + numberWithCommas(maxID) + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else if(args.toLowerCase().startsWith("buy"))
                    {
                        message.channel.send("", {embed: {title: "***Buying Characters***", description: "<@" + message.author.id + "> You can buy character packs using the following commands:\n\n`" + commandPrefix + "cc buy bronze` - Buy a Bronze Character Pack for " + numberWithCommas(bronzePrice) + " tokens.\n`" + commandPrefix + "cc buy silver` - Buy a Silver Character Pack for " + numberWithCommas(silverPrice) + " tokens.\n`" + commandPrefix + "cc buy gold` - Buy a Gold Character Pack for " + numberWithCommas(goldPrice) + " tokens.\n`" + commandPrefix + "cc buy platinum <character-id>` - Buy a Platinum Ranked Character for " + numberWithCommas(platinumPrice) + " tokens. Purchasing a platinum ranked character requires you to have the bronze, gold and silver verions of the character. All 3 will be taken along with the required tokens for the purchase to be complete. You must specify the ID of the character you want for this rank.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                    }
                    else if(args.toLowerCase().startsWith("send"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());

                        var rank = -1;
                        if(args.toLowerCase().startsWith("send bronze"))
                        {
                            rank = 0
                        }
                        else if(args.toLowerCase().startsWith("send silver"))
                        {
                            rank = 1
                        }
                        else if(args.toLowerCase().startsWith("send gold"))
                        {
                            rank = 2
                        }
                        else if(args.toLowerCase().startsWith("send platinum"))
                        {
                            rank = 3
                        }

                        if(rank == -1)
                        {
                            message.channel.send("", {embed: {title: "***No Character Info Given***", description: "<@" + message.author.id + "> You must give a valid Character Rank and Character ID. Character Ranks include: Bronze, Silver, Gold and Platinum. E.g: `" + commandPrefix + "cc send <character-rank> <character-id>`, `" + commandPrefix + "cc send bronze 10`.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            var options = args.toString().replace(/,/g, "")
                            var amountText = options.match(/\d+/g);
                            var amount = []
                            var ID = "";
                            if(amountText != null)
                            {
                                amount = amountText.map(Number);
                            }

                            var validID = false;

                            if(amount.length > 0)
                            {
                                ID = amount[0].toString()

                                if(ID >= 1 && ID <= maxID)
                                    validID = true;
                            }

                            if(validID)
                            {
                                var user;
                                var mentions = message.mentions.users.array()
                                user = mentions[0];

                                if(user != null && user != undefined && user.id != message.author.id && !user.bot)
                                {
                                    var name = "Character With The ID " + ID
                                    for(var index = 0; index < database.length; index++)
                                    {
                                        if(database[index].id == ID)
                                        {
                                            name = database[index].name
                                        }
                                    }
    
                                    if(rank == 0)
                                    {
                                        for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                        {
                                            if(characters[i].bronze[cIndex].id == ID)
                                            {
                                                if(characters[i].bronze[cIndex].amount > 0)
                                                {
                                                    characters[i].bronze[cIndex].amount = characters[i].bronze[cIndex].amount - 1;
                                                    var userFound = false;
                                                    for(var sendIndex = 0; sendIndex < characters.length; sendIndex++)
                                                    {
                                                        if(characters[sendIndex].id == user.id)
                                                        {
                                                            userFound = true;
                                                            var characterFound = false;
                                                            for(var sIndex = 0; sIndex < characters[sendIndex].bronze.length; sIndex++)
                                                            {
                                                                if(characters[sendIndex].bronze[sIndex].id == ID)
                                                                {
                                                                    characterFound = true;
                                                                    characters[sendIndex].bronze[sIndex].amount = characters[sendIndex].bronze[sIndex].amount + 1;
                                                                }
                                                            }

                                                            if(!characterFound)
                                                            {
                                                                characters[sendIndex].bronze.push({id: ID, amount: 1})
                                                            }

                                                            firebase.database().ref("characters/" + user.id).set(JSON.stringify(characters[sendIndex]))
                                                        }
                                                    }

                                                    if(!userFound)
                                                    {
                                                        firebase.database().ref("characters/" + user.id).set(JSON.stringify({id: user.id, bronze: [{id: ID, amount: 1}], silver: [], gold: [], platinum: [], trades: []}))
                                                    }

                                                    message.channel.send("<@" + message.author.id + "> has sent a Bronze " + name + " to <@" + user.id + ">", {embed: {title: "***Successfully Sent Character***", description: "<@" + message.author.id + "> You have sent a Bronze " + name + " to <@" + user.id + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                                else
                                                {
                                                    message.channel.send("", {embed: {title: "***Character Send Failed**", description: "<@" + message.author.id + "> You do not own a Bronze Ranked " + name + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                            }
                                        }
                                    }
                                    else if(rank == 1)
                                    {
                                        for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                        {
                                            if(characters[i].silver[cIndex].id == ID)
                                            {
                                                if(characters[i].silver[cIndex].amount > 0)
                                                {
                                                    characters[i].silver[cIndex].amount = characters[i].silver[cIndex].amount - 1;
                                                    var userFound = false;
                                                    for(var sendIndex = 0; sendIndex < characters.length; sendIndex++)
                                                    {
                                                        if(characters[sendIndex].id == user.id)
                                                        {
                                                            userFound = true;
                                                            var characterFound = false;
                                                            for(var sIndex = 0; sIndex < characters[sendIndex].silver.length; sIndex++)
                                                            {
                                                                if(characters[sendIndex].silver[sIndex].id == ID)
                                                                {
                                                                    characterFound = true;
                                                                    characters[sendIndex].silver[sIndex].amount = characters[sendIndex].silver[sIndex].amount + 1;
                                                                }
                                                            }

                                                            if(!characterFound)
                                                            {
                                                                characters[sendIndex].silver.push({id: ID, amount: 1})
                                                            }

                                                            firebase.database().ref("characters/" + user.id).set(JSON.stringify(characters[sendIndex]))
                                                        }
                                                    }

                                                    if(!userFound)
                                                    {
                                                        firebase.database().ref("characters/" + user.id).set(JSON.stringify({id: user.id, bronze: [], silver: [{id: ID, amount: 1}], gold: [], platinum: [], trades: []}))
                                                    }

                                                    message.channel.send("<@" + message.author.id + "> has sent a Silver Ranked " + name + " to <@" + user.id + ">", {embed: {title: "***Successfully Sent Character***", description: "<@" + message.author.id + "> You have sent a Silver " + name + " to <@" + user.id + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                                else
                                                {
                                                    message.channel.send("", {embed: {title: "***Character Send Failed**", description: "<@" + message.author.id + "> You do not own a Silver Ranked " + name + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                            }
                                        }
                                    }
                                    else if(rank == 2)
                                    {
                                        for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                        {
                                            if(characters[i].gold[cIndex].id == ID)
                                            {
                                                if(characters[i].gold[cIndex].amount > 0)
                                                {
                                                    characters[i].gold[cIndex].amount = characters[i].gold[cIndex].amount - 1;
                                                    var userFound = false;
                                                    for(var sendIndex = 0; sendIndex < characters.length; sendIndex++)
                                                    {
                                                        if(characters[sendIndex].id == user.id)
                                                        {
                                                            userFound = true;
                                                            var characterFound = false;
                                                            for(var sIndex = 0; sIndex < characters[sendIndex].gold.length; sIndex++)
                                                            {
                                                                if(characters[sendIndex].gold[sIndex].id == ID)
                                                                {
                                                                    characterFound = true;
                                                                    characters[sendIndex].gold[sIndex].amount = characters[sendIndex].gold[sIndex].amount + 1;
                                                                }
                                                            }

                                                            if(!characterFound)
                                                            {
                                                                characters[sendIndex].gold.push({id: ID, amount: 1})
                                                            }

                                                            firebase.database().ref("characters/" + user.id).set(JSON.stringify(characters[sendIndex]))
                                                        }
                                                    }

                                                    if(!userFound)
                                                    {
                                                        firebase.database().ref("characters/" + user.id).set(JSON.stringify({id: user.id, bronze: [], silver: [], gold: [{id: ID, amount: 1}], platinum: [], trades: []}))
                                                    }

                                                    message.channel.send("<@" + message.author.id + "> has sent a Gold Ranked " + name + " to <@" + user.id + ">", {embed: {title: "***Successfully Sent Character***", description: "<@" + message.author.id + "> You have sent a Gold " + name + " to <@" + user.id + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                                else
                                                {
                                                    message.channel.send("", {embed: {title: "***Character Send Failed**", description: "<@" + message.author.id + "> You do not own a Gold Ranked " + name + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                        {
                                            if(characters[i].platinum[cIndex].id == ID)
                                            {
                                                if(characters[i].platinum[cIndex].amount > 0)
                                                {
                                                    characters[i].platinum[cIndex].amount = characters[i].platinum[cIndex].amount - 1;
                                                    var userFound = false;
                                                    for(var sendIndex = 0; sendIndex < characters.length; sendIndex++)
                                                    {
                                                        if(characters[sendIndex].id == user.id)
                                                        {
                                                            userFound = true;
                                                            var characterFound = false;
                                                            for(var sIndex = 0; sIndex < characters[sendIndex].platinum.length; sIndex++)
                                                            {
                                                                if(characters[sendIndex].platinum[sIndex].id == ID)
                                                                {
                                                                    characterFound = true;
                                                                    characters[sendIndex].platinum[sIndex].amount = characters[sendIndex].platinum[sIndex].amount + 1;
                                                                }
                                                            }

                                                            if(!characterFound)
                                                            {
                                                                characters[sendIndex].platinum.push({id: ID, amount: 1})
                                                            }

                                                            firebase.database().ref("characters/" + user.id).set(JSON.stringify(characters[sendIndex]))
                                                        }
                                                    }

                                                    if(!userFound)
                                                    {
                                                        firebase.database().ref("characters/" + user.id).set(JSON.stringify({id: user.id, bronze: [], silver: [], gold: [], platinum: [{id: ID, amount: 1}], trades: []}))
                                                    }

                                                    message.channel.send("<@" + message.author.id + "> has sent a Platinum Ranked " + name + " to <@" + user.id + ">", {embed: {title: "***Successfully Sent Character***", description: "<@" + message.author.id + "> You have sent a Platinum Ranked " + name + " to <@" + user.id + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                                else
                                                {
                                                    message.channel.send("", {embed: {title: "***Character Send Failed**", description: "<@" + message.author.id + "> You do not own a Platinum Ranked " + name + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    message.channel.send("", {embed: {title: "***No User Tagged***", description: "<@" + message.author.id + "> You must tag another user to send a character.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                            }
                            else
                            {
                                message.channel.send("", {embed: {title: "***No Character ID Given***", description: "<@" + message.author.id + "> You must give a valid Character ID. The ID can range from 1 to " + numberWithCommas(maxID) + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                    }
                    else if(args.toLowerCase().startsWith("info"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());

                        var options = args.toString().replace(/,/g, "")
                        var amountText = options.match(/\d+/g);
                        var amount = []
                        var ID = "";
                        if(amountText != null)
                        {
                            amount = amountText.map(Number);
                        }

                        var validID = false;

                        if(amount.length > 0)
                        {
                            ID = amount[0].toString()

                            if(ID >= 1 && ID <= maxID)
                                validID = true;
                        }

                        if(validID)
                        {
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    var details = "", extraDetails = "";
                                    var bronzeAmount = 0, silverAmount = 0, goldAmount = 0, platinumAmount = 0;

                                    for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                    {
                                        if(characters[i].bronze[cIndex].id == ID)
                                        {
                                            bronzeAmount = characters[i].bronze[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                    {
                                        if(characters[i].silver[cIndex].id == ID)
                                        {
                                            silverAmount = characters[i].silver[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                    {
                                        if(characters[i].gold[cIndex].id == ID)
                                        {
                                            goldAmount = characters[i].gold[cIndex].amount
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                    {
                                        if(characters[i].platinum[cIndex].id == ID)
                                        {
                                            platinumAmount = characters[i].platinum[cIndex].amount
                                        }
                                    }

                                    details = "Bronze Versions Owned: " + numberWithCommas(bronzeAmount) 
                                    + "\nSilver Versions Owned: " + numberWithCommas(silverAmount)
                                    + "\nGold Versions Owned: " + numberWithCommas(goldAmount) 
                                    + "\n Platinum Versions Owned: " + numberWithCommas(platinumAmount) + "\n\n"

                                    Object.keys(database[index]).forEach(function(key) {
                                        var val = database[index][key];
                                        if(typeof val == "object" && key != "image")
                                        {
                                            var heading = toTitleCase(key.replace(/-/g, " "))
                                            details = details + "**__" + heading + "__**\n"
                                            Object.keys(val).forEach(function(childKey){
                                                var subHeading = toTitleCase(childKey.replace(/-/g, " "))
                                                var tempDetails = "__" + subHeading + "__\n"
                                                if(Array.isArray(val[childKey]))
                                                {
                                                    for(var childIndex = 0; childIndex < val[childKey].length; childIndex++)
                                                    {
                                                        if(val[childKey][childIndex] == "null")
                                                            tempDetails = tempDetails + "Unknown\n"
                                                        else
                                                            tempDetails = tempDetails + val[childKey][childIndex] + "\n"
                                                    }
                                                }
                                                else
                                                {
                                                    if(val[childKey] == "null")
                                                        tempDetails = tempDetails + "Unknown\n"
                                                    else
                                                        tempDetails = tempDetails + val[childKey] + "\n"
                                                }

                                                tempDetails = tempDetails + "\n"

                                                if((details + tempDetails).length > 2048)
                                                {
                                                    extraDetails = extraDetails + tempDetails
                                                }
                                                else
                                                {
                                                    details = details + tempDetails
                                                }
                                            })
                                        }
                                    });

                                    if(extraDetails == "")
                                    {
                                        message.channel.send("***" + database[index].name + " - " + database[index].id + "***", {embed: {title: "***" + database[index].name + " - " + database[index].id + "***", description: details, color: 8388863, timestamp: timestamp, thumbnail:{url: database[index].image.url}, image: {url: database[index].image.url}, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                    else
                                    {
                                        message.channel.send("***" + database[index].name + " - " + database[index].id + "***", {embed: {title: "***" + database[index].name + " - " + database[index].id + "***", description: details, color: 8388863, timestamp: timestamp, thumbnail: {url: database[index].image.url}, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        message.channel.send("", {embed: {title: "***" + database[index].name + " - " + database[index].id + "***", description: extraDetails, color: 8388863, timestamp: timestamp, thumbnail:{url: database[index].image.url}, image: {url: database[index].image.url}, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }
                            }
                        }
                        else
                        {
                            message.channel.send("", {embed: {title: "***No Character ID Given***", description: "<@" + message.author.id + "> You must give a valid Character ID. The ID can range from 1 to " + numberWithCommas(maxID) + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else if (args.toLowerCase().startsWith("sell bronze"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());

                        var options = args.toString().replace(/,/g, "")
                        var amountText = options.match(/\d+/g);
                        var amount = []
                        var ID = "";
                        if(amountText != null)
                        {
                            amount = amountText.map(Number);
                        }

                        var validID = false;

                        if(amount.length > 0)
                        {
                            ID = amount[0].toString()

                            if(ID >= 1 && ID <= maxID)
                                validID = true;
                        }

                        if(validID)
                        {
                            var name = "character with the ID " + ID
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    name = database[index].name
                                }
                            }

                            var characterFound = false;

                            for(var characterIndex = 0; characterIndex < characters[i].bronze.length; characterIndex++)
                            {
                                if(characters[i].bronze[characterIndex].id == ID)
                                {
                                    if(characters[i].bronze[characterIndex].amount > 0)
                                    {
                                        characterFound = true;
                                        IndexRef.addTokens(message.author.id, bronzePrice/10)
                                        
                                        message.channel.send("", {embed: {title: "***Successfully Sold Character***", description: "<@" + message.author.id + "> You have sold a Bronze Ranked " + name + " for " + numberWithCommas(bronzePrice/10) + " tokens. You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
    
                                        characters[i].bronze[characterIndex].amount = characters[i].bronze[characterIndex].amount - 1
                                    }
                                }
                            }

                            if(!characterFound)
                            {
                                message.channel.send("", {embed: {title: "***Character Not Owned***", description: "<@" + message.author.id + "> You do not own a Bronze Ranked " + name + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else
                        {
                            message.channel.send("", {embed: {title: "***No Character ID Given***", description: "<@" + message.author.id + "> You must give a valid Character ID. The ID can range from 1 to " + numberWithCommas(maxID) + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else if (args.toLowerCase().startsWith("sell silver"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());

                        var options = args.toString().replace(/,/g, "")
                        var amountText = options.match(/\d+/g);
                        var amount = []
                        var ID = "";
                        if(amountText != null)
                        {
                            amount = amountText.map(Number);
                        }

                        var validID = false;

                        if(amount.length > 0)
                        {
                            ID = amount[0].toString()

                            if(ID >= 1 && ID <= maxID)
                                validID = true;
                        }

                        if(validID)
                        {
                            var name = "character with the ID " + ID
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    name = database[index].name
                                }
                            }

                            var characterFound = false;

                            for(var characterIndex = 0; characterIndex < characters[i].silver.length; characterIndex++)
                            {
                                if(characters[i].silver[characterIndex].id == ID)
                                {
                                    if(characters[i].silver[characterIndex].amount > 0)
                                    {
                                        characterFound = true;
                                        IndexRef.addTokens(message.author.id, silverPrice/10)
                                        
                                        message.channel.send("", {embed: {title: "***Successfully Sold Character***", description: "<@" + message.author.id + "> You have sold a Silver Ranked " + name + " for " + numberWithCommas(silverPrice/10) + " tokens. You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
    
                                        characters[i].silver[characterIndex].amount = characters[i].silver[characterIndex].amount - 1
                                    }
                                }
                            }

                            if(!characterFound)
                            {
                                message.channel.send("", {embed: {title: "***Character Not Owned***", description: "<@" + message.author.id + "> You do not own a Silver Ranked " + name + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else
                        {
                            message.channel.send("", {embed: {title: "***No Character ID Given***", description: "<@" + message.author.id + "> You must give a valid Character ID. The ID can range from 1 to " + numberWithCommas(maxID) + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else if (args.toLowerCase().startsWith("sell gold"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());

                        var options = args.toString().replace(/,/g, "")
                        var amountText = options.match(/\d+/g);
                        var amount = []
                        var ID = "";
                        if(amountText != null)
                        {
                            amount = amountText.map(Number);
                        }

                        var validID = false;

                        if(amount.length > 0)
                        {
                            ID = amount[0].toString()

                            if(ID >= 1 && ID <= maxID)
                                validID = true;
                        }

                        if(validID)
                        {
                            var name = "character with the ID " + ID
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    name = database[index].name
                                }
                            }

                            var characterFound = false;

                            for(var characterIndex = 0; characterIndex < characters[i].gold.length; characterIndex++)
                            {
                                if(characters[i].gold[characterIndex].id == ID)
                                {
                                    if(characters[i].gold[characterIndex].amount > 0)
                                    {
                                        characterFound = true;
                                        IndexRef.addTokens(message.author.id, goldPrice/10)
                                        
                                        message.channel.send("", {embed: {title: "***Successfully Sold Character***", description: "<@" + message.author.id + "> You have sold a Gold Ranked " + name + " for " + numberWithCommas(goldPrice/10) + " tokens. You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
    
                                        characters[i].gold[characterIndex].amount = characters[i].gold[characterIndex].amount - 1
                                    }
                                }
                            }

                            if(!characterFound)
                            {
                                message.channel.send("", {embed: {title: "***Character Not Owned***", description: "<@" + message.author.id + "> You do not own a Gold Ranked " + name + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else
                        {
                            message.channel.send("", {embed: {title: "***No Character ID Given***", description: "<@" + message.author.id + "> You must give a valid Character ID. The ID can range from 1 to " + numberWithCommas(maxID) + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else if (args.toLowerCase().startsWith("sell platinum"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());

                        var options = args.toString().replace(/,/g, "")
                        var amountText = options.match(/\d+/g);
                        var amount = []
                        var ID = "";
                        if(amountText != null)
                        {
                            amount = amountText.map(Number);
                        }

                        var validID = false;

                        if(amount.length > 0)
                        {
                            ID = amount[0].toString()

                            if(ID >= 1 && ID <= maxID)
                                validID = true;
                        }

                        if(validID)
                        {
                            var name = "character with the ID " + ID
                            for(var index = 0; index < database.length; index++)
                            {
                                if(database[index].id == ID)
                                {
                                    name = database[index].name
                                }
                            }

                            var characterFound = false;

                            for(var characterIndex = 0; characterIndex < characters[i].platinum.length; characterIndex++)
                            {
                                if(characters[i].platinum[characterIndex].id == ID)
                                {
                                    if(characters[i].platinum[characterIndex].amount > 0)
                                    {
                                        characterFound = true;
                                        IndexRef.addTokens(message.author.id, platinumPrice/10)
                                        
                                        message.channel.send("", {embed: {title: "***Successfully Sold Character***", description: "<@" + message.author.id + "> You have sold a Platinum Ranked " + name + " for " + numberWithCommas(platinumPrice/10) + " tokens. You now have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
    
                                        characters[i].platinum[characterIndex].amount = characters[i].platinum[characterIndex].amount - 1
                                    }
                                }
                            }

                            if(!characterFound)
                            {
                                message.channel.send("", {embed: {title: "***Character Not Owned***", description: "<@" + message.author.id + "> You do not own a Platinum Ranked " + name + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else
                        {
                            message.channel.send("", {embed: {title: "***No Character ID Given***", description: "<@" + message.author.id + "> You must give a valid Character ID. The ID can range from 1 to " + numberWithCommas(maxID) + ".", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else if(args.toLowerCase().startsWith("sell"))
                    {
                        message.channel.send("", {embed: {title: "***Selling Characters***", description: "<@" + message.author.id + "> You can sell characters you own using the following commands:\n\n`" + commandPrefix + "cc sell bronze <character-id>` - Sell a Bronze Ranked Character you own and receive " + numberWithCommas(bronzePrice/10) + " tokens.\n`" + commandPrefix + "cc sell silver <character-id>` - Sell a Silver Ranked Character you own and receive " + numberWithCommas(silverPrice/10) + " tokens.\n`" + commandPrefix + "cc sell gold <character-id>` - Sell a Gold Ranked Character you own and receive " + numberWithCommas(goldPrice/10) + " tokens.\n`" + commandPrefix + "cc sell platinum <character-id>` - Sell a Platinum Ranked Character you own and receive " + numberWithCommas(platinumPrice/10) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                    }
                    else if(args.toLowerCase().startsWith("ranks"))
                    {
                        var ranks = []

                        for(var characterIndex = 0; characterIndex < characters.length; characterIndex++)
                        {
                            var totalPlatCount = 0

                            for(var index = 0; index < characters[characterIndex].platinum.length; index++)
                            {
                                totalPlatCount = totalPlatCount + characters[characterIndex].platinum[index].amount;
                            }

                            ranks.push({id: characters[characterIndex].id, characterCount: totalPlatCount})
                        }

                        if(ranks.length == 0)
                        {
                            var timestamp = (new Date(Date.now()).toJSON());
                            message.channel.send("", {embed: {title: "**Global Calamity Cards Leaderboard - Top 10 players :trophy:**",
                            description: "No platinum characters owned by any user.",
                            color: 16757505,
                            timestamp: timestamp,
                            footer: {
                                icon_url: message.client.user.avatarURL,
                                text: "Sent on"
                            }}}).catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            ranks.sort(rankAscending);
                            var names = [];
                            var userPromises = []
                
                            for(var index = 0; index < ranks.length; index++)
                            {
                                userPromises.push(message.client.fetchUser(ranks[index].id)
                                .then(user => {
                                    names.push(user.username);
                                }, rejection => {
                                        console.log(rejection.message);
                                }));
                            }
                            
                            Promise.all(userPromises).then(() => {
                                var descriptionList = "";
                
                                var length = ranks.length;
    
                                if(length > 10)
                                {
                                    length = 10;
                                }
    
                                for(var rankIndex = 0; rankIndex < length; rankIndex++)
                                {
                                    descriptionList = descriptionList + (rankEmojis[rankIndex] + "``" + numberWithCommas(ranks[rankIndex].characterCount) + "`` - **" + names[rankIndex] + "**\n");
                                }
                    
                                var timestamp = (new Date(Date.now()).toJSON());
                                message.channel.send("", {embed: {title: "**Global Calamity Characters Leaderboard - Top 10 players :trophy:**",
                                description: "**Rank** - Number of Platinum Characters Owned - Name\n" + descriptionList + "\nFiltered from a total of " + numberWithCommas(characters.length) + " players.",
                                color: 16757505,
                                timestamp: timestamp,
                                footer: {
                                    icon_url: message.client.user.avatarURL,
                                    text: "Sent on"
                                }}}).catch(error => console.log("Send Error - " + error));
                            })
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
                            var characterFound = false;
                            var timestamp = (new Date(Date.now()).toJSON());

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

                                var uniqueBronzeChars = 0, totalBronzeChars = 0;
                                var uniqueSilverChars = 0, totalSilverChars = 0;
                                var uniqueGoldChars = 0, totalGoldChars = 0;
                                var uniquePlatinumChars = 0, totalPlatinumChars = 0;

                                var totalUniqueChars = 0
                                var totalChars = 0

                                for(var characterIndex = 0; characterIndex < characters.length; characterIndex++)
                                {
                                    if(characters[characterIndex].id == userID)
                                    {
                                        characterFound = true
                                        
                                        for(var index = 0; index < characters[characterIndex].bronze.length; index++)
                                        {
                                            totalBronzeChars = totalBronzeChars + characters[characterIndex].bronze[index].amount
                                            if(characters[characterIndex].bronze[index].amount > 0)
                                                uniqueBronzeChars = uniqueBronzeChars + 1
                                        }

                                        for(var index = 0; index < characters[characterIndex].silver.length; index++)
                                        {
                                            totalSilverChars = totalSilverChars + characters[characterIndex].silver[index].amount
                                            if(characters[characterIndex].silver[index].amount > 0)
                                                uniqueSilverChars = uniqueSilverChars + 1
                                        }

                                        for(var index = 0; index < characters[characterIndex].gold.length; index++)
                                        {
                                            totalGoldChars = totalGoldChars + characters[characterIndex].gold[index].amount
                                            if(characters[characterIndex].gold[index].amount > 0)
                                                uniqueGoldChars = uniqueGoldChars + 1
                                        }

                                        for(var index = 0; index < characters[characterIndex].platinum.length; index++)
                                        {
                                            totalPlatinumChars = totalPlatinumChars + characters[characterIndex].platinum[index].amount
                                            if(characters[characterIndex].platinum[index].amount > 0)
                                                uniquePlatinumChars = uniquePlatinumChars + 1
                                        }

                                        totalUniqueChars = uniqueBronzeChars + uniqueSilverChars + uniqueGoldChars + uniquePlatinumChars
                                        totalChars = totalBronzeChars + totalSilverChars + totalGoldChars + totalPlatinumChars

                                        message.channel.send("", {embed: {title: "***Calamity Cards Profile for " + user.username + "***", description: "***__Bronze Characters__***\nUnique Bronze Characters Owned: " + numberWithCommas(uniqueBronzeChars) + "/" + numberWithCommas(maxID) + "\nTotal Bronze Characters Owned: " + numberWithCommas(totalBronzeChars) + "\n\n***__Silver Characters__***\nUnique Silver Characters Owned: " + numberWithCommas(uniqueSilverChars) + "/" + numberWithCommas(maxID) + "\nTotal Silver Characters Owned: " + numberWithCommas(totalSilverChars) + "\n\n***__Gold Characters__***\nUnique Gold Characters Owned: " + numberWithCommas(uniqueGoldChars) + "/" + numberWithCommas(maxID) + "\nTotal Gold Characters Owned: " + numberWithCommas(totalGoldChars) + "\n\n***__Platinum Characters__***\nUnique Platinum Characters Owned: " + numberWithCommas(uniquePlatinumChars) + "/" + numberWithCommas(maxID) + "\nTotal Platinum Characters Owned: " + numberWithCommas(totalPlatinumChars) + " (Shown in leaderboards - use `" + commandPrefix + "cc ranks`)\n\n***__Overall Characters__***\nOverall Unique Characters Owned: " + numberWithCommas(totalUniqueChars) + "/" + numberWithCommas(maxID*4) + "\nOverall Total Characters Owned: " + numberWithCommas(totalChars) + "\n\n" + user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }

                                if(!characterFound)
                                {
                                    message.channel.send("", {embed: {title: "***Calamity Cards Profile for " + user.username + "***", description: "***__Bronze Characters__***\nUnique Bronze Characters Owned: " + numberWithCommas(uniqueBronzeChars) + "/" + numberWithCommas(maxID) + "\nTotal Bronze Characters Owned: " + numberWithCommas(totalBronzeChars) + "\n\n***__Silver Characters__***\nUnique Silver Characters Owned: " + numberWithCommas(uniqueSilverChars) + "/" + numberWithCommas(maxID) + "\nTotal Silver Characters Owned: " + numberWithCommas(totalSilverChars) + "\n\n***__Gold Characters__***\nUnique Gold Characters Owned: " + numberWithCommas(uniqueGoldChars) + "/" + numberWithCommas(maxID) + "\nTotal Gold Characters Owned: " + numberWithCommas(totalGoldChars) + "\n\n***__Platinum Characters__***\nUnique Platinum Characters Owned: " + numberWithCommas(uniquePlatinumChars) + "/" + numberWithCommas(maxID) + "\nTotal Platinum Characters Owned: " + numberWithCommas(totalPlatinumChars) + "\n\n***__Overall Characters__***\nOverall Unique Characters Owned: " + numberWithCommas(totalUniqueChars) + "/" + numberWithCommas(maxID*4) + "\nOverall Total Characters Owned: " + numberWithCommas(totalChars) + "\n\n" + user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                            }
                            else
                            {
                                message.channel.send("<@" + message.author.id + "> User not found on this server.").catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else
                        {
                            var uniqueBronzeChars = 0, totalBronzeChars = 0;
                            var uniqueSilverChars = 0, totalSilverChars = 0;
                            var uniqueGoldChars = 0, totalGoldChars = 0;
                            var uniquePlatinumChars = 0, totalPlatinumChars = 0;

                            for(var index = 0; index < characters[i].bronze.length; index++)
                            {
                                totalBronzeChars = totalBronzeChars + characters[i].bronze[index].amount
                                if(characters[i].bronze[index].amount > 0)
                                    uniqueBronzeChars = uniqueBronzeChars + 1
                            }

                            for(var index = 0; index < characters[i].silver.length; index++)
                            {
                                totalSilverChars = totalSilverChars + characters[i].silver[index].amount
                                if(characters[i].silver[index].amount > 0)
                                    uniqueSilverChars = uniqueSilverChars + 1
                            }

                            for(var index = 0; index < characters[i].gold.length; index++)
                            {
                                totalGoldChars = totalGoldChars + characters[i].gold[index].amount
                                if(characters[i].gold[index].amount > 0)
                                    uniqueGoldChars = uniqueGoldChars + 1
                            }

                            for(var index = 0; index < characters[i].platinum.length; index++)
                            {
                                totalPlatinumChars = totalPlatinumChars + characters[i].platinum[index].amount
                                if(characters[i].platinum[index].amount > 0)
                                    uniquePlatinumChars = uniquePlatinumChars + 1
                            }

                            var totalUniqueChars = uniqueBronzeChars + uniqueSilverChars + uniqueGoldChars + uniquePlatinumChars
                            var totalChars = totalBronzeChars + totalSilverChars + totalGoldChars + totalPlatinumChars

                            var timestamp = (new Date(Date.now()).toJSON());

                            var thumbnail = "";

                            if(message.author.avatarURL != undefined && message.author.avatarURL != null)
                                thumbnail = message.author.avatarURL

                            message.channel.send("", {embed: {title: "***Calamity Cards Profile for " + message.author.username + "***", description: "***__Bronze Characters__***\nUnique Bronze Characters Owned: " + numberWithCommas(uniqueBronzeChars) + "/" + numberWithCommas(maxID) + "\nTotal Bronze Characters Owned: " + numberWithCommas(totalBronzeChars) + "\n\n***__Silver Characters__***\nUnique Silver Characters Owned: " + numberWithCommas(uniqueSilverChars) + "/" + numberWithCommas(maxID) + "\nTotal Silver Characters Owned: " + numberWithCommas(totalSilverChars) + "\n\n***__Gold Characters__***\nUnique Gold Characters Owned: " + numberWithCommas(uniqueGoldChars) + "/" + numberWithCommas(maxID) + "\nTotal Gold Characters Owned: " + numberWithCommas(totalGoldChars) + "\n\n***__Platinum Characters__***\nUnique Platinum Characters Owned: " + numberWithCommas(uniquePlatinumChars) + "/" + numberWithCommas(maxID) + "\nTotal Platinum Characters Owned: " + numberWithCommas(totalPlatinumChars) + "\n\n***__Overall Characters__***\nOverall Unique Characters Owned: " + numberWithCommas(totalUniqueChars) + "/" + numberWithCommas(maxID*4) + "\nOverall Total Characters Owned: " + numberWithCommas(totalChars) + "\n\nYou currently have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else if(args.toLowerCase().startsWith("list"))
                    {
                        var lists = []
                        var item = "***Rank - Character Name - ID - Copies Owned***\n"

                        characters[i].bronze.sort(rankAscendingIDs)
                        characters[i].silver.sort(rankAscendingIDs)
                        characters[i].gold.sort(rankAscendingIDs)
                        characters[i].platinum.sort(rankAscendingIDs)

                        for(var index = 0; index < characters[i].bronze.length; index++)
                        {
                            var ID = characters[i].bronze[index].id
                            var name = "character with the ID " + ID
                            for(var nameIndex = 0; nameIndex < database.length; nameIndex++)
                            {
                                if(database[nameIndex].id == ID)
                                {
                                    name = database[nameIndex].name
                                }
                            }

                            var text = "Bronze - " + name + " - " + characters[i].bronze[index].id + " - " + characters[i].bronze[index].amount
                            if((item + text + "\n").length      )
                            {
                                item = item + text + "\n";
                            }
                            else
                            {
                                lists.push(item);
                                item = "***Rank - Character Name - ID - Copies Owned***\n"
                            }
                        }

                        if((item + "\n").length < 2048 && characters[i].bronze.length > 0)
                            item = item + "\n"

                        for(var index = 0; index < characters[i].silver.length; index++)
                        {
                            var ID = characters[i].silver[index].id
                            var name = "character with the ID " + ID
                            for(var nameIndex = 0; nameIndex < database.length; nameIndex++)
                            {
                                if(database[nameIndex].id == ID)
                                {
                                    name = database[nameIndex].name
                                }
                            }

                            var text = "Silver - " + name + " - " + characters[i].silver[index].id + " - " + characters[i].silver[index].amount
                            if((item + text + "\n").length < 2048)
                            {
                                item = item + text + "\n";
                            }
                            else
                            {
                                lists.push(item);
                                item = "***Rank - Character Name - ID - Copies Owned***\n"
                            }
                        }

                        if((item + "\n").length < 2048 && characters[i].silver.length > 0)
                            item = item + "\n"

                        for(var index = 0; index < characters[i].gold.length; index++)
                        {
                            var ID = characters[i].gold[index].id
                            var name = "character with the ID " + ID
                            for(var nameIndex = 0; nameIndex < database.length; nameIndex++)
                            {
                                if(database[nameIndex].id == ID)
                                {
                                    name = database[nameIndex].name
                                }
                            }

                            var text = "Gold - " + name + " - " + characters[i].gold[index].id + " - " + characters[i].gold[index].amount
                            if((item + text + "\n").length < 2048)
                            {
                                item = item + text + "\n";
                            }
                            else
                            {
                                lists.push(item);
                                item = "***Rank - Character Name - ID - Copies Owned***\n"
                            }
                        }

                        if((item + "\n").length < 2048 && characters[i].gold.length > 0)
                            item = item + "\n"

                        for(var index = 0; index < characters[i].platinum.length; index++)
                        {
                            var ID = characters[i].platinum[index].id
                            var name = "character with the ID " + ID
                            for(var nameIndex = 0; nameIndex < database.length; nameIndex++)
                            {
                                if(database[nameIndex].id == ID)
                                {
                                    name = database[nameIndex].name
                                }
                            }
                            
                            var text = "Platinum - " + name + " - " + characters[i].platinum[index].id + " - " + characters[i].platinum[index].amount
                            if((item + text + "\n").length < 2048)
                            {
                                item = item + text + "\n";
                            }
                            else
                            {
                                lists.push(item);
                                item = "***Rank - Character Name - ID - Copies Owned***\n"
                            }
                        }

                        if(item != "***Rank - Character Name - ID - Copies Owned***\n")
                        {
                            lists.push(item)
                        }
                        else if(lists.length == 0)
                        {
                            lists.push("No Characters Owned")
                        }

                        var timestamp = (new Date(Date.now()).toJSON());

                        for(var index = 0; index < lists.length; index++)
                        {
                            message.channel.send("<@" + message.author.id + ">", {embed: {title: "***List of Characters You Own (" + (index + 1) + "/" + lists.length + ")***", description: lists[index], color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else
                    {
                        message.channel.send("<@" + message.author.id + "> No parameter given. Use `" + commandPrefix + "help cc` for help.").catch(error => {console.log("Send Error - " + error); });
                    }
                
                    firebase.database().ref("characters/" + message.author.id).set(JSON.stringify(characters[i]))
                    return;
                }
            }
        })
    }
}

module.exports = CCCommand;