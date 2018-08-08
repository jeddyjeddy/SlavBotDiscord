const command = require("discord.js-commando");
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
var CommandCounter = require("../../index.js")

class FreerealestateCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "freerealestate",
            group: "imageshit",
            memberName: "freerealestate",
            description: "***It's free real estate...*** This command also has an optional image parameter.",
            examples: ["`!freerealestate <top-text>|<text-above-image>`", "`!freerealestate <top-text>|<text-above-image>|<imageoption>`", "`!freerealestate <top-text>|<text-above-image>|image`", "`!freerealestate <top-text>|<text-above-image>|avatar`", "`!freerealestate <top-text>|<text-above-image>|@User`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter(message.author.id)

        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        var text = "";
        var textAboveImage = "";
        var option = "";

        if(args.indexOf("|") > -1 && args.slice(args.indexOf("|")).length > 1)
        {
            text = args.slice(0, args.indexOf("|"))
            var slicedArgs = args.slice(args.indexOf("|") + 1);
            if(slicedArgs.indexOf("|") > -1)
            {
                textAboveImage = slicedArgs.slice(0, slicedArgs.indexOf("|"));
                if(slicedArgs.slice(slicedArgs.indexOf("|")).length > 1)
                {
                    option = slicedArgs.toLowerCase().slice(slicedArgs.indexOf("|") + 1);
                }
            }
            else
            {
                textAboveImage = slicedArgs;
            }
        }
        else
        {
            text = args;
        }

        if(args.length > 0 && text.length <= 185)
        {
            if(option != "")
            {
                if(option.indexOf("image") > -1)
                {
                    message.channel.fetchMessages({ around: message.id })
                    .then(messages => {
                        var messageID = "";
                        messages.filter(msg => {
                            if(msg.attachments.first() != undefined)
                            {
                                if(msg.attachments.last().height > 0)
                                {
                                    if(messageID == "")
                                    {
                                        messageID = msg.id;
                                        url = msg.attachments.first().url;
                                    }
                                }
                            }
                        });
                    
                        if(messageID == "")
                        {
                            message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help freerealestate` for help.").catch(error => console.log("Send Error - " + error));
                            message.channel.stopTyping();
                            return;
                        }
                        message.channel.send("***taking image***").catch(error => console.log("Send Error - " + error));
                        var file = shortid.generate() + ".png";

                        Jimp.read(url).then(function (userImage) {
                            Jimp.read("free.jpg").then(function (freeImage) {
                            Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {

                                var y = 250;
                                var x = 190;

                                userImage.resize(Jimp.AUTO, 320)
                                x = x + ((320 - userImage.bitmap.width) / 2)
                                

                                var XYText = 10;
                                var YText2 = 155

                                freeImage.composite(userImage, x, y).print(font, XYText, XYText, text, freeImage.bitmap.width - XYText).print(font, XYText, YText2, textAboveImage).write(file, function(error){  
                                    if(error) {message.channel.stopTyping(); console.log(error); return;};
                                message.channel.send("***It's Free Real Estate***", {
                                            files: [file]
                                }).then(function(){
                                    message.channel.stopTyping();
                                    fs.unlink(file, resultHandler);
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                    console.log(err.message);
                                    message.channel.stopTyping();
                                    fs.unlink(file, resultHandler);
                                });
                                    });
                            });
                         }).catch(function (err) {
                            console.log(err.message);
                            message.channel.stopTyping();});
                        }).catch(function (err) {
                            console.log(err.message);
                            message.channel.stopTyping();});
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                        console.log(err.message);
                        message.channel.stopTyping();
                    });
                }
                else
                {                    
                    if(option.indexOf("avatar") > -1)
                    {
                        var url = message.author.avatarURL;
                        var file = shortid.generate() + ".png";

                        Jimp.read(url).then(function (userImage) {
                            Jimp.read("free.jpg").then(function (freeImage) {
                            Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                                userImage.resize(320, 320);

                                var y = 250;
                                var x = 190;

                                var XYText = 10;
                                var YText2 = 155

                                freeImage.composite(userImage, x, y).print(font, XYText, XYText, text, freeImage.bitmap.width - XYText).print(font, XYText, YText2, textAboveImage).write(file, function(error){  
                                    if(error) {message.channel.stopTyping(); console.log(error); return;};
                                message.channel.send("***It's Free Real Estate***", {
                                            files: [file]
                                }).then(function(){
                                    message.channel.stopTyping();
                                    fs.unlink(file, resultHandler);
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                    console.log(err.message);
                                    message.channel.stopTyping();
                                    fs.unlink(file, resultHandler);
                                });
                                    });
                            });
                        }).catch(function (err) {
                            console.log(err.message);
                            message.channel.stopTyping();});
                        }).catch(function (err) {
                            console.log(err.message);
                            message.channel.stopTyping();});
                    }
                    else
                    {
                        var otherUser = false;
                        var userID = "";
                        var getUser = false;
                        for(var i = 0; i < option.length; i++)
                        {
                            if(getUser)
                            {
                                if(option[i].toString() == ">")
                                {
                                    i = option.length;
                                    otherUser = true;
                                }
                                else
                                {
                                    if(option[i].toString() != "@" && !isNaN(option[i].toString()))
                                    {
                                        userID = userID + option[i].toString();
                                    }
                                }
                            }
                            else
                            {
                                if(option[i].toString() == "<")
                                {
                                    getUser = true;
                                } 
                            }
                        }
                        if(otherUser)
                        {
                            console.log("other real estate");
                            console.log(userID);
                
                            message.channel.client.fetchUser(userID)
                            .then(user => {
                                    url = user.avatarURL;
                                    var file = shortid.generate() + ".png";

                                    Jimp.read(url).then(function (userImage) {
                                        Jimp.read("free.jpg").then(function (freeImage) {
                                        Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                                            userImage.resize(320, 320);

                                            var y = 250;
                                            var x = 190;
            
                                            var XYText = 10;
                                            var YText2 = 155
            
                                            freeImage.composite(userImage, x, y).print(font, XYText, XYText, text, freeImage.bitmap.width - XYText).print(font, XYText, YText2, textAboveImage).write(file, function(error){  
                                                if(error) {message.channel.stopTyping(); console.log(error); return;};
                                            message.channel.send("***It's Free Real Estate***", {
                                                        files: [file]
                                            }).then(function(){
                                                message.channel.stopTyping();
                                                fs.unlink(file, resultHandler);
                                            }).catch(function (err) {
                                                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                console.log(err.message);
                                                message.channel.stopTyping();
                                                fs.unlink(file, resultHandler);
                                            });
                                                });
                                        });
                                    }).catch(function (err) {
                                        console.log(err.message);
                                        message.channel.stopTyping();});
                                    }).catch(function (err) {
                                        console.log(err.message);
                                        message.channel.stopTyping();});
                            }, rejection => {
                                    console.log(rejection.message);
                            });
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> No image option mentioned after seperator. Use `" + commandPrefix + "help freerealestate` for help.").catch(error => console.log("Send Error - " + error));
                            message.channel.stopTyping();
                            return;
                        }
                    }
                }
            }
            else
            {
                var file = shortid.generate() + ".png";
            
                Jimp.read("free.jpg").then(function (freeImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                        var XYText = 10;
                        var YText2 = 155

                        freeImage.print(font, XYText, XYText, text, freeImage.bitmap.width - XYText).print(font, XYText, YText2, textAboveImage).write(file, function(error){  
                            if(error) {message.channel.stopTyping(); console.log(error); return;};
                        message.channel.send("***It's Free Real Estate***", {
                                    files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        });
                            });
                    });
                 }).catch(function (err) {
                    console.log(err.message);
                    message.channel.stopTyping();
                });
            }
        }
        else
        {
            if(args.length > 0)
             message.channel.send("<@" + message.author.id + "> Character limit for top text is 185 characters, use `" + commandPrefix + "help freerealestate` for help.").catch(error => console.log("Send Error - " + error));
            else
             message.channel.send("<@" + message.author.id + "> Incorrect parameters, top text not given, use `" + commandPrefix + "help freerealestate` for help.").catch(error => console.log("Send Error - " + error));
            message.channel.stopTyping();
        }
    }
}

module.exports = FreerealestateCommand;