const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class Avatarommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "abatar",
            group: "imageshit",
            memberName: "avatar",
            description: "Gives the avatar of the tagged user or your avatar if no tagged user is given. Putting the ID of any user works as well.",
            examples: ["`!avatar`", "`!avatar @User`", "`!avatar <user-id>`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        var otherUser = false;
        var userID = "";
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }
        if(args.length > 0)
        {
            console.log("args are present");
            var getUser = false;
            for(var i = 0; i < args.length; i++)
            {
                if(getUser)
                {
                    if(args[i].toString() == ">")
                    {
                        i = args.length;
                        otherUser = true;
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
        }
        
        var url = "";
        console.log(url);

        var promises = []

        if(otherUser)
        {
            console.log(userID);

            promises.push(message.channel.client.fetchUser(userID)
            .then(user => {
                if(user.avatarURL != undefined && user.avatarURL != null)
                    url = user.avatarURL;
                else
                    url = "no user"
            }, rejection => {
                    console.log(rejection.message);
                    url = "no user";
            }))
        }
        else
        {
            url = message.author.avatarURL;
        }

        const ID = userID;
        Promise.all(promises).then(() => {
            message.channel.send("Avatar for <@" + ID + ">", {files: [url]}).catch(error => console.log("Send Error - " + error));
        }).catch((e) => {
            console.log("User Data Error - " + e.message);
            message.channel.send("User data not found").catch(error => console.log("Send Error - " + error));
        });
    }
    
}

module.exports = Avatarommand;
