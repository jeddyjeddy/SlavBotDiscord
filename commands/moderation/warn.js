const command = require("discord.js-commando");
var IndexRef = require("../../index.js")
var warnings = [{guild: "", users: []}]
var firebase = require("firebase");
var signedIntoFirebase = false;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signedIntoFirebase = true;
    } 
    else
    {
        signedIntoFirebase = false;
    }
});

class WarnCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "warn",
            group: "moderation",
            memberName: "warn",
            description: "Warns a member or members. User is banned after the third warning.",
            examples: ["`!warn @User`", "`!warn @User1 @User2`", "`!warn remove @User1 @User2`", "`!warn view @User1 @User2`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null || !signedIntoFirebase)
        {
            return;
        }

        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("BAN_MEMBERS")){
            message.channel.send("<@" + message.author.id + "> Slav Bot requires either the Administrator Permission or the Ban Members Permission .").catch(error => console.log("Send Error - " + error))
            return;
        }
        
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("BAN_MEMBERS") && message.author.id != message.guild.owner.id){
            message.channel.send("<@" + message.author.id + "> This command is only available to the owner, or those with either the Administrator Permission or the Ban Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        var promises = []
        var foundGuild = false;
        for(var i = 0; i < warnings.length; i++)
        {
            if(warnings[i].guild == message.guild.id)
            {
                foundGuild = true;
            }
        }

        if(!foundGuild)
        {
            promises.push(firebase.database().ref("serversettings/" + message.guild.id + "/warnings").once('value').then((snap) => {
                if(snap.val() != null)
                {
                    var data = JSON.parse(snap.val())
                    warnings.push(data)
                }
                else
                {
                    warnings.push({guild: message.guild.id, users: []})
                }
            }))
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

            Promise.all(promises).then(() => {
                for(var i = 0; i < users.length; i++)
                {
                    const user = users[i];
                    message.guild.fetchMember(user).then(function(member){
                        if(member.id == message.guild.owner.id)
                        {
                            message.channel.send("<@" + message.author.id + "> You cannot warn the owner of the server.").catch(error => console.log("Send Error - " + error));
                        }
                        else if(member.id == message.client.user.id)
                        {
                            message.channel.send("<@" + message.author.id + "> You cannot warn Slav Bot.").catch(error => console.log("Send Error - " + error));   
                        }
                        else
                        {
                            for(var index = 0; index < warnings.length; index++)
                            {
                                if(warnings[index].guild == message.guild.id)
                                {
                                    var thumbnail = "";
    
                                    if(member.user.avatarURL != undefined && member.user.avatarURL != null)
                                        thumbnail = member.user.avatarURL

                                    var userFound = false;
                                    for(var userIndex = 0; userIndex < warnings[index].users.length; userIndex++)
                                    {
                                        if(warnings[index].users[userIndex].id == member.id)
                                        {
                                            userFound = true;

                                            if(args.toString().toLowerCase().startsWith("remove"))
                                            {
                                                if(warnings[index].users[userIndex].warnings <= 0)
                                                {
                                                    message.channel.send("<@" + member.id + "> has 0 warnings. <@" + message.author.id + "> please mention a user with at least one warning.")
                                                    warnings[index].users[userIndex].warnings = 0;
                                                }
                                                else
                                                {
                                                    warnings[index].users[userIndex].warnings = warnings[index].users[userIndex].warnings - 1;
                                                    message.channel.send("<@" + member.id + "> Your warning count has been reduced by <@" + message.author.id + ">", {embed: {title: `***Reduced Warning Count For ${member.user.tag}***`, description: "<@" + member.id + "> You now have " + warnings[index].users[userIndex].warnings + " warning(s). Having 3 or more warnings will result in a ban.", thumbnail: {"url": thumbnail}, color: 8388863, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL,text: "Warned on"}}})
                                                }
                                            }
                                            else if(args.toString().toLowerCase().startsWith("view"))
                                            {
                                                message.channel.send("", {embed: {title: `***Warning Profile For ${member.user.tag}***`, description: "<@" + member.id + "> You have received a total of " + warnings[index].users[userIndex].warnings + " warning(s). Having 3 or more warnings will result in a ban.", thumbnail: {"url": thumbnail}, color: 8388863, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL,text: "Warned on"}}})
                                            }
                                            else
                                            {
                                                warnings[index].users[userIndex].warnings = warnings[index].users[userIndex].warnings + 1;

                                                message.channel.send("<@" + member.id + "> You have been warned by <@" + message.author.id + ">", {embed: {title: `***${member.user.tag} Has Been Warned***`, description: "<@" + member.id + "> You have received a total of " + warnings[index].users[userIndex].warnings + " warning(s). Having 3 or more warnings will result in a ban.", thumbnail: {"url": thumbnail}, color: 8388863, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL,text: "Warned on"}}})
    
                                                if(warnings[index].users[userIndex].warnings >= 3)
                                                {
                                                    message.guild.ban(member.id, 7).then(() => {
                                                        message.channel.send("<@" + member.id + "> has been banned for exceeding the warning limit.", {embed: {title: `***${member.user.tag} Has Been Banned***`, description: "<@" + member.id + "> has been banned for exceeding the warning limit.", thumbnail: {"url": thumbnail}, color: 8388863, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL,text: "Warned on"}}}).catch(error => console.log("Send Error - " + error))
                                                    }).catch(function(error){
                                                        console.log(error);
                                                        message.channel.send("Error - " + error.message).catch(error => console.log("Send Error - " + error));
                                                    })
                                                }
                                            }
                                        }
                                    }

                                    if(!userFound)
                                    {
                                        if(args.toString().toLowerCase().startsWith("remove"))
                                        {
                                            message.channel.send("<@" + member.id + "> has never been warned. <@" + message.author.id + "> please mention a user with at least one warning.")
                                        }
                                        else if(args.toString().toLowerCase().startsWith("view"))
                                        {
                                            message.channel.send("", {embed: {title: `***Warning Profile For ${member.user.tag}***`, description: "<@" + member.id + "> You have received a total of 0 warning(s). Having 3 or more warnings will result in a ban.", thumbnail: {"url": thumbnail}, color: 8388863, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL,text: "Warned on"}}})
                                        }
                                        else
                                        {
                                            warnings[index].users.push({id: member.id, warnings: 1})
                                            message.channel.send("<@" + member.id + "> You have been warned by <@" + message.author.id + ">", {embed: {title: `***${member.user.tag} Has Been Warned***`, description: "<@" + member.id + "> You have received a total of 1 warning(s). Having 3 or more warnings will result in a ban.", thumbnail: {"url": thumbnail}, color: 8388863, timestamp: (new Date()).toJSON(), footer: {icon_url: message.client.user.avatarURL,text: "Warned on"}}})
                                        }    
                                    }
                            
                                    firebase.database().ref("serversettings/" + message.guild.id + "/warnings").set(JSON.stringify(warnings[index]))
                                }
                            }   
                        }
                    }).catch(function(error){
                        console.log(error.message);
                        message.channel.send("Error - " + error.message).catch(error => console.log("Send Error - " + error));
                    })
                }
            })
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
            return;
        }
    }
}

module.exports = WarnCommand;
