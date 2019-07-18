const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
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


class AutoRoleCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "autorole",
            group: "moderation",
            memberName: "autorole",
            description: "Automatically assigns a role to new members.",
            examples: ["`!autorole` (Disable Auto Role)", "`!autorole <role-name>` (Enable/Change Auto Role)"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null || !signedIntoFirebase)
        {
            return;
        }

        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.client.user.id).hasPermission("MANAGE_ROLES")){
            message.channel.send("<@" + message.author.id + "> Slav Bot does not have the Administrator or Manage Roles Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }
        
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_ROLES") && message.author.id != message.guild.owner.id){
            message.channel.send("<@" + message.author.id + "> This command is only available to the owner, or those with the Administrator or Manage Roles Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        CommandCounter.addCommandCounter(message.author.id)

        if(args.length > 0)
        {
            var userRole = message.guild.roles.find("name", args.toString());

            if(userRole == null)
            {
                message.channel.send("<@" + message.author.id + "> The role " + args.toString() + " does not exist.").catch(error => console.log("Send Error - " + error));
            }
            else
            {
                firebase.database().ref("serversettings/" + message.guild.id + "/autorole").set(userRole.id.toString())
                message.channel.send("<@" + message.author.id + "> New members will now receive the " + args.toString() + " role.").catch(error => console.log("Send Error - " + error));
            }

        }
        else
        {
            firebase.database().ref("serversettings/" + message.guild.id + "/autorole").remove()
            message.channel.send("<@" + message.author.id + "> Auto Role has been disabled.").catch(error => console.log("Send Error - " + error));
            return;
        }
    }
}

module.exports = AutoRoleCommand;
