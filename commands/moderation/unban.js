const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class UnbanCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "unban",
            group: "moderation",
            memberName: "unban",
            description: "Unban a member or members. Requires the user ID of the user to unban.",
            examples: ["`!unban <@id>`", "`!unban <@1234> <@51343214>`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }
        
        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.client.user.id).hasPermission("BAN_MEMBERS")){
            message.channel.send("<@" + message.author.id + "> Slav Bot does not have the Administrator or Ban Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("BAN_MEMBERS") && message.author.id != message.guild.owner.id){
            message.channel.send("<@" + message.author.id + "> This command is only available to the owner, or those with the Administrator or Ban Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        CommandCounter.addCommandCounter(message.author.id)

        var users = [];

        if(args.length > 0)
        {
            console.log("args are present");
            var getUser = false;
            var userID = "";

           for(var i = 0; i < args.length; i++)
            {
                if(getUser)
                {
                    if(args[i].toString() == ">")
                    {
                        users.push(userID);
                        userID = "";
                        getUser = false;
                    }
                    else
                    {
                        if(args[i].toString() != "@" && !isNaN(args[i].toString()))
                        {
                            userID = userID + args[i].toString();
                        }
                    }
                }
                else
                {
                    if(args[i].toString() == "<")
                    {
                            getUser = true;
                    } 
                }
            }

            if(users.length == 0)
            {
                message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
                return;
            }
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
            return;
        }
        
        for(var i = 0; i < users.length; i++)
        {
            message.guild.unban(users[i]).then(message.channel.send("Unbanned <@" + users[i] + ">").catch(error => console.log("Send Error - " + error))).catch(function(error){
                console.log(error.message);
                message.channel.send("Error - " + error.message).catch(error => console.log("Send Error - " + error));
            })
        }
    }
}

module.exports = UnbanCommand;
