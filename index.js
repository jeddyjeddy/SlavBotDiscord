const commando = require("discord.js-commando");
const bot = new commando.Client({
    owner: "281876391535050762",
    unknownCommandResponse: false,
    autoReconnect: true,
    invite: "https://discord.gg/2T259Pf"});

const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DBL_TOKEN, bot);

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
var request = require('request');

dbl.on('posted', () => {
    console.log('Server count posted!');
    console.log(bot.guilds.size)
    // Set the headers
    var headers = {
        'Authorization': process.env.BOTS_FOR_DISCORD_API,
        'Content-Type': 'application/json'
    }

    // Configure the request
    var options = {
        url: 'https://botsfordiscord.com/api/v1/bots/' + bot.user.id,
        method: 'POST',
        headers: headers,
        body: JSON.stringify({'count': bot.guilds.size, 'server_count': bot.guilds.size})
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
        }
        else
        {
            console.log(error)
        }
    })
    
    var headers2 = {
        'Authorization': process.env.DISCORD_SERVICES,
        'Content-Type': 'application/json'
    }

    // Configure the request
    
    var options2 = {
        url: 'https://discord.services/api/bots/' + bot.user.id,
        method: 'POST',
        headers: headers2,
        body: JSON.stringify({'guild_count': bot.guilds.size})
    }

    // Start the request
    request(options2, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
        }
        else
        {
            console.log(error)
        }
    })

    var headers3 = {
        'Authorization': process.env.BOTS_ON_DISCORD_API,
        'Content-Type': 'application/json'
    }

    // Configure the request
    var options3 = {
        url: 'https://bots.ondiscord.xyz/bot-api/bots/' + bot.user.id + "/guilds",
        method: 'POST',
        headers: headers3,
        body: JSON.stringify({"guildCount": bot.guilds.size})
    }

    // Start the request
    request(options3, function (error, response, body) {
        if (!error) {
            // Print out the response body
            console.log(body)
        }
        else
        {
            console.log(error)
        }
    })

    var headers4 = {
        'Authorization': process.env.BOTS_DISCORD_PW_API,
        'Content-Type': 'application/json'
    }

    // Configure the request
    var options4 = {
        url: 'https://bots.discord.pw/api/bots/' + bot.user.id + "/stats",
        method: 'POST',
        headers: headers4,
        body: JSON.stringify({"server_count": bot.guilds.size})
    }

    // Start the request
    request(options4, function (error, response, body) {
        if (!error) {
            // Print out the response body
            console.log(body)
        }
        else
        {
            console.log(error)
        }
    })

    var headers5 = {
        'Authorization': process.env.DISCORD_BOTS_GROUP,
        'Content-Type': 'application/json'
    }

    var options5 = {
        url: 'https://discordbots.group/api/bot/' + bot.user.id,
        method: 'POST',
        headers: headers5,
        body: JSON.stringify({"count": bot.guilds.size})
    }

    // Start the request
    request(options5, function (error, response, body) {
        if (!error) {
            // Print out the response body
            console.log(body)
        }
        else
        {
            console.log(error)
        }
    })

    var headers6 = {
        'Authorization': process.env.DISCORD_BOT_LIST,
        'Content-Type': 'application/json'
    }

    var options6 = {
        url: 'https://discordbotlist.com/api/bots/' + bot.user.id + "/stats",
        method: 'POST',
        headers: headers6,
        body: JSON.stringify({"guilds": bot.guilds.size})
    }

    // Start the request
    request(options6, function (error, response, body) {
        if (!error) {
            // Print out the response body
            console.log(body)
        }
        else
        {
            console.log(error)
        }
    })

    var headers7 = {
        'Authorization': process.env.BOTLIST_SPACE,
        'Content-Type': 'application/json'
    }

    var options7 = {
        url: 'https://botlist.space/api/bots/' + bot.user.id,
        method: 'POST',
        headers: headers7,
        body: JSON.stringify({"server_count": bot.guilds.size})
    }

    // Start the request
    request(options7, function (error, response, body) {
        if (!error) {
            // Print out the response body
            console.log(body)
        }
        else
        {
            console.log(error)
        }
    })

    var headers8 = {
        'Authorization': process.env.DISCORDBOT_WORLD,
        'Content-Type': 'application/json'
    }

    var options8 = {
        url: 'https://discordbot.world/api/bot/' + bot.user.id + "/stats",
        method: 'POST',
        headers: headers8,
        body: JSON.stringify({"guild_count": bot.guilds.size})
    }

    // Start the request
    request(options8, function (error, response, body) {
        if (!error) {
            // Print out the response body
            console.log(body)
        }
        else
        {
            console.log(error)
        }
    })

    bot.user.setActivity('Despacito ' + numberWithCommas(Math.floor(Math.random() * 9999) + 1), { type: 'LISTENING' }).catch((error) => console.log("Status Fail: " + error));
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
var allOofCounters = [{key: "Key", counter: null}]
var allOwOCounters = [{key: "Key", counter: null}]
var responseSettings = [{key: "Key", respond: true, overwrites: null}] 
var userCommandUsage = [{key: "Key", data: {uses: 0, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250}}] 

var localGetResponse = (guild) => {
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(guild.id == responseSettings[i].key)
        {
            return responseSettings[i].respond;
        }
    }

    firebase.database().ref("serversettings/" + guild.id + "/respond").once('value').then(function(snapshot) {
        if(snapshot.val() == null)
            migrateServerID(guild)
    })
    return false;
}

