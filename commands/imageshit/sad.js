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

class SadCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "sad",
            group: "imageshit",
            memberName: "sad",
            description: "This is so sad... Can we ***Insert Text***",
            examples: ["`!sad stop this please?`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter()
        var editText = "";
        var editTextExtra = "";
        var editTextExtra2 = "";

        if(args.length > 0 && args.length < 87)
        {
            var nextLine = false;
            var nextLine2 = false;

            for(var i = 0; i < args.length; i++)
            {
                if(i > 50 && args.length >= 51)
                {
                    if(nextLine2)
                    {
                        editTextExtra2 = editTextExtra2 + args[i].toString();
                    }
                    else
                    {
                        editTextExtra = editTextExtra + args[i].toString();
                        if(args[i].toString() == " ")
                        {
                            nextLine2 = true;
                        }
                    }
                }
                else if(i > 20 && args.length >= 21)
                {
                    if(nextLine)
                    {
                        editTextExtra = editTextExtra + args[i].toString();
                    }
                    else
                    {
                        editText = editText + args[i].toString();
                        if(args[i].toString() == " ")
                        {
                            nextLine = true;
                        }
                    }
                }
                else
                    editText = editText + args[i].toString();
            }
            var file = shortid.generate() + ".png";
            console.log("1: " + editText + "\n2:" + editTextExtra + "\n3:" + editTextExtra2);
            if(args.length > 50)
            {
                console.log("LARGE");
                Jimp.read("sad.png").then(function (sadImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                         sadImage.print(font, 190, 55, editText).print(font, 190, 85, editTextExtra).print(font, 190, 115, editTextExtra2).write(file, function(error){
                            if(error) throw error;
                        message.channel.send("*This is so sad...*", {
                                    files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            setTimeout(function(){
                                fs.unlink(file, resultHandler);
                                console.log("Deleted " + file);
                            }, 10000);
                        }).catch(function (err) {
                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            setTimeout(function(){
                                fs.unlink(file, resultHandler);
                                console.log("Deleted " + file);
                            }, 10000);
                        });
                            });
                    });
                 });
            }
            else if(args.length > 20)
            {
                Jimp.read("sad.png").then(function (sadImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                         sadImage.print(font, 190, 85, editText).print(font, 190, 115, editTextExtra).write(file, function(error){
                            if(error) throw error;
                        message.channel.send("*This is so sad...*", {
                                    files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            setTimeout(function(){
                                fs.unlink(file, resultHandler);
                                console.log("Deleted " + file);
                            }, 10000);
                        }).catch(function (err) {
                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                            setTimeout(function(){
                                fs.unlink(file, resultHandler);
                                console.log("Deleted " + file);
                            }, 10000);
                        });
                            });
                    });
                 });
            }
            else
            {
                Jimp.read("sad.png").then(function (sadImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                         sadImage.print(font, 190, 90, editText)
                                .write(file, function(error){
                                    if(error) throw error;
                                
                        message.channel.send("*This is so sad...*", {
                                    files: [file]
                        }).then(function(){
                            message.channel.stopTyping();
                            setTimeout(function(){
                                fs.unlink(file, resultHandler);
                                console.log("Deleted " + file);
                            }, 10000);
                        }).catch(function (err) {
                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                            setTimeout(function(){
                                fs.unlink(file, resultHandler);
                                console.log("Deleted " + file);
                            }, 10000);
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
                message.reply("a maximum of 86 characters are only allowed.").catch(error => console.log("Send Error - " + error));
            else
                message.reply("please give text for the command.").catch(error => console.log("Send Error - " + error));
                
             message.channel.stopTyping();
        }
    }
}

module.exports = SadCommand;