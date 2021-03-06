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
                            message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help changemymind` for help.").catch(error => {console.log("Send Error - " + error); });
                            
                            return;
                        }
                        message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                        const file = "TempStorage/" + shortid.generate() + ".png";

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
                                    if(error) { console.log(error); return;};
                                message.channel.send("***Change My Mind***", {
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
                    if(option.indexOf("avatar") > -1)
                    {
                        var url = message.author.avatarURL;
                        const file = "TempStorage/" + shortid.generate() + ".png";

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
                                    if(error) { console.log(error); return;};
                                message.channel.send("***Change My Mind***", {
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
                                if(user.avatarURL != undefined && user.avatarURL != null)
                                    url = user.avatarURL;
                                else
                                {
                                    message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                                    return;
                                }
                                    
                                    const file = "TempStorage/" + shortid.generate() + ".png";

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
                                                if(error) { console.log(error); return;};
                                            message.channel.send("***Change My Mind***", {
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
                            message.channel.send("<@" + message.author.id + "> No image option mentioned after seperator. Use `" + commandPrefix + "help changemymind` for help.").catch(error => {console.log("Send Error - " + error); });
                            
                            return;
                        }
                    }
                }
            }
            else
            {
                const file = "TempStorage/" + shortid.generate() + ".png";
            
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
                            if(error) { console.log(error); return;};
                        message.channel.send("***Change My Mind***", {
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
                message.channel.send("<@" + message.author.id + "> Character limit for the text parameter is 67 characters, use `" + commandPrefix + "help changemymind` for help.").catch(error => {console.log("Send Error - " + error); });
            else
                message.channel.send("<@" + message.author.id + "> Incorrect parameters, text not given, use `" + commandPrefix + "help changemymind` for help.").catch(error => {console.log("Send Error - " + error); });
        
             
        }
    }
}

module.exports = ChangemymindCommand;