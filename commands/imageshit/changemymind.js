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

class ChangemymindCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "changemymind",
            group: "imageshit",
            memberName: "changemymind",
            description: "***Change My Mind.*** This command also has an optional image parameter.",
            examples: ["`!changemymind <text>`", "`!changemymind <text>|<imageoption>`", "`!changemymind <text>|image`", "`!changemymind <text>|avatar`", "`!changemymind <text>|@User`"]
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
        var option = "";

        if(args.indexOf("|") > -1 && args.slice(args.indexOf("|")).length > 1)
        {
            text = args.slice(0, args.indexOf("|"))
            var slicedArgs = args.slice(args.indexOf("|") + 1);
            option = slicedArgs.toString();

        }
        else
        {
            text = args;
        }

        if(args.length > 0 && text.length <= 67)
        {
            var selectedFont = "Arial_24.fnt";

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
                            message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help changemymind` for help.").catch(error => console.log("Send Error - " + error));
                            message.channel.stopTyping();
                            return;
                        }
                        message.channel.send("***taking image***").catch(error => console.log("Send Error - " + error));
                        var file = shortid.generate() + ".png";

                        Jimp.read(url).then(function (userImage) {
                            Jimp.read("changemymind.png").then(function (freeImage) {
                            Jimp.loadFont(selectedFont).then(function (font) {

                                var textWidth = 200;
                                var textHeight = 100;
                                var textRot = -22;
                                var textX = 300;
                                var textY = 230;

                                var textImage = new Jimp(textWidth, textHeight);
                                textImage.print(font, 0, 0, text, textWidth)
                                textImage.rotate(textRot)

                                var y = 108;
                                var x = 195;
                                var size = 60;

                                userImage.resize(Jimp.AUTO, size)
                                x = x + ((size - userImage.bitmap.width) / 2)

                                userImage.rotate(-24);

                                freeImage.composite(userImage, x, y).composite(textImage, textX, textY).write(file, function(error){  
                                    if(error) {message.channel.stopTyping(); console.log(error); return;};
                                message.channel.send("***Change My Mind***", {
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
                            Jimp.read("changemymind.png").then(function (freeImage) {
                            Jimp.loadFont(selectedFont).then(function (font) {
                                var textWidth = 200;
                                var textHeight = 100;
                                var textRot = -22;
                                var textX = 300;
                                var textY = 230;

                                var textImage = new Jimp(textWidth, textHeight);
                                textImage.print(font, 0, 0, text, textWidth)
                                textImage.rotate(textRot)

                                var y = 108;
                                var x = 195;
                                var size = 60;

                                userImage.resize(size, size);
                                userImage.rotate(-24);

                                freeImage.composite(userImage, x, y).composite(textImage, textX, textY).write(file, function(error){  
                                    if(error) {message.channel.stopTyping(); console.log(error); return;};
                                message.channel.send("***Change My Mind***", {
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
                            console.log("other changemymind");
                            console.log(userID);
                
                            message.channel.client.fetchUser(userID)
                            .then(user => {
                                    url = user.avatarURL;
                                    var file = shortid.generate() + ".png";

                                    Jimp.read(url).then(function (userImage) {
                                        Jimp.read("changemymind.png").then(function (freeImage) {
                                        Jimp.loadFont(selectedFont).then(function (font) {

                                            var textWidth = 200;
                                            var textHeight = 100;
                                            var textRot = -22;
                                            var textX = 300;
                                            var textY = 230;

                                            var textImage = new Jimp(textWidth, textHeight);
                                            textImage.print(font, 0, 0, text, textWidth)
                                            textImage.rotate(textRot)

                                            var y = 108;
                                            var x = 195;
                                            var size = 60;

                                            userImage.resize(size, size);
                                            userImage.rotate(-24);

                                            freeImage.composite(userImage, x, y).composite(textImage, textX, textY).write(file, function(error){  
                                                if(error) {message.channel.stopTyping(); console.log(error); return;};
                                            message.channel.send("***Change My Mind***", {
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
                            message.channel.send("<@" + message.author.id + "> No image option mentioned after seperator. Use `" + commandPrefix + "help changemymind` for help.").catch(error => console.log("Send Error - " + error));
                            message.channel.stopTyping();
                            return;
                        }
                    }
                }
            }
            else
            {
                var file = shortid.generate() + ".png";
            
                Jimp.read("changemymind.png").then(function (freeImage) {
                    Jimp.loadFont(selectedFont).then(function (font) {
                        var textWidth = 200;
                        var textHeight = 100;
                        var textRot = -22;
                        var textX = 300;
                        var textY = 230;

                        var textImage = new Jimp(textWidth, textHeight);
                        textImage.print(font, 0, 0, text, textWidth);
                        textImage.rotate(textRot);

                        freeImage.composite(textImage, textX, textY).write(file, function(error){  
                            if(error) {message.channel.stopTyping(); console.log(error); return;};
                        message.channel.send("***Change My Mind***", {
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
                message.channel.send("<@" + message.author.id + "> Character limit for the text parameter is 67 characters, use `" + commandPrefix + "help changemymind` for help.").catch(error => console.log("Send Error - " + error));
            else
                message.channel.send("<@" + message.author.id + "> Incorrect parameters, text not given, use `" + commandPrefix + "help changemymind` for help.").catch(error => console.log("Send Error - " + error));
        
             message.channel.stopTyping();
        }
    }
}

module.exports = ChangemymindCommand;