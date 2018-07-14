const command = require("discord.js-commando");
var signedIntoFirebase = false;
var firebase = require("firebase");
const fs = require('fs');
var callback = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file saved");
    }
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signedIntoFirebase = true;
    } 
    else
    {
        signedIntoFirebase = false;
    }
  });

class MuteCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "mute",
            group: "moderation",
            memberName: "mute",
            description: "Mute a member or members in all channels. Messages that are sent by muted users will always be deleted. This can also be used to mute Slav Bot's responses to certain messages, regular command responses will not be muted.",
            examples: ["`!mute @User`", "`!mute @User1 @User2`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }
        
        if(!signedIntoFirebase)
        {
           return; 
        }
        
        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.client.user.id).hasPermission("MANAGE_CHANNELS")){
            message.reply("Slav Bot does not have the Administrator or Manage Channels Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_CHANNELS")){
            message.reply("this command is only available to admins and mods.").catch(error => console.log("Send Error - " + error))
            return;
        }

        message.channel.startTyping();
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
        
        fs.readFile('mutedusers/' + message.guild.id + '.json', 'utf8', function readFileCallback(err, data){
            var mutedusers = []
            if (err){
                firebase.database().ref("serversettings/" + message.guild.id + "/mutedusers").once('value').then(function(snapshot) {
                    if(snapshot.val() == null)
                    {
                        mutedusers = ["test"]
                    }
                    else
                    {
                        mutedusers = JSON.parse(snapshot.val());
                    }
                           
                    var addedUsers = [];

                    for(var i = 0; i < users.length; i++)
                    {
                        var userAdded = false;
        
                        for(var userIndex = 0; userIndex < mutedusers.length; userIndex++)
                        {
                            if(mutedusers[userIndex] == users[i])
                            {
                                userAdded = true;
                            }
                        }    
                        
                        if(!userAdded)
                        {
                            addedUsers.push(users[i])
                            message.reply("muted <@" + users[i] + ">").catch(error => console.log("Send Error - " + error))
                        }
                        else
                        {
                            message.reply("<@" + users[i] + "> already muted").catch(error => console.log("Send Error - " + error))
                        }
                    }  
        
                    for(var i = 0; i < addedUsers.length; i++)
                    {
                        mutedusers.push(addedUsers[i])   
                    }

                    firebase.database().ref("serversettings/" + message.guild.id + "/mutedusers").set(JSON.stringify(mutedusers));
                    fs.writeFile('mutedusers/' + message.guild.id + '.json', JSON.stringify({allMutedUsers: mutedusers}), 'utf8', callback); // write it back 
                    message.channel.stopTyping();
                });
            } else {
            try 
            {
                mutedUsers = JSON.parse(data).allMutedUsers; 
            }
            catch(e) 
            {
                console.log(e); // error in the above string (in this case, yes)!
                mutedUsers = ["test"]
            }
            var addedUsers = [];

            for(var i = 0; i < users.length; i++)
            {
                var userAdded = false;

                for(var userIndex = 0; userIndex < mutedusers.length; userIndex++)
                {
                    if(mutedusers[userIndex] == users[i])
                    {
                        userAdded = true;
                    }
                }    
                
                if(!userAdded)
                {
                    addedUsers.push(users[i])
                    message.reply("muted <@" + users[i] + ">").catch(error => console.log("Send Error - " + error))
                }
                else
                {
                    message.reply("<@" + users[i] + "> already muted").catch(error => console.log("Send Error - " + error))
                }
            }  

            for(var i = 0; i < addedUsers.length; i++)
            {
                mutedusers.push(addedUsers[i])   
            }

            firebase.database().ref("serversettings/" + message.guild.id + "/mutedusers").set(JSON.stringify(mutedusers));
            fs.writeFile('mutedusers/' + message.guild.id + '.json', JSON.stringify({allMutedUsers: mutedusers}), 'utf8', callback); // write it back 
            message.channel.stopTyping();
            
        }});
    }
}

module.exports = MuteCommand;
