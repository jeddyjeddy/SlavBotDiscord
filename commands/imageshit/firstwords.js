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

class FirstwordsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "firstwords",
            group: "imageshit",
            memberName: "firstwords",
            description: "***The baby's first words...*** This command also has an optional image parameter.",
            examples: ["`!firstwords <text>`", "`!firstwords <text>|<imageoption>`", "`!firstwords <text>|image`", "`!firstwords <text>|avatar`", "`!firstwords <text>|@User`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        var editText = "";
        var editTextExtra = "";
        var editTextExtra2 = "";
        var editTextExtra3 = ""
        var editTextExtra4 = ""
        var editTextExtra5 = ""
        var editTextExtra6 = ""

        var text = args;

        if(args.length > 0)
        {
            if(args.indexOf("|") > -1)
            text = args.slice(0, args.indexOf("|"))
        }
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if(args.length > 0 && text.length < 100)
        {
            var firstWords = "";
            if(args.length > 1)
            {
                firstWords = args[0] + "..." + args[0] + args[1] + "..." + args[0] + args[1]
            }
            else
            {
                firstWords = args[0] + "..." + args[0] + "..." + args[0]
            }


            var nextLine = false;
            var nextLine2 = false;
            var nextLine3 = false;
            var nextLine4 = false;
            var nextLine5 = false;
            var nextLine6 = false;
            var lineCount = 0;

            for(var i = 0; i < text.length; i++)
            {
                if(i > 85 && text.length >= 86)
                {
                    lineCount = 7;
                    if(nextLine6)
                    {
                        editTextExtra6 = editTextExtra6 + text[i].toString();
                    }
                    else
                    {
                        editTextExtra5 = editTextExtra5 + text[i].toString();
                        if(text[i].toString() == " ")
                        {
                            nextLine6 = true;
                        }
                    }
                }
                else if(i > 75 && text.length >= 76)
                {
                    lineCount = 6;
                    if(nextLine5)
                    {
                        editTextExtra5 = editTextExtra5 + text[i].toString();
                    }
                    else
                    {
                        editTextExtra4 = editTextExtra4 + text[i].toString();
                        if(text[i].toString() == " ")
                        {
                            nextLine5 = true;
                        }
                    }
                }
                else if(i > 60 && text.length >= 61)
                {
                    lineCount = 5;
                    if(nextLine4)
                    {
                        editTextExtra4 = editTextExtra4 + text[i].toString();
                    }
                    else
                    {
                        editTextExtra3 = editTextExtra3 + text[i].toString();
                        if(text[i].toString() == " ")
                        {
                            nextLine4 = true;
                        }
                    }
                }
                else if(i > 45 && text.length >= 46)
                {
                    lineCount = 4;
                    if(nextLine3)
                    {
                        editTextExtra3 = editTextExtra3 + text[i].toString();
                    }
                    else
                    {
                        editTextExtra2 = editTextExtra2 + text[i].toString();
                        if(text[i].toString() == " ")
                        {
                            nextLine3 = true;
                        }
                    }
                }
                else if(i > 30 && text.length >= 31)
                {
                    lineCount = 3;
                    if(nextLine2)
                    {
                        editTextExtra2 = editTextExtra2 + text[i].toString();
                    }
                    else
                    {
                        editTextExtra = editTextExtra + text[i].toString();
                        if(text[i].toString() == " ")
                        {
                            nextLine2 = true;
                        }
                    }
                }
                else if(i > 15 && text.length >= 16)
                {
                    lineCount = 2;
                    if(nextLine)
                    {
                        editTextExtra = editTextExtra + text[i].toString();
                    }
                    else
                    {
                        editText = editText + text[i].toString();
                        if(text[i].toString() == " ")
                        {
                            nextLine = true;
                        }
                    }
                }
                else
                {
                    editText = editText + text[i].toString();
                    lineCount = 1;
                }
            }

            if(lineCount > 0)
            {
                if(lineCount == 1)
                {
                    editTextExtra3 = editText;
                    editText = "";
                }
                else if(lineCount == 2)
                {
                    editTextExtra3 = editText;
                    editText = "";
                    editTextExtra4 = editTextExtra;
                    editTextExtra = "";
                }
                else if(lineCount == 3)
                {
                    editTextExtra4 = editTextExtra2;
                    editTextExtra3 = editTextExtra;
                    editTextExtra2 = editText;
                    editText = "";
                    editTextExtra = "";
                }
                else if(lineCount == 4)
                {
                    editTextExtra5 = editTextExtra3;
                    editTextExtra4 = editTextExtra2;
                    editTextExtra3 = editTextExtra;
                    editTextExtra2 = editText;
                    editText = "";
                    editTextExtra = "";
                }
                else if(lineCount == 5)
                {
                    editTextExtra5 = editTextExtra4;
                    editTextExtra4 = editTextExtra3;
                    editTextExtra3 = editTextExtra2;
                    editTextExtra2 = editTextExtra;
                    editTextExtra = editText;
                    editText = "";
                }
                else if(lineCount == 6)
                {
                    editTextExtra6 = editTextExtra5;
                    editTextExtra5 = editTextExtra4;
                    editTextExtra4 = editTextExtra3;
                    editTextExtra3 = editTextExtra2;
                    editTextExtra2 = editTextExtra;
                    editTextExtra = editText;
                    editText = "";
                }
            }

            if(args.indexOf("|") > -1)
            {
                var param = args.toLowerCase().slice(args.indexOf("|"), args.length)
                if(param.indexOf("image") > -1)
                {
                    message.channel.fetchMessages({ around: message.id })
                    .then(messages => {
                        var messageID = "";
                        messages.filter(msg => {
                            if(msg.attachments.last() != undefined)
                            {
                                var attachments = msg.attachments.array();
                                for(var i = attachments.length - 1; i > -1; i--)
                                {
                                    if(attachments[i].height > 0)
                                    {
                                        if(messageID == "")
                                        {
                                            messageID = msg.id;
                                            url = attachments[i].url;
                                        }
                                    }
                                }
                            }
                        });
                    
                        if(messageID == "")
                        {
                            message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help firstwords` for help.").catch(error => {console.log("Send Error - " + error); });
                            
                            return;
                        }
                        message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                        var file = shortid.generate() + ".png";

                        Jimp.read(url).then(function (userImage) {
                            Jimp.read("firstwords.jpg").then(function (firstwordsImage) {
                            Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                                userImage.scaleToFit(160, 160);
                                var userImageSmaller = new Jimp(userImage);
                                userImageSmaller.scaleToFit(70, 70);
                                userImageSmaller.rotate(-10);

                                var y = 70;
                                y = y + ((160 - userImage.bitmap.height) / 2);

                                var x = 60;
                                x = x + ((160 - userImage.bitmap.width) / 2)

                                var x2 = 20;
                                x2 = x2 + ((160 - userImage.bitmap.width) / 2)

                                var x3 = 460;
                                x3 = x3 + ((70 - userImageSmaller.bitmap.width) / 2)

                                firstwordsImage.composite(userImage, x, y).composite(userImage, x2, 550).composite(userImageSmaller, x3, 270).print(font, 100, 20, firstWords).print(font, 100, 410, editText).print(font, 100, 440, editTextExtra).print(font, 100, 470, editTextExtra2)
                                .print(font, 100, 500, editTextExtra3).print(font, 190, 530, editTextExtra4).print(font, 220, 560, editTextExtra5)
                                .print(font, 260, 600, editTextExtra6).write(file, function(error){  
                                    if(error) { console.log(error); return;};
                                message.channel.send("***The baby's first words...***", {
                                            files: [file]
                                }).then(function(){
                                    
                                    fs.remove(file, resultHandler);
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message);
                                    
                                    fs.remove(file, resultHandler);
                                });
                                    });
                            });
                         }).catch(function (err) {
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
                    if(param.indexOf("avatar") > -1)
                    {
                        var url = message.author.avatarURL;
                        var file = shortid.generate() + ".png";

                        Jimp.read(url).then(function (userImage) {
                            Jimp.read("firstwords.jpg").then(function (firstwordsImage) {
                            Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                                userImage.resize(160, 160);
                                var userImageSmaller = new Jimp(userImage);
                                userImageSmaller.resize(70, 70);
                                userImageSmaller.rotate(-10);
                                firstwordsImage.composite(userImage, 60, 70).composite(userImage, 20, 550).composite(userImageSmaller, 460, 270).print(font, 100, 20, firstWords).print(font, 100, 410, editText).print(font, 100, 440, editTextExtra).print(font, 100, 470, editTextExtra2)
                                .print(font, 100, 500, editTextExtra3).print(font, 190, 530, editTextExtra4).print(font, 220, 560, editTextExtra5)
                                .print(font, 260, 600, editTextExtra6).write(file, function(error){  
                                    if(error) { console.log(error); return;};
                                message.channel.send("***The baby's first words...***", {
                                            files: [file]
                                }).then(function(){
                                    
                                    fs.remove(file, resultHandler);
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message);
                                    
                                    fs.remove(file, resultHandler);
                                });
                                    });
                            });
                        }).catch(function (err) {
                            console.log(err.message);
                            });
                        }).catch(function (err) {
                            console.log(err.message);
                            });
                    }
                    else
                    {
                        var otherUser = false;
                        var userID = "";
                        var getUser = false;
                        for(var i = args.indexOf("|"); i < args.length; i++)
                        {
                            if(getUser)
                            {
                                if(args[i].toString() == ">")
                                {
                                    i = args.length;
                                    otherUser = true;
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
                        if(otherUser)
                        {
                            console.log("other firstwords");
                            console.log(userID);
                
                            message.channel.client.fetchUser(userID)
                            .then(user => {
                                    if(user.avatarURL != undefined && user.avatarURL != null)
                                        url = user.avatarURL;
                                    else
                                    {
                                        message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                                        return;
                                    }
                                    var file = shortid.generate() + ".png";

                                    Jimp.read(url).then(function (userImage) {
                                        Jimp.read("firstwords.jpg").then(function (firstwordsImage) {
                                        Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                                            userImage.resize(160, 160);
                                            var userImageSmaller = new Jimp(userImage);
                                            userImageSmaller.resize(70, 70);
                                            userImageSmaller.rotate(-10);
                                            firstwordsImage.composite(userImage, 60, 70).composite(userImage, 20, 550).composite(userImageSmaller, 460, 270).print(font, 100, 20, firstWords).print(font, 100, 410, editText).print(font, 100, 440, editTextExtra).print(font, 100, 470, editTextExtra2)
                                            .print(font, 100, 500, editTextExtra3).print(font, 190, 530, editTextExtra4).print(font, 220, 560, editTextExtra5)
                                            .print(font, 260, 600, editTextExtra6).write(file, function(error){  
                                                if(error) { console.log(error); return;};
                                            message.channel.send("***The baby's first words...***", {
                                                        files: [file]
                                            }).then(function(){
                                                
                                                fs.remove(file, resultHandler);
                                            }).catch(function (err) {
                                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                                console.log(err.message);
                                                
                                                fs.remove(file, resultHandler);
                                            });
                                                });
                                        });
                                    }).catch(function (err) {
                                        console.log(err.message);
                                        });
                                    }).catch(function (err) {
                                        console.log(err.message);
                                        });
                            }, rejection => {
                                    console.log(rejection.message);
                                    
                                    message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                                     
                            });
                        }
                        else
                        {
                            message.channel.send("<@" + message.author.id + "> No image option mentioned after seperator. Use `" + commandPrefix + "help firstwords` for help.").catch(error => {console.log("Send Error - " + error); });
                            
                            return;
                        }
                    }
                }
            }
            else
            {
                var file = shortid.generate() + ".png";
            
                Jimp.read("firstwords.jpg").then(function (firstwordsImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                        firstwordsImage.print(font, 100, 20, firstWords).print(font, 100, 410, editText).print(font, 100, 440, editTextExtra).print(font, 100, 470, editTextExtra2)
                        .print(font, 100, 500, editTextExtra3).print(font, 190, 530, editTextExtra4).print(font, 220, 560, editTextExtra5)
                        .print(font, 260, 600, editTextExtra6).write(file, function(error){  
                            if(error) { console.log(error); return;};
                        message.channel.send("***The baby's first words...***", {
                                    files: [file]
                        }).then(function(){
                            
                            fs.remove(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.remove(file, resultHandler);
                        });
                            });
                    });
                 }).catch(function (err) {
                    console.log(err.message);
                    
                });
            }
        }
        else
        {
            if(args.length > 0)
                message.channel.send("<@" + message.author.id + "> A maximum of 100 characters are only allowed.").catch(error => {console.log("Send Error - " + error); });
            else
                message.channel.send("<@" + message.author.id + "> Please give text for the command.").catch(error => {console.log("Send Error - " + error); });

            
        }
    }
}

module.exports = FirstwordsCommand;