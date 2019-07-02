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

        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_ROLES")){
            message.channel.send("<@" + message.author.id + "> Slav Bot requires the Administrator Permission or the Manage Roles Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }
        
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_ROLES") && !message.guild.member(message.author).hasPermission("KICK_MEMBERS") && !message.guild.member(message.author).hasPermission("BAN_MEMBERS") && message.author.id != message.guild.owner.id){
            message.channel.send("<@" + message.author.id + "> This command is only available to the owner, or those with either the Administrator Permission, the Manage Roles Permission, the Kick Members Permission, or the Ban Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

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
                message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
                return;
            }  

            var muteRole = message.guild.roles.find("name", IndexRef.getRoleName(message.guild.id));
            var promises = []

            if(muteRole == null)
            {
                var allChannels = message.guild.channels.array()
                promises.push(message.guild.createRole({name: IndexRef.getRoleName(message.guild.id), permissions: 0}).then(function()
                {
                    allChannels.forEach(channel => {
                        channel.overwritePermissions(message.guild.roles.find("name", IndexRef.getRoleName(message.guild.id)), {SEND_MESSAGES: false, ATTACH_FILES: false, ADD_REACTIONS: false})
                    })
                }))
            }

            Promise.all(promises).then(() => {
                for(var i = 0; i < users.length; i++)
                {
                    const user = users[i];
                    message.guild.fetchMember(user).then(function(member){
                        
                        if(member.id == message.guild.owner.id)
                        {
                            message.channel.send("<@" + message.author.id + "> You cannot mute/unmute the owner of the server.").catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            if(!member.roles.find("id", muteRole.id))
                            {
                                message.channel.send("<@" + member.id + "> is already unmuted.").catch(error => console.log("Send Error - " + error));
                                IndexRef.removeMutedUser(message.guild.id, member.id)
                            }
                            else
                            {
                                member.removeRole(muteRole).then(() => {
                                    message.channel.send("<@" + member.id + "> has been unmuted.").catch(error => console.log("Send Error - " + error));
                                }).catch(error => console.log("Send Error - " + error));
                                IndexRef.removeMutedUser(message.guild.id, member.id)
                            }                        
                        }
                    }).catch(function(error){
                        console.log(error.message);
                        message.channel.send("Error - " + error.message).catch(error => console.log("Send Error - " + error));
                    })
                }   
            }).catch((e) => {
                console.log(e.message);
                message.channel.send("Error - " + e.message).catch(error => console.log("Send Error - " + error));
            });    
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
            return;
        }
    }
}

module.exports = UnmuteCommand;
