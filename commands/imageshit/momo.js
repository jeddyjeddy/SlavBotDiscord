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

class MomoCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "momo",
            group: "imageshit",
            memberName: "momo",
            description: "Make Momo say something. This command only has a text parameter.",
            examples: ["`!momo <text>`", "`!momo Hello`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)

        if(args.length > 0 && args.length < 181)
        {
            const file = shortid.generate() + ".png";
            var editText = args.toString()
                Jimp.read("momo.jpg").then(function (spidermanImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK   ).then(function (font) {
                        spidermanImage.print(font, 520, 90, editText, 450).write(file, function(error){ 
                            if(error) { console.log(error); return;};
                        message.channel.send("***Momo says...***", {
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
                message.channel.send("<@" + message.author.id + "> A maximum of 180 characters are only allowed.").catch(error => {console.log("Send Error - " + error); });
            else
                message.channel.send("<@" + message.author.id + "> Please give text for the command.").catch(error => {console.log("Send Error - " + error); });

            
        }
    }
}

module.exports = MomoCommand;