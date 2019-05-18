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

class AwwnimeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "awwnime",
            group: "imageshit",
            memberName: "awwnime",
            description: "Gives a random Image of an anime girl from /r/awwnime. The weebs made me do this.",
            examples: ["`!awwnime`"]
        });
    }

    async run(message, args)
    {
        var url = "https://www.reddit.com/r/awwnime/random/.json";
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
            
            var title = redditResponse[0].data.children[0].data.title;
            var url = redditResponse[0].data.children[0].data.url;
            var thumbnail = redditResponse[0].data.children[0].data.thumbnail;

            if(thumbnail == undefined)
            {
                if(url == undefined)
                {
                    if(messageCheck(message.id))
                    this.run(message, args)
                    
                    return; 
                }
                else
                {
                    thumbnail = "";
                }
            }
            else if(thumbnail == "nsfw")
            {
                if(messageCheck(message.id))
                    this.run(message, args)
                    
                return;
            }
            
            if(url == undefined)
            {
                url = "";
            }

            if(url.indexOf(".png") == -1 && url.indexOf(".jpg") == -1 && url.indexOf(".jpeg") == -1 && url.indexOf(".gif") == -1)
            {
                if(thumbnail.indexOf(".png") == -1 && thumbnail.indexOf(".jpg") == -1 && thumbnail.indexOf(".jpeg") == -1 && thumbnail.indexOf(".gif") == -1)
                {
                    if(messageCheck(message.id))
                    this.run(message, args)
                    
                    return;
                }
                else
                {
                    url = thumbnail;
                }
            }
            
            if(url.substring(url.length - 5) == ".gifv")
            {
                url = url.substring(0, url.length - 5) + ".gif"
            }

            if(title == "" || title == null)
            {
                title = "***Blessed Image***";
            }
            else
            {
                title = "***" + title + "***";
            }

            if(url != null || url != "")
            {
                message.channel.send(title, {files: [url]}).catch(function(error){console.log("Send Error - " + error); message.channel.send("Error - " + error);});
                CommandCounter.addCommandCounter(message.author.id)
                completeCheck(message.id)
            }
            else
            {
                if(messageCheck(message.id))
                    this.run(message, args)
            }            
        });
    }
}

module.exports = AwwnimeCommand;