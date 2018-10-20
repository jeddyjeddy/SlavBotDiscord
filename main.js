const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js', { token: process.env.BOT_TOKEN });

var firebase = require("firebase");
var config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.PROJECT_ID + ".firebaseapp.com",
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.PROJECT_ID + ".appspot.com",
    databaseURL: "https://" + process.env.PROJECT_ID + ".firebaseio.com"
  };
firebase.initializeApp(config);

var signedIntoFirebase = false;
firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode);
    console.log(errorMessage);
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("signed in to firebase");
      signedIntoFirebase = true;
      initData();
    } else {
      console.log("signed out of firebase");
      signedIntoFirebase = false;
    }
  });

var userCommandUsage = [{key: "Key", data: {uses: 0, requestsSent: 0, weekendUsesCheck: 100, usesCheck: 250}}] 
var tokens = [{key: "Key", tokens: 0, collectDate: ""}]

function initData()
{
    firebase.database().ref("usersettings/").once('value').then(function(snapshot) {
        if(snapshot.val() != null)
        {
            snapshot.forEach(function(childSnap){
                if(childSnap.child("commandusage").val() != null)
                    userCommandUsage.push({key: childSnap.key, data: JSON.parse(childSnap.child("commandusage").val())});
    
                if(childSnap.child("tokens").val() != null)
                {
                    var token = JSON.parse(childSnap.child("tokens").val())
                    tokens.push(token)
                }
            });
        }
      })
}

function commandUsageAscending(a, b)
{
    if (a.data.uses < b.data.uses)
        return 1;
    if (a.data.uses > b.data.uses)
        return -1;
    return 0;
}

/*const giveawayToken = 10000;

var listener = require("contentful-webhook-listener");
var webhook = listener.createServer({
    "Authorization": process.env.VOTE_AUTH
}, function requestListener (request, response) {
    console.log("request received");
    var body = []
    request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
            body = Buffer.concat(body).toString()
            if(body != [] && body !== undefined && body !== null)
            {
                var data = JSON.parse(body);
                sendUserTokens(data["user"])
            }
      });
});
var port = 3000;
 
webhook.listen(port, function callback () {
 
    console.log("server is listening");
 
});*/

async function sendUserTokens(userID)
{
    var shards = Manager.shards.array()
    var foundUser = false;
    shards.forEach(async (shard) => {
        if(!foundUser)
            foundUser = await shard.eval(`var user = await this.fetchMember(${userID});if(user != undefined && user != null){user.send("Thank you for voting, you have recieved " + numberWithCommas(giveawayToken) + " tokens. You now have " + numberWithCommas(getUserTokens(data["user"])) + " tokens. Use \`help ww\` for more info on these tokens.").catch(error => console.log("Send Error - " + error));return true;}else{return false;}`);
    })

    this.addUserTokens(userID, giveawayToken)
}

var ResponseFunctions = module.exports = {
    commandCounterChange: function(user){
        const userID  = user.id;
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
                                       
                                        user.send("You have sent " + numberWithCommas(userCommandUsage[i].data.uses) + " command requests to Slav Bot! Thank you for your support! You can help Slav Bot grow even further by voting for it on DBL. Votes made during the weekends are counted as double votes!\n\nYou will also recieve " + numberWithCommas(giveawayToken) + " War Tokens by voting.\n\nhttps://discordbots.org/bot/319533843482673152/vote").then(() => {
                                            user.send("You can also Support Slav Bot on Patreon: https://www.patreon.com/merriemweebster").catch(error => console.log("Send Error - " + error))
                                        }).catch(error => console.log("Send Error - " + error));
                                        
    
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
                                        
                                        user.send("You have sent " + numberWithCommas(userCommandUsage[i].data.uses) + " command requests to Slav Bot! Thank you for your support! You can help Slav Bot grow even further by voting for it on DBL.\n\nYou will also recieve " + numberWithCommas(giveawayToken) + " War Tokens by voting.\n\nhttps://discordbots.org/bot/319533843482673152/vote").then(() => {
                                            user.send("You can also Support Slav Bot on Patreon: https://www.patreon.com/merriemweebster").catch(error => console.log("Send Error - " + error))
                                        }).catch(error => console.log("Send Error - " + error));
                                       
                                    
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
                                    this.commandCounterChange(userID)
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
    },
    getUserCommandCounter: function(userID) {

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
    },
    
    getUserBaseCount: function() 
    {
        return numberWithCommas(userCommandUsage.length);
    },
    getLeaderboardRankings: function()
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
    },

    getLocalLeaderboardRankings: function(members)
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
    },

    getUserTokens: function(userID)
    {
        for(var index = 0; index < tokens.length; index++)
        {
            if(tokens[index].key == userID)
            {
                return tokens[index].tokens;
            }
        }

        firebase.database().ref("usersettings/" + userID + "/tokens").once('value').then(function(snapshot) {
            if(snapshot.val() != null)
            {
                var token = JSON.parse(snapshot.val())
                tokens.push(token)
            }
            else
            {
                var timestamp = (new Date(Date.now()).toJSON());
                var token = {key: userID, tokens: 0, collectDate: timestamp}
                tokens.push(token);
                firebase.database().ref("usersettings/" + userID + "/tokens").set(JSON.stringify(token))
            }
        })

        return 0;
    },

    addUserTokens: function(userID, amount)
    {
        for(var index = 0; index < tokens.length; index++)
        {
            if(tokens[index].key == userID)
            {
                tokens[index].tokens = tokens[index].tokens + amount;
                firebase.database().ref("usersettings/" + userID + "/tokens").set(JSON.stringify(tokens[index]))
                return;
            }
        }

        if(signedIntoDiscord)
        {
            this.getUserTokens(userID)
            this.addUserTokens(userID, amount)
        }
    },

    subtractUserTokens: function(userID, amount)
    {
        for(var index = 0; index < tokens.length; index++)
        {
            if(tokens[index].key == userID)
            {
                if(tokens[index].tokens >= amount)
                {
                    tokens[index].tokens = tokens[index].tokens - amount;
                    firebase.database().ref("usersettings/" + userID + "/tokens").set(JSON.stringify(tokens[index]))
                    return true;
                }
            }
        }

        return false;
    },

    getTokenCooldown: function(userID)
    {
        for(var index = 0; index < tokens.length; index++)
        {
            if(tokens[index].key == userID)
            {
                return tokens[index].collectDate;
            }
        }

        return (new Date(Date.now()).toJSON());
    },

    setTokenCooldown: function(userID, cooldown)
    {
        for(var index = 0; index < tokens.length; index++)
        {
            if(tokens[index].key == userID)
            {
                tokens[index].collectDate = cooldown;
                firebase.database().ref("usersettings/" + userID + "/tokens").set(JSON.stringify(tokens[index]))
            }
        }
    }
}

Manager.spawn(2, 15000);
manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));