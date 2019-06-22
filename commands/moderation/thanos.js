const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class ThanosCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "thanos",
            group: "moderation",
            memberName: "thanos",
            description: "Perfectly balanced, as all servers should be. Kicks half the members of a server. Only available to the server owner.",
            examples: ["`!thanos`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }
        
        if(message.author.id == message.guild.ownerID)
        {
            CommandCounter.addCommandCounter(message.author.id)
            var users = [];
    
            message.guild.fetchMembers().then(() => {
                var allMembers = message.guild.members.array()
                for(var i = 0; i < allMembers.length; i++)
                {
                    if(allMembers[i].id != message.guild.ownerID)
                    {
                        users.push(allMembers[i])
                    }
                }
    
                var victimsAmount = Math.floor(users.length / 2)

                if(victimsAmount > 0)
                {
                    users = getRandom(users, victimsAmount)
    
                    for(var i = 0; i < users.length; i++)
                    {
                        users[i].kick("To preserve the balance of the server.").catch(function(error){
                            console.log(error.message);
                        })
                    }
        
                    message.channel.send("<@" + message.author.id + "> " + numberWithCommas(victimsAmount) + " users have been kicked. Perfectly balanced, as all servers should be.").catch(error => console.log("Send Error - " + error));
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> No users to kick.").catch(error => console.log("Send Error - " + error));
                } 
            })
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> This command is only available to the server owner.").catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = ThanosCommand;
