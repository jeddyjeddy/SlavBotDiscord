const command = require("discord.js-commando");
var firebase = require("firebase");
var signedIntoFirebase = false;
var blackList = []
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        Promise.all([firebase.database().ref("blacklist").once('value').then(function(snapshot) {
            if(snapshot.val() != null)
                blackList = JSON.parse(snapshot.val());  
        })]).then(() => {
            signedIntoFirebase = true;
        })
    } 
    else
    {
        signedIntoFirebase = false;
    }
  });

class FeedbackCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "feedback",
            group: "util",
            memberName: "feedback",
            description: "Send your feedback to the owner. Feedback can include suggestions for new commands or bug reports.",
            examples: ["`!feedback <your-feedback>`"]
        });
    }

    async run(message, args)
    {
        if(signedIntoFirebase)
        {
                if(args.length > 0)
                {    
                    var blackListed = false;

                    for(var i = 0; i < blackList.length; i++)
                    {
                        if(blackList[i] == message.author.id)
                        {
                            blackListed = true;
                        }
                    }

                    if(blackListed)
                    {
                        message.channel.send("<@" + message.author.id + "> The owner has blacklisted you due to missuse of the feedback command. Your feedback will not be sent.").catch(error => console.log("Send Error - " + error));
                    }
                    else
                    {
                        if(message.author.id == message.client.owners[0].id)
                        {
                            if(args.length > 0)
                            {
                                var userID = "";
                                var getUser = false;
                                for(var i = 0; i < args.length; i++)
                                {
                                    if(getUser)
                                    {
                                        if(args[i].toString() == ">")
                                        {
                                            i = args.length;
                                        }
                                        else
                                        {
                                            if(args[i].toString() != "@" && (!isNaN(args[i].toString()) || args[i] == "&"))
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

                                if(args.startsWith("blacklist"))
                                {
                                    var alreadyBlackListed = false;

                                    for(var i = 0; i < blackList.length; i++)
                                    {
                                        if(blackList[i] == userID)
                                        {
                                            alreadyBlackListed = true;
                                        }
                                    }

                                    if(alreadyBlackListed)
                                    {
                                        if(args.startsWith("blacklist remove"))
                                        {
                                            for(var i = 0; i < blackList.length; i++)
                                            {
                                                if(blackList[i] == userID)
                                                {
                                                    blackList.splice(i, 1);
                                                    firebase.database().ref("blacklist").set(JSON.stringify(blackList))
                                                    message.channel.send("<@" + userID + "> is no longer blacklisted").catch(error => console.log("Send Error - " + error));
                                                }
                                            }
                                        }
                                        else
                                            message.channel.send("User already blacklisted").catch(error => console.log("Send Error - " + error));
                                    }
                                    else
                                    {
                                        blackList.push(userID.toString());
                                        firebase.database().ref("blacklist").set(JSON.stringify(blackList))
                                        message.channel.send("<@" + userID + "> has been blacklisted").catch(error => console.log("Send Error - " + error));
                                    }
                                }
                                else
                                {
                                    var params = args.toString().split("|");
                                    if(params.length < 2)
                                    {
                                        message.channel.send("<@" + message.author.id + "> Add text for Message")
                                        return;
                                    }
                                    var text = params[1];
    
                                    message.channel.client.fetchUser(userID)
                                    .then(user => {
                                            user.send("***Message from the owner:*** " + text).then(() => { 
                                                message.channel.send("<@" + message.author.id + "> Message sent: " + text).catch(error => console.log("Send Error - " + error));
                                        }).catch(error => {console.log("Send Error - " + error); message.channel.send("Failed to send DM").catch(error => console.log("Send Error - " + error));});
                                    }, rejection => {
                                            console.log(rejection.message);
                                    });
                                }
                            }
                        }
                        else
                        {
                            message.client.owners[0].send("***Feedback (from <@" + message.author.id + ">):*** " + args).catch(error => console.log("Send Error - " + error));
                            message.channel.send("<@" + message.author.id + "> Thank you for your feedback!").catch(error => console.log("Send Error - " + error));
                        }
                    }
                }
                else
                {
                    message.channel.send("<@" + message.author.id + "> No feedback given in command.").catch(error => console.log("Send Error - " + error));
                }
        } 
        else
        {
            this.run(message, args);
        } 
    }
}

module.exports = FeedbackCommand;