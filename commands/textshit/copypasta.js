const request = require('request');
const command = require("discord.js-commando");

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
        message.channel.startTyping();
        var url = "http://www.reddit.com/r/copypasta/random/.json";
        request(url, { json: true }, (err, res, redditResponse) => {
            if (err) { message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error)); message.channel.stopTyping(); return console.log(err); }
            var selftext = redditResponse[0].data.children[0].data.selftext;
            var slices = [];
            if(selftext.length > 2000)
            {
                console.log("too long")
                var division = Math.floor(selftext.length / 2000);
                var start = 0;
                for(var i = 1; i <= division; i++)
                {
                    slices.push(selftext.slice(start * 2000, i * 2000));
                    start += 1;
                }

                if(selftext.length / 2000 > division)
                {
                    var index = 0;
                    for(var i = 0; i < slices.length; i++)
                    {
                        index = index + slices[i].length;
                    }

                    slices.push(selftext.slice(index, selftext.length));
                }

                for(var i = 0; i < slice.length; i++)
                {
                    var shiftText = "";
                    if(i == slices.length - 1)
                    {
                        if(slices[i].length > 2000)
                        {
                            var cut = 0;
                            for(var index = slices[i].length - 1; index >= 0; index--)
                            {
                                if(slice[i][index] == " ")
                                {
                                    cut = index;
                                    index = -1;
                                }
                            }
                            shiftText = slices[i].slice(cut, slices[i].length);
                            slices[i] = slices[i].slice(0, cut);
                            slices.push(shiftText);
                        }
                    }
                    else
                    {
                        var cut = 0;
                        for(var index = slices[i].length - 1; index >= 0; index--)
                        {
                            if(slice[i][index] == " ")
                            {
                                cut = index;
                                index = -1;
                            }
                        }
                        shiftText = slices[i].slice(cut, slices[i].length);
                        slices[i] = slices[i].slice(0, cut);
                        slices[i + 1] = shiftText + slices[i + 1];
                    }
                }

                for(var i = 0; i < slices.length; i++)
                {
                    message.channel.send(slices[i]).catch(error => console.log("Send Error - " + error)); 
                }
            }
            else
            {
                message.channel.send(selftext).catch(error => console.log("Send Error - " + error));
            }
            message.channel.stopTyping();
            });
    }
}

module.exports = CopypastaCommand;