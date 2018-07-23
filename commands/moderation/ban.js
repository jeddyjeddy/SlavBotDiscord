const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class BanCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "ban",
            group: "moderation",
            memberName: "ban",
            description: "Ban a member or members.",
            examples: ["`!ban @User`", "`!ban @User1 @User2`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }

        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.client.user.id).hasPermission("BAN_MEMBERS")){
            message.reply("Slav Bot does not have the Administrator or Ban Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }
        
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("BAN_MEMBERS")){
            message.reply("this command is only available to those with the Administrator or Ban Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        message.channel.startTyping();
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
            console.log(users)
            if(users.length == 0)
            {
                message.reply("no users mentioned.").catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
                return;
            }
        }
        else
        {
            message.reply("no users mentioned.").catch(error => console.log("Send Error - " + error));
            message.channel.stopTyping();
            return;
        }
        
        for(var i = 0; i < users.length; i++)
        {
            message.guild.fetchMember(users[i]).then(function(member){
                if(member.id == message.guild.owner.id)
                {
                    message.reply("you cannot ban the owner of the server.").catch(error => console.log("Send Error - " + error));
                }
                else
                {
                    member.ban().catch(error => message.reply("Error - " + error).catch(error => console.log("Send Error - " + error)));
                    message.reply("banned <@" + users[i] + ">").catch(error => console.log("Send Error - " + error))
                }
                
                message.channel.stopTyping();
            }).catch(function(error){
                console.log(error.member);
                message.reply("Error - " + error.message).catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
            })
        }
    }
}

module.exports = BanCommand;
