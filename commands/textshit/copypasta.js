const request = require('request');
const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class CopypastaCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "copypasta",
            group: "textshit",
            memberName: "copypasta",
            description: "Gives a random copypasta from /r/copypasta.",
            examples: ["`!copypasta`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        var url = "http://www.reddit.com/r/copypasta/random/.json";
        request(url, { json: true }, (err, res, redditResponse) => {
            if (err) { message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error)); return console.log(err); }
            
            if(redditResponse[0].data.children == undefined)
            {
                this.run(message, args)
                return; 
            }
            
            var selftext = redditResponse[0].data.children[0].data.selftext;

            if(selftext == undefined || selftext == "")
            {
                this.run(message, args);
                return;
            }

            message.channel.send(selftext, {split: true}).catch(error => {console.log("Send Error - " + error); message.channel.send("Failed To Send Copypasta - " + error).catch(error => {console.log("Send Error 2 - " + error);});});
        });
    }
}

module.exports = CopypastaCommand;