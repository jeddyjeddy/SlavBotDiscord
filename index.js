const commando = require("discord.js-commando");
const bot = new commando.Client({
    owner: "281876391535050762",
    unknownCommandResponse: false});

const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DBL_TOKEN, bot);

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

dbl.on('posted', () => {
    console.log('Server count posted!');
});
    
dbl.on('error', e => {
console.log(`Oops! ${e}`);
});

bot.on('guildDelete', mem => {
    if(signedIntoFirebase)
    {
        var channels = mem.channels.array();
        for(var i = 0; i < channels.length; i++)
        {
            firebase.database().ref("serversettings/" + channels[i].id).remove();
        }
        firebase.database().ref("serversettings/" + mem.id).remove();
    }
});

var allSwearCounters = [{key: "Key", counter: null}] 
var allThotCounters = [{key: "Key", counter: null}]
var responseSettings = [{key: "Key", respond: true}] 
var userCommandUsage = [{key: "Key", uses: 0, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250}] 

var localGetResponse = (guild) => {
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(guild.id == responseSettings[i].key)
        {
            return responseSettings[i].respond;
        }
    }
    firebase.database().ref("serversettings/" + guild.id).once('value').then(function(snapshot) {
        if(snapshot.val() == null)
        {
            migrateServerID(guild);
        }
        else
        {
            if(snapshot.child("respond").val() == null)
            {
                responseSettings.push({key: guild.id, respond: true})
            }
            else if(snapshot.child("respond").val() === true)
            {
                responseSettings.push({key: guild.id, respond: true})
            }
            else if(snapshot.child("respond").val() === false)
            {
                responseSettings.push({key: guild.id, respond: false})
            }
        }
        
    })
    return false;
}

var localChangeResponse = (guildID, setting) => {
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(guildID == responseSettings[i].key)
        {
            responseSettings[i].respond = setting;
            if(signedIntoFirebase)
            {
                firebase.database().ref("serversettings/" + guildID + "/respond").set(setting);
            }
        }
    }
}

var muteData = [{key: "Key", role: "", data: null}]

var getRoleName = (guildID) => {
    for(var i = 0; i < muteData.length; i++)
    {
        if(guildID == muteData[i].key)
        {
            return muteData[i].role;
        }
    }

    addGuild(guildID, "Server-wide Mute")
    return "Server-wide Mute";
}

var setRoleName = (guildID, name) => {
    var changed = false;
    for(var i = 0; i < muteData.length; i++)
    {
        if(guildID == muteData[i].key)
        {
            changed = true;
            muteData[i].role = name;
            if(signedIntoFirebase)
            {
                firebase.database().ref("serversettings/" + guildID + "/mutedusers").set(JSON.stringify(muteData[i]))
            }
        }
    }

    if(!changed)
    {
        addGuild(guildID, name)
    }
}

var addMutedUser = (guildID, userID, length) => {
    for(var i = 0; i < muteData.length; i++)
    {
        if(guildID == muteData[i].key)
        {
            if(muteData[i].data == null)
            {
                muteData[i].data = [{key: userID, time: length}]
                if(signedIntoFirebase)
                {
                    firebase.database().ref("serversettings/" + guildID + "/mutedusers").set(JSON.stringify(muteData[i]))
                }
                return true;
            }
            else
            {
                var hasUser = false;
                for(var dataIndex = 0; dataIndex < muteData[i].data.length; dataIndex++)
                {
                    if(muteData[i].data[dataIndex].key == userID)
                    {
                        hasUser = true;
                    }
                }

                if(!hasUser)
                {
                    muteData[i].data.push({key: userID, time: length});
                    if(signedIntoFirebase)
                    {
                        firebase.database().ref("serversettings/" + guildID + "/mutedusers").set(JSON.stringify(muteData[i]))
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }

    getRoleName(guildID);
    return false;
}

var removeMutedUser = (guildID, userID) => {
    for(var i = 0; i < muteData.length; i++)
    {
        if(guildID == muteData[i].key)
        {
            if(muteData[i].data != null)
            {
                for(var dataIndex = 0; dataIndex < muteData[i].data.length; dataIndex++)
                {
                    if(muteData[i].data[dataIndex].key == userID)
                    {
                        muteData[i].data.splice(dataIndex, 1);
                        
                        if(muteData[i].data.length == 0)
                            muteData[i].data = null

                        if(signedIntoFirebase)
                        {
                            firebase.database().ref("serversettings/" + guildID + "/mutedusers").set(JSON.stringify(muteData[i]))
                        }

                        return;
                    }
                }
            }
        }
    }
}

var addGuild = (guildID, name) => {
    var added = false;
    for(var i = 0; i < muteData.length; i++)
    {
        if(guildID == muteData[i].key)
        {
            added = true;
        }
    }

    if(!added)
    {
        muteData.push({key: guildID, role: name, data: null})
    }

    if(signedIntoFirebase)
    {
        firebase.database().ref("serversettings/" + guildID + "/mutedusers").set(JSON.stringify(muteData[i]))
    }
}

var migrateServerID = (guild) =>
{
    //If server ID in serversettings returns null
    var channels = guild.channels.array();
    var alreadyFoundData = false;
    console.log("Migrating " + guild.id)
    for(var i = 0; i < channels.length; i++)
    {
        const checkIndex = i;
        firebase.database().ref("serversettings/" + channels[i].id).once('value').then(function(snapshot) {
            if(snapshot.val() != null)
            {
                if(!alreadyFoundData)
                {
                    console.log("Previous data found for " + guild.id)
                    firebase.database().ref("serversettings/" + guild.id).set(snapshot.val());
                    alreadyFoundData = true;
                }
                else
                {
                    snapshot.ref.remove();
                }
            }

            if(checkIndex == channels.length - 1)
            { 
                console.log("Migrating over " + guild.id)
                var responseCheck = false;
                for(var index = 0; index < responseSettings.length; index++)
                {
                    if(guild.id == responseSettings[index].key)
                    {
                          responseCheck = true;
                    }
                }

                if(!responseCheck)
                {
                    if(alreadyFoundData)
                    {
                        localGetResponse(guild);
                    }
                    else
                    {
                        responseSettings.push({key: guild.id, respond: true});
                    }
                }

                firebase.database().ref("serversettings/" + guild.id).once('value').then(function(snapshot) {
                    if(snapshot.val() == null)
                    {
                        console.log("Adding new data for " + guild.id)
                        firebase.database().ref("serversettings/" + guild.id + "/respond").set(true)
                    }
                })
            }
        })
    }
}

var getUserCommandCounter = (userID) => {

    for(var i = 0; i < userCommandUsage.length; i++)
    { 
        if(userCommandUsage[i].key == userID)
        {
            return userCommandUsage[i].uses;
        }
    }

    
    if(signedIntoFirebase)
    {
        userCommandUsage.push({key: userID, uses: 0, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250});
    }
    
    return 0;
}

var commandCounterChange = (userID) => {
    if(!signedIntoFirebase || userCommandUsage == [{key: "Key", uses: 0, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250}])
    {
        commandCounterChange(userID);
        return;
    }

    var isStored = false;
    for(var index = 0; index < userCommandUsage.length; index++)
    {
        if(userCommandUsage[index].key == userID) 
        {
            isStored = true;
            userCommandUsage[index].uses += 1;
            const i = index;
            dbl.hasVoted(userID).then(voted => {
                if (!voted)
                {
                    if(userCommandUsage[i].requestsSent < 3)
                    {
                        dbl.isWeekend().then(weekend => {
                            if (weekend)
                            {
                                if(userCommandUsage[i].uses >= userCommandUsage[i].weekendUsesCheck)
                                {
                                    console.log("Sending Weekend Request")
                                    bot.fetchUser(userID)
                                    .then(user => {
                                            user.send("You have sent " + userCommandUsage[i].uses + " command requests to Slav Bot! Thank you for your support! You can help Slav Bot grow even further by voting for it on DBL. Votes made during the weekends are counted as double votes! https://discordbots.org/bot/319533843482673152/vote").catch(error => console.log("Send Error - " + error));
                                    }, rejection => {
                                            console.log(rejection.message);
                                    });

                                    userCommandUsage[i].weekendUsesCheck = userCommandUsage[i].uses + 100;
                                    userCommandUsage[i].requestsSent += 1;
                                    firebase.database().ref("commandusage").set(JSON.stringify(userCommandUsage));
                                }
                                else
                                {
                                    firebase.database().ref("commandusage").set(JSON.stringify(userCommandUsage));
                                }
                            }
                            else
                            {
                                if(userCommandUsage[i].uses >= userCommandUsage[i].usesCheck)
                                {
                                    console.log("Sending Regular Request")
                                    bot.fetchUser(userID)
                                    .then(user => {
                                            user.send("You have sent " + userCommandUsage[i].uses + " command requests to Slav Bot! Thank you for your support! You can help Slav Bot grow even further by voting for it on DBL. https://discordbots.org/bot/319533843482673152/vote").catch(error => console.log("Send Error - " + error));
                                    }, rejection => {
                                            console.log(rejection.message);
                                    });
                                
                                    userCommandUsage[i].usesCheck = userCommandUsage[i].uses + 250;
                                    userCommandUsage[i].requestsSent += 1;
                                    firebase.database().ref("commandusage").set(JSON.stringify(userCommandUsage));
                                }
                                else
                                {
                                    firebase.database().ref("commandusage").set(JSON.stringify(userCommandUsage));
                                }   
                            }
                        });
                    }
                    else
                    {
                        dbl.getVotes().then(votes => {
                            if (votes.find(vote => vote.id == userID))
                            {
                                userCommandUsage[i].requestsSent = 0;
                                firebase.database().ref("commandusage").set(JSON.stringify(userCommandUsage));
                                commandCounterChange(userID)
                            }
                            else
                            {
                                dbl.isWeekend().then(weekend => {
                                    if (weekend)
                                    {
                                        if(userCommandUsage[i].uses >= userCommandUsage[i].weekendUsesCheck)
                                        {
                                            userCommandUsage[i].weekendUsesCheck = userCommandUsage[i].uses + 100;
                                            userCommandUsage[i].requestsSent += 1;
                                        }
                                    }
                                    else
                                    {
                                        if(userCommandUsage[i].uses >= userCommandUsage[i].usesCheck)
                                        {
                                            userCommandUsage[i].usesCheck = userCommandUsage[i].uses + 250;                                 
                                            userCommandUsage[i].requestsSent += 1;
                                        }
                                    }

                                    if(userCommandUsage[i].requestsSent > 5)
                                    {
                                        userCommandUsage[i].requestsSent = 0;
                                    }

                                    firebase.database().ref("commandusage").set(JSON.stringify(userCommandUsage));
                                });
                            }
                        }); 
                    }
                }
                else
                {
                    firebase.database().ref("commandusage").set(JSON.stringify(userCommandUsage));
                }
            });
        }
    }

    if(!isStored)
    {
        userCommandUsage.push({key: userID, uses: 1, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250});
        firebase.database().ref("commandusage").set(JSON.stringify(userCommandUsage));
    }
}

var getLeaderboardRankings = () =>
{
    var leaderboardRankings = userCommandUsage.sort(commandUsageAscending);

    if(leaderboardRankings.length > 10)
        leaderboardRankings.splice(10);

    return leaderboardRankings;
}

var getLocalLeaderboardRankings = (members) =>
{
    var leaderboardRankings = [];

    for(var i = 0; i < userCommandUsage.length; i++)
    {
        var isGuildMember = false;
        for(var memberIndex = 0; memberIndex < members.length; memberIndex++)
        {
            if(userCommandUsage[i].key == members[memberIndex])
            {
                isGuildMember = true;
            }
        }

        if(isGuildMember)
        {
            leaderboardRankings.push(userCommandUsage[i]);
        }
    }

    var localLeaderboardRankings = leaderboardRankings.sort(commandUsageAscending);


    if(localLeaderboardRankings.length > 10)
        localLeaderboardRankings.splice(10);

    return localLeaderboardRankings;
}

function commandUsageAscending(a, b)
{
    if (a.uses < b.uses)
        return 1;
    if (a.uses > b.uses)
        return -1;
    return 0;
}

var ResponseFunctions = module.exports = {
 getResponse: function(guild) {
    return localGetResponse(guild)
},

 changeResponse: function(guildID, setting) {
    localChangeResponse(guildID, setting)
},

addCommandCounter: function(userID){
    commandCounterChange(userID)
},
getCommandCounter: function(userID)
{
    return getUserCommandCounter(userID)
},
getLeaderboards: function()
{
    return getLeaderboardRankings();
},
getLocalLeaderboards: function(members)
{
    return getLocalLeaderboardRankings(members);
},

getRoleName: function(guildID)
{
    return getRoleName(guildID);
},

setRoleName: function(guildID, name)
{
    setRoleName(guildID, name);
},

addMutedUser: function(guildID, userID, length)
{
    return addMutedUser(guildID, userID, length);
},

removeMutedUser: function(guildID, userID)
{
    removeMutedUser(guildID, userID);
}
}

var firebase = require("firebase");
var config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.PROJECT_ID + ".firebaseapp.com",
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.PROJECT_ID + ".appspot.com",
    databaseURL: "https://" + process.env.PROJECT_ID + ".firebaseio.com"
  };
firebase.initializeApp(config);
bot.registry.registerGroup("textshit", "Text Shit");
bot.registry.registerGroup("imageshit", "Image Shit");
bot.registry.registerGroup("games", "Games");
bot.registry.registerGroup("moderation", "Moderation");

bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

const responses1 = ["ur daddy left u", "ur grandpap a trap", "ur nan garbage can", "I'd insult ur mother, but even a whore like her is better than you.", "ur mum gayest"];
const responses2 = ["still u", "undoubtedly u", "no u", "ur dad", "ur face", "don't be a cuck"];
const curseResponses = ["You people sicken me", "Do none of you have anything better to do?", "You should have your mouth washed out with soap", "Do you kiss your mother with that mouth?", "Didn't know we had sailors here", "God is watching", "God is disappointed", "Your parents must be proud"];

var signedIntoFirebase = false;
var schedule = require('node-schedule');

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("signed in to firebase");
      signedIntoFirebase = true;
      firebase.database().ref("commandusage").once('value').then(function(snapshot) {
        if(snapshot.val() != null)
        {
            userCommandUsage = JSON.parse(snapshot.val())
        }
      })

      firebase.database().ref("serversettings").once('value').then(function(snapshot) {
        if(snapshot.val() != null)
        {
            snapshot.forEach(function(childSnap){
                if(childSnap.child("mutedusers").val() != null)
                {
                    var data = JSON.parse(childSnap.child("mutedusers").val());

                    var guild;
                    var guilds = bot.guilds.array()

                    for(var i = 0; i < guilds.length; i++)
                    {
                        if(guilds[i].id == data.key)
                        {
                            guild = guilds[i];
                        }
                    }

                    var muteRole = guild.roles.find("name", data.role)

                    if(data.key != childSnap.key)
                    {
                        data.key = childSnap.key;
                        if(muteRole != null && guild != undefined)
                        {
                            var member;
                            var members = guild.members.array()
        
                            for(var index = 0; index < members.length; index++)
                            {
                                if(members[index].id == data.data[i].key)
                                {
                                    member = members[index];
                                }
                            }

                            if(member == undefined)
                                return;

                            if(member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_ROLES")){
                                var allChannels = guild.channels.array()
                                allChannels.forEach(channel => {
                                    channel.overwritePermissions(muteRole, {SEND_MESSAGES: false, ATTACH_FILES: false, ADD_REACTIONS: false})
                                });
                            }
                        }
                    }

                    muteData.push(data)
                    if(guild == undefined)
                    {
                        console.log("No Guild")
                        return;
                    }
                    if(muteRole == null)
                    {
                        console.log("No Role")
                        return;   
                    }

                    if(data.data != null)
                    {
                        console.log("Has Data")
                        console.log(data.data)
                        for(var i = 0; i < data.data.length; i++)
                        {
                            if(data.data[i].time != null)
                            {
                                const date = new Date(data.data[i].time);
                                var member;
                                var members = guild.members.array()
            
                                for(var index = 0; index < members.length; index++)
                                {
                                    if(members[index].id == data.data[i].key)
                                    {
                                        member = members[index];
                                    }
                                }

                                if(member == undefined)
                                    return;

                                if(date.getTime() < (new Date()).getTime())
                                {
                                    removeMutedUser(data.key, data.data[i].key)

                                    if(member.roles.find("id", muteRole.id))
                                    {
                                        if(member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_ROLES")){
                                            member.removeRole(muteRole).catch(error => console.log("Send Error - " + error));
                                        }
                                    } 
                                }
                                else
                                {
                                    var member;
                                    var members = guild.members.array()
                
                                    for(var index = 0; index < members.length; index++)
                                    {
                                        if(members[index].id == data.data[i].key)
                                        {
                                            member = members[index];
                                        }
                                    }

                                    if(member == undefined)
                                        return;

                                    schedule.scheduleJob(date, function(){
                                        removeMutedUser(data.key, data.data[i].key)
    
                                        if(member.roles.find("id", muteRole.id))
                                        {
                                            if(member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_ROLES")){
                                                member.removeRole(muteRole).catch(error => console.log("Send Error - " + error));
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            })
        }
      })
    } else {
      console.log("signed out of firebase");
      signedIntoFirebase = false;
    }
  });

bot.on("message", (message) => {
    if(!signedIntoFirebase)
    {
        return;
    }

    if(message.guild == null)
    {
        return;
    }
    
    if(!message.guild.member(message.client.user.id).hasPermission("SEND_MESSAGES") || !message.guild.member(message.client.user.id).hasPermission("ATTACH_FILES")){
        return;
    }
    var noResponse = false;
    var hasKey = false;
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(message.guild.id == responseSettings[i].key)
        {
            noResponse = responseSettings[i].respond;
            hasKey = true;
        }
    }

    if(hasKey === false)
    {
        localGetResponse(message.guild);
    }

    if(noResponse === true)
    {
        if (message.content.toLowerCase().indexOf("ur mom") > -1 || message.content.toLowerCase().indexOf("ur mum") > -1
        || message.content.toLowerCase().indexOf("ur mother") > -1 || message.content.toLowerCase().indexOf("ur dad") > -1
        || message.content.toLowerCase().indexOf("ur daddy") > -1 || message.content.toLowerCase().indexOf("ur father") > -1) 
        {
            if(message.author.id != bot.user.id)
                message.channel.send("<@" + message.author.id + "> " + responses1[Math.floor(Math.random() * (responses1.length))]).catch(error => console.log("Send Error - " + error));	
        }
        else if(message.content.toLowerCase().indexOf("no u") > -1 || message.content.toLowerCase().indexOf("no you") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("<@" + message.author.id + "> " + responses2[Math.floor(Math.random() * (responses2.length))]).catch(error => console.log("Send Error - " + error));
        }
    
        if(message.content.toLowerCase().indexOf("traps are gay") > -1 || message.content.toLowerCase().indexOf("traps are not gay") > -1)
        {
            message.reply("traps are definitely gay").catch(error => console.log("Send Error - " + error));
        }

    if(message.content.toLowerCase().indexOf("thot") > -1 || message.content.toLowerCase().indexOf("whore") > -1)
    {  
        if(message.author.id != bot.user.id)
        {
            var thotCounter = [];
            if(allThotCounters.length > 0)
            {
                for(var i = 0; i < allThotCounters.length; i++)
                {
                    if(allThotCounters[i].key == message.guild.id)
                    {
                        thotCounter = allThotCounters[i].counter;
                        i = allThotCounters.length;
                    }
                }
            }

            var msg = message.content.toLowerCase();
            var count = (msg.match(/thot/g) || []).length + (msg.match(/whore/g) || []).length;
           
            if(thotCounter == [] || thotCounter.length == 0)
            {       
                firebase.database().ref("serversettings/" + message.guild.id).once('value').then(function(snapshot) {
                    if(snapshot.val() == null)
                    {
                        migrateServerID(message.guild)
                        return;
                    }

                    if(snapshot.child("thotcounter").val() != null)
                    {
                        thotCounter = JSON.parse(snapshot.child("thotcounter").val());
                    }
                    else
                    {
                        thotCounter = [{key: "Key", value: 0, valueToCheck: 50, specialCheck: 1000}];
                    }

                    var hasKey = false;
                    var index = 1;
                    
                    for(var i = 0; i < thotCounter.length; i++)
                    {
                        if(thotCounter[i].key == message.channel.id)
                        {
                            hasKey = true;
                            thotCounter[i].value = thotCounter[i].value + count;
                            index = i;

                            if(thotCounter[i].specialCheck == null)
                            {
                                thotCounter[i]["specialCheck"] = 1000;
                            }
                        }
                    }
                    if(!hasKey)
                    {
                        thotCounter.push({
                            key: message.channel.id,
                            value: 1,
                            valueToCheck: 50,
                            specialCheck: 1000
                        });
                        for(var i = 0; i < thotCounter.length; i++)
                        {
                            if(thotCounter[i].key == message.channel.id)
                            {
                                index = i;
                            }
                        }
                    }
                    
                        message.channel.send("Thot counter: " + numberWithCommas(thotCounter[index].value)).catch(error => console.log("Send Error - " + error));

                        if(thotCounter[index].value >= thotCounter[index].valueToCheck)
                        {
                            thotCounter[index].valueToCheck = Math.floor((thotCounter[index].value + 50)/10) * 10;

                            if(thotCounter[index].valueToCheck % 50 != 0)
                            {
                                thotCounter[index].valueToCheck = (Math.floor((thotCounter[index].valueToCheck/100)) * 100) + 50
                            }

                            if(thotCounter[index].value >= thotCounter[index].specialCheck)
                            {
                                message.channel.send("***Thot patrol, dispatched***", {files: ["thot1000.jpg"]}).catch(error => console.log("Send Error - " + error));
                                thotCounter[index].specialCheck = Math.floor((thotCounter[index].value + 1000)/1000) * 1000;
                            }
                            else
                            {
                                message.channel.send("***B E G O N E  T H O T***", {files: ["thot.gif"]}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                    

                    allThotCounters.push({key: message.guild.id, counter: thotCounter})
                    firebase.database().ref("serversettings/" + message.guild.id + "/thotcounter").set(JSON.stringify(thotCounter));
                }); 
            }   
            else
            {
                    var hasKey = false;
                    var index = 1;
                    
                    for(var i = 0; i < thotCounter.length; i++)
                    {
                        if(thotCounter[i].key == message.channel.id)
                        {
                            hasKey = true;
                            thotCounter[i].value = thotCounter[i].value + count;
                            index = i;

                            if(thotCounter[i].specialCheck == null)
                            {
                                thotCounter[i]["specialCheck"] = 1000;
                            }
                        }
                    }
                    if(!hasKey)
                    {
                        thotCounter.push({
                            key: message.channel.id,
                            value: 1,
                            valueToCheck: 10,
                             specialCheck: 1000
                        });
                        for(var i = 0; i < thotCounter.length; i++)
                        {
                            if(thotCounter[i].key == message.channel.id)
                            {
                                index = i;
                            }
                        }
                    }

                    
                        message.channel.send("Thot counter: " + numberWithCommas(thotCounter[index].value)).catch(error => console.log("Send Error - " + error));

                        if(thotCounter[index].value >= thotCounter[index].valueToCheck)
                        {
                            thotCounter[index].valueToCheck = Math.floor((thotCounter[index].value + 50)/10) * 10;

                            if(thotCounter[index].valueToCheck % 50 != 0)
                            {
                                thotCounter[index].valueToCheck = (Math.floor((thotCounter[index].valueToCheck/100)) * 100) + 50
                            }

                            if(thotCounter[index].value >= thotCounter[index].specialCheck)
                            {
                                message.channel.send("***Thot patrol, dispatched***", {files: ["thot1000.jpg"]}).catch(error => console.log("Send Error - " + error));
                                thotCounter[index].specialCheck = Math.floor((thotCounter[index].value + 1000)/1000) * 1000;
                            }
                            else
                            {
                                message.channel.send("***B E G O N E  T H O T***", {files: ["thot.gif"]}).catch(error => console.log("Send Error - " + error));
                            }
                        }
                    

                    for(var i = 0; i < allThotCounters.length; i++)
                    {
                        if(allThotCounters[i].key == message.guild.id)
                        {
                            allThotCounters[i].counter = thotCounter;
                            i = allThotCounters.length;
                        }
                    }
                    firebase.database().ref("serversettings/" + message.guild.id + "/thotcounter").set(JSON.stringify(thotCounter));
            }
        }
    }

    if(message.content.toLowerCase().indexOf("fuck") > -1 || message.content.toLowerCase().indexOf("bitch") > -1 
      || message.content.toLowerCase().indexOf("cunt") > -1 || message.content.toLowerCase().indexOf("twat") > -1 
      || message.content.toLowerCase().indexOf("dick") > -1 || message.content.toLowerCase().indexOf("slut") > -1
      || message.content.toLowerCase().indexOf("fok") > -1  || message.content.toLowerCase().indexOf("fuk") > -1 
      || message.content.toLowerCase().indexOf("fek") > -1 || message.content.toLowerCase().indexOf("facc") > -1 
      || message.content.toLowerCase().indexOf("focc") > -1 || message.content.toLowerCase().indexOf("fucc") > -1 
      || message.content.toLowerCase().indexOf("fecc") > -1|| message.content.toLowerCase().indexOf("asshole") > -1 
      || message.content.toLowerCase().indexOf("dumbass") > -1 || message.content.toLowerCase().indexOf("bastard") > -1 
      || message.content.toLowerCase().indexOf("fack") > -1 || message.content.toLowerCase().indexOf("fock") > -1 
      || message.content.toLowerCase().indexOf("feck") > -1 || message.content.toLowerCase().indexOf("wanker") > -1
      || message.content.toLowerCase().indexOf("tosser") > -1)
    {
        if(message.author.id != bot.user.id)
        {
            var swearcounter = [];
            if(allSwearCounters.length > 0)
            {
                for(var i = 0; i < allSwearCounters.length; i++)
                {
                    if(allSwearCounters[i].key == message.guild.id)
                    {
                        swearcounter = allSwearCounters[i].counter;
                        i = allSwearCounters.length;
                    }
                }
            }

            var msg = message.content.toLowerCase();
            var count = (msg.match(/fuck/g) || []).length + (msg.match(/bitch/g) || []).length + (msg.match(/cunt/g) || []).length + (msg.match(/twat/g) || []).length + (msg.match(/dick/g) || []).length + (msg.match(/slut/g) || []).length + (msg.match(/fok/g) || []).length + (msg.match(/fuk/g) || []).length + (msg.match(/fek/g) || []).length + (msg.match(/facc/g) || []).length + (msg.match(/focc/g) || []).length + (msg.match(/fucc/g) || []).length + (msg.match(/fecc/g) || []).length + (msg.match(/asshole/g) || []).length + (msg.match(/dumbass/g) || []).length + (msg.match(/bastard/g) || []).length + (msg.match(/fack/g) || []).length + (msg.match(/fock/g) || []).length + (msg.match(/feck/g) || []).length + (msg.match(/wanker/g) || []).length + (msg.match(/tosser/g) || []).length;

            if(swearcounter == [] || swearcounter.length == 0)
            {
                firebase.database().ref("serversettings/" + message.guild.id).once('value').then(function(snapshot) {
                    if(snapshot.val() == null)
                    {
                        migrateServerID(message.guild);
                        return;
                    }
                    
                    if(snapshot.child("swearcounter").val() != null)
                    {
                        swearCounter = JSON.parse(snapshot.child("swearcounter").val());
                    }
                    else
                    {
                        swearCounter = [{key: "Key", value: 0, valueToCheck: 10, specialCheck: 1000}];
                    }


                    message.channel.send("<@" + message.author.id + "> ***this is a christian server***").catch(error => console.log("Send Error - " + error));
                    
                    var hasKey = false;
                    var index = 1;
        
                    for(var i = 0; i < swearCounter.length; i++)
                    {
                        if(swearCounter[i].key == message.channel.id)
                        {
                            hasKey = true;
                            swearCounter[i].value = swearCounter[i].value + count;
                            index = i;

                            if(swearCounter[i].specialCheck == null)
                            {
                                swearCounter[i]["specialCheck"] = 1000;
                            }
                        }
                    }
                    if(!hasKey)
                    {
                        swearCounter.push({
                            key: message.channel.id,
                            value: 1,
                            valueToCheck: 10,
                            specialCheck: 1000
                        });
                        for(var i = 0; i < swearCounter.length; i++)
                        {
                            if(swearCounter[i].key == message.channel.id)
                            {
                                index = i;
                            }
                        }
                    }

                   
                        message.channel.send("Swear counter: " + numberWithCommas(swearCounter[index].value)).catch(error => console.log("Send Error - " + error));
        
                        if(swearCounter[index].value >= swearCounter[index].valueToCheck)
                        {
                            swearCounter[index].valueToCheck = Math.floor((swearCounter[index].value + 10)/10) * 10;
                            if(swearCounter[index].value >= swearCounter[index].specialCheck)
                            {
                                message.channel.send("This is it; the pinnacle of degeneracy. I hope you're all happy, you autistic fucks.", {files: ["swear1000.gif"]}).catch(error => console.log("Send Error - " + error));
                                swearCounter[index].specialCheck = Math.floor((swearCounter[index].value + 1000)/1000) * 1000;
                            }
                            else
                            {
                                message.channel.send(curseResponses[Math.floor(Math.random() * (curseResponses.length))]).catch(error => console.log("Send Error - " + error));
                            }
                        }
                    
                    
                    allSwearCounters.push({key: message.guild.id, counter: swearcounter})
                    firebase.database().ref("serversettings/" + message.guild.id + "/swearcounter").set(JSON.stringify(swearCounter));
                });
            }
            else
            {
                    message.channel.send("<@" + message.author.id + "> ***this is a christian server***").catch(error => console.log("Send Error - " + error));
                
                var hasKey = false;
                var index = 1;
            
                for(var i = 0; i < swearCounter.length; i++)
                {
                    if(swearCounter[i].key == message.channel.id)
                    {
                        hasKey = true;
                        swearCounter[i].value = swearCounter[i].value + count;
                        index = i;

                        if(swearCounter[i].specialCheck == null)
                        {
                            swearCounter[i]["specialCheck"] = 1000;
                        }
                    }
                }
                if(!hasKey)
                {
                    swearCounter.push({
                        key: message.channel.id,
                        value: 1,
                        valueToCheck: 10,
                        specialCheck: 1000
                    });
                    for(var i = 0; i < swearCounter.length; i++)
                    {
                        if(swearCounter[i].key == message.channel.id)
                        {
                            index = i;
                        }
                    }
                }

               
                    message.channel.send("Swear counter: " + numberWithCommas(swearCounter[index].value)).catch(error => console.log("Send Error - " + error));
    
                    if(swearCounter[index].value >= swearCounter[index].valueToCheck)
                    {
                        swearCounter[index].valueToCheck = Math.floor((swearCounter[index].value + 10)/10) * 10;
                        if(swearCounter[index].value >= swearCounter[index].specialCheck)
                        {
                            message.channel.send("This is it; the pinnacle of degeneracy. I hope you're all happy, you autistic fucks.", {files: ["swear1000.gif"]}).catch(error => console.log("Send Error - " + error));
                            swearCounter[index].specialCheck = Math.floor((swearCounter[index].value + 1000)/1000) * 1000;
                        }
                        else
                        {
                            message.channel.send(curseResponses[Math.floor(Math.random() * (curseResponses.length))]).catch(error => console.log("Send Error - " + error));
                        }
                    }
                
               
                    for(var i = 0; i < allSwearCounters.length; i++)
                    {
                        if(allSwearCounters[i].key == message.guild.id)
                        {
                            allSwearCounters[i].counter = swearcounter;
                            i = allSwearCounters.length;
                        }
                    }

                    firebase.database().ref("serversettings/" + message.guild.id + "/swearcounter").set(JSON.stringify(swearCounter));
                }
            }
        }
    }
});

bot.login(process.env.BOT_TOKEN).then(function(){
    bot.user.setActivity('Hardbass', { type: 'LISTENING' }).catch(console.error);
    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    
        console.log(errorCode);
        console.log(errorMessage);
    });
});
