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
const RetroText = require('retrotext')
var CommandCounter = require("../../index.js")

class RetroCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "retro",
            group: "imageshit",
            memberName: "retro",
            description: "Takes given text and creates a retro text image. Includes 4 Text styles and 5 Background styles.",
            examples: ["`!retro <textStyle>|<backgroundStyle>|text1`", "`!retro 1|2|text1|text2`", "`!retro 4|5|text1|text2|text3`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        var textLine1 = "";
        var textLine2 = "";
        var textLine3 = "";
        var bgStyle = 1;
        var textStyle = 1;
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }
        if(args.length > 0)
        {
            var nextLine = false;
            var nextLine2 = false;

            for(var i = 0; i < args.length; i++)
            {
                if(i == 0)
                {
                    if(parseInt(args[i]) >= 1 && parseInt(args[i]) <= 4)
                    {
                        textStyle = parseInt(args[i]);
                    }
                    else
                    {
                        message.channel.send("<@" + message.author.id + "> The text style option should be a number from 1-4.").catch(error => console.log("Send Error - " + error));
                        
                        return;
                    }
                }
                else if(i == 1)
                {
                    if(args[i] != "|")
                    {
                        message.channel.send("<@" + message.author.id + "> Please use the correct format for the command. Use `" + commandPrefix + "help retro` for help.").catch(error => console.log("Send Error - " + error));
                        
                        return;                    
                    }
                }
                else if(i == 2)
                {
                    if(parseInt(args[i]) >= 1 && parseInt(args[i]) <= 5)
                    {
                        bgStyle = parseInt(args[i]);
                    }
                    else
                    {
                        message.channel.send("<@" + message.author.id + "> The background style option should be a number from 1-5.").catch(error => console.log("Send Error - " + error));
                        
                        return;
                    }
                }
                else if(i == 3)
                {
                    if(args[i] != "|")
                    {
                        message.channel.send("<@" + message.author.id + "> Please use the correct format for the command. Use `" + commandPrefix + "help retro` for help.").catch(error => console.log("Send Error - " + error));
                        
                        return;                    
                    }
                }
                else if(i > 2)
                {
                    if(nextLine2)
                    {
                        textLine3 = textLine3 + args[i];
                    }
                    else if (nextLine)
                    {
                        if(args[i] == "|")
                        {
                            nextLine2 = true;
                        }
                        else
                        {
                            textLine2 = textLine2 + args[i];
                        }
                    }
                    else
                    {
                        if(args[i] == "|")
                        {
                            nextLine = true;
                        }
                        else
                        {
                            textLine1 = textLine1 + args[i];
                        }
                    }
                }
            }
            
            const image = new RetroText().setLine1(textLine1.replace(/[^a-zA-Z0-9. ]/g, '')).setLine2(textLine2.replace(/[^a-zA-Z0-9. ]/g, ''))
            .setLine3(textLine3.replace(/[^a-zA-Z0-9. ]/g, '')).setBackgroundStyle(bgStyle).setTextStyle(textStyle);
            let url
            try {
                url = await image.fetchURL() 
            } catch (err) {
              console.log(err.message);
              
              return;
            }
            Jimp.read(url).then(function (textImage) {
                var file = shortid.generate() + ".png"
                textImage.write(file, function(error){
                    if(error) { console.log(error); return;};
                    console.log("got retro image");
                    console.log(file);
                    message.channel.send("Text Style: " + textStyle +  " - Background Style: " + bgStyle, {
                        files: [file]
                    }).then(function(){
                        
                        fs.remove(file, resultHandler);
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                        console.log(err.message);
                        
                        fs.remove(file, resultHandler);
                    });
                    console.log("Message Sent");
                    
                });
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
                
            });
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> Please fill the parameters for the command. Use `" + commandPrefix + "help retro` for help.").catch(error => console.log("Send Error - " + error));
            
        }
    }
}

module.exports = RetroCommand;