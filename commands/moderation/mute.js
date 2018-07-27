const command = require("discord.js-commando");
var IndexRef = require("../../index.js")
const timestring = require('timestring')
var schedule = require('node-schedule');

class MuteCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "mute",
            group: "moderation",
            memberName: "mute",
            description: "Mutes a member or members. Length parameter is optional.",
            examples: ["`!mute @User`", "`!mute @User1 @User2`", "`!mute 30s @User @User2`", "`!mute 1m 30s @User @User2`", "`!mute 1m30s @User @User2`", "`!mute 1d30s @User @User2`", "`!mute 30days @User @User2`", "`!mute 2 hours @User @User2`", "`!mute 1y2mth @User @User2`", "`!mute 1 year 3 months 2 days @User @User2`"]
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

            var time = 0;
            var parameter = args.slice(0, firstIndex);
            if(parameter.length >= 2)
            {
                time = timestring(parameter, "ms")
            }

            var muteRole = message.guild.roles.find("name", IndexRef.getRoleName(message.guild.id));

            if(muteRole == null)
            {
                var allChannels = message.guild.channels.array()
                message.guild.createRole({name: IndexRef.getRoleName(message.guild.id)}).then(function()
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
                        message.reply("you cannot mute the owner of the server.").catch(error => console.log("Send Error - " + error));
                    }
                    else
                    {
                        if(member.roles.find("id", muteRole.id))
                        {
                            message.reply("<@" + member.id + "> is already muted.").catch(error => console.log("Send Error - " + error));
                            IndexRef.addMutedUser(message.guild.id, member.id, null)
                        }
                        else
                        {
                            if(time > 0)
                            {
                                //Convert time to Date
                                var date = new Date((new Date).getTime() + time)

                                if(IndexRef.addMutedUser(message.guild.id, member.id, date.toJSON()))
                                {
                                    member.addRole(muteRole).then(message.reply("<@" + user + "> has been muted for " + parameter + ".").catch(error => console.log("Send Error - " + error))).catch(error => message.reply("Error - " + error).catch(error => console.log("Send Error - " + error)));
                                    schedule.scheduleJob(date, function(){
                                        IndexRef.removeMutedUser(message.guild.id, member.id)
                                        if(member.roles.find("id", muteRole.id))
                                        {
                                            member.removeRole(muteRole).catch(error => console.log("Send Error - " + error));
                                        }
                                    });
                                }
                                else
                                {
                                    message.reply("<@" + member.id + "> is already muted.").catch(error => console.log("Send Error - " + error));
                                }
                            }
                            else
                            {

                                if(IndexRef.addMutedUser(message.guild.id, member.id, null))
                                {
                                    member.addRole(muteRole).then(message.reply("<@" + user + "> has been muted.").catch(error => console.log("Send Error - " + error))).catch(error => message.reply("Error - " + error).catch(error => console.log("Send Error - " + error)));
                                }
                                else
                                {
                                    message.reply("<@" + member.id + "> is already muted.").catch(error => console.log("Send Error - " + error));
                                }
                            }
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

module.exports = MuteCommand;
