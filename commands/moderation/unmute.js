const command = require("discord.js-commando");
var IndexRef = require("../../index.js")

class UnmuteCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "unmute",
            group: "moderation",
            memberName: "unmute",
            description: "Unmutes a member or members.",
            examples: ["`!unmute @User`", "`!unmute @User1 @User2`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }

        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && (!message.guild.member(message.author).hasPermission("MANAGE_ROLES") || !message.guild.member(message.author).hasPermission("MUTE_MEMBERS"))){
            message.reply("Slav Bot requires the Administrator Permission or both Manage Roles and Mute Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }
        
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && (!message.guild.member(message.author).hasPermission("MANAGE_ROLES") || !message.guild.member(message.author).hasPermission("MUTE_MEMBERS"))){
            message.reply("this command is only available to those with the Administrator Permission or both Manage Roles and Mute Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        message.channel.startTyping();
        IndexRef.addCommandCounter(message.author.id)
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
                message.reply("no users mentioned.").catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
                return;
            }  

            var muteRole = message.guild.roles.find("name", IndexRef.getRoleName(message.guild.id));

            if(muteRole == null)
            {
                var allChannels = message.guild.channels.array()
                message.guild.createRole({name: IndexRef.getRoleName(message.guild.id), permissions: 0}).then(function()
                {
                    allChannels.forEach(channel => {
                        channel.overwritePermissions(message.guild.roles.find("name", IndexRef.getRoleName(message.guild.id)), {SEND_MESSAGES: false, ATTACH_FILES: false, ADD_REACTIONS: false})
                    })
                })
                
                message.channel.stopTyping();
                const Ref = this;
                setTimeout(function(){
                    Ref.run(message, args);
                }, 1000)
                return;
            }

            for(var i = 0; i < users.length; i++)
            {
                const user = users[i];
                message.guild.fetchMember(user).then(function(member){
                    
                    if(member.id == message.guild.owner.id)
                    {
                        message.reply("you cannot mute/unmute the owner of the server.").catch(error => console.log("Send Error - " + error));
                    }
                    else
                    {
                        if(!member.roles.find("id", muteRole.id))
                        {
                            message.reply("<@" + member.id + "> is already unmuted.").catch(error => console.log("Send Error - " + error));
                            IndexRef.removeMutedUser(message.guild.id, member.id)
                        }
                        else
                        {
                            member.removeRole(muteRole).catch(error => console.log("Send Error - " + error));
                            IndexRef.removeMutedUser(message.guild.id, member.id)
                            message.reply("<@" + member.id + "> has been unmuted.").catch(error => console.log("Send Error - " + error));
                        }                        
                    }
                }).catch(function(error){
                    console.log(error.message);
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

module.exports = UnmuteCommand;
