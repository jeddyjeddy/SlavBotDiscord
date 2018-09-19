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

        if(args.length > 0 && args.length < 141)
        {
            const file = shortid.generate() + ".png";
            var editText = args.toString()
                Jimp.read("sonic.png").then(function (sonicImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(function (font) {
                        sonicImage.print(font, 30, 115, editText, 750).write(file, function(error){ 
                            if(error) { console.log(error); return;};
                        message.channel.send("***Sonic says...***", {
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