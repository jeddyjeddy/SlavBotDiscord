const command = require("discord.js-commando");
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs-extra');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}
var CommandCounter = require("../../index.js")

class ClassCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "class",
            group: "imageshit",
            memberName: "class",
            description: "***Choose your class.*** Takes random users and puts their profile pictures in the image. Alternatively, you can use the image parameter to use the last uploaded images (up to 6 images only).",
            examples: ["`!class`", "`!class image`", "`!class @User1 @User2 @User3` (6 users Max)"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if(args.toString().toLowerCase() == "image")
        {
            message.channel.fetchMessages({ around: message.id })
            .then(messages => {
                var urls = [];
                var arrayMessages = messages.array();
                for(var i = 0; i < arrayMessages.length; i++)
                {
                    if(arrayMessages[i].attachments.first() != undefined)
                    {
                        for(var i2 = arrayMessages[i].attachments.array().length - 1; i2 > -1; i2--)
                        {
                            if(urls.length < 6)
                            {
                                if(arrayMessages[i].attachments.array()[i2].height > 0)
                                {
                                    urls.splice(0, 0, arrayMessages[i].attachments.array()[i2].url)
                                }
                            }
                        }
                    }
                }

                if(urls.length == 0)
                {
                    message.channel.send("<@" + message.author.id + "> No images found, use `" + commandPrefix + "help class` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }

                while(urls.length < 6)
                {
                    urls.push("blank.png")
                }

                message.channel.send("***taking images***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("class.png").then(function (classImage) {
                    console.log("got image");
                    var BG = new Jimp(classImage.bitmap.width, classImage.bitmap.height)
                    Jimp.read(urls[0]).then(function (image1) {
                        image1.cover(196, 196)
                        BG.composite(image1, 19, 89)
                        Jimp.read(urls[1]).then(function (image2) {
                            image2.cover(201, 201)
                            BG.composite(image2, 249, 86)
                            Jimp.read(urls[2]).then(function (image3) {
                                image3.cover(197, 197)
                                BG.composite(image3, 471, 87)
                                Jimp.read(urls[3]).then(function (image4) {
                                    image4.cover(199, 199)
                                    BG.composite(image4, 15, 301)
                                    Jimp.read(urls[4]).then(function (image5) {
                                        image5.cover(204, 204)
                                        BG.composite(image5, 241, 299)
                                        Jimp.read(urls[5]).then(function (image6) {
                                            image6.cover(200, 200)
                                            BG.composite(image6, 467, 301)
                                            
                                            var mergedImage = BG.composite(classImage, 0, 0);
                                
                                            const file = "TempStorage/" + shortid.generate() + ".png"
                                            mergedImage.write(file, function(error){
                                                if(error) { console.log(error); return;};
                                                console.log("got merged image");
                                                console.log(file);
                                                message.channel.send("***Choose your class:***", {
                                                    files: [file]
                                                }).then(function(){
                                                    
                    
                                                    fs.remove(file, resultHandler);
                                                }).catch(function (err) {
                                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                                    console.log(err.message);
                                                    
                                                    fs.remove(file, resultHandler);
                                                });
                                                console.log("Message Sent");
                                            });
                                        }).catch(function (err) {
                                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                            console.log(err.message);
                                            
                                        });
                                    }).catch(function (err) {
                                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                        console.log(err.message);
                                        
                                    });
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message);
                                    
                                });
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                console.log(err.message);
                                
                            });
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                        });
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                        
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    
                });
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                console.log(err.message);
                
            });
        }
        else
        {
            if(message.guild == null)
            {
                return;
            }
            var profileURLs = [];
            var profiles = [];
            console.log("users class");

            if(args.length > 0)
            {
                var getUser = false;
                var userID = "";
                for(var i = 0; i < args.length; i++)
                {
                    if(profiles.length < 6)
                    {
                        if(getUser)
                        {
                            if(args[i].toString() == ">")
                            {
                                profiles.push(userID);
                                userID = "";
                                getUser = false;
                            }
                            else
                            {
                                if(args[i].toString() != "@" && !isNaN(args[i].toString()))
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

                if(profiles.length > 0)
                {
                    while(profiles.length < 6)
                    {
                        profiles.push("blank")
                    }
                }
            }

            if(profiles.length == 0)
            {
                var users = message.guild.members.array()
                while(profiles.length < 6)
                {
                    if(profiles.length >= users.length)
                    {
                        profiles.push("blank")
                    }
                    else
                    {
                        var user = users[Math.floor(Math.random() * users.length)].id
                        var alreadyAdded = false;
                        for(var i = 0; i < profiles.length; i++)
                        {
                            if(profiles[i] == user)
                            {
                                alreadyAdded = true;
                            }
                        }
    
                        if(!alreadyAdded)
                        {
                            profiles.push(user)
                        }
                    }
                }   
            }

            var promises = []
            
            for(var i = 0; i < profiles.length; i++)
            {
                if(profiles[i] != "blank")
                {
                    profileURLs.push(profiles[i])
                }
                else
                {
                    profileURLs.push("blank.png");
                }
            }

            for(var i = 0; i < profileURLs.length; i++)
            {
                if(profileURLs[i] != "blank.png")
                {
                    const index = i;
                    promises.push(message.channel.client.fetchUser(profileURLs[index])
                    .then(user => {
                        console.log("Adding")
                        if(user.avatarURL != undefined)
                            profileURLs[index] = user.avatarURL
                        else
                            profileURLs[index] = "blank.png"

                    }, rejection => {
                            profileURLs[index] = "blank.png"
                            console.log(rejection.message);
                    }));
                }
            }

            Promise.all(promises).then(() => { 
                message.channel.send("***creating classes***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("class.png").then(function (classImage) {
                    console.log("got image");
                    var BG = new Jimp(classImage.bitmap.width, classImage.bitmap.height)
                    Jimp.read(profileURLs[0]).then(function (image1) {
                        image1.resize(196, 196)
                        BG.composite(image1, 19, 89)
                        Jimp.read(profileURLs[1]).then(function (image2) {
                            image2.resize(201, 201)
                            BG.composite(image2, 249, 86)
                            Jimp.read(profileURLs[2]).then(function (image3) {
                                image3.resize(197, 197)
                                BG.composite(image3, 471, 87)
                                Jimp.read(profileURLs[3]).then(function (image4) {
                                    image4.resize(199, 199)
                                    BG.composite(image4, 15, 301)
                                    Jimp.read(profileURLs[4]).then(function (image5) {
                                        image5.resize(204, 204)
                                        BG.composite(image5, 241, 299)
                                        Jimp.read(profileURLs[5]).then(function (image6) {
                                            image6.resize(200, 200)
                                            BG.composite(image6, 467, 301)
                                            
                                            var mergedImage = BG.composite(classImage, 0, 0);
                                
                                            const file = "TempStorage/" + shortid.generate() + ".png"
                                            mergedImage.write(file, function(error){
                                                if(error) { console.log(error); return;};
                                                console.log("got merged image");
                                                console.log(file);
                                                message.channel.send("***Choose your class:***", {
                                                    files: [file]
                                                }).then(function(){
                                                    
                    
                                                    fs.remove(file, resultHandler);
                                                }).catch(function (err) {
                                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                                    console.log(err.message);
                                                    
                                                    fs.remove(file, resultHandler);
                                                });
                                                console.log("Message Sent");
                                            });
                                        }).catch(function (err) {
                                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                            console.log(err.message);
                                            
                                        });
                                    }).catch(function (err) {
                                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                        console.log(err.message);
                                        
                                    });
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message);
                                    
                                });
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                console.log(err.message);
                                
                            });
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                        });
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                        
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    
                });
            }).catch((e) => {
                console.log("User Data Error - " + e.message);
                message.channel.send("User data not found").catch(error => console.log("Send Error - " + error));
            });
        }
    }
}

module.exports = ClassCommand;
