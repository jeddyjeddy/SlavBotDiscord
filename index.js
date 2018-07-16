const commando = require("discord.js-commando");
const bot = new commando.Client({
    owner: "281876391535050762"});

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
        firebase.database().ref("serversettings/" + mem.id).remove();
});

var allSwearCounters = [{key: "Key", counter: null}] 
var allThotCounters = [{key: "Key", counter: null}]
var responseSettings = [{key: "Key", respond: true}] 

var localGetResponse = (guildID) => {
    for(var i = 0; i < responseSettings.length; i++)
    {
        if(guildID == responseSettings[i].key)
        {
            return responseSettings[i].respond;
        }
    }
    firebase.database().ref("serversettings/" + guildID + "/respond").once('value').then(function(snapshot) {
        if(snapshot.val() == null)
        {
            migrateServerID(message.guild);
        }
        else if(snapshot.val() === true)
        {
            responseSettings.push({key: guildID, respond: true})
        }
        else if(snapshot.val() === false)
        {
            responseSettings.push({key: guildID, respond: false})
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

var migrateServerID = (guild) =>
{
    //If server ID in serversettings returns null
    var channels = guild.channels.array();
    var alreadyFoundData = false;
    for(var i = 0; i < channels.length; i++)
    {
        firebase.database().ref("serversettings/" + channels[i].id).once('value').then(function(snapshot) {
            if(snapshot.val() != null)
            {
                if(!alreadyFoundData)
                {
                    firebase.database().ref("serversettings/" + guild.id).set(snapshot.val());
                    alreadyFoundData = true;
                }
                else
                {
                    snapshot.ref.remove();
                }
            }

            if(i == channels.length - 1)
            {
                var responseCheck = false;
                for(var index = 0; index < responseSettings.length; index++)
                {
                    if(guildID == responseSettings[index].key)
                    {
                        responseCheck = true;
                    }
                }

                if(!responseCheck)
                {
                    if(alreadyFoundData)
                    {
                        localGetResponse(guild.id);
                    }
                    else
                    {
                        responseSettings.push({key: guild.id, respond: true});
                    }
                }
            }
        })
    }
}

var ResponseFunctions = module.exports = {
 getResponse: function(guildID) {
    return localGetResponse(guildID)
},

 changeResponse: function(guildID, setting) {
    localChangeResponse(guildID, setting)
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
    
    if(!message.guild.member(message.client.user.id).hasPermission("SEND_MESSAGES") && !message.guild.member(message.client.user.id).hasPermission("ATTACH_FILES")){
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
        localGetResponse(message.guild.id);
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
                firebase.database().ref("serversettings/" + message.guild.id + "/thotcounter").once('value').then(function(snapshot) {
                    if(snapshot.val() == null)
                    {
                        migrateServerID(message.guild)
                        return;
                    }

                    thotCounter = JSON.parse(snapshot.val());

                    if(thotCounter == null)
                    {
                        thotCounter = [{key: "Key", value: 0, valueToCheck: 10}];
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
                        }
                    }
                    if(!hasKey)
                    {
                        thotCounter.push({
                            key: message.channel.id,
                            value: 1,
                            valueToCheck: 10
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
                            message.channel.send("***B E G O N E  T H O T***", {files: ["thot.gif"]}).catch(error => console.log("Send Error - " + error));
                            thotCounter[index].valueToCheck = Math.floor((thotCounter[index].value + 10)/10) * 10;
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
                        }
                    }
                    if(!hasKey)
                    {
                        thotCounter.push({
                            key: message.channel.id,
                            value: 1,
                            valueToCheck: 10
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
                            message.channel.send("***B E G O N E  T H O T***", {files: ["thot.gif"]}).catch(error => console.log("Send Error - " + error));
                            thotCounter[index].valueToCheck = Math.floor((thotCounter[index].value + 10)/10) * 10;
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
      || message.content.toLowerCase().indexOf("feck") > -1)
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
            var count = (msg.match(/fuck/g) || []).length + (msg.match(/bitch/g) || []).length + (msg.match(/cunt/g) || []).length + (msg.match(/twat/g) || []).length + (msg.match(/dick/g) || []).length + (msg.match(/slut/g) || []).length + (msg.match(/fok/g) || []).length + (msg.match(/fuk/g) || []).length + (msg.match(/fek/g) || []).length + (msg.match(/facc/g) || []).length + (msg.match(/focc/g) || []).length + (msg.match(/fucc/g) || []).length + (msg.match(/fecc/g) || []).length + (msg.match(/asshole/g) || []).length + (msg.match(/dumbass/g) || []).length + (msg.match(/bastard/g) || []).length + (msg.match(/fack/g) || []).length + (msg.match(/fock/g) || []).length + (msg.match(/feck/g) || []).length;

            if(swearcounter == [] || swearcounter.length == 0)
            {
                firebase.database().ref("serversettings/" + message.guild.id + "/swearcounter").once('value').then(function(snapshot) {
                    if(snapshot.val() == null)
                    {
                        migrateServerID(message.guild);
                        return;
                    }
                    
                    swearCounter = JSON.parse(snapshot.val());

                    if(swearCounter == null)
                    {
                        swearCounter = [{key: "Key", value: 0, valueToCheck: 10}];
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
                        }
                    }
                    if(!hasKey)
                    {
                        swearCounter.push({
                            key: message.channel.id,
                            value: 1,
                            valueToCheck: 10
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
                            message.channel.send(curseResponses[Math.floor(Math.random() * (curseResponses.length))]).catch(error => console.log("Send Error - " + error));
                            swearCounter[index].valueToCheck = Math.floor((swearCounter[index].value + 10)/10) * 10;
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
                    }
                }
                if(!hasKey)
                {
                    swearCounter.push({
                        key: message.channel.id,
                        value: 1,
                        valueToCheck: 10
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
                        message.channel.send(curseResponses[Math.floor(Math.random() * (curseResponses.length))]).catch(error => console.log("Send Error - " + error));
                        swearCounter[index].valueToCheck = Math.floor((swearCounter[index].value + 10)/10) * 10;
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

bot.login(process.env.BOT_TOKEN);
