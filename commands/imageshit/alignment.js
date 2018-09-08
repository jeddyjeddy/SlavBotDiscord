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

class AlignmentCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "alignment",
            group: "imageshit",
            memberName: "alignment",
            description: "Takes random users and puts their profile pictures in an Alignment Chart. Alternatively, you can use the image parameter to use the last uploaded images (up to 9 images only).",
            examples: ["`!alignment`", "`!alignment image`"]
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
                            if(urls.length < 9)
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
                    message.channel.send("<@" + message.author.id + "> No images found, use `" + commandPrefix + "help alignment` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }

                while(urls.length < 9)
                {
                    urls.push("blankdark.png")
                }

                message.channel.send("***taking images***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("chart.png").then(function (alignmentImage) {
                    console.log("got image");
                    var BG = new Jimp(alignmentImage.bitmap.width, alignmentImage.bitmap.height)
                    Jimp.read(urls[0]).then(function (image1) {
                        image1.cover(287, 183)
                        BG.composite(image1, 24, 10)
                        Jimp.read(urls[1]).then(function (image2) {
                            image2.cover(288, 182)
                            BG.composite(image2, 356, 12)
                            Jimp.read(urls[2]).then(function (image3) {
                                image3.cover(286, 181)
                                BG.composite(image3, 690, 11)
                                Jimp.read(urls[3]).then(function (image4) {
                                    image4.cover(288, 178)
                                    BG.composite(image4, 23, 280)
                                    Jimp.read(urls[4]).then(function (image5) {
                                        image5.cover(287, 181)
                                        BG.composite(image5, 357, 278)
                                        Jimp.read(urls[5]).then(function (image6) {
                                            image6.cover(309, 182)
                                            BG.composite(image6, 688, 278)
                                            Jimp.read(urls[6]).then(function (image7) {
                                                image7.cover(290, 182)
                                                BG.composite(image7, 22, 544)
                                                Jimp.read(urls[7]).then(function (image8) {
                                                    image8.cover(288, 180)
                                                    BG.composite(image8, 356, 544)
                                                    Jimp.read(urls[8]).then(function (image9) {
                                                        image9.cover(288, 180)
                                                        BG.composite(image9, 689, 544)
                                                        
                                                        var mergedImage = BG.composite(alignmentImage, 0, 0);
                                            
                                                        var file = shortid.generate() + ".png"
                                                        mergedImage.write(file, function(error){
                                                            if(error) { console.log(error); return;};
                                                            console.log("got merged image");
                                                            console.log(file);
                                                            message.channel.send("***Alignment Chart***", {
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
            console.log("users alignment");
            var users = message.guild.members.array()
            while(profiles.length < 9)
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

            var promises = []
            
            for(var i = 0; i < profiles.length; i++)
            {
                if(profiles[i] != "blank")
                {
                    profileURLs.push(profiles[i])
                }
                else
                {
                    profileURLs.push("blankdark.png");
                }
            }

            for(var i = 0; i < profileURLs.length; i++)
            {
                if(profileURLs[i] != "blankdark.png")
                {
                    const index = i;
                    promises.push(message.channel.client.fetchUser(profileURLs[index])
                    .then(user => {
                        console.log("Adding")
                        if(user.avatarURL != undefined)
                            profileURLs[index] = user.avatarURL
                        else
                            profileURLs[index] = "blankdark.png"

                    }, rejection => {
                            profileURLs[index] = "blankdark.png"
                            console.log(rejection.message);
                    }));
                }
            }
            Promise.all(promises).then(() => { 
                message.channel.send("***creating chart***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("chart.png").then(function (alignmentImage) {
                    console.log("got image");
                    var BG = new Jimp(alignmentImage.bitmap.width, alignmentImage.bitmap.height)
                    Jimp.read(profileURLs[0]).then(function (image1) {
                        image1.cover(287, 183)
                        BG.composite(image1, 24, 10)
                        Jimp.read(profileURLs[1]).then(function (image2) {
                            image2.cover(288, 182)
                            BG.composite(image2, 356, 12)
                            Jimp.read(profileURLs[2]).then(function (image3) {
                                image3.cover(286, 181)
                                BG.composite(image3, 690, 11)
                                Jimp.read(profileURLs[3]).then(function (image4) {
                                    image4.cover(288, 178)
                                    BG.composite(image4, 23, 280)
                                    Jimp.read(profileURLs[4]).then(function (image5) {
                                        image5.cover(287, 181)
                                        BG.composite(image5, 357, 278)
                                        Jimp.read(profileURLs[5]).then(function (image6) {
                                            image6.cover(309, 182)
                                            BG.composite(image6, 688, 278)
                                            Jimp.read(profileURLs[6]).then(function (image7) {
                                                image7.cover(290, 182)
                                                BG.composite(image7, 22, 544)
                                                Jimp.read(profileURLs[7]).then(function (image8) {
                                                    image8.cover(288, 180)
                                                    BG.composite(image8, 356, 544)
                                                    Jimp.read(profileURLs[8]).then(function (image9) {
                                                        image9.cover(288, 180)
                                                        BG.composite(image9, 689, 544)
                                                        
                                                        var mergedImage = BG.composite(alignmentImage, 0, 0);
                                            
                                                        var file = shortid.generate() + ".png"
                                                        mergedImage.write(file, function(error){
                                                            if(error) { console.log(error); return;};
                                                            console.log("got merged image");
                                                            console.log(file);
                                                            message.channel.send("***Alignment Chart***", {
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

module.exports = AlignmentCommand;
