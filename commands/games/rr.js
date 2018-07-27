const command = require("discord.js-commando");
var isPlaying = [{key: "Key", value: true}];
var loaded = false;
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}
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

var allBulletLoads = [{key: "Key", counter: null}]
var CommandCounter = require("../../index.js")

class RrCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "rr",
            group: "games",
            memberName: "rr",
            description: "Play Russian Roulette.",
            examples: ["`!rr`"]
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
            var bulletLoad = [];
            if(allBulletLoads.length > 0)
            {
                for(var i = 0; i < allBulletLoads.length; i++)
                {
                    if(allBulletLoads[i].key == message.guild.id)
                    {
                        bulletLoad = allBulletLoads[i].counter;
                        i = allBulletLoads.length;
                    }
                }
            }

            if(bulletLoad == null || bulletLoad.length == 0)
            {
                firebase.database().ref("serversettings/" + message.guild.id + "/bulletload").once('value').then(function(snapshot) {
                    bulletLoad = JSON.parse(snapshot.val());
                    if(bulletLoad == null)
                    {
                        bulletLoad = [{key: "Key", value: 0}]
                    }  
                    message.channel.startTyping();
    
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
                        for(var i = 0; i < bulletLoad.length; i++)
                        {
                            if(bulletLoad[i].key == message.channel.id)
                            {
                                hasKey = true;
                                bulletLoad[i].value = bulletLoad[i].value - 1;
                                index = i;
                            }
                        }
                        if(!hasKey)
                        {
                            bulletLoad.push({
                                key: message.channel.id,
                                value: Math.floor(Math.random() * 6)
                            });
                            for(var i = 0; i < bulletLoad.length; i++)
                            {
                                if(bulletLoad[i].key == message.channel.id)
                                {
                                    index = i;
                                }
                            }
                        }
                        message.channel.send("**Revolver Already Loaded**").catch(error => console.log("Send Error - " + error));
                        setTimeout(function(){
                            message.channel.send("***Pulls Trigger...***").catch(error => console.log("Send Error - " + error));
            
                            if(bulletLoad[index].value <= 0)
                            {
                                setTimeout(function(){
                                    message.channel.send("***Revolver Fires...***").catch(error => console.log("Send Error - " + error));
                                    setTimeout(function(){
                                        message.channel.send("<@" + message.author.id + ">** is dead...**").catch(error => console.log("Send Error - " + error));
                                        loaded = false;
                                        Jimp.read("tombstone.png").then(function (tombImage) {
                                            Jimp.read(message.author.avatarURL).then(function (userImage) {
                                                tombImage.resize(userImage.bitmap.width / 2, userImage.bitmap.height / 2);
                        
                                                var x = userImage.bitmap.width - tombImage.bitmap.width;
                                                var y = tombImage.bitmap.height;
                                                        
                                                var mergedImage = userImage.composite(tombImage, x, y );
                                                var file = shortid.generate() + ".png"
                                                mergedImage.write(file, function(error){
                                                    if(error) throw error;
                                                    message.channel.send("F", {
                                                        files: [file]
                                                    }).then(function(){
                                                        message.channel.stopTyping();
            
                                                        fs.unlink(file, resultHandler);
                                                         
                                                    }).catch(function (err) {
                                                        message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                        console.log(err.message);
                                                        message.channel.stopTyping();
                                                        fs.unlink(file, resultHandler);
                                                    });
                                                    isPlaying[playindex].value = false;
                                                });
                                            }).catch(function (err) {
                                                console.log(err.message);
                                                message.channel.stopTyping();
                                            });
                                        }).catch(function (err) {
                                            console.log(err.message);
                                            message.channel.stopTyping();
                                        });
                                    }, messageDelay);
                                }, messageDelay);
                            }
                            else
                            {
                                setTimeout(function(){
                                    message.channel.send("*The revolver clicks...*").catch(error => console.log("Send Error - " + error));
                                    setTimeout(function(){
                                        message.channel.send("*You're still alive!*").catch(error => console.log("Send Error - " + error));
                                        message.channel.stopTyping();
                                    }, messageDelay);
                                    isPlaying[playindex].value = false;
                                }, messageDelay);
                            }
                        }, messageDelay);
                    }
                    else
                    {
                        var hasKey = false;
                        var index = 1;
                        for(var i = 0; i < bulletLoad.length; i++)
                        {
                            if(bulletLoad[i].key == message.channel.id)
                            {
                                hasKey = true;
                                bulletLoad[i].value = Math.floor(Math.random() * 6);
                                index = i
                            }
                        }
                        if(!hasKey)
                        {
                            bulletLoad.push({
                                key: message.channel.id,
                                value: Math.floor(Math.random() * 6)
                            });
                            for(var i = 0; i < bulletLoad.length; i++)
                            {
                                if(bulletLoad[i].key == message.channel.id)
                                {
                                    index = i;
                                }
                            }
                        }
                        message.channel.send("***Reloading Revolver...***").catch(error => console.log("Send Error - " + error));
                        setTimeout(function(){
                            message.channel.send("***Spinning Cylinder...***").catch(error => console.log("Send Error - " + error));
            
                            setTimeout(function(){
                                message.channel.send("***Pulls Trigger...***").catch(error => console.log("Send Error - " + error));
            
                                setTimeout(function(){
                                    if(bulletLoad[index].value <= 0)
                                    {
                                        message.channel.send("***Revolver Fires...***").catch(error => console.log("Send Error - " + error));
                                        setTimeout(function(){
                                            message.channel.send("<@" + message.author.id + ">** is dead...**").catch(error => console.log("Send Error - " + error));
                                            Jimp.read("tombstone.png").then(function (tombImage) {
                                                Jimp.read(message.author.avatarURL).then(function (userImage) {
                                                    tombImage.resize(userImage.bitmap.width / 2, userImage.bitmap.height / 2);
                            
                                                    var x = userImage.bitmap.width - tombImage.bitmap.width;
                                                    var y = tombImage.bitmap.height;
                                                            
                                                    var mergedImage = userImage.composite(tombImage, x, y );
                                                    var file = shortid.generate() + ".png"
                                                    mergedImage.write(file, function(error){
                                                        if(error) throw error;
                                                        message.channel.send("F", {
                                                            files: [file]
                                                        }).then(function(){
                                                            message.channel.stopTyping();
                                                                fs.unlink(file, resultHandler);
                                                               
                                                        }).catch(function (err) {
                                                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                            console.log(err.message);
                                                            message.channel.stopTyping();
                                                                fs.unlink(file, resultHandler);
                                                              
                                                        })
                                                        isPlaying[playindex].value = false;
                                                    });
                                                });
                                            }).catch(function (err) {
                                                console.log(err.message);
                                                message.channel.stopTyping();
                                            });
                                        }, messageDelay);
                                    }
                                    else
                                    {
                                        setTimeout(function(){
                                            message.channel.send("*The revolver clicks...*").catch(error => console.log("Send Error - " + error));
                                            setTimeout(function(){
                                                message.channel.send("*You're still alive!*").catch(error => console.log("Send Error - " + error));
                                                message.channel.stopTyping();
                                            }, messageDelay);
                                            var hasKey = false;
                                            for(var i = 0; i < bulletLoad.length; i++)
                                            {
                                                if(bulletLoad[i].key == message.channel.id)
                                                {
                                                    hasKey = true;
                                                }
                                            }
                                            if(!hasKey)
                                            {
                                                bulletLoad.push({
                                                    key: message.channel.id,
                                                    value: Math.floor(Math.random() * 6)
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
                    console.log(bulletLoad);

                    allBulletLoads.push({key: message.guild.id, counter: bulletLoad})
                    firebase.database().ref("serversettings/" + message.guild.id + "/bulletload").set(JSON.stringify(bulletLoad));
                }); 
            } //Local Storage
            else
            {
                message.channel.startTyping();

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
                    for(var i = 0; i < bulletLoad.length; i++)
                    {
                        if(bulletLoad[i].key == message.channel.id)
                        {
                            hasKey = true;
                            bulletLoad[i].value = bulletLoad[i].value - 1;
                            index = i;
                        }
                    }
                    if(!hasKey)
                    {
                        bulletLoad.push({
                            key: message.channel.id,
                            value: Math.floor(Math.random() * 6)
                        });
                        for(var i = 0; i < bulletLoad.length; i++)
                        {
                            if(bulletLoad[i].key == message.channel.id)
                            {
                                index = i;
                            }
                        }
                    }
                    message.channel.send("**Revolver Already Loaded**").catch(error => console.log("Send Error - " + error));
                    setTimeout(function(){
                        message.channel.send("***Pulls Trigger...***").catch(error => console.log("Send Error - " + error));
        
                        if(bulletLoad[index].value <= 0)
                        {
                            setTimeout(function(){
                                message.channel.send("***Revolver Fires...***").catch(error => console.log("Send Error - " + error));
                                setTimeout(function(){
                                    message.channel.send("<@" + message.author.id + ">** is dead...**").catch(error => console.log("Send Error - " + error));
                                    loaded = false;
                                    Jimp.read("tombstone.png").then(function (tombImage) {
                                        Jimp.read(message.author.avatarURL).then(function (userImage) {
                                            tombImage.resize(userImage.bitmap.width / 2, userImage.bitmap.height / 2);
                    
                                            var x = userImage.bitmap.width - tombImage.bitmap.width;
                                            var y = tombImage.bitmap.height;
                                                    
                                            var mergedImage = userImage.composite(tombImage, x, y );
                                            var file = shortid.generate() + ".png"
                                            mergedImage.write(file, function(error){
                                                if(error) throw error;
                                                message.channel.send("F", {
                                                    files: [file]
                                                }).then(function(){
                                                    message.channel.stopTyping();
        
                                                        fs.unlink(file, resultHandler);
                                                     
                                                }).catch(function (err) {
                                                    message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                    console.log(err.message);
                                                    message.channel.stopTyping();
                                                        fs.unlink(file, resultHandler);
                                                      
                                                });
                                                isPlaying[playindex].value = false;
                                            });
                                        }).catch(function (err) {
                                            console.log(err.message);
                                            message.channel.stopTyping();
                                        });
                                    }).catch(function (err) {
                                        console.log(err.message);
                                        message.channel.stopTyping();
                                    });
                                }, messageDelay);
                            }, messageDelay);
                        }
                        else
                        {
                            setTimeout(function(){
                                message.channel.send("*The revolver clicks...*").catch(error => console.log("Send Error - " + error));
                                setTimeout(function(){
                                    message.channel.send("*You're still alive!*").catch(error => console.log("Send Error - " + error));
                                    message.channel.stopTyping();
                                }, messageDelay);
                                isPlaying[playindex].value = false;
                            }, messageDelay);
                        }
                    }, messageDelay);
                }
                else
                {
                    var hasKey = false;
                    var index = 1;
                    for(var i = 0; i < bulletLoad.length; i++)
                    {
                        if(bulletLoad[i].key == message.channel.id)
                        {
                            hasKey = true;
                            bulletLoad[i].value = Math.floor(Math.random() * 6);
                            index = i
                        }
                    }
                    if(!hasKey)
                    {
                        bulletLoad.push({
                            key: message.channel.id,
                            value: Math.floor(Math.random() * 6)
                        });
                        for(var i = 0; i < bulletLoad.length; i++)
                        {
                            if(bulletLoad[i].key == message.channel.id)
                            {
                                index = i;
                            }
                        }
                    }
                    message.channel.send("***Reloading Revolver...***").catch(error => console.log("Send Error - " + error));
                    setTimeout(function(){
                        message.channel.send("***Spinning Cylinder...***").catch(error => console.log("Send Error - " + error));
        
                        setTimeout(function(){
                            message.channel.send("***Pulls Trigger...***").catch(error => console.log("Send Error - " + error));
        
                            setTimeout(function(){
                                if(bulletLoad[index].value <= 0)
                                {
                                    message.channel.send("***Revolver Fires...***").catch(error => console.log("Send Error - " + error));
                                    setTimeout(function(){
                                        message.channel.send("<@" + message.author.id + ">** is dead...**").catch(error => console.log("Send Error - " + error));
                                        Jimp.read("tombstone.png").then(function (tombImage) {
                                            Jimp.read(message.author.avatarURL).then(function (userImage) {
                                                tombImage.resize(userImage.bitmap.width / 2, userImage.bitmap.height / 2);
                        
                                                var x = userImage.bitmap.width - tombImage.bitmap.width;
                                                var y = tombImage.bitmap.height;
                                                        
                                                var mergedImage = userImage.composite(tombImage, x, y );
                                                var file = shortid.generate() + ".png"
                                                mergedImage.write(file, function(error){
                                                    if(error) throw error;
                                                    message.channel.send("F", {
                                                        files: [file]
                                                    }).then(function(){
                                                        message.channel.stopTyping();
                                                            fs.unlink(file, resultHandler);
                                                          
                                                    }).catch(function (err) {
                                                        message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                        console.log(err.message);
                                                        message.channel.stopTyping();
                                                            fs.unlink(file, resultHandler);
                                                         
                                                    })
                                                    isPlaying[playindex].value = false;
                                                });
                                            });
                                        }).catch(function (err) {
                                            console.log(err.message);
                                            message.channel.stopTyping();
                                        });
                                    }, messageDelay);
                                }
                                else
                                {
                                    setTimeout(function(){
                                        message.channel.send("*The revolver clicks...*").catch(error => console.log("Send Error - " + error));
                                        setTimeout(function(){
                                            message.channel.send("*You're still alive!*").catch(error => console.log("Send Error - " + error));
                                            message.channel.stopTyping();
                                        }, messageDelay);
                                        var hasKey = false;
                                        for(var i = 0; i < bulletLoad.length; i++)
                                        {
                                            if(bulletLoad[i].key == message.channel.id)
                                            {
                                                hasKey = true;
                                            }
                                        }
                                        if(!hasKey)
                                        {
                                            bulletLoad.push({
                                                key: message.channel.id,
                                                value: Math.floor(Math.random() * 6)
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
                console.log(bulletLoad);

                for(var i = 0; i < allBulletLoads.length; i++)
                {
                    if(allBulletLoads[i].key == message.guild.id)
                    {
                        allBulletLoads[i].counter = bulletLoad;
                        i = allBulletLoads.length;
                    }
                }
                firebase.database().ref("serversettings/" + message.guild.id + "/bulletload").set(JSON.stringify(bulletLoad));
            }
        }
        else
        {
            run(message, args); 
        }
    }
}

module.exports = RrCommand;