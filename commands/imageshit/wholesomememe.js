const request = require('request');
const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class WholesomeMemeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "wholesomememe",
            group: "imageshit",
            memberName: "wholesomememe",
            description: "Gives a random Wholesome Meme from /r/wholesomememes.",
            examples: ["`!wholesomememe`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        var url = "https://www.reddit.com/r/wholesomememes/random/.json";
        request(url, { json: true }, (err, res, redditResponse) => {
            if (err) { message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error)); return console.log(err); }
            
            if(redditResponse[0].data.children == undefined)
            {
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
                title = "***Wholesome***";
            }
            else
            {
                title = "***" + title + "***";
            }

            if(url != null || url != "")
            {
                message.channel.send(title, {files: [url]}).catch(function(error){console.log("Send Error - " + error); message.channel.send("Error - " + error);});
            }
            else
            {
                this.run(message, args)
            }
        });
    }
}

module.exports = WholesomeMemeCommand;