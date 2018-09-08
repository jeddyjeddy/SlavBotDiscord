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
        
        CommandCounter.addCommandCounter(message.author.id)
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
                            if(error) { console.log(error); return;};
                        message.channel.send("*This is so sad...*", {
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
                 });
            }
            else if(args.length > 20)
            {
                Jimp.read("sad.png").then(function (sadImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                         sadImage.print(font, 190, 85, editText).print(font, 190, 115, editTextExtra).write(file, function(error){
                            if(error) { console.log(error); return;};
                        message.channel.send("*This is so sad...*", {
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
                 });
            }
            else
            {
                Jimp.read("sad.png").then(function (sadImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                         sadImage.print(font, 190, 90, editText)
                                .write(file, function(error){
                                    if(error) { console.log(error); return;};
                                
                        message.channel.send("*This is so sad...*", {
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
                message.channel.send("<@" + message.author.id + "> A maximum of 86 characters are only allowed.").catch(error => {console.log("Send Error - " + error); });
            else
                message.channel.send("<@" + message.author.id + "> Please give text for the command.").catch(error => {console.log("Send Error - " + error); });
                
             
        }
    }
}

module.exports = SadCommand;