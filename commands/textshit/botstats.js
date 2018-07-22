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

class BotstatsCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "botstats",
            group: "util",
            memberName: "botstats",
            description: "Sends Slav Bot's stats from DBL.",
            examples: ["`!botstats`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        Jimp.read("https://discordbots.org/api/widget/319533843482673152.svg").then(function (statsImage) {
            var file = shortid.generate() + ".png"
            statsImage.write(file, function(error){
                if(error) throw error;
                console.log("Bot Stats")
                message.channel.send("***Bot Stats***", {
                    files: [file]
                }).then(function(){
                    setTimeout(function(){
                        message.channel.stopTyping();
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
                console.log("Message Sent");
            });
        }).catch(function (err) {
            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
            console.log(err.message);
            message.channel.stopTyping();
        });
        message.channel.stopTyping();
    }
}

module.exports = BotstatsCommand;