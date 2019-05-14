const request = require('request');
const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
var counterCheck = [{key: "Key", tries: 0}]

function messageCheck(messageID)
{
    for(var i = 0; i < counterCheck.length; i++)
    {
        if(counterCheck[i].key == messageID)
        {
            if(counterCheck[i].tries < 5)
            {
                counterCheck[i].tries += 1;
                return true;
            }
            else
            {
                counterCheck.splice(i, 1)
                return false;
            }
        }
    }

    counterCheck.push({key: messageID, tries: 1})
    return true;
}

function completeCheck(messageID)
{
    for(var i = 0; i < counterCheck.length; i++)
    {
        if(counterCheck[i].key == messageID)
        {
            counterCheck.splice(i, 1)
        }
    }
}

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
        var url = "http://www.reddit.com/r/copypasta/random/.json";
        request(url, { json: true }, (err, res, redditResponse) => {
            if (err) { message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error)); return console.log(err); }
            
            if(redditResponse[0] == undefined)
            {
                if(messageCheck(message.id))
                this.run(message, args)

                return; 
            }
            else if(redditResponse[0].data == undefined)
            {
                if(messageCheck(message.id))
                this.run(message, args)

                return; 
            }
            else if(redditResponse[0].data.children == undefined)
            {
                if(messageCheck(message.id))
                this.run(message, args)

                return; 
            }
            
            var selftext = redditResponse[0].data.children[0].data.selftext;

            if(selftext == undefined || selftext == "")
            {
                if(messageCheck(message.id))
                this.run(message, args);

                return;
            }
            
            var title = redditResponse[0].data.children[0].data.title;

            if(title == null)
            {
                title = "";
            }
            else
            {
                title = "***" + title + "***";
            }

            selftext = title + "\n" + selftext

            message.channel.send(selftext, {split: true}).catch(error => {console.log("Send Error - " + error); message.channel.send("Failed To Send Copypasta - " + error).catch(error => {console.log("Send Error 2 - " + error);});});
            CommandCounter.addCommandCounter(message.author.id)
            completeCheck(message.id)
        });
    }
}

module.exports = CopypastaCommand;