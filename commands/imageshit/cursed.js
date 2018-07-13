const request = require('request');
const command = require("discord.js-commando");

class CursedCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "cursed",
            group: "imageshit",
            memberName: "cursed",
            description: "Gives a random Cursed Image from /r/cursedimages.",
            examples: ["`!cursed`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        var url = "http://www.reddit.com/r/cursedimages/random/.json";
        request(url, { json: true }, (err, res, redditResponse) => {
            if (err) { message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error)); message.channel.stopTyping(); return console.log(err); }
            var title = redditResponse[0].data.children[0].data.title;
            var url = redditResponse[0].data.children[0].data.url;
            
            if(redditResponse[0].data.children[0].data.thumbnail == "nsfw")
            {
                this.run(message, args)
            }
            else
            {
                if(title == "" || title == null)
                {
                    title = "***Cursed Image***";
                }
                else
                {
                    title = "***" + title + "***";
                }
    
                if(url != null || url != "")
                {
                    message.channel.send(title, {files: [url]}).catch(error => console.log("Send Error - " + error));
                }
                else
                {
                    this.run(message, args)
                }
            }
            
            message.channel.stopTyping();
        });
    }
}

module.exports = CursedCommand;