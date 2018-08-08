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
            message.channel.send("<@" + message.author.id + "> Slav Bot does not have the Administrator or Change Nickname Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }
        
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("CHANGE_NICKNAME")){
            message.channel.send("<@" + message.author.id + "> This command is only available to those with the Administrator or Change Nickname Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        CommandCounter.addCommandCounter(message.author.id)
        var users = [];

        if(args.length > 0)
        {
            console.log("args are present");
            var getUser = false;
            var userID = "";
            var firstIndex = -1;

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
                        if(firstIndex == -1)
                        {
                            firstIndex = i;
                        }
                        getUser = true;
                    } 
                }
            }

            if(users.length == 0)
            {
                message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
                return;
            }  

            var nickname = "";
            console.log(firstIndex);
            
            if(firstIndex > 0)
            {
                nickname = args.slice(0, firstIndex)
            }

            for(var i = 0; i < users.length; i++)
            {
                const user = users[i];
                message.guild.fetchMember(user).then(function(member){
                    if(member.id == message.guild.owner.id)
                    {
                        message.channel.send("<@" + message.author.id + "> You cannot set the nickname of the server owner via a command. This must be done manually.").catch(error => console.log("Send Error - " + error));
                    }
                    else
                    {
                        if(nickname == "")
                        {
                            member.setNickname(nickname).then(message.channel.send("<@" + user + "> no longer has a nickname.").catch(error => console.log("Send Error - " + error))).catch(error => message.channel.send("Error - " + error).catch(error => console.log("Send Error - " + error)));
                        }
                        else
                        {
                            member.setNickname(nickname).then(message.channel.send("<@" + user + "> now has the nickname " + nickname).catch(error => console.log("Send Error - " + error))).catch(error => message.channel.send("Error - " + error).catch(error => console.log("Send Error - " + error)));
                        }
                    }
                }).catch(function(error){
                    console.log(error.message);
                    message.channel.send("Error - " + error.message).catch(error => console.log("Send Error - " + error));
                })
            }

        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
            return;
        }
    }
}

module.exports = RenameCommand;
