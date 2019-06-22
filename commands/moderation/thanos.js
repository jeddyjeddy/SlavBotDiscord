const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

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
                    if(allMembers[i].id != message.guild.ownerID && !allMembers[i].bot)
                    {
                        users.push(allMembers[i])
                    }
                }
    
                const victimsAmount = Math.floor(users.length / 2)

                if(victimsAmount > 0)
                {
                    message.channel.send(numberWithCommas(victimsAmount) + " users will be kicked in 30 seconds.", {files: ["thanos.gif"]}).catch(error => console.log("Send Error - " + error));

                    setTimeout(() => {
                        message.channel.send("Balancing server in 30 seconds").catch(error => console.log("Send Error - " + error));
                        setTimeout(() => {
                            message.channel.send("Balancing server in 20 seconds").catch(error => console.log("Send Error - " + error));
                        }, 10000) 
                        setTimeout(() => {
                            message.channel.send("Balancing server in 10 seconds").catch(error => console.log("Send Error - " + error));
                        }, 20000) 
                        setTimeout(() => {
                            for(var i = 0; i < victimsAmount; i++)
                            {
                                users[i].kick("To preserve the balance of the server.").catch(function(error){
                                    console.log(error.message);
                                })
                            }
                
                            message.channel.send("<@" + message.author.id + "> " + numberWithCommas(victimsAmount) + " user(s) have been kicked. Perfectly balanced, as all servers should be.", {files: ["thanos.gif"]}).catch(error => console.log("Send Error - " + error));
                        }, 30000)
                    }, 5000)
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
