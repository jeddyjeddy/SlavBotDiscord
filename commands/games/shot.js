const command = require("discord.js-commando");
var isPlaying = [{key: "Key", value: true}];
var loaded = false;
const drunkMessages = ["is pissing on the train tracks", "is fighting with a random bear", "is hearing Hardbass from everywhere", "is pissing his tracksuit while squatting", "is trying to complete a series of backflips", "is pointing at random people and accusing them of being American spies", "is having visions of his dead babushka giving him one last meal"]
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

const messageDelay = 1000;

var allShotLoads = [{key: "Key", counter: null}]
var CommandCounter = require("../../index.js")

class ShotCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "shot",
            group: "games",
            memberName: "shot",
            description: "Have some shots of Vodka. See who lasts the longest.",
            examples: ["`!shot`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        } 

        if(signedIntoFirebase)
        {
            CommandCounter.addCommandCounter(message.author.id);
            var shotLoad = [];
            if(allShotLoads.length > 0)
            {
                for(var i = 0; i < allShotLoads.length; i++)
                {
                    if(allShotLoads[i].key == message.guild.id)
                    {
                        shotLoad = allShotLoads[i].counter;
                        i = allShotLoads.length;
                    }
                }
            }

            if(shotLoad == null || shotLoad.length == 0)
            {
                firebase.database().ref("serversettings/" + message.guild.id + "/shotLoad").once('value').then(function(snapshot) {
                    shotLoad = JSON.parse(snapshot.val());
                    if(shotLoad == null)
                    {
                        shotLoad = [{key: "Key", value: 0}]
                    }  
                    
    
                    var hasPlayKey = false;
                    var playindex = 1;
                    for(var i = 0; i < isPlaying.length; i++)
                    {
                        if(isPlaying[i].key == message.channel.id)
                        {
                            hasPlayKey = true;
                            playindex = i;
                        }
                    }
                    if(!hasPlayKey)
                    {
                        isPlaying.push({
                            key: message.channel.id,
                            value: false
                        });
                        for(var i = 0; i < isPlaying.length; i++)
                        {
                            if(isPlaying[i].key == message.channel.id)
                            {
                                playindex = i;
                            }
                        }
                    }
            
                    if(isPlaying[playindex].value)
                    {
                        return;
                    }
                    else
                    {
                        isPlaying[playindex].value = true; 
                    }
            
                    if(loaded)
                    {
                        const shots = Math.floor(Math.random() * 10) + 1;
                        var hasKey = false;
                        var index = 1;
                        for(var i = 0; i < shotLoad.length; i++)
                        {
                            if(shotLoad[i].key == message.channel.id)
                            {
                                hasKey = true;
                                shotLoad[i].value = shotLoad[i].value - shots;
                                index = i;
                            }
                        }
                        if(!hasKey)
                        {
                            shotLoad.push({
                                key: message.channel.id,
                                value: Math.floor(Math.random() * 16)
                            });
                            for(var i = 0; i < shotLoad.length; i++)
                            {
                                if(shotLoad[i].key == message.channel.id)
                                {
                                    index = i;
                                }
                            }
                        }
                        message.channel.send("**Bottle of Vodka not yet empty**").catch(error => {console.log("Send Error - " + error); });
                        setTimeout(function(){
                            message.channel.send("***Pouring Shot...***").catch(error => {console.log("Send Error - " + error); });
                            setTimeout(function(){
                                message.channel.send("***Taking " + shots + " shot(s) of Vodka...***").catch(error => {console.log("Send Error - " + error); });
                                if(shotLoad[index].value <= 0)
                            {
                                setTimeout(function(){
                                    message.channel.send("<@" + message.author.id + ">** is piss drunk...**").catch(error => {console.log("Send Error - " + error); });
                                    loaded = false;
                                    message.channel.send("<@" + message.author.id + "> ***" + drunkMessages[Math.floor(Math.random() * drunkMessages.length)] + "***").catch(error => {console.log("Send Error - " + error); });
                                }, messageDelay);
                                
                            }
                            else
                            {
                                setTimeout(function(){
                                    message.channel.send("<@" + message.author.id + ">* remains sober...*").catch(error => {console.log("Send Error - " + error); });
                                    setTimeout(function(){
                                        message.channel.send("*A True Slav!*").catch(error => {console.log("Send Error - " + error); });
                                        
                                    }, messageDelay);
                                    isPlaying[playindex].value = false;
                                }, messageDelay);
                            }
                            }, messageDelay);
                            
                        }, messageDelay);
                    }
                    else
                    {
                        var hasKey = false;
                        var index = 1;
                        const shots = Math.floor(Math.random() * 10) + 1;
                        for(var i = 0; i < shotLoad.length; i++)
                        {
                            if(shotLoad[i].key == message.channel.id)
                            {
                                hasKey = true;
                                shotLoad[i].value = Math.floor(Math.random() * 16) - shots;
                                index = i
                            }
                        }
                        if(!hasKey)
                        {
                            shotLoad.push({
                                key: message.channel.id,
                                value: Math.floor(Math.random() * 16) - shots
                            });
                            for(var i = 0; i < shotLoad.length; i++)
                            {
                                if(shotLoad[i].key == message.channel.id)
                                {
                                    index = i;
                                }
                            }
                        }
                        message.channel.send("***Gettting another bottle of Vodka...***").catch(error => {console.log("Send Error - " + error); });
                        setTimeout(function(){
                            message.channel.send("***Opening Bottle...***").catch(error => {console.log("Send Error - " + error); });
            
                            setTimeout(function(){
                                message.channel.send("***Pouring Shot...***").catch(error => {console.log("Send Error - " + error); });
            
                                setTimeout(function(){
                                    message.channel.send("***Taking " + shots + " shot(s) of Vodka...***").catch(error => {console.log("Send Error - " + error); });

                                    if(shotLoad[index].value <= 0)
                                    {
                                        setTimeout(function(){
                                            message.channel.send("<@" + message.author.id + ">** is piss drunk...**").catch(error => {console.log("Send Error - " + error); });
                                            message.channel.send("<@" + message.author.id + "> ***" + drunkMessages[Math.floor(Math.random() * drunkMessages.length)] + "***").catch(error => {console.log("Send Error - " + error); });
                                        }, messageDelay);
                                    }
                                    else
                                    {
                                        setTimeout(function(){
                                            message.channel.send("<@" + message.author.id + ">* remains sober...*").catch(error => {console.log("Send Error - " + error); });
                                            setTimeout(function(){
                                                message.channel.send("*A True Slav!*").catch(error => {console.log("Send Error - " + error); });
                                                
                                            }, messageDelay);
                                            var hasKey = false;
                                            for(var i = 0; i < shotLoad.length; i++)
                                            {
                                                if(shotLoad[i].key == message.channel.id)
                                                {
                                                    hasKey = true;
                                                }
                                            }
                                            if(!hasKey)
                                            {
                                                shotLoad.push({
                                                    key: message.channel.id,
                                                    value: Math.floor(Math.random() * 16) - shots
                                                });
                                            }
                                            loaded = true;
                                            isPlaying[playindex].value = false;
                                        }, messageDelay);
                                    }
                                }, messageDelay);
                            }, messageDelay);
                        }, messageDelay);
                    }
                    console.log(shotLoad);

                    allShotLoads.push({key: message.guild.id, counter: shotLoad})
                    firebase.database().ref("serversettings/" + message.guild.id + "/shotLoad").set(JSON.stringify(shotLoad));
                }); 
            } //Local Storage
            else
            {
                

                var hasPlayKey = false;
                var playindex = 1;
                for(var i = 0; i < isPlaying.length; i++)
                {
                    if(isPlaying[i].key == message.channel.id)
                    {
                        hasPlayKey = true;
                        playindex = i;
                    }
                }
                if(!hasPlayKey)
                {
                    isPlaying.push({
                        key: message.channel.id,
                        value: false
                    });
                    for(var i = 0; i < isPlaying.length; i++)
                    {
                        if(isPlaying[i].key == message.channel.id)
                        {
                            playindex = i;
                        }
                    }
                }
        
                if(isPlaying[playindex].value)
                {
                    return;
                }
                else
                {
                    isPlaying[playindex].value = true; 
                }
        
                if(loaded)
                {
                    var hasKey = false;
                    var index = 1;
                    const shots = Math.floor(Math.random() * 10) + 1;
                    for(var i = 0; i < shotLoad.length; i++)
                    {
                        if(shotLoad[i].key == message.channel.id)
                        {
                            hasKey = true;
                            shotLoad[i].value = shotLoad[i].value - shots;
                            index = i;
                        }
                    }
                    if(!hasKey)
                    {
                        shotLoad.push({
                            key: message.channel.id,
                            value: Math.floor(Math.random() * 16) - shots
                        });
                        for(var i = 0; i < shotLoad.length; i++)
                        {
                            if(shotLoad[i].key == message.channel.id)
                            {
                                index = i;
                            }
                        }
                    }
                    message.channel.send("**Bottle of Vodka not yet empty**").catch(error => {console.log("Send Error - " + error); });
                    setTimeout(function(){
                        message.channel.send("***Pouring Shot...***").catch(error => {console.log("Send Error - " + error); });
                        setTimeout(function(){
                            message.channel.send("***Taking " + shots + " shot(s) of Vodka...***").catch(error => {console.log("Send Error - " + error); });
                            if(shotLoad[index].value <= 0)
                            {
                                setTimeout(function(){
                                    message.channel.send("<@" + message.author.id + ">** is piss drunk...**").catch(error => {console.log("Send Error - " + error); });
                                    loaded = false;
                                    message.channel.send("<@" + message.author.id + "> ***" + drunkMessages[Math.floor(Math.random() * drunkMessages.length)] + "***").catch(error => {console.log("Send Error - " + error); });
                                }, messageDelay);
                                
                            }
                            else
                            {
                                setTimeout(function(){
                                    message.channel.send("<@" + message.author.id + ">* remains sober...*").catch(error => {console.log("Send Error - " + error); });
                                    setTimeout(function(){
                                        message.channel.send("*A True Slav!*").catch(error => {console.log("Send Error - " + error); });
                                        
                                    }, messageDelay);
                                    isPlaying[playindex].value = false;
                                }, messageDelay);
                            }
                        }, messageDelay);
                        
                    }, messageDelay);
                }
                else
                {
                    var hasKey = false;
                    var index = 1;
                    const shots = Math.floor(Math.random() * 10) + 1;
                    for(var i = 0; i < shotLoad.length; i++)
                    {
                        if(shotLoad[i].key == message.channel.id)
                        {
                            hasKey = true;
                            shotLoad[i].value = Math.floor(Math.random() * 16) - shots;
                            index = i
                        }
                    }
                    if(!hasKey)
                    {
                        shotLoad.push({
                            key: message.channel.id,
                            value: Math.floor(Math.random() * 16) - shots
                        });
                        for(var i = 0; i < shotLoad.length; i++)
                        {
                            if(shotLoad[i].key == message.channel.id)
                            {
                                index = i;
                            }
                        }
                    }
                    message.channel.send("***Gettting another bottle of Vodka...***").catch(error => {console.log("Send Error - " + error); });
                    setTimeout(function(){
                        message.channel.send("***Opening Bottle...***").catch(error => {console.log("Send Error - " + error); });
        
                        setTimeout(function(){
                            message.channel.send("***Pouring Shot...***").catch(error => {console.log("Send Error - " + error); });
        
                            setTimeout(function(){
                                message.channel.send("***Taking " + shots + " shot(s) of Vodka...***").catch(error => {console.log("Send Error - " + error); });

                                if(shotLoad[index].value <= 0)
                                {
                                    setTimeout(function(){
                                        message.channel.send("<@" + message.author.id + ">** is piss drunk...**").catch(error => {console.log("Send Error - " + error); });
                                        message.channel.send("<@" + message.author.id + "> ***" + drunkMessages[Math.floor(Math.random() * drunkMessages.length)] + "***").catch(error => {console.log("Send Error - " + error); });
                                    }, messageDelay);
                                }
                                else
                                {
                                    setTimeout(function(){
                                        message.channel.send("<@" + message.author.id + ">* remains sober...*").catch(error => {console.log("Send Error - " + error); });
                                        setTimeout(function(){
                                            message.channel.send("*A True Slav!*").catch(error => {console.log("Send Error - " + error); });
                                            
                                        }, messageDelay);
                                        var hasKey = false;
                                        for(var i = 0; i < shotLoad.length; i++)
                                        {
                                            if(shotLoad[i].key == message.channel.id)
                                            {
                                                hasKey = true;
                                            }
                                        }
                                        if(!hasKey)
                                        {
                                            shotLoad.push({
                                                key: message.channel.id,
                                                value: Math.floor(Math.random() * 16) - shots
                                            });
                                        }
                                        loaded = true;
                                        isPlaying[playindex].value = false;
                                    }, messageDelay);
                                }
                            }, messageDelay);
                        }, messageDelay);
                    }, messageDelay);
                }
                console.log(shotLoad);

                for(var i = 0; i < allShotLoads.length; i++)
                {
                    if(allShotLoads[i].key == message.guild.id)
                    {
                        allShotLoads[i].counter = shotLoad;
                        i = allShotLoads.length;
                    }
                }
                firebase.database().ref("serversettings/" + message.guild.id + "/shotLoad").set(JSON.stringify(shotLoad));
            }
        }
        else
        {
            run(message, args); 
        }
    }
}

module.exports = ShotCommand;