const command = require("discord.js-commando");
const request = require('request')

class RandomcadeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "randomcade",
            group: "imageshit",
            memberName: "randomcade",
            description: "Gives an image of a random cade.",
            examples: ["`!randomcade`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        request('http://thecatapi.com/api/images/get?format=src', { json: false }, (err, res, body) => {
            if (err) { return console.log(err); }
                console.log(res.request.uri.href);
                message.channel.send("", {files: [res.request.uri.href]}).catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
            });
    }
}

module.exports = RandomcadeCommand;