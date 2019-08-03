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

const maxID = database.length;

class CCCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "cc",
            group: "games",
            memberName: "cc",
            description: "Play Calamity Cards, a trading card game where you can purchase various Heroes and Villains from comic books, movies, TV shows and more. Buy character packs to collect all of the unique characters. Try your best to get as many platinum characters as you can to increase your rank and sell your unwanted cards to earn tokens. These tokens can also be earned by voting for Slav Bot on discordbots.org, Daily Spins after voting (one spin per day) and by participating in token giveaways on the Slav Support server. Tokens can also be earned by buying Supporter Roles on the Slav Support server, or by becoming a Patreon Supporter where you will be entitled to receive tokens on a weekly basis.",
            examples: ["`!cc profile` (Check your profile and various stats)", "`!cc collect` (Gather Card Trading Resources)", "`!cc profile @User` (Check another user's profile and various stats)", "`!cc buy <package-rank>` (Buy character packs for various card ranks - Bronze, Silver, Gold and Platinum)", "`!cc buy platinum <character-id>` (Buy a Platinum character, for more info use `!cc buy`)", "`!cc sell <character-rank> <character-id>` (Sell a character from your inventory)", "`!cc send <character-rank> <character-id> @User` (Send a character from your inventory to another user)", "`!cc trade <your-character-rank> <your-character-id>|<other-character-rank> <other-character-id> @User`", "`!cc trade bronze 20|gold 20 @User` (In this example, you are placing a trade where you will trade your bronze character for another user's gold character)", "`!cc trade list` (View a list of all trade requests you have received)", "`!cc info <character-id>` (View details on a character)", "`!cc ranks` (Check Global Leaderboards)", "`!cc give <amount> @User1 @User2` (Give your tokens to another user)", "`!cc list` (Gives a list of characters you own)"]
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
                    else if (args.toLowerCase().startsWith("trade"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());

                        if(args.toLowerCase().startsWith("trade accept"))
                        {
                            var user;
                            var mentions = message.mentions.users.array()

                            if(mentions.length > 0)
                                user = mentions[0];

                            var requestCheck = false;
                            var invalidTag = false;

                            if(user == null || user == undefined)
                                invalidTag = true;
                            else if(user.bot)
                                invalidTag = true;
                            
                            if(!invalidTag)
                            {
                                for(var tradeIndex = 0; tradeIndex < characters[i].trades.length; tradeIndex++)
                                {
                                    if(characters[i].trades[tradeIndex].user == user.id)
                                    {
                                        requestCheck = true;
                                        var sendRank = characters[i].trades[tradeIndex].send.rank, sendID = characters[i].trades[tradeIndex].send.id, takeRank = characters[i].trades[tradeIndex].take.rank, takeID = characters[i].trades[tradeIndex].take.id

                                        var takeCheck = false, sendCheck = false, requestCheck = true;;

                                        if(sendRank == "Bronze")
                                        {
                                            for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                            {
                                                if(characters[i].bronze[cIndex].id == sendID)
                                                {
                                                    if(characters[i].bronze[cIndex].amount > 0)
                                                        takeCheck = true;
                                                }
                                            }
                                        }
                                        else if(sendRank == "Silver")
                                        {
                                            for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                            {
                                                if(characters[i].silver[cIndex].id == sendID)
                                                {
                                                    if(characters[i].silver[cIndex].amount > 0)
                                                        takeCheck = true;
                                                }
                                            }
                                        }
                                        else if(sendRank == "Gold")
                                        {
                                            for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                            {
                                                if(characters[i].gold[cIndex].id == sendID)
                                                {
                                                    if(characters[i].gold[cIndex].amount > 0)
                                                        takeCheck = true;
                                                }
                                            }
                                        }
                                        else if(sendRank == "Platinum")
                                        {
                                            for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                            {
                                                if(characters[i].platinum[cIndex].id == sendID)
                                                {
                                                    if(characters[i].platinum[cIndex].amount > 0)
                                                        takeCheck = true;
                                                }
                                            }
                                        }
        
                                        for(var index = 0; index < characters.length; index++)
                                        {
                                            if(characters[index].id == user.id)
                                            {
                                                if(takeRank == "Bronze")
                                                {   
                                                    for(var cIndex = 0; cIndex < characters[index].bronze.length; cIndex++)
                                                    {
                                                        if(characters[index].bronze[cIndex].id == takeID)
                                                        {
                                                            if(characters[index].bronze[cIndex].amount > 0)
                                                                sendCheck = true;
                                                        }
                                                    }
                                                }
                                                else if(takeRank == "Silver")
                                                {
                                                    for(var cIndex = 0; cIndex < characters[index].silver.length; cIndex++)
                                                    {
                                                        if(characters[index].silver[cIndex].id == takeID)
                                                        {
                                                            if(characters[index].silver[cIndex].amount > 0)
                                                                sendCheck = true;
                                                        }
                                                    }
                                                }
                                                else if(takeRank == "Gold")
                                                {
                                                    for(var cIndex = 0; cIndex < characters[index].gold.length; cIndex++)
                                                    {
                                                        if(characters[index].gold[cIndex].id == takeID)
                                                        {
                                                            if(characters[index].gold[cIndex].amount > 0)
                                                                sendCheck = true;
                                                        }
                                                    }
                                                }
                                                else if(takeRank == "Platinum")
                                                {
                                                    for(var cIndex = 0; cIndex < characters[index].platinum.length; cIndex++)
                                                    {
                                                        if(characters[index].platinum[cIndex].id == takeID)
                                                        {
                                                            if(characters[index].platinum[cIndex].amount > 0)
                                                                sendCheck = true;
                                                        }
                                                    }
                                                } 
                                            }
                                        }
        
                                        if(takeCheck && sendCheck)
                                        {
                                            var sendName = "ID - " + sendID,
                                            takeName = "ID - " + takeID
                                            for(var index = 0; index < database.length; index++)
                                            {
                                                if(database[index].id == sendID)
                                                {
                                                    sendName = database[index].name
                                                }
            
                                                if(database[index].id == takeID)
                                                {
                                                    takeName = database[index].name
                                                }
                                            }

                                            if(sendRank == "Bronze")
                                            {
                                                for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                                {
                                                    if(characters[i].bronze[cIndex].id == sendID)
                                                    {
                                                        characters[i].bronze[cIndex].amount = characters[i].bronze[cIndex].amount - 1;
                                                    }
                                                }
                                            }
                                            else if(sendRank == "Silver")
                                            {
                                                for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                                {
                                                    if(characters[i].silver[cIndex].id == sendID)
                                                    {
                                                        characters[i].silver[cIndex].amount = characters[i].silver[cIndex].amount - 1;
                                                    }
                                                }
                                            }
                                            else if(sendRank == "Gold")
                                            {
                                                for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                                {
                                                    if(characters[i].gold[cIndex].id == sendID)
                                                    {
                                                        characters[i].gold[cIndex].amount = characters[i].gold[cIndex].amount - 1;
                                                    }
                                                }
                                            }
                                            else if(sendRank == "Platinum")
                                            {                                                
                                                for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                                {
                                                    if(characters[i].platinum[cIndex].id == sendID)
                                                    {
                                                        characters[i].platinum[cIndex].amount = characters[i].platinum[cIndex].amount - 1;
                                                    }
                                                }
                                            }

                                            if(takeRank == "Bronze")
                                            {
                                                var notFound = true;
                                                for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                                {
                                                    if(characters[i].bronze[cIndex].id == takeID)
                                                    {
                                                        notFound = false;
                                                        characters[i].bronze[cIndex].amount = characters[i].bronze[cIndex].amount + 1;
                                                    }
                                                }

                                                if(notFound)
                                                    characters[i].bronze.push({id: takeID, amount: 1})
                                            }
                                            else if(takeRank == "Silver")
                                            {
                                                var notFound = true;
                                                for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                                {
                                                    if(characters[i].silver[cIndex].id == takeID)
                                                    {
                                                        notFound = false;
                                                        characters[i].silver[cIndex].amount = characters[i].silver[cIndex].amount + 1;
                                                    }
                                                }

                                                if(notFound)
                                                    characters[i].silver.push({id: takeID, amount: 1})
                                            }
                                            else if(takeRank == "Gold")
                                            {
                                                var notFound = true;
                                                for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                                {
                                                    if(characters[i].gold[cIndex].id == takeID)
                                                    {
                                                        notFound = false;
                                                        characters[i].gold[cIndex].amount = characters[i].gold[cIndex].amount + 1;
                                                    }
                                                }

                                                if(notFound)
                                                    characters[i].gold.push({id: takeID, amount: 1})
                                            }
                                            else if(takeRank == "Platinum")
                                            {
                                                var notFound = true;
                                                for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                                {
                                                    if(characters[i].platinum[cIndex].id == takeID)
                                                    {
                                                        notFound = false;
                                                        characters[i].platinum[cIndex].amount = characters[i].platinum[cIndex].amount + 1;
                                                    }
                                                }
                                                
                                                if(notFound)
                                                    characters[i].platinum.push({id: takeID, amount: 1})
                                            }
            
                                            for(var index = 0; index < characters.length; index++)
                                            {
                                                if(characters[index].id == user.id)
                                                {
                                                    if(takeRank == "Bronze")
                                                    {   
                                                        for(var cIndex = 0; cIndex < characters[index].bronze.length; cIndex++)
                                                        {
                                                            if(characters[index].bronze[cIndex].id == takeID)
                                                            {
                                                                characters[index].bronze[cIndex].amount = characters[index].bronze[cIndex].amount - 1;
                                                            }
                                                        }
                                                    }
                                                    else if(takeRank == "Silver")
                                                    {
                                                        for(var cIndex = 0; cIndex < characters[index].silver.length; cIndex++)
                                                        {
                                                            if(characters[index].silver[cIndex].id == takeID)
                                                            {
                                                                characters[index].silver[cIndex].amount = characters[index].silver[cIndex].amount - 1;
                                                            }
                                                        }
                                                    }
                                                    else if(takeRank == "Gold")
                                                    {
                                                        for(var cIndex = 0; cIndex < characters[index].gold.length; cIndex++)
                                                        {
                                                            if(characters[index].gold[cIndex].id == takeID)
                                                            {
                                                                characters[index].gold[cIndex].amount = characters[index].gold[cIndex].amount - 1;
                                                            }
                                                        }
                                                    }
                                                    else if(takeRank == "Platinum")
                                                    {
                                                        for(var cIndex = 0; cIndex < characters[index].platinum.length; cIndex++)
                                                        {
                                                            if(characters[index].platinum[cIndex].id == takeID)
                                                            {
                                                                characters[index].platinum[cIndex].amount = characters[index].platinum[cIndex].amount - 1;
                                                            }
                                                        }
                                                    } 

                                                    if(sendRank == "Bronze")
                                                    {   
                                                        var notFound = true;
                                                        for(var cIndex = 0; cIndex < characters[index].bronze.length; cIndex++)
                                                        {
                                                            if(characters[index].bronze[cIndex].id == sendID)
                                                            {
                                                                notFound = false;
                                                                characters[index].bronze[cIndex].amount = characters[index].bronze[cIndex].amount + 1;
                                                            }
                                                        }

                                                        if(notFound)
                                                            characters[index].bronze.push({id: sendID, amount: 1})
                                                    }
                                                    else if(sendRank == "Silver")
                                                    {
                                                        var notFound = true;
                                                        for(var cIndex = 0; cIndex < characters[index].silver.length; cIndex++)
                                                        {
                                                            if(characters[index].silver[cIndex].id == sendID)
                                                            {
                                                                notFound = false;
                                                                characters[index].silver[cIndex].amount = characters[index].silver[cIndex].amount + 1;
                                                            }
                                                        }

                                                        if(notFound)
                                                            characters[index].silver.push({id: sendID, amount: 1})
                                                    }
                                                    else if(sendRank == "Gold")
                                                    {
                                                        var notFound = true;
                                                        for(var cIndex = 0; cIndex < characters[index].gold.length; cIndex++)
                                                        {
                                                            if(characters[index].gold[cIndex].id == sendID)
                                                            {
                                                                notFound = false;
                                                                characters[index].gold[cIndex].amount = characters[index].gold[cIndex].amount + 1;
                                                            }
                                                        }

                                                        if(notFound)
                                                            characters[index].gold.push({id: sendID, amount: 1})
                                                    }
                                                    else if(sendRank == "Platinum")
                                                    {
                                                        var notFound = true;
                                                        for(var cIndex = 0; cIndex < characters[index].platinum.length; cIndex++)
                                                        {
                                                            if(characters[index].platinum[cIndex].id == sendID)
                                                            {
                                                                notFound = false;
                                                                characters[index].platinum[cIndex].amount = characters[index].platinum[cIndex].amount + 1;
                                                            }
                                                        }

                                                        if(notFound)
                                                            characters[index].platinum.push({id: sendID, amount: 1})
                                                    } 

                                                    firebase.database().ref("characters/" + user.id).set(JSON.stringify(characters[index]))
                                                }
                                            }

                                            message.channel.send(`<@${message.author.id}> has accepted the trade request of <@${user.id}>\n<@${message.author.id}> has been given a ${takeRank} Ranked ${takeName}\n<@${user.id}> has been given a ${sendRank} Ranked ${sendName}`, {embed: {title: "***Trade Request Sent***", description: "<@" + user.id + "> Your trade request has been accepted by <@" + message.author.id + ">\n\n<@" + user.id + "> has been given a " + sendRank + " Ranked " + sendName + "\n<@" + message.author.id + "> has been given a " + takeRank + " Ranked " + takeName + ".", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                        else
                                            message.channel.send(`<@${message.author.id}> Failed to accept trade request of <@${user.id}>`, {embed: {title: "***Failed To Accept Trade Request***", description: "<@" + message.author.id + "> You must make sure that the cards being requested for the trade are owned by each respective user. This trade request is now invalid and will be deleted.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            
                                        characters[i].trades.splice(tradeIndex, 1);
                                    }
                                }

                                if(!requestCheck)
                                    message.channel.send("<@" + message.author.id + ">", {embed: {title: "***No Trade Request Found***", description: "<@" + message.author.id + "> You do not have any trade requests from <@" + user.id + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                message.channel.send("<@" + message.author.id + ">", {embed: {title: "***No User Tagged***", description: "<@" + message.author.id + "> You must tag another user to accept their trade request.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else if(args.toLowerCase().startsWith("trade decline"))
                        {
                            var user;
                            var mentions = message.mentions.users.array()

                            if(mentions.length > 0)
                                user = mentions[0];

                            var invalidTag = false;

                            if(user == null || user == undefined)
                                invalidTag = true;
                            else if(user.bot)
                                invalidTag = true;

                            var requestCheck = false;

                            if(!invalidTag)
                            {
                                for(var tradeIndex = 0; tradeIndex < characters[i].trades.length; tradeIndex++)
                                {
                                    if(characters[i].trades[tradeIndex].user == user.id)
                                    {
                                        requestCheck = true;
                                        characters[i].trades.splice(tradeIndex, 1);
                                        message.channel.send("<@" + message.author.id + "> has declined the trade request of <@" + user.id + ">", {embed: {title: "***Trade Request Declined***", description: "<@" + user.id + "> Your trade request has been declined by <@" + message.author.id + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }

                                if(!requestCheck)
                                    message.channel.send("<@" + message.author.id + ">", {embed: {title: "***No Trade Request Found***", description: "<@" + message.author.id + "> You do not have any trade requests from <@" + user.id + ">", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                message.channel.send("<@" + message.author.id + ">", {embed: {title: "***No User Tagged***", description: "<@" + message.author.id + "> You must tag another user to decline their trade request.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else if(args.toLowerCase().startsWith("trade list"))
                        {
                            if(characters[i].trades == null || characters[i].trades == undefined || characters[i].trades.length == 0)
                            {
                                message.channel.send("", {embed: {title: "***No Character Trade Requests Given***", description: "<@" + message.author.id + "> You do not have any trade requests from other users.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                var lists = []
                                var item = ""

                                var sendName = "ID - " + characters[i].trades[requestIndex].send.id,
                                takeName = "ID - " + characters[i].trades[requestIndex].take.id
                                for(var index = 0; index < database.length; index++)
                                {
                                    if(database[index].id == characters[i].trades[requestIndex].send.id)
                                    {
                                        sendName = database[index].name
                                    }

                                    if(database[index].id == characters[i].trades[requestIndex].take.id)
                                    {
                                        takeName = database[index].name
                                    }
                                }

                                for(var requestIndex = 0; requestIndex < characters[i].trades.length; requestIndex++)
                                {
                                    var text = "***Trade Request No." + (requestIndex + 1) + "***\n<@" + characters[i].trades[requestIndex].user + "> has requested to trade your " + characters[i].trades[requestIndex].send.rank + " " + sendName + " (ID - " + characters[i].trades[requestIndex].send.id + ") for a " + characters[i].trades[requestIndex].take.rank + " " + takeName + " (ID - " + characters[i].trades[requestIndex].take.id + ")"
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
                                    message.channel.send("", {embed: {title: "***No Character Trade Requests Given***", description: "<@" + message.author.id + "> You do not have any trade requests from other users.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                                else
                                {
                                    var userPromises = []
                                    for(var requestIndex = 0; requestIndex < characters[i].trades.length; requestIndex++)
                                    {
                                        userPromises.push(message.client.fetchUser(characters[i].trades[requestIndex].user)
                                        .then(user => {
                                            for(var index = 0; index < lists.length; index++)
                                            {
                                                lists[index] = lists[index].replace(RegExp("<@" + user.id + ">", "g"), user.tag)
                                            }
                                        }, rejection => {
                                                console.log(rejection.message);
                                        }));
                                    }

                                    Promise.all(userPromises).then(() => {
                                        for(var index = 0; index < lists.length; index++)
                                        {
                                            message.channel.send("<@" + message.author.id + ">", {embed: {title: "***List of Character Trade Requests (" + (index + 1) + "/" + lists.length + ")***", description: lists[index], color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                    })   
                                }
                            }
                        }
                        else
                        {
                            var user;
                            var mentions = message.mentions.users.array()

                            if(mentions.length > 0)
                                user = mentions[0];
                           
                            var sendRank = "", sendID = "", takeRank = "", takeID = ""

                            var parameters = args.toLowerCase().split("|")

                            if(parameters.length > 1)
                            {
                                var sendParam = parameters[1]
                                var takeParam = parameters[0]

                                if(sendParam.indexOf("bronze") > -1)
                                {
                                    sendRank = "Bronze"
                                }
                                else if(sendParam.indexOf("silver") > -1)
                                {
                                    sendRank = "Silver"
                                }
                                else if(sendParam.indexOf("gold") > -1)
                                {
                                    sendRank = "Gold"
                                }
                                else if(sendParam.indexOf("platinum") > -1)
                                {
                                    sendRank = "Platinum"
                                }

                                if(sendRank != "")
                                {
                                    var options = sendParam.replace(/,/g, "")
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
                                        sendID = ID
                                    }
                                }

                                
                                if(takeParam.indexOf("bronze") > -1)
                                {
                                    takeRank = "Bronze"
                                }
                                else if(takeParam.indexOf("silver") > -1)
                                {
                                    takeRank = "Silver"
                                }
                                else if(takeParam.indexOf("gold") > -1)
                                {
                                    takeRank = "Gold"
                                }
                                else if(takeParam.indexOf("platinum") > -1)
                                {
                                    takeRank = "Platinum"
                                }

                                if(takeRank != "")
                                {
                                    var options = takeParam.replace(/,/g, "")
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
                                        takeID = ID
                                    }
                                }
                            }

                            var invalidTag = false;

                            if(user == null || user == undefined)
                                invalidTag = true;
                            else if(user.bot)
                                invalidTag = true;

                            if(sendRank == "" || sendID == "" || takeRank == "" || takeID == "" || invalidTag)
                            {
                                message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Trade Details Not Given***", description: "<@" + message.author.id + "> You must specify the characters you want to trade and tag a user to send a trade request. E.g: `" + commandPrefix + "cc trade <your-character-rank> <your-character-id>|<other-character-rank> <other-character-id> @User`, `" + commandPrefix + "cc trade bronze 20|gold 20 @User` (In this example, you are placing a trade where you will trade your bronze character for another user's gold character)", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                var takeCheck = false, sendCheck = false, requestCheck = true;;

                                if(takeRank == "Bronze")
                                {
                                    for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                    {
                                        if(characters[i].bronze[cIndex].id == takeID)
                                        {
                                            if(characters[i].bronze[cIndex].amount > 0)
                                                takeCheck = true;
                                        }
                                    }
                                }
                                else if(takeRank == "Silver")
                                {
                                    for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                    {
                                        if(characters[i].silver[cIndex].id == takeID)
                                        {
                                            if(characters[i].silver[cIndex].amount > 0)
                                                takeCheck = true;
                                        }
                                    }
                                }
                                else if(takeRank == "Gold")
                                {
                                    for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                    {
                                        if(characters[i].gold[cIndex].id == takeID)
                                        {
                                            if(characters[i].gold[cIndex].amount > 0)
                                                takeCheck = true;
                                        }
                                    }
                                }
                                else if(takeRank == "Platinum")
                                {
                                    for(var cIndex = 0; cIndex < characters[i].platinum.length; cIndex++)
                                    {
                                        if(characters[i].platinum[cIndex].id == takeID)
                                        {
                                            if(characters[i].platinum[cIndex].amount > 0)
                                                takeCheck = true;
                                        }
                                    }
                                }

                                var userExists = false;
                                for(var index = 0; index < characters.length; index++)
                                {
                                    if(characters[index].id == user.id)
                                    {
                                        userExists = true;
                                        if(sendRank == "Bronze")
                                        {   
                                            for(var cIndex = 0; cIndex < characters[index].bronze.length; cIndex++)
                                            {
                                                if(characters[index].bronze[cIndex].id == sendID)
                                                {
                                                    if(characters[index].bronze[cIndex].amount > 0)
                                                        sendCheck = true;
                                                }
                                            }
                                        }
                                        else if(sendRank == "Silver")
                                        {
                                            for(var cIndex = 0; cIndex < characters[index].silver.length; cIndex++)
                                            {
                                                if(characters[index].silver[cIndex].id == sendID)
                                                {
                                                    if(characters[index].silver[cIndex].amount > 0)
                                                        sendCheck = true;
                                                }
                                            }
                                        }
                                        else if(sendRank == "Gold")
                                        {
                                            for(var cIndex = 0; cIndex < characters[index].gold.length; cIndex++)
                                            {
                                                if(characters[index].gold[cIndex].id == sendID)
                                                {
                                                    if(characters[index].gold[cIndex].amount > 0)
                                                        sendCheck = true;
                                                }
                                            }
                                        }
                                        else if(sendRank == "Platinum")
                                        {
                                            for(var cIndex = 0; cIndex < characters[index].platinum.length; cIndex++)
                                            {
                                                if(characters[index].platinum[cIndex].id == sendID)
                                                {
                                                    if(characters[index].platinum[cIndex].amount > 0)
                                                        sendCheck = true;
                                                }
                                            }
                                        } 

                                        for(var tradeIndex = 0; tradeIndex < characters[index].trades.length; tradeIndex++)
                                        {
                                            if(characters[index].trades[tradeIndex].user == message.author.id)
                                            {
                                                requestCheck = false;
                                            }
                                        }
                                    }
                                }

                                if(takeCheck && sendCheck && requestCheck && userExists)
                                {
                                    for(var index = 0; index < characters.length; index++)
                                    {
                                        if(characters[index].id == user.id)
                                        {
                                            characters[index].trades.push({user: message.author.id, send: {rank: sendRank, id: sendID}, take: {rank: takeRank, id: takeID}})
                                            firebase.database().ref("characters/" + user.id).set(JSON.stringify(characters[index]))
                                        }
                                    }

                                    var sendName = "ID - " + sendID,
                                    takeName = "ID - " + takeID
                                    for(var index = 0; index < database.length; index++)
                                    {
                                        if(database[index].id == sendID)
                                        {
                                            sendName = database[index].name
                                        }
    
                                        if(database[index].id == takeID)
                                        {
                                            takeName = database[index].name
                                        }
                                    }

                                    message.channel.send(`<@${message.author.id}> has sent a trade request to <@${user.id}>`, {embed: {title: "***Trade Request Sent***", description: "<@" + user.id + "> You have been sent a trade request from <@" + message.author.id + "> to trade your " + sendRank + " Ranked " + sendName + " for their " + takeRank + " Ranked " + takeName + ".\n\nTo accept this trade, use the command `" + commandPrefix + "cc trade accept @" + message.author.tag + "` and to decline, use the command `" + commandPrefix + "cc trade decline @" + message.author.tag + "`. Use `" + commandPrefix + "cc trade list` to view a list of all trade requests you have received.\n\nThis trade request is undoable and can be accepted/denied by the receiver at any moment.", color: 65339, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                }
                                else
                                    message.channel.send(`<@${message.author.id}> Failed to send trade request.`, {embed: {title: "***Failed To Send Trade Request***", description: "<@" + message.author.id + "> You must make sure that the cards being requested for the trade are owned by each respective user. If the user already has a trade request from you that they have not responded to, you must wait until they respond.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                    }
                    else if (args.toLowerCase().startsWith("buy bronze"))
                    {
                        const timestamp = (new Date(Date.now()).toJSON());
                        
                        if(!IndexRef.subtractTokens(message.author.id, bronzeAmount))
                        {
                            message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Failed To Buy Bronze Pack***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase a Bronze Character Pack. You need " + numberWithCommas(bronzePrice) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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
                            message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Failed To Buy Silver Pack***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase a Silver Character Pack. You need " + numberWithCommas(silverPrice) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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
                            message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Failed To Buy Gold Pack***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase a Gold Character Pack. You need " + numberWithCommas(goldPrice) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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
                                    message.channel.send("<@" + message.author.id + ">", {embed: {title: "***Failed To Buy Platinum Character***", description: "<@" + message.author.id + "> You do not have enough tokens to purchase a Platinum Ranked Character. You need " + numberWithCommas(platinumPrice) + " tokens, while you only have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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

                                    for(var cIndex = 0; cIndex < characters[i].bronze.length; cIndex++)
                                    {
                                        if(characters[i].bronze[cIndex].id == ID)
                                        {
                                            characters[i].bronze[cIndex].amount = characters[i].bronze[cIndex].amount - 1
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].silver.length; cIndex++)
                                    {
                                        if(characters[i].silver[cIndex].id == ID)
                                        {
                                            characters[i].silver[cIndex].amount = characters[i].silver[cIndex].amount - 1
                                        }
                                    }

                                    for(var cIndex = 0; cIndex < characters[i].gold.length; cIndex++)
                                    {
                                        if(characters[i].gold[cIndex].id == ID)
                                        {
                                            characters[i].gold[cIndex].amount = characters[i].gold[cIndex].amount - 1
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
                                            + "\nPlatinum Versions Owned: " + numberWithCommas(platinumAmount) + "\n\nFor more detailed info on this character, use `" + commandPrefix + "cc info " + ID + "`."

                                            message.channel.send("<@" + message.author.id + "> ***Platinum Character Purchased***", {embed: {title: "***You Purchased A Platinum Ranked " + database[index].name + " - " + database[index].id + "***", description: details, color: 13487565, timestamp: timestamp, thumbnail:{url: database[index].image.url}, image: {url: database[index].image.url}, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                        }
                                    }
                                }
                            }
                            else
                            {
                                message.channel.send("", {embed: {title: "***Failed To Buy Platinum Character***", description: "<@" + message.author.id + "> You must own at least one Bronze, Silver and Gold version of " + name + " to get the Platinum Rank. They will be taken along with " + numberWithCommas(platinumPrice) + " tokens to complete the purchase.", color: 16711680, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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

                                if(mentions.length > 0)
                                    user = mentions[0];

                                var invalidTag = false;

                                if(user == null || user == undefined)
                                    invalidTag = true;
                                else if(user.bot)
                                    invalidTag = true;

                                if(user != null && user != undefined && user.id != message.author.id && !invalidTag)
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
                                    + "\nPlatinum Versions Owned: " + numberWithCommas(platinumAmount) + "\n\n"

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

                                        message.channel.send("", {embed: {title: "***Calamity Cards Profile for " + user.username + "***", description: "***__Bronze Characters__***\nUnique Bronze Characters Owned: " + numberWithCommas(uniqueBronzeChars) + "/" + numberWithCommas(maxID) + "\nTotal Bronze Cards Owned: " + numberWithCommas(totalBronzeChars) + "\n\n***__Silver Characters__***\nUnique Silver Characters Owned: " + numberWithCommas(uniqueSilverChars) + "/" + numberWithCommas(maxID) + "\nTotal Silver Cards Owned: " + numberWithCommas(totalSilverChars) + "\n\n***__Gold Characters__***\nUnique Gold Characters Owned: " + numberWithCommas(uniqueGoldChars) + "/" + numberWithCommas(maxID) + "\nTotal Gold Cards Owned: " + numberWithCommas(totalGoldChars) + "\n\n***__Platinum Characters__***\nUnique Platinum Characters Owned: " + numberWithCommas(uniquePlatinumChars) + "/" + numberWithCommas(maxID) + "\nTotal Platinum Cards Owned: " + numberWithCommas(totalPlatinumChars) + " (Shown in leaderboards - use `" + commandPrefix + "cc ranks`)\n\n***__Overall Characters__***\nOverall Unique Characters Owned: " + numberWithCommas(totalUniqueChars) + "/" + numberWithCommas(maxID*4) + "\nOverall Total Cards Owned: " + numberWithCommas(totalChars) + "\n\n" + user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }

                                if(!characterFound)
                                {
                                    message.channel.send("", {embed: {title: "***Calamity Cards Profile for " + user.username + "***", description: "***__Bronze Characters__***\nUnique Bronze Characters Owned: " + numberWithCommas(uniqueBronzeChars) + "/" + numberWithCommas(maxID) + "\nTotal Bronze Cards Owned: " + numberWithCommas(totalBronzeChars) + "\n\n***__Silver Characters__***\nUnique Silver Characters Owned: " + numberWithCommas(uniqueSilverChars) + "/" + numberWithCommas(maxID) + "\nTotal Silver Cards Owned: " + numberWithCommas(totalSilverChars) + "\n\n***__Gold Characters__***\nUnique Gold Characters Owned: " + numberWithCommas(uniqueGoldChars) + "/" + numberWithCommas(maxID) + "\nTotal Gold Cards Owned: " + numberWithCommas(totalGoldChars) + "\n\n***__Platinum Characters__***\nUnique Platinum Characters Owned: " + numberWithCommas(uniquePlatinumChars) + "/" + numberWithCommas(maxID) + "\nTotal Platinum Cards Owned: " + numberWithCommas(totalPlatinumChars) + "\n\n***__Overall Characters__***\nOverall Unique Characters Owned: " + numberWithCommas(totalUniqueChars) + "/" + numberWithCommas(maxID*4) + "\nOverall Total Cards Owned: " + numberWithCommas(totalChars) + "\n\n" + user.username + " currently has " + numberWithCommas(IndexRef.getTokens(user.id)) + " tokens.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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

                            message.channel.send("", {embed: {title: "***Calamity Cards Profile for " + message.author.username + "***", description: "***__Bronze Characters__***\nUnique Bronze Characters Owned: " + numberWithCommas(uniqueBronzeChars) + "/" + numberWithCommas(maxID) + "\nTotal Bronze Cards Owned: " + numberWithCommas(totalBronzeChars) + "\n\n***__Silver Characters__***\nUnique Silver Characters Owned: " + numberWithCommas(uniqueSilverChars) + "/" + numberWithCommas(maxID) + "\nTotal Silver Cards Owned: " + numberWithCommas(totalSilverChars) + "\n\n***__Gold Characters__***\nUnique Gold Characters Owned: " + numberWithCommas(uniqueGoldChars) + "/" + numberWithCommas(maxID) + "\nTotal Gold Cards Owned: " + numberWithCommas(totalGoldChars) + "\n\n***__Platinum Characters__***\nUnique Platinum Characters Owned: " + numberWithCommas(uniquePlatinumChars) + "/" + numberWithCommas(maxID) + "\nTotal Platinum Cards Owned: " + numberWithCommas(totalPlatinumChars) + "\n\n***__Overall Characters__***\nOverall Unique Characters Owned: " + numberWithCommas(totalUniqueChars) + "/" + numberWithCommas(maxID*4) + "\nOverall Total Cards Owned: " + numberWithCommas(totalChars) + "\n\nYou currently have " + numberWithCommas(IndexRef.getTokens(message.author.id)) + " tokens.", color: 16711680, thumbnail: {"url": thumbnail}, timestamp: timestamp, footer: {icon_url: message.client.user.avatarURL,text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
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