var localHasOverwrite = (guild) => {
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(guild.id == responseSettings[i].key)
        {
            if(responseSettings[i].overwrites == null)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
    return false;
}

var localGetOverwrite = (guild, channel) => {
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(guild.id == responseSettings[i].key)
        {
            if(responseSettings[i].overwrites == null)
            {
                return false;
            }
            else
            {
                for(var i2 = 0; i2 < responseSettings[i].overwrites.length; i2++)
                {
                    if(responseSettings[i].overwrites[i2] == channel)
                    {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

var localGetAllOverwrite = (guild) => {
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(guild.id == responseSettings[i].key)
        {
            return responseSettings[i].overwrites;
        }
    }
    return null;
}

var localChangeResponse = (guildID, setting, channel) => {
    if(channel == null)
    {
        for(var i = 0; i < responseSettings.length; i++)
        {
            if(guildID == responseSettings[i].key)
            {
                responseSettings[i].respond = setting;
                responseSettings[i].overwrites = null; 
                if(signedIntoFirebase)
                {
                    firebase.database().ref("serversettings/" + guildID + "/respond").set(setting);
                    firebase.database().ref("serversettings/" + guildID + "/respondoverwrites").remove();
                }
            }
        }
    }
    else
    {
        for(var i = 0; i < responseSettings.length; i++)
        {
            if(guildID == responseSettings[i].key)
            {
                if(responseSettings[i].respond != setting)
                {
                    if(responseSettings[i].overwrites == null)
                    {
                        responseSettings[i].overwrites = [channel]
                        firebase.database().ref("serversettings/" + guildID + "/respondoverwrites").set(JSON.stringify(responseSettings[i].overwrites));
                    }
                    else
                    {
                        responseSettings[i].overwrites.push(channel)
                        firebase.database().ref("serversettings/" + guildID + "/respondoverwrites").set(JSON.stringify(responseSettings[i].overwrites));
                    }
                }
                else
                {
                    if(responseSettings[i].overwrites != null)
                    {
                        for(var i2 = 0; i2 < responseSettings[i].overwrites.length; i2++)
                        {
                            if(responseSettings[i].overwrites[i2] == channel)
                            {
                                responseSettings[i].overwrites.splice(i2, 1) 
                            }
                        }

                        if(responseSettings[i].overwrites.length == 0)
                        {
                            responseSettings[i].overwrites = null
                            firebase.database().ref("serversettings/" + guildID + "/respondoverwrites").remove();
                        }
                        else
                            firebase.database().ref("serversettings/" + guildID + "/respondoverwrites").set(JSON.stringify(responseSettings[i].overwrites));
                    }
                }
            }
        }
    }
}

var muteData = [{key: "Key", role: "", data: null}]
var welcomeData = [{key: "Key", channel: ""}]

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
                        responseSettings.push({key: guild.id, respond: false, overwrites: null});
                    }
                }

                firebase.database().ref("serversettings/" + guild.id).once('value').then(function(snapshot) {
                    if(snapshot.val() == null)
                    {
                        console.log("Adding new data for " + guild.id)
                        firebase.database().ref("serversettings/" + guild.id + "/respond").set(false)
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
            return userCommandUsage[i].data.uses;
        }
    }

    if(signedIntoFirebase && userCommandUsage !== [{key: "Key", data: {uses: 0, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250}}])
    {
        firebase.database().ref("usersettings/" + userID).once('value').then(function(snapshot) {
            if(snapshot.child("commandusage").val() != null)
            {
                userCommandUsage.push({key: snapshot.key, data: JSON.parse(childSnap.child("commandusage").val())});
            }
            else
            {
                userCommandUsage.push({key: userID, data: {uses: 0, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250}});
            }
          })
    }
    
    return "`Unknown CRS (Try again when fully initialised)`";
}

var setWelcomeChannel = (guildID, channelID) => {

    for(var i = 0; i < welcomeData.length; i++)
    { 
        if(welcomeData[i].key == guildID)
        {
            if(welcomeData[i].channel == channelID)
            {
                return false;
            }
            else
            {
                welcomeData[i].channel = channelID;
                firebase.database().ref("serversettings/" + guildID + "/welcomechannel").set(channelID);
                return true;
            }
        }
    }

    welcomeData.push({key: guildID, channel: channelID})
    firebase.database().ref("serversettings/" + guildID + "/welcomechannel").set(channelID);
    return true;
}

var disableWelcomeChannel = (guildID) => {

    for(var i = 0; i < welcomeData.length; i++)
    { 
        if(welcomeData[i].key == guildID)
        {
            welcomeData.splice(i, 1);
            firebase.database().ref("serversettings/" + guildID + "/welcomechannel").remove();
            return true;
        }
    }

    return false;
}

var commandCounterChange = (userID) => {
    if(!signedIntoFirebase || userCommandUsage === [{key: "Key", data: {uses: 0, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250}}])
    {
        return;
    }

    var isStored = false;
    for(var index = 0; index < userCommandUsage.length; index++)
    {
        if(userCommandUsage[index].key == userID) 
        {
            isStored = true;
            userCommandUsage[index].data.uses += 1;
            firebase.database().ref("usersettings/" + userCommandUsage[index].key + "/commandusage").set(JSON.stringify(userCommandUsage[index].data));
            const i = index;
            dbl.hasVoted(userID).then(voted => {
                if (!voted)
                {
                    if(userCommandUsage[i].data.requestsSent < 3)
                    {
                        dbl.isWeekend().then(weekend => {
                            if (weekend)
                            {
                                if(userCommandUsage[i].data.uses >= userCommandUsage[i].data.weekendUsesCheck)
                                {
                                    console.log("Sending Weekend Request")
                                    bot.fetchUser(userID)
                                    .then(user => {
                                            user.send("You have sent " + numberWithCommas(userCommandUsage[i].data.uses) + " command requests to Slav Bot! Thank you for your support! You can help Slav Bot grow even further by voting for it on DBL. Votes made during the weekends are counted as double votes! https://discordbots.org/bot/319533843482673152/vote").catch(error => console.log("Send Error - " + error));
                                    }, rejection => {
                                            console.log(rejection.message);
                                    });

                                    userCommandUsage[i].data.weekendUsesCheck = userCommandUsage[i].data.uses + 100;
                                    userCommandUsage[i].data.requestsSent += 1;
                                    firebase.database().ref("usersettings/" + userCommandUsage[i].key + "/commandusage").set(JSON.stringify(userCommandUsage[i].data));
                                }
                            }
                            else
                            {
                                if(userCommandUsage[i].data.uses >= userCommandUsage[i].data.usesCheck)
                                {
                                    console.log("Sending Regular Request")
                                    bot.fetchUser(userID)
                                    .then(user => {
                                            user.send("You have sent " + numberWithCommas(userCommandUsage[i].data.uses) + " command requests to Slav Bot! Thank you for your support! You can help Slav Bot grow even further by voting for it on DBL. https://discordbots.org/bot/319533843482673152/vote").catch(error => console.log("Send Error - " + error));
                                    }, rejection => {
                                            console.log(rejection.message);
                                    });
                                
                                    userCommandUsage[i].data.usesCheck = userCommandUsage[i].data.uses + 250;
                                    userCommandUsage[i].data.requestsSent += 1;
                                    firebase.database().ref("usersettings/" + userCommandUsage[i].key + "/commandusage").set(JSON.stringify(userCommandUsage[i].data));
                                }
                            }
                        });
                    }
                    else
                    {
                        dbl.getVotes().then(votes => {
                            if (votes.find(vote => vote.id == userID))
                            {
                                userCommandUsage[i].data.requestsSent = 0;
                                firebase.database().ref("usersettings/" + userCommandUsage[i].key + "/commandusage").set(JSON.stringify(userCommandUsage[i].data));
                                commandCounterChange(userID)
                            }
                            else
                            {
                                dbl.isWeekend().then(weekend => {
                                    if (weekend)
                                    {
                                        if(userCommandUsage[i].data.uses >= userCommandUsage[i].data.weekendUsesCheck)
                                        {
                                            userCommandUsage[i].data.weekendUsesCheck = userCommandUsage[i].data.uses + 100;
                                            userCommandUsage[i].data.requestsSent += 1;
                                        }
                                    }
                                    else
                                    {
                                        if(userCommandUsage[i].data.uses >= userCommandUsage[i].data.usesCheck)
                                        {
                                            userCommandUsage[i].data.usesCheck = userCommandUsage[i].data.uses + 250;                                 
                                            userCommandUsage[i].data.requestsSent += 1;
                                        }
                                    }

                                    if(userCommandUsage[i].data.requestsSent > 5)
                                    {
                                        userCommandUsage[i].data.requestsSent = 0;
                                    }

                                    firebase.database().ref("usersettings/" + userCommandUsage[i].key + "/commandusage").set(JSON.stringify(userCommandUsage[i].data));
                                });
                            }
                        }); 
                    }
                }
            });
        }
    }

    if(!isStored)
    {
        firebase.database().ref("usersettings/" + userID).once('value').then(function(snapshot) {
            if(snapshot.child("commandusage").val() == null)
            {
                var data = {key: userID, data: {uses: 1, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250}};
                userCommandUsage.push(data);
                firebase.database().ref("usersettings/" + userID + "/commandusage").set(JSON.stringify(data.data));
            }
          })
    }
}

var getLeaderboardRankings = () =>
{
    var leaderboardRankings = userCommandUsage;
    leaderboardRankings.sort(commandUsageAscending);

    if(leaderboardRankings.length > 10)
    {
        var leaderboardRankingsShort = [];

        for(var i = 0; i < 10; i++)
        {
            leaderboardRankingsShort.push(leaderboardRankings[i])
        }

        leaderboardRankings = leaderboardRankingsShort;
    }

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
    {
        var leaderboardRankingsShort = [];

        for(var i = 0; i < 10; i++)
        {
            leaderboardRankingsShort.push(localLeaderboardRankings[i])
        }

        localLeaderboardRankings = leaderboardRankingsShort;
    }

    return localLeaderboardRankings;
}

var getUserBaseCount = () =>
{
    return numberWithCommas(userCommandUsage.length);
}

function commandUsageAscending(a, b)
{
    if (a.data.uses < b.data.uses)
        return 1;
    if (a.data.uses > b.data.uses)
        return -1;
    return 0;
}

var ResponseFunctions = module.exports = {
 getResponse: function(guild) {
    return localGetResponse(guild)
},

getOverwrite: function(guild, channelID) {
    return localGetOverwrite(guild, channelID)
},
getAllOverwrite: function(guild, channelID) {
    return localGetAllOverwrite(guild)
},
hasOverwrite: function(guild) {
    return localHasOverwrite(guild)
},

 changeResponse: function(guildID, setting, channel) {
    localChangeResponse(guildID, setting, channel)
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
getUserCount: function()
{
    return getUserBaseCount();
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
},

setWelcome: function(guildID, channelID)
{
    return setWelcomeChannel(guildID, channelID);
},

disableWelcome: function(guildID,)
{
    return disableWelcomeChannel(guildID);
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
var signedIntoDiscord = false;

firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode);
    console.log(errorMessage);
});

var schedule = require('node-schedule');

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("signed in to firebase");
      signedIntoFirebase = true;

      if(signedIntoDiscord)
      {
        initData();
      }
    } else {
      console.log("signed out of firebase");
      signedIntoFirebase = false;
    }
  });

bot.on("channelDelete", (channel) => {
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(responseSettings[i].overwrites != null)
        {
            for(var index = 0; index < responseSettings[i].overwrites.length; index++)
            {
                if(responseSettings[i].overwrites[index] == channel.id)
                {
                    responseSettings[i].overwrites.splice(index, 1) 
                    firebase.database().ref("serversettings/" + responseSettings[i].key + "/respondoverwrites").set(JSON.stringify(responseSettings[i].overwrites));
                }
            }
        }
    }
})

var initData = () => {
    console.log("Init Data")
    
    firebase.database().ref("usersettings/").once('value').then(function(snapshot) {
        if(snapshot.val() != null)
        {
            snapshot.forEach(function(childSnap){
                userCommandUsage.push({key: childSnap.key, data: JSON.parse(childSnap.child("commandusage").val())});
            });
        }
      })
      firebase.database().ref("serversettings").once('value').then(function(snapshot) {
        if(snapshot.val() != null)
        {
            snapshot.forEach(function(childSnap){
                var overwrites = null;
                if(childSnap.child("respondoverwrites").val() != null)
                {
                    overwrites = JSON.parse(childSnap.child("respondoverwrites").val())
                }

                if(childSnap.child("respond").val() != null)
                {   
                    if(childSnap.child("respond").val() === true)
                    {
                        responseSettings.push({key: childSnap.key, respond: true, overwrites: overwrites})
                    }
                    else if(childSnap.child("respond").val() === false)
                    {
                        responseSettings.push({key: childSnap.key, respond: false, overwrites: overwrites})
                    }
                }
                else(childSnap.child("respond").val() == null)
                {
                    responseSettings.push({key: childSnap.key, respond: false, overwrites: overwrites})
                }

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

                    var muteRole;
                    var roles = guild.roles.array()
                    for(var i = 0; i < roles.length; i++)
                    {
                        if(roles[i].name == data.role)
                        {
                            muteRole = roles[i];
                        }
                    }


                    if(data.key != childSnap.key)
                    {
                        data.key = childSnap.key;
                        if(muteRole != undefined && guild != undefined)
                        {
                            var member;
                            var members = guild.members.array()
        
                            for(var index = 0; index < members.length; index++)
                            {
                                if(members[index].id == bot.user.id)
                                {
                                    member = members[index];
                                }
                            }

                            if(member != undefined)
                            {
                                if(member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_ROLES")){
                                    var allChannels = guild.channels.array()
                                    allChannels.forEach(channel => {
                                        channel.overwritePermissions(muteRole, {SEND_MESSAGES: false, ATTACH_FILES: false, ADD_REACTIONS: false})
                                    });
                                }
                            }
                        }
                    }

                    muteData.push(data)
                    if(muteRole != undefined && guild != undefined)
                    {
                        if(data.data != null && data.data != undefined)
                        {
                            for(var i = 0; i < data.data.length; i++)
                            {
                                if(data.data[i].time !== null)
                                {
                                    const date = new Date(data.data[i].time);
                                    var members = guild.members.array()
                                    var member;
                                    for(var index = 0; index < members.length; index++)
                                    {
                                        if(members[index].id == data.data[i].key)
                                        {
                                            member = members[index];
                                        }
                                    }

                                    var botMember;                
                                    for(var index = 0; index < members.length; index++)
                                    {
                                        if(members[index].id == bot.user.id)
                                        {
                                            botMember = members[index];
                                        }
                                    }
    
                                    if(member != undefined && botMember != undefined)
                                    {
                                        if(date.getTime() < (new Date()).getTime())
                                        {
                                            var hasRole = false;
                                            var userRoles = member.roles.array()
                                            for(var index = 0; index < userRoles.length; index++)
                                            {
                                                if(userRoles[index].name == data.role)
                                                {
                                                    hasRole = true;
                                                }
                                            }
        
                                            if(hasRole)
                                            {
                                                if(botMember.hasPermission("ADMINISTRATOR") || botMember.hasPermission("MANAGE_ROLES")){
                                                    member.removeRole(muteRole).catch(error => console.log("Send Error - " + error));
                                                    removeMutedUser(data.key, data.data[i].key)
                                                }
                                            } 
                                        }
                                        else
                                        {
                                            const savedData = data;
                                            const dataIndex = i;
                                            const memberRef = member;
                                            const botRef = botMember;
                                            schedule.scheduleJob(date, function(){
                                                var hasRole = false;
                                                var userRoles = memberRef.roles.array()
                                                for(var index = 0; index < userRoles.length; index++)
                                                {
                                                    if(userRoles[index].name == savedData.role)
                                                    {
                                                        hasRole = true;
                                                    }
                                                }
        
                                                if(hasRole)
                                                {
                                                    if(botRef.hasPermission("ADMINISTRATOR") || botRef.hasPermission("MANAGE_ROLES")){
                                                        memberRef.removeRole(muteRole).catch(error => console.log("Send Error - " + error));
                                                        removeMutedUser(savedData.key, savedData.data[dataIndex].key)
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }   
                    }
                }

                if(childSnap.child("welcomechannel").val() != null)
                {
                    welcomeData.push({key: childSnap.key, channel: childSnap.child("welcomechannel").val().toString()});
                }

                if(childSnap.child("prefix").val() != null)
                {
                    var guild;
                    var guilds = bot.guilds.array()

                    for(var i = 0; i < guilds.length; i++)
                    {
                        if(guilds[i].id == childSnap.key)
                        {
                            guild = guilds[i];
                        }
                    }

                    if(guild != undefined)
                    {
                        guild.commandPrefix = childSnap.child("prefix").val().toString();
                    }
                }
            })
        }
      })
}

bot.on("channelCreate", (channel) => {
    var guild;
    var guilds = bot.guilds.array()

    for(var i = 0; i < guilds.length; i++)
    {
        var channels = guilds[i].channels.array();
        for(var index = 0; index < channels.length; index++)
        {
            if(channels[index].id == channel.id)
            {
                guild = guilds[i];
            }
        }
    }
    
    if(guild != undefined)
    {
        guild.fetchMember(bot.user.id).then((user) => {
            if(user.hasPermission("ADMINISTRATOR") || user.hasPermission("MANAGE_ROLES"))
            {
                for(var i = 0; i < muteData.length; i++)
                {
                    if(muteData[i].key == guild.id)
                    {
                        var muteRole;
                        var roles = guild.roles.array()
                        for(var index = 0; index < roles.length; index++)
                        {
                            if(roles[index].name == muteData[i].role)
                            {
                                muteRole = roles[index];
                            }
                        }

                        if(muteRole != undefined)
                            channel.overwritePermissions(muteRole, {SEND_MESSAGES: false, ATTACH_FILES: false, ADD_REACTIONS: false})
                    }
                }
            }
        }).catch((error) => console.log(error.message));
    }
})

var welcomeResponses = ["Hail, comrade,", "Pass the semechki,", "Nice addidas tracksuit,", "You're not a Western spy, right?", "Let's see who can squat longer,", "Heels touch ground when Slavs are around,"];

bot.on("guildMemberAdd", (member) => {
    var hasWelcome = false;
    var channelID;
    for(var i = 0; i < welcomeData.length; i++)
    {
        if(welcomeData[i].key == member.guild.id)
        {
            channelID = welcomeData[i].channel;
            hasWelcome = true;
        }
    }

    if(hasWelcome)
    {
        var channels = member.guild.channels.array();
        var notFound = true;

        for(var i = 0; i < channels.length; i++)
        {
            if(channels[i].id == channelID)
            {
                notFound = false;
                channels[i].send(welcomeResponses[Math.floor(Math.random() * welcomeResponses.length)] + " <@" + member.id + ">").catch(error => console.log("Send Error - " + error));
            }
        }

        if(notFound)
            disableWelcomeChannel(member.guild.id);
    }
})

bot.on("guildMemberRemove", (member) => {
    var hasWelcome = false;
    var channelID;
    for(var i = 0; i < welcomeData.length; i++)
    {
        if(welcomeData[i].key == member.guild.id)
        {
            channelID = welcomeData[i].channel;
            hasWelcome = true;
        }
    }

    if(hasWelcome)
    {
        var channels = member.guild.channels.array();
        var notFound = true;

        for(var i = 0; i < channels.length; i++)
        {
            if(channels[i].id == channelID)
            {
                notFound = false;
                channels[i].send("We have lost a comrade, " + member.displayName + " has left us.").catch(error => console.log("Send Error - " + error));
            }
        }

        if(notFound)
            disableWelcomeChannel(member.guild.id);
    }
})


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

    var noResponse = localGetResponse(message.guild);
    
    if(localGetOverwrite(message.guild, message.channel.id))
    {
        noResponse = !noResponse;
    }

    if(noResponse === true)
    {
        if (message.content.toLowerCase().indexOf("ur mom") > -1 || message.content.toLowerCase().indexOf("ur mum") > -1
        || message.content.toLowerCase().indexOf("ur mother") > -1 || message.content.toLowerCase().indexOf("ur dad") > -1
        || message.content.toLowerCase().indexOf("ur daddy") > -1 || message.content.toLowerCase().indexOf("ur father") > -1
        || message.content.toLowerCase().indexOf("ur aunt") > -1 || message.content.toLowerCase().indexOf("ur uncle") > -1
        || message.content.toLowerCase().indexOf("ur pap") > -1 || message.content.toLowerCase().indexOf("ur grandpa") > -1
        || message.content.toLowerCase().indexOf("ur grandnan") > -1 || message.content.toLowerCase().indexOf("ur father") > -1
        || message.content.toLowerCase().indexOf("ur nan") > -1 || message.content.toLowerCase().indexOf("ur grandma") > -1) 
        {
            if(message.author.id != bot.user.id)
                message.channel.send("<@" + message.author.id + "> " + responses1[Math.floor(Math.random() * (responses1.length))]).catch(error => console.log("Send Error - " + error));	
        }
        else if(message.content.toLowerCase().indexOf("no u") > -1 || message.content.toLowerCase().indexOf("no you") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("<@" + message.author.id + "> " + responses2[Math.floor(Math.random() * (responses2.length))]).catch(error => console.log("Send Error - " + error));
        }
        else if(message.content.toLowerCase().indexOf("ye u") > -1 || message.content.toLowerCase().indexOf("ye you") > -1 || message.content.toLowerCase().indexOf("yeah u") > -1 || message.content.toLowerCase().indexOf("yeah you") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("<@" + message.author.id + "> " + "no you");
        }
    
        if(message.content.toLowerCase().indexOf("trap") > -1 && message.content.toLowerCase().indexOf("gay") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("Traps are definitely gay").catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase().indexOf("luft") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("LUUUUUUUFT").catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase().indexOf("depress") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("It really do be like that sometimes").catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase().indexOf("cease") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("Stop! You have violated the law!").catch(error => console.log("Send Error - " + error));
        }
        if(message.content.toLowerCase().indexOf("thonk") > -1 || message.content.toLowerCase().indexOf("think") > -1)
        {
            if(message.author.id != bot.user.id)
            {
                message.channel.send(":thinking:").catch(error => console.log("Send Error - " + error));
            }
        }

        if(message.content.toLowerCase().indexOf("so sad") > -1)
        {
            if(message.author.id != bot.user.id)
            {
                message.channel.send("Alexa, play despacito").catch(error => console.log("Send Error - " + error));
                message.channel.send("ɴᴏᴡ ᴘʟᴀʏɪɴɢ: Despacito " + numberWithCommas(Math.floor(Math.random() * 9999) + 1) + " (Feat: Slav bot)\n\n:white_circle:───────────────── \n\n◄◄⠀▐▐ ⠀►►   00:01 / 04:20⠀ ───○ :loud_sound:⠀ ᴴᴰ :gear: ❐ ⊏⊐").catch(error => console.log("Send Error - " + error));
            }
        }

        if(message.content.toLowerCase() == "f")
        {
            if(message.author.id != bot.user.id)
                message.channel.send("F").catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase().indexOf("perhaps") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("Perhaps").catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase().indexOf("maybe") > -1)
        {
            if(message.author.id != bot.user.id)
                message.channel.send("Keyword: Maybe").catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase() == "h")
        {
            if(message.author.id != bot.user.id)
                message.channel.send("H").catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase() == "lmfao")
        {
            if(message.author.id != bot.user.id)
            {
                message.channel.send("lmf:peach:o").catch(error => console.log("Send Error - " + error));
            }
        }

        if(message.content.toLowerCase() == "k")
        {
            if(message.author.id != bot.user.id)
                message.channel.send("K").catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase() == "hue")
        {
            if(message.author.id != bot.user.id)
                message.channel.send("Hue").catch(error => console.log("Send Error - " + error));
        }

    if(message.isMentioned(bot.user) && message.author.id != bot.user.id)
    {
        if(message.content.toLowerCase().indexOf("hi") > -1 || message.content.toLowerCase().indexOf("hello") > -1)
        {
            const helloResponses = ["hi", "hello", "ваша мать шлюха вокзальная сука блять"]
            message.channel.send(helloResponses[Math.floor(Math.random() * helloResponses.length)]).catch(error => console.log("Send Error - " + error));
        }

        if(message.content.toLowerCase().indexOf("you there?") > -1)
        {
            message.channel.send("Of course, bless the Motherland").catch(error => console.log("Send Error - " + error));
        }
    }

    if(message.content.toLowerCase().indexOf("thot") > -1 || message.content.toLowerCase().indexOf("t h o t") > -1
    || message.content.toLowerCase().indexOf("whore") > -1 || message.content.toLowerCase().indexOf("daddy") > -1
    || message.content.toLowerCase().indexOf("papi") > -1)
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
            var count = (msg.match(/thot/g) || []).length + (msg.match(/t h o t/g) || []).length 
            + (msg.match(/whore/g) || []).length + (msg.match(/daddy/g) || []).length + (msg.match(/papi/g) || []).length;
           
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
                            value: count,
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
                            value: count,
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

            if(message.isMentioned(bot.user))
            {
                message.channel.send("no u").catch(error => console.log("Send Error - " + error));
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
      || message.content.toLowerCase().indexOf("tosser") > -1 || message.content.toLowerCase().indexOf("cyka") > -1
      || message.content.toLowerCase().indexOf("blyat") > -1 || message.content.toLowerCase().indexOf("yobany urod") > -1
      || message.content.toLowerCase().indexOf("idi nahui") > -1 || message.content.toLowerCase().indexOf("pohui") > -1
      || message.content.toLowerCase().indexOf("kurva") > -1 || message.content.toLowerCase().indexOf("kurwa") > -1
      || message.content.toLowerCase().indexOf("pizdec") > -1 || message.content.toLowerCase().indexOf("pičo") > -1 
      || message.content.toLowerCase().indexOf("zmrd") > -1 || message.content.toLowerCase().indexOf("kokot") > -1
      || message.content.toLowerCase().indexOf("debil") > -1 || message.content.toLowerCase().indexOf("nahui pidar") > -1
      || message.content.toLowerCase().indexOf("vošukal") > -1 || message.content.toLowerCase().indexOf("čůrák") > -1
      || message.content.toLowerCase().indexOf("do prdele") > -1 || message.content.toLowerCase().indexOf("v prdeli") > -1 
      || message.content.toLowerCase().indexOf("zasranej") > -1 || message.content.toLowerCase().indexOf("yob tvoyu maht") > -1
      || message.content.toLowerCase().indexOf("yob tvoyu mat") > -1 || message.content.toLowerCase().indexOf("faggot") > -1
      || message.content.toLowerCase().indexOf("сука") > -1 || message.content.toLowerCase().indexOf("блядь") > -1
      || message.content.toLowerCase().indexOf("пиздець") > -1 || message.content.toLowerCase().indexOf("arsehole") > -1
      || message.content.toLowerCase().indexOf("bellend") > -1 || message.content.toLowerCase().indexOf("bollocks") > -1
      || message.content.toLowerCase().indexOf("nojoda") > -1 || message.content.toLowerCase().indexOf("coño") > -1
      || message.content.toLowerCase().indexOf("mierda") > -1)
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
            var count = (msg.match(/fuck/g) || []).length + (msg.match(/bitch/g) || []).length + (msg.match(/cunt/g) || []).length 
            + (msg.match(/twat/g) || []).length + (msg.match(/dick/g) || []).length + (msg.match(/slut/g) || []).length 
            + (msg.match(/fok/g) || []).length + (msg.match(/fuk/g) || []).length + (msg.match(/fek/g) || []).length 
            + (msg.match(/facc/g) || []).length + (msg.match(/focc/g) || []).length + (msg.match(/fucc/g) || []).length 
            + (msg.match(/fecc/g) || []).length + (msg.match(/asshole/g) || []).length + (msg.match(/dumbass/g) || []).length 
            + (msg.match(/bastard/g) || []).length + (msg.match(/fack/g) || []).length + (msg.match(/fock/g) || []).length 
            + (msg.match(/feck/g) || []).length + (msg.match(/wanker/g) || []).length + (msg.match(/tosser/g) || []).length 
            + (msg.match(/cyka/g) || []).length + (msg.match(/blyat/g) || []).length + (msg.match(/yobany urod/g) || []).length 
            + (msg.match(/idi nahui/g) || []).length + (msg.match(/pohui/g) || []).length + (msg.match(/kurva/g) || []).length 
            + (msg.match(/kurwa/g) || []).length + (msg.match(/pizdec/g) || []).length + (msg.match(/pičo/g) || []).length 
            + (msg.match(/zmrd/g) || []).length + (msg.match(/kokot/g) || []).length + (msg.match(/debil/g) || []).length 
            + (msg.match(/nahui pidar/g) || []).length + (msg.match(/vošukal/g) || []).length + (msg.match(/čůrák/g) || []).length 
            + (msg.match(/do prdele/g) || []).length + (msg.match(/v prdeli/g) || []).length + (msg.match(/zasranej/g) || []).length
            + (msg.match(/yob tvoyu maht/g) || []).length + (msg.match(/yob tvoyu mat/g) || []).length 
            + (msg.match(/faggot/g) || []).length + (msg.match(/сука/g) || []).length + (msg.match(/блядь/g) || []).length 
            + (msg.match(/пиздець/g) || []).length + (msg.match(/arsehole/g) || []).length + (msg.match(/bellend/g) || []).length 
            + (msg.match(/bollocks/g) || []).length + (msg.match(/nojoda/g) || []).length + (msg.match(/coño/g) || []).length
            + (msg.match(/mierda/g) || []).length;

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
                            value: count,
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
                        value: count,
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

                if(message.isMentioned(bot.user))
                {
                    message.channel.send("no u").catch(error => console.log("Send Error - " + error));
                }
            }
        }

        if(message.content.toLowerCase().indexOf("owo") > -1 || message.content.toLowerCase().indexOf("ovo") > -1 
        || message.content.toLowerCase().indexOf("uwu") > -1 || message.content.toLowerCase().indexOf("umu") > -1 || message.content.toLowerCase().indexOf("uvu") > -1
        || message.content.toLowerCase().indexOf("qwq") > -1 || message.content.toLowerCase().indexOf("qmq") > -1 || message.content.toLowerCase().indexOf("qvq") > -1
        || message.content.toLowerCase().indexOf("òwó") > -1 || message.content.toLowerCase().indexOf("òmó") > -1 || message.content.toLowerCase().indexOf("òvó") > -1 
        || message.content.toLowerCase().indexOf("ùwú") > -1 || message.content.toLowerCase().indexOf("ùmú") > -1 || message.content.toLowerCase().indexOf("ùvú") > -1
        || message.content.toLowerCase().indexOf("òwò") > -1 || message.content.toLowerCase().indexOf("òmò") > -1 || message.content.toLowerCase().indexOf("òvò") > -1 
        || message.content.toLowerCase().indexOf("ùwù") > -1 || message.content.toLowerCase().indexOf("ùwù") > -1 || message.content.toLowerCase().indexOf("ùvù") > -1
        || message.content.toLowerCase().indexOf("ówó") > -1 || message.content.toLowerCase().indexOf("óvó") > -1 || message.content.toLowerCase().indexOf("ómó") > -1 
        || message.content.toLowerCase().indexOf("úwú") > -1 || message.content.toLowerCase().indexOf("úvú") > -1 || message.content.toLowerCase().indexOf("úmú") > -1
        || message.content.toLowerCase().indexOf("ůwů") > -1 || message.content.toLowerCase().indexOf("ůvů") > -1 || message.content.toLowerCase().indexOf("ůmů") > -1
        || message.content.toLowerCase().indexOf("@w@") > -1 || message.content.toLowerCase().indexOf("@m@") > -1 || message.content.toLowerCase().indexOf("@v@") > -1
        || message.content.toLowerCase().indexOf("0w0") > -1 || message.content.toLowerCase().indexOf("0m0") > -1 || message.content.toLowerCase().indexOf("0v0") > -1
        || message.content.toLowerCase().indexOf(">w<") > -1 || message.content.toLowerCase().indexOf(">v<") > -1 || message.content.toLowerCase().indexOf(">m<") > -1
        || message.content.toLowerCase().indexOf("^w^") > -1 || message.content.toLowerCase().indexOf("^v^") > -1 || message.content.toLowerCase().indexOf("^m^") > -1
        || message.content.toLowerCase().indexOf("ôwô") > -1 || message.content.toLowerCase().indexOf("ôvô") > -1 || message.content.toLowerCase().indexOf("ômô") > -1
        || message.content.toLowerCase().indexOf("õwõ") > -1 || message.content.toLowerCase().indexOf("õvõ") > -1 || message.content.toLowerCase().indexOf("õmõ") > -1)
        {  
            if(message.author.id != bot.user.id)
            {
                var owoCounter = [];
                if(allOwOCounters.length > 0)
                {
                    for(var i = 0; i < allOwOCounters.length; i++)
                    {
                        if(allOwOCounters[i].key == message.guild.id)
                        {
                            owoCounter = allOwOCounters[i].counter;
                            i = allOwOCounters.length;
                        }
                    }
                }

                var msg = message.content.toLowerCase();
                var count = (msg.match(/owo/g) || []).length + (msg.match(/ovo/g) || []).length 
                + (msg.match(/uwu/g) || []).length + (msg.match(/umu/g) || []).length  + (msg.match(/uvu/g) || []).length 
                + (msg.match(/qwq/g) || []).length + (msg.match(/qmq/g) || []).length  + (msg.match(/qvq/g) || []).length 
                + (msg.match(/òwó/g) || []).length + (msg.match(/òmó/g) || []).length + (msg.match(/òvó/g) || []).length 
                + (msg.match(/ùwú/g) || []).length + (msg.match(/ùmú/g) || []).length + (msg.match(/ùvú/g) || []).length 
                + (msg.match(/òwò/g) || []).length + (msg.match(/òmò/g) || []).length + (msg.match(/òvò/g) || []).length 
                + (msg.match(/ùwù/g) || []).length + (msg.match(/ùwù/g) || []).length + (msg.match(/ùvù/g) || []).length 
                + (msg.match(/ówó/g) || []).length + (msg.match(/óvó/g) || []).length + (msg.match(/ómó/g) || []).length 
                + (msg.match(/úwú/g) || []).length + (msg.match(/úvú/g) || []).length + (msg.match(/úmú/g) || []).length 
                + (msg.match(/ůwů/g) || []).length + (msg.match(/ůvů/g) || []).length + (msg.match(/ůmů/g) || []).length 
                + (msg.match(/0v0/g) || []).length + (msg.match(/0w0/g) || []).length + (msg.match(/0m0/g) || []).length 
                + (msg.match(/>w</g) || []).length + (msg.match(/>v</g) || []).length + (msg.match(/>m</g) || []).length 
                + (msg.match(/^w^/g) || []).length + (msg.match(/^v^/g) || []).length + (msg.match(/^m^/g) || []).length 
                + (msg.match(/ôwô/g) || []).length + (msg.match(/ôvô/g) || []).length + (msg.match(/ômô/g) || []).length 
                + (msg.match(/õwõ/g) || []).length + (msg.match(/õvõ/g) || []).length + (msg.match(/õmõ/g) || []).length;
            
                if(owoCounter == [] || owoCounter.length == 0)
                {       
                    firebase.database().ref("serversettings/" + message.guild.id).once('value').then(function(snapshot) {
                        if(snapshot.val() == null)
                        {
                            migrateServerID(message.guild)
                            return;
                        }

                        if(snapshot.child("owocounter").val() != null)
                        {
                            owoCounter = JSON.parse(snapshot.child("owocounter").val());
                        }
                        else
                        {
                            owoCounter = [{key: "Key", value: 0, valueToCheck: 50, specialCheck: 1000}];
                        }

                        var hasKey = false;
                        var index = 1;
                        
                        for(var i = 0; i < owoCounter.length; i++)
                        {
                            if(owoCounter[i].key == message.channel.id)
                            {
                                hasKey = true;
                                owoCounter[i].value = owoCounter[i].value + count;
                                index = i;

                                if(owoCounter[i].specialCheck == null)
                                {
                                    owoCounter[i]["specialCheck"] = 1000;
                                }
                            }
                        }
                        if(!hasKey)
                        {
                            owoCounter.push({
                                key: message.channel.id,
                                value: count,
                                valueToCheck: 50,
                                specialCheck: 1000
                            });
                            for(var i = 0; i < owoCounter.length; i++)
                            {
                                if(owoCounter[i].key == message.channel.id)
                                {
                                    index = i;
                                }
                            }
                        }
                        
                            message.channel.send("OwO counter: " + numberWithCommas(owoCounter[index].value)).catch(error => console.log("Send Error - " + error));

                            if(owoCounter[index].value >= owoCounter[index].valueToCheck)
                            {
                                owoCounter[index].valueToCheck = Math.floor((owoCounter[index].value + 50)/10) * 10;

                                if(owoCounter[index].valueToCheck % 50 != 0)
                                {
                                    owoCounter[index].valueToCheck = (Math.floor((owoCounter[index].valueToCheck/100)) * 100) + 50
                                }

                                if(owoCounter[index].value >= owoCounter[index].specialCheck)
                                {
                                    message.channel.send("***Another OwO will result in death***", {files: ["owo1000.png"]}).catch(error => console.log("Send Error - " + error));
                                    owoCounter[index].specialCheck = Math.floor((owoCounter[index].value + 1000)/1000) * 1000;
                                }
                                else
                                {
                                    message.channel.send("***This is an Anti-Weeb server***", {files: ["owo.png"]}).catch(error => console.log("Send Error - " + error));
                                }
                            }
                        

                        allOwOCounters.push({key: message.guild.id, counter: owoCounter})
                        firebase.database().ref("serversettings/" + message.guild.id + "/owocounter").set(JSON.stringify(owoCounter));
                    }); 
                }   
                else
                {
                        var hasKey = false;
                        var index = 1;
                        
                        for(var i = 0; i < owoCounter.length; i++)
                        {
                            if(owoCounter[i].key == message.channel.id)
                            {
                                hasKey = true;
                                owoCounter[i].value = owoCounter[i].value + count;
                                index = i;

                                if(owoCounter[i].specialCheck == null)
                                {
                                    owoCounter[i]["specialCheck"] = 1000;
                                }
                            }
                        }
                        if(!hasKey)
                        {
                            owoCounter.push({
                                key: message.channel.id,
                                value: count,
                                valueToCheck: 50,
                                specialCheck: 1000
                            });
                            for(var i = 0; i < owoCounter.length; i++)
                            {
                                if(owoCounter[i].key == message.channel.id)
                                {
                                    index = i;
                                }
                            }
                        }

                        
                            message.channel.send("OwO counter: " + numberWithCommas(owoCounter[index].value)).catch(error => console.log("Send Error - " + error));

                            if(owoCounter[index].value >= owoCounter[index].valueToCheck)
                            {
                                owoCounter[index].valueToCheck = Math.floor((owoCounter[index].value + 50)/10) * 10;

                                if(owoCounter[index].valueToCheck % 50 != 0)
                                {
                                    owoCounter[index].valueToCheck = (Math.floor((owoCounter[index].valueToCheck/100)) * 100) + 50
                                }

                                if(owoCounter[index].value >= owoCounter[index].specialCheck)
                                {
                                    message.channel.send("***Another OwO will result in death***", {files: ["owo1000.png"]}).catch(error => console.log("Send Error - " + error));
                                    owoCounter[index].specialCheck = Math.floor((owoCounter[index].value + 1000)/1000) * 1000;
                                }
                                else
                                {
                                    message.channel.send("***This is an Anti-Weeb server***", {files: ["owo.png"]}).catch(error => console.log("Send Error - " + error));
                                }
                            }
                        

                        for(var i = 0; i < allOwOCounters.length; i++)
                        {
                            if(allOwOCounters[i].key == message.guild.id)
                            {
                                allOwOCounters[i].counter = owoCounter;
                                i = allOwOCounters.length;
                            }
                        }
                        firebase.database().ref("serversettings/" + message.guild.id + "/owocounter").set(JSON.stringify(owoCounter));
                }

                if(message.isMentioned(bot.user))
                {
                    message.channel.send("OwO").catch(error => console.log("Send Error - " + error));
                }
            }
        }

        if(message.content.toLowerCase().indexOf("oof") > -1)
        {  
            var checked = true;
            if(message.content.toLowerCase().indexOf("oof") > 0)
            {
                var character = message.content.toLowerCase()[message.content.toLowerCase().indexOf("oof") - 1]
                if(character != "o" && !character.match(/^[^a-zA-Z]+$/))
                {
                    checked = false;
                }
            }

            if(checked)
            {
                if(message.author.id != bot.user.id)
                {
                    var oofCounter = [];
                    if(allOofCounters.length > 0)
                    {
                        for(var i = 0; i < allOofCounters.length; i++)
                        {
                            if(allOofCounters[i].key == message.guild.id)
                            {
                                oofCounter = allOofCounters[i].counter;
                                i = allOofCounters.length;
                            }
                        }
                    }
        
                    var msg = message.content.toLowerCase();
                    var count = (msg.match(/oof/g) || []).length;
                
                    if(oofCounter == [] || oofCounter.length == 0)
                    {       
                        firebase.database().ref("serversettings/" + message.guild.id).once('value').then(function(snapshot) {
                            if(snapshot.val() == null)
                            {
                                migrateServerID(message.guild)
                                return;
                            }
        
                            if(snapshot.child("oofcounter").val() != null)
                            {
                                oofCounter = JSON.parse(snapshot.child("oofcounter").val());
                            }
                            else
                            {
                                oofCounter = [{key: "Key", value: 0, valueToCheck: 50, specialCheck: 1000}];
                            }
        
                            var hasKey = false;
                            var index = 1;
                            
                            for(var i = 0; i < oofCounter.length; i++)
                            {
                                if(oofCounter[i].key == message.channel.id)
                                {
                                    hasKey = true;
                                    oofCounter[i].value = oofCounter[i].value + count;
                                    index = i;
        
                                    if(oofCounter[i].specialCheck == null)
                                    {
                                        oofCounter[i]["specialCheck"] = 1000;
                                    }
                                }
                            }
                            if(!hasKey)
                            {
                                oofCounter.push({
                                    key: message.channel.id,
                                    value: count,
                                    valueToCheck: 50,
                                    specialCheck: 1000
                                });
                                for(var i = 0; i < oofCounter.length; i++)
                                {
                                    if(oofCounter[i].key == message.channel.id)
                                    {
                                        index = i;
                                    }
                                }
                            }
                            
                                message.channel.send("Oof counter: " + numberWithCommas(oofCounter[index].value)).catch(error => console.log("Send Error - " + error));
        
                                if(oofCounter[index].value >= oofCounter[index].valueToCheck)
                                {
                                    oofCounter[index].valueToCheck = Math.floor((oofCounter[index].value + 50)/10) * 10;
        
                                    if(oofCounter[index].valueToCheck % 50 != 0)
                                    {
                                        oofCounter[index].valueToCheck = (Math.floor((oofCounter[index].valueToCheck/100)) * 100) + 50
                                    }
        
                                    if(oofCounter[index].value >= oofCounter[index].specialCheck)
                                    {
                                        message.channel.send("***Only people with big peepee oof***", {files: ["oof.png"]}).catch(error => console.log("Send Error - " + error));
                                        oofCounter[index].specialCheck = Math.floor((oofCounter[index].value + 1000)/1000) * 1000;
                                    }
                                    else
                                    {
                                        message.channel.send("***Every time you oof, you gain " + ((Math.floor(Math.random() * 9) + 1) * 10) + " IQ points***", {files: ["oof.gif"]}).catch(error => console.log("Send Error - " + error));
                                    }
                                }
                            
        
                            allOofCounters.push({key: message.guild.id, counter: oofCounter})
                            firebase.database().ref("serversettings/" + message.guild.id + "/oofcounter").set(JSON.stringify(oofCounter));
                        }); 
                    }   
                    else
                    {
                            var hasKey = false;
                            var index = 1;
                            
                            for(var i = 0; i < oofCounter.length; i++)
                            {
                                if(oofCounter[i].key == message.channel.id)
                                {
                                    hasKey = true;
                                    oofCounter[i].value = oofCounter[i].value + count;
                                    index = i;
        
                                    if(oofCounter[i].specialCheck == null)
                                    {
                                        oofCounter[i]["specialCheck"] = 1000;
                                    }
                                }
                            }
                            if(!hasKey)
                            {
                                oofCounter.push({
                                    key: message.channel.id,
                                    value: count,
                                    valueToCheck: 50,
                                    specialCheck: 1000
                                });
                                for(var i = 0; i < oofCounter.length; i++)
                                {
                                    if(oofCounter[i].key == message.channel.id)
                                    {
                                        index = i;
                                    }
                                }
                            }
        
                            
                                message.channel.send("Oof counter: " + numberWithCommas(oofCounter[index].value)).catch(error => console.log("Send Error - " + error));
        
                                if(oofCounter[index].value >= oofCounter[index].valueToCheck)
                                {
                                    oofCounter[index].valueToCheck = Math.floor((oofCounter[index].value + 50)/10) * 10;
        
                                    if(oofCounter[index].valueToCheck % 50 != 0)
                                    {
                                        oofCounter[index].valueToCheck = (Math.floor((oofCounter[index].valueToCheck/100)) * 100) + 50
                                    }
        
                                    if(oofCounter[index].value >= oofCounter[index].specialCheck)
                                    {
                                        message.channel.send("***Only people with big peepee oof***", {files: ["oof.png"]}).catch(error => console.log("Send Error - " + error));
                                        oofCounter[index].specialCheck = Math.floor((oofCounter[index].value + 1000)/1000) * 1000;
                                    }
                                    else
                                    {
                                        message.channel.send("***Every time you oof, you gain " + ((Math.floor(Math.random() * 9) + 1) * 10) + " IQ points***", {files: ["oof.gif"]}).catch(error => console.log("Send Error - " + error));
                                    }
                                }
                            
        
                            for(var i = 0; i < allOofCounters.length; i++)
                            {
                                if(allOofCounters[i].key == message.guild.id)
                                {
                                    allOofCounters[i].counter = oofCounter;
                                    i = allOofCounters.length;
                                }
                            }
                            firebase.database().ref("serversettings/" + message.guild.id + "/oofcounter").set(JSON.stringify(oofCounter));
                    }
        
                    if(message.isMentioned(bot.user))
                    {
                        message.channel.send("no u").catch(error => console.log("Send Error - " + error));
                    }
                } 
            }
        }
    }
});

bot.on("disconnect", () => {
    console.log("Reconnecting")
    bot.login(process.env.BOT_TOKEN).then(function(){
        console.log("Reconnected")
    });  
})

bot.login(process.env.BOT_TOKEN).then(function(){
    signedIntoDiscord = true;
    if(signedIntoFirebase)
    {
        initData()
    }
});
