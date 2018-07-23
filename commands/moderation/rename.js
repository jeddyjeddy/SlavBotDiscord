const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class RenameCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "rename",
            group: "moderation",
            memberName: "rename",
            description: "Sets the nickname for a member or members. Keep the name parameter empty to reset nicknames.",
            examples: ["`!rename <new-name> @User`", "`!rename <new-name> @User1 @User2`", "`!rename @User`", "`!rename @User1 @User2`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }

        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.client.user.id).hasPermission("CHANGE_NICKNAME")){
            message.reply("Slav Bot does not have the Administrator or Change Nickname Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }
        
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("CHANGE_NICKNAME")){
            message.reply("this command is only available to those with the Administrator or Change Nickname Permission.").catch(error => console.log("Send Error - " + error))
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
            var firstIndex = 0;

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
                        if(firstIndex == 0)
                        {
                            firstIndex = i;
                        }
                        getUser = true;
                    } 
                }
            }

            if(users.length == 0)
            {
                message.reply("no users mentioned.").catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
                return;
            }  

            var nickname = "";
            console.log(firstIndex);
            
            if(firstIndex > 0)
            {
                nickname = args.splice(firstIndex)
            }

            for(var i = 0; i < users.length; i++)
            {
                const user = users[i];
                message.guild.fetchMember(user).then(function(member){
                    member.setNickname(nickname).then(message.reply("<@" + user + "> now has the nickname " + nickname).catch(error => console.log("Send Error - " + error))).catch(error => message.reply("Error - " + error).catch(error => console.log("Send Error - " + error)));
                }).catch(function(error){
                    console.log(error.member);
                    message.reply("Error - " + error.message).catch(error => console.log("Send Error - " + error));
                })
            }

            message.channel.stopTyping();
        }
        else
        {
            message.reply("no users mentioned.").catch(error => console.log("Send Error - " + error));
            message.channel.stopTyping();
            return;
        }
    }
}

module.exports = RenameCommand;
