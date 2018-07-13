const command = require("discord.js-commando");
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
            firebase.database().ref("blacklist").once('value').then(function(snapshot) {
                var blackList = JSON.parse(snapshot.val());  
                message.channel.startTyping();
        
                var blackListed = false;

                for(var i = 0; i < blackList.length; i++)
                {
                    if(blackList[i] == message.author.id)
                    {
                        blackListed = true;
                    }
                }

                if(args.length > 0)
                {
                    if(blackListed)
                    {
                        message.reply("The owner has blacklisted you due to missuse of the feedback command. Your feedback will not be sent.").catch(error => console.log("Send Error - " + error));
                    }
                    else
                    {
                        message.channel.client.fetchUser("281876391535050762")
                        .then(user => {
                                user.send("***Feedback (from <@" + message.author.id + ">):*** " + args).catch(error => console.log("Send Error - " + error));
                                message.reply("thank you for your feedback!").catch(error => console.log("Send Error - " + error));
                        }, rejection => {
                                console.log(rejection.message);
                        });
                    }
                }
                else
                {
                    message.reply("no feedback given in command.").catch(error => console.log("Send Error - " + error));
                }

                message.channel.stopTyping();
            }); 
        } 
        else
        {
            run(message, args);
        } 
    }
}

module.exports = FeedbackCommand;