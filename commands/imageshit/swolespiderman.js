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

class SwoleSpidermanCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "swolespiderman",
            group: "imageshit",
            memberName: "swolespiderman",
            description: "Make Swole Spider-Man say something. This command only has a text parameter.",
            examples: ["`!swolespiderman <text>`", "`!swolespiderman You retard`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)

        if(args.length > 0 && args.length < 66)
        {
            const file = shortid.generate() + ".png";
            var editText = args.toString()
                Jimp.read("swolespiderman.png").then(function (spidermanImage) {
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK   ).then(function (font) {
                        spidermanImage.print(font, 16, 10, editText, 260).write(file, function(error){ 
                            if(error) { console.log(error); return;};
                        message.channel.send("***Swole Spider-Man says...***", {
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
                message.channel.send("<@" + message.author.id + "> A maximum of 65 characters are only allowed.").catch(error => {console.log("Send Error - " + error); });
            else
                message.channel.send("<@" + message.author.id + "> Please give text for the command.").catch(error => {console.log("Send Error - " + error); });

            
        }
    }
}

module.exports = SwoleSpidermanCommand;