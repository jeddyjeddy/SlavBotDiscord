const command = require("discord.js-commando");

class RedditCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "reddit",
            group: "util",
            memberName: "reddit",
            description: "Gives the link for Slav Bot's Subreddit.",
            examples: ["`!reddit`"]
        });
    }

    async run(message, args)
    {
        message.channel.send("Post your creations/screenshots with Slav Bot on our subreddit: https://www.reddit.com/r/slavbot/").catch(error => console.log("Send Error - " + error));
    }
}

module.exports = RedditCommand;