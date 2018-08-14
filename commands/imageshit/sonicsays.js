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

class SonicsaysCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "sonicsays",
            group: "imageshit",
            memberName: "sonicsays",
            description: "Sonic Says... ***Insert Text***",
            examples: ["`!sonicsays please don't spam.`"]
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

        if(args.length > 0 && args.length < 141)
        {
            var nextLine = false;
            var nextLine2 = false;
            var nextLine3 = false;
            var nextLine4 = false;
            var nextLine5 = false;
            var nextLine6 = false;


            for(var i = 0; i < args.length; i++)
            {
                if(i > 120 && args.length >= 121)
                {
                    if(nextLine6)
                    {
                        editTextExtra6 = editTextExtra6 + args[i].toString();
                    }
                    else
                    {
                        editTextExtra5 = editTextExtra5 + args[i].toString();
                        if(args[i].toString() == " ")
                        {
                            nextLine6 = true;
                        }
                    }
                }
                else if(i > 100 && args.length >= 101)
                {
                    if(nextLine5)
                    {
                        editTextExtra5 = editTextExtra5 + args[i].toString();
                    }
                    else
                    {
                        editTextExtra4 = editTextExtra4 + args[i].toString();
                        if(args[i].toString() == " ")
                        {
                            nextLine5 = true;
                        }
                    }
                }
                else if(i > 80 && args.length >= 81)
                {
                    if(nextLine4)
                    {
                        editTextExtra4 = editTextExtra4 + args[i].toString();
                    }
                    else
                    {
                        editTextExtra3 = editTextExtra3 + args[i].toString();
                        if(args[i].toString() == " ")
                        {
                            nextLine4 = true;
                        }
                    }
                }
                else if(i > 60 && args.length >= 61)
                {
                    if(nextLine3)
                    {
                        editTextExtra3 = editTextExtra3 + args[i].toString();
                    }
                    else
                    {
                        editTextExtra2 = editTextExtra2 + args[i].toString();
                        if(args[i].toString() == " ")
                        {
                            nextLine3 = true;
                        }
                    }
                }
                else if(i > 40 && args.length >= 41)
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
            
                Jimp.read("sonic.jpg").then(function (sonicImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (font) {
                        sonicImage.print(font, 90, 70, editText).print(font, 90, 90, editTextExtra).print(font, 90, 110, editTextExtra2)
                         .print(font, 90, 130, editTextExtra3).print(font, 90, 150, editTextExtra4).print(font, 90, 170, editTextExtra5)
                         .print(font, 90, 190, editTextExtra6).write(file, function(error){ 
                            if(error) { console.log(error); return;};
                        message.channel.send("***Sonic says...***", {
                                    files: [file]
                        }).then(function(){
                            
                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                            console.log(err.message);
                            
                            fs.unlink(file, resultHandler);
                        });
                            });
                    });
                 }).catch(function (err) {
                    console.log(err.message);
                    
            });
        }
        else
        {
            if(args.length > 0)
                message.channel.send("<@" + message.author.id + "> A maximum of 140 characters are only allowed.").catch(error => {console.log("Send Error - " + error); });
            else
                message.channel.send("<@" + message.author.id + "> Please give text for the command.").catch(error => {console.log("Send Error - " + error); });

            
        }
    }
}

module.exports = SonicsaysCommand;