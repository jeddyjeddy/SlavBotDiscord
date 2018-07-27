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
        message.channel.startTyping();
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
                            message.reply("no image found, use `" + commandPrefix + "help firstwords` for help.").catch(error => console.log("Send Error - " + error));
                            message.channel.stopTyping();
                            return;
                        }
                        message.reply("***taking image***").catch(error => console.log("Send Error - " + error));
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
                                    if(error) throw error;
                                message.channel.send("***The baby's first words...***", {
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
                                    });
                            });
                         }).catch(function (err) {
                            console.log(err.message);
                            message.channel.stopTyping();});
                        }).catch(function (err) {
                            console.log(err.message);
                            message.channel.stopTyping();});
                    }).catch(function (err) {
                        message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                        console.log(err.message);
                        message.channel.stopTyping();
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
                                    if(error) throw error;
                                message.channel.send("***The baby's first words...***", {
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
                                    url = user.avatarURL;
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
                                                if(error) throw error;
                                            message.channel.send("***The baby's first words...***", {
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
                            message.reply("no image option mentioned after seperator. Use `" + commandPrefix + "help firstwords` for help.").catch(error => console.log("Send Error - " + error));
                            message.channel.stopTyping();
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
                            if(error) throw error;
                        message.channel.send("***The baby's first words...***", {
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
                message.reply("a maximum of 100 characters are only allowed.").catch(error => console.log("Send Error - " + error));
            else
                message.reply("please give text for the command.").catch(error => console.log("Send Error - " + error));

            message.channel.stopTyping();
        }
    }
}

module.exports = FirstwordsCommand;