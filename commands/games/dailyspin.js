const command = require("discord.js-commando");
var IndexRef = require("../../index.js")
var firebase = require("firebase");
var signedIntoFirebase = false;
var patrons = []
var listening = false;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signedIntoFirebase = true;

        if(!listening)
        {
            firebase.database().ref("patrons").on("child_added", function(snapshot){
                patrons.push(snapshot.key)
            })
            
            firebase.database().ref("patrons").on("child_removed", function(snapshot){
                for(var i = 0; i < patrons.length; i++)
                {
                    if(patrons[i] == snapshot.key)
                    {
                        patrons[i] = ""
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

const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DBL_TOKEN);

var userSpins = []

class DailySpinCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "dailyspin",
            group: "games",
            memberName: "dailyspin",
            description: "Spin the prize wheel once a day for War Tokens! You can only spin the wheel if you have voted for the bot. Patreon supporters get a chance to win the Golden Prize.",
            examples: ["`!dailyspin`"]
        });
    }

    async run(message, args)
    {
        if(!signedIntoFirebase || !IndexRef.isInit)
            return;
            
        IndexRef.addCommandCounter(message.author.id);
        IndexRef.initTokens(message.author.id)
        
        var existingData = false;
        for(var i = 0; i < userSpins.length; i++)
        {
            if(userSpins[i].userID == message.author.id)
            {
                existingData = true;
            }
        }

        var promises = []

        if(!existingData)
        {
            promises.push(firebase.database().ref("usersettings/" + message.author.id + "/dailyspin").once('value').then(function(snapshot){
                if(snapshot.val() == null)
                {
                    var timestamp = (new Date());
                    timestamp.setHours(0, 0, 0, 0)
                    userSpins.push({userID: message.author.id, dailyspin: JSON.stringify((timestamp.toJSON()))})
                }
                else
                {
                    userSpins.push({userID: message.author.id, dailyspin: snapshot.val()})
                }
            }))
        }

        var hasVoted = false;
        promises.push(dbl.hasVoted(message.author.id).then(voted => {
            hasVoted = voted;
        }).catch(error => console.log("DBL Error - " + error)))

        var isPatron = false;
        for(var i = 0; i < patrons.length; i++)
        {
            if(patrons[i] == message.author.id)
            {
                isPatron = true;
            }
        }

        setImmediate(() => {
            Promise.all(promises).then(() => {
                for(var i = 0; i < userSpins.length; i++)
                {
                    if(userSpins[i].userID == message.author.id)
                    {
                        const date = new Date(JSON.parse(userSpins[i].dailyspin))
                        var todayDate = (new Date())
                        todayDate.setHours(0, 0, 0, 0)
                        const today = todayDate
    
                        const userSpinsIndex = i;
    
                        if(today.getTime() >= date.getTime())
                        {
                            firebase.database().ref("usersettings/" + message.author.id + "/lastvote").once("value").then(function(snapshot)
                            {
                                if(snapshot.val() == null)
                                {
                                    if(hasVoted)
                                    {
                                        message.channel.send("<@" + message.author.id + "> ***Spinning The Wheel...***", {files: ["wheel.png"]})
                                        var nextDayDate = (new Date(today.getTime() + (24*60*60*1000)));
                                        nextDayDate.setHours(0, 0, 0, 0)
                                        const nextDay = nextDayDate.toJSON()
                                        userSpins[userSpinsIndex].dailyspin = JSON.stringify(nextDay)
                                        setTimeout(() => {
                                            var chance = Math.random()
                                            var prize = 0;
                                            var goldenPrize = false;
            
                                            if(chance >= 0.95)
                                            {
                                                if(chance >= 0.975 && isPatron)
                                                {
                                                    prize = 1000000
                                                    goldenPrize = true;
                                                }
                                                else
                                                {
                                                    prize = 500000
                                                }
                                            }
                                            else if(chance >= 0.925)
                                            {
                                                prize = 450000
                                            }
                                            else if(chance >= 0.875)
                                            {
                                                prize = 400000
                                            }
                                            else if(chance >= 0.85)
                                            {
                                                prize = 350000
                                            }
                                            else if(chance >= 0.825)
                                            {
                                                prize = 300000
                                            }
                                            else if(chance >= 0.8)
                                            {
                                                prize = 250000
                                            }
                                            else if(chance >= 0.775)
                                            {
                                                prize = 200000
                                            }
                                            else if(chance >= 0.6)
                                            {
                                                prize = 150000
                                            }
                                            else if(chance >= 0.2)
                                            {
                                                prize = 100000
                                            }
                                            else 
                                            {
                                                prize = 50000
                                            }
            
                                            IndexRef.addTokens(message.author.id, prize)
                                            firebase.database().ref("usersettings/" + message.author.id + "/dailyspin").set(JSON.stringify(nextDay).replace(/"/g, ""))
            
                                            var prizeMessage = ""
            
                                            if(goldenPrize)
                                            {
                                                prizeMessage = "the ***Golden Prize*** for"
                                            }
            
                                            const addMessage = prizeMessage
            
                                            setTimeout(() => {
                                                message.channel.send("", {embed: {title: "***Daily Spin***", description: "<@" + message.author.id + "> Congrats! :tada:\n\nYou have won " + addMessage + " ***" + numberWithCommas(prize) + " War Tokens!*** Remember to spin the wheel again on the next day.", color: 16761856, timestamp: nextDay, footer: {icon_url: message.client.user.avatarURL, text: "Next Spin on"}}}).catch(error => console.log("Send Error - " + error));
                                                if(!isPatron)
                                                {
                                                    message.channel.send("", {embed: {title: "***Daily Spin Golden Prize***", description: "<@" + message.author.id + "> You can get a chance to win the Golden Prize by ***[supporting us on Patreon](https://www.patreon.com/merriemweebster)***.\n\n\n***[Patreon supporters also get weekly tokens.](https://www.patreon.com/merriemweebster)***", color: 16761856, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL, text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                                message.channel.send("", {embed: {title: "***Purchase War Tokens***", description: "<@" + message.author.id + "> ***[You can also purchase War Tokens on our website. Special Weekend Sales for War Tokens every Friday, Saturday and Sunday.](https://slavbot.com/shop)***", color: 16761856, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL, text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            }, 500)
                                        }, 2000)
                                    }
                                    else
                                    {
                                        message.channel.send("", {embed: {title: "***Daily Spin***", description: "<@" + message.author.id + "> You have not yet voted for a daily spin.\n\n***[Vote here to spin the wheel!](https://discordbots.org/bot/319533843482673152/vote)***", color: 16761856, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL, text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }
                                else
                                {
                                    var lastVotedTime = snapshot.val()

                                    if(lastVotedTime.indexOf("\"") > -1)
                                    {
                                        lastVotedTime = lastVotedTime.replace(/"/g, "")
                                        firebase.database().ref("usersettings/" + message.author.id + "/lastvote").set(lastVotedTime)
                                    }
                                    
                                    var lastVotedDate = new Date(lastVotedTime)
    
                                    if(today.getTime() < (lastVotedDate.getTime() + 43200000) || hasVoted)
                                    {
                                        message.channel.send("<@" + message.author.id + "> ***Spinning The Wheel...***", {files: ["wheel.png"]})
                                        var nextDayDate = (new Date(today.getTime() + (24*60*60*1000)));
                                        nextDayDate.setHours(0, 0, 0, 0)
                                        const nextDay = nextDayDate.toJSON()
                                        userSpins[userSpinsIndex].dailyspin = JSON.stringify(nextDay)
                                        setTimeout(() => {
                                            var chance = Math.random()
                                            var prize = 0;
                                            var goldenPrize = false;
            
                                            if(chance >= 0.95)
                                            {
                                                if(chance >= 0.975 && isPatron)
                                                {
                                                    prize = 1000000
                                                    goldenPrize = true;
                                                }
                                                else
                                                {
                                                    prize = 500000
                                                }
                                            }
                                            else if(chance >= 0.925)
                                            {
                                                prize = 450000
                                            }
                                            else if(chance >= 0.875)
                                            {
                                                prize = 400000
                                            }
                                            else if(chance >= 0.85)
                                            {
                                                prize = 350000
                                            }
                                            else if(chance >= 0.825)
                                            {
                                                prize = 300000
                                            }
                                            else if(chance >= 0.8)
                                            {
                                                prize = 250000
                                            }
                                            else if(chance >= 0.775)
                                            {
                                                prize = 200000
                                            }
                                            else if(chance >= 0.6)
                                            {
                                                prize = 150000
                                            }
                                            else if(chance >= 0.2)
                                            {
                                                prize = 100000
                                            }
                                            else 
                                            {
                                                prize = 50000
                                            }
            
                                            IndexRef.addTokens(message.author.id, prize)
                                            firebase.database().ref("usersettings/" + message.author.id + "/dailyspin").set(JSON.stringify(nextDay).replace(/"/g, ""))
            
                                            var prizeMessage = ""
            
                                            if(goldenPrize)
                                            {
                                                prizeMessage = "the ***Golden Prize*** for"
                                            }
            
                                            const addMessage = prizeMessage
            
                                            setTimeout(() => {
                                                message.channel.send("", {embed: {title: "***Daily Spin***", description: "<@" + message.author.id + "> Congrats! :tada:\n\nYou have won " + addMessage + " ***" + numberWithCommas(prize) + " War Tokens!*** Remember to spin the wheel again on the next day.", color: 16761856, timestamp: nextDay, footer: {icon_url: message.client.user.avatarURL, text: "Next Spin on"}}}).catch(error => console.log("Send Error - " + error));
                                                if(!isPatron)
                                                {
                                                    message.channel.send("", {embed: {title: "***Daily Spin Golden Prize***", description: "<@" + message.author.id + "> You can get a chance to win the Golden Prize by ***[supporting us on Patreon](https://www.patreon.com/merriemweebster)***.", color: 16761856, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL, text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                                }
                                                message.channel.send("", {embed: {title: "***Purchase War Tokens***", description: "<@" + message.author.id + "> ***[You can also purchase War Tokens on our website. Special Weekend Sales for War Tokens every Friday, Saturday and Sunday.](https://slavbot.com/shop)***", color: 16761856, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL, text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                            }, 500)
                                        }, 2000)
                                    }
                                    else
                                    {
                                        message.channel.send("", {embed: {title: "***Daily Spin***", description: "<@" + message.author.id + "> You have not yet voted for a daily spin.\n\n***[Vote here to spin the wheel!](https://discordbots.org/bot/319533843482673152/vote)***", color: 16761856, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL, text: "Sent on"}}}).catch(error => console.log("Send Error - " + error));
                                    }
                                }
                            })
                        }
                        else
                        {
                            message.channel.send("", {embed: {title: "***Daily Spin***", description: "<@" + message.author.id + "> You have already spun the wheel today.", color: 16761856, timestamp: date, footer: {icon_url: message.client.user.avatarURL, text: "Next Spin on"}}}).catch(error => console.log("Send Error - " + error));
                        }
                    }
                }
            })
        })
    }
}

module.exports = DailySpinCommand;