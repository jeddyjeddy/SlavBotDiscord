const command = require("discord.js-commando");
var allPolls = [{key: "Key", polls: null}]
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

class PollCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "poll",
            group: "textshit",
            memberName: "poll",
            description: "Create a poll. The required parameters for this command is the title for the poll and at least 2 choices. The poll can be stopped at any time, each channel can only have 1 poll",
            examples: ["`!poll` (Sends poll again if there is an on-going poll)", "`!poll <title>|<option1>|<option2>`", "`!poll end`", "`!poll <title>|<option1>|<option2>|<option3>`", "`!poll <option-number>` (To place your vote)", "`!poll 2`"]
        });
    }

    async run(message, args)
    {
        if(!signedIntoFirebase)
            return;

        message.channel.startTyping();

        var hasPoll = false;
        var pollIndex = -1;
        var guildIndex = -1;

        for(var i = 0; i < allPolls.length; i++)
        {
            if(allPolls[i].key == message.guild.id)
            {
                guildIndex = i;
                for(var channelIndex = 0; channelIndex < allPolls[i].polls.length; channelIndex++)
                {
                    var poll = allPolls[i].polls[channelIndex];
                    if(poll.key == message.channel.id)
                    {
                        hasPoll = true;
                        pollIndex = channelIndex;
                    }
                }
            }
        }
        
        if(guildIndex == -1)
        {
            const classRef = this;
            firebase.database().ref("serversettings/" + message.guild.id + "/polls").once('value').then(function(snapshot) {
                if(snapshot.val() == null)
                {
                    allPolls.push({key: message.guild.id, polls: []});
                }
                else
                {
                    var downloadedPolls = JSON.parse(snapshot.val())
                    allPolls.push({key: message.guild.id, polls: downloadedPolls});
                }

                classRef.run(message, args);
            });
            message.channel.stopTyping();
            return;
        }

        if(args.toLowerCase() == "end")
        {
            if(hasPoll)
            {
                //End Poll
                if(message.author.id == allPolls[guildIndex].polls[pollIndex].poll.owner)
                {
                    message.channel.send("the poll ***" + allPolls[guildIndex].polls[pollIndex].poll.title + "*** has ended").catch(error => console.log("Send Error - " + error));
                    //Poll Results
                    var options = allPolls[guildIndex].polls[pollIndex].poll.options;
                    optionTitles = [];
                    var optionVotes = [];

                    for(var i = 0; i < options.length; i++)
                    {
                        optionTitles.push(options[i].option + " - [" + options[i].users.length + "]");
                        optionVotes.push(options[i].users.length);
                    }

                    var descriptionFields = [];

                    for(var i = 0; i < optionTitles.length; i++)
                    {
                        descriptionFields.push("```" + (i + 1) + ": " + optionTitles[i] + "```")
                    }

                    var descriptions = [""]
                    var descriptionIndex = -1;
                    var nextIndex = true;
                    for(var i = 0; i < descriptionFields.length; i++)
                    {
                        if(!nextIndex)
                        {
                            if((descriptions[descriptionIndex] + descriptionFields[i]).length > 2048)
                            {
                                nextIndex = true;
                                descriptions.push(descriptionFields[i]);
                            }
                            else
                                descriptions[descriptionIndex] = descriptions[descriptionIndex] + descriptionFields[i];
                        }
                        else
                        {
                            descriptionIndex += 1;
                            nextIndex = false;
                            descriptions[descriptionIndex] = descriptions[descriptionIndex] + descriptionFields[i];
                        }
                    }

                    for(var i = 0; i < descriptions.length; i++)
                    {
                        if(i > 0)
                            message.channel.send("", {embed: {description: descriptions[i], color: 25394}}).catch(error => console.log("Send Error - " + error));
                        else
                            message.channel.send("***" + title + "***", {embed: {title: title.toString(), description: descriptions[i], color: 25394}}).catch(error => console.log("Send Error - " + error));
                    }

                    var largestVote = -1;

                    for(var i = 0; i < optionVotes.length; i++)
                    {
                        if(optionVotes[i] > largestVote)
                        {
                            largestVote = optionVotes[i];
                        }
                    }

                    var largestVotes = [];

                    for(var i = 0; i < optionVotes.length; i++)
                    {
                        if(optionVotes[i] == largestVote)
                        {
                            largestVotes.push(i);
                        }
                    }

                    if(largestVotes.length == optionVotes.length)
                    {
                        if(largestVote == 0)
                        {
                            message.channel.send("No votes were given in this poll.").catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            message.channel.send("All options have been given an equal vote of " + largestVote + " votes.").catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else
                    {
                        var winnerTitle = "Highest voted option";

                        if(largestVotes.length > 1)
                        {
                            winnerTitle = "Highest voted options";
                        }

                        var winnerTitles = [];
                        var winnerFields = [];

                        for(var i = 0; i < largestVotes.length; i++)
                        {
                            winnerTitles.push(options[largestVotes[i]].option + " - [" + options[largestVotes[i]].users.length + "]");
                        }

                        for(var i = 0; i < winnerTitles.length; i++)
                        {
                            winnerFields.push("```" + (largestVotes[i] + 1) + ": " + winnerTitles[i] + "```")
                        }

                        var winnerDescriptions = [""]
                        var winnerDescriptionIndex = -1;
                        var nextWinnerIndex = true;
                        for(var i = 0; i < winnerFields.length; i++)
                        {
                            if(!nextWinnerIndex)
                            {
                                if((winnerDescriptions[winnerDescriptionIndex] + winnerDescriptions[i]).length > 2048)
                                {
                                    nextWinnerIndex = true;
                                    winnerDescriptions.push(descriptionFields[i]);
                                }
                                else
                                winnerDescriptions[winnerDescriptionIndex] = winnerDescriptions[winnerDescriptionIndex] + winnerFields[i];
                            }
                            else
                            {
                                winnerDescriptionIndex += 1;
                                nextWinnerIndex = false;
                                winnerDescriptions[winnerDescriptionIndex] = winnerDescriptions[winnerDescriptionIndex] + winnerFields[i];
                            }
                        }

                        for(var i = 0; i < winnerDescriptions.length; i++)
                        {
                            if(i > 0)
                                message.channel.send("", {embed: {description: winnerDescriptions[i], color: 11553281}}).catch(error => console.log("Send Error - " + error));
                            else
                                message.channel.send("***" + winnerTitle + "***", {embed: {title: winnerTitle.toString(), description: winnerDescriptions[i], color: 11553281}}).catch(error => console.log("Send Error - " + error));
                        }
                    }

                    allPolls[guildIndex].polls.splice(pollIndex, 1);
                }
                else
                {
                    if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("MANAGE_CHANNELS") && !message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")){
                        message.reply("other than the owner of the poll, only admins and those with the manage channels or manage messages permissions can end polls.").catch(error => console.log("Send Error - " + error))
                    }
                    else
                    {
                        message.channel.send("the poll ***" + allPolls[guildIndex].polls[pollIndex].poll.title + "*** has ended").catch(error => console.log("Send Error - " + error));

                        //Poll Results
                        var options = allPolls[guildIndex].polls[pollIndex].poll.options;
                        optionTitles = [];
                        var optionVotes = [];
    
                        for(var i = 0; i < options.length; i++)
                        {
                            optionTitles.push(options[i].option + " - [" + options[i].users.length + "]");
                            optionVotes.push(options[i].users.length);
                        }
    
                        var descriptionFields = [];
    
                        for(var i = 0; i < optionTitles.length; i++)
                        {
                            descriptionFields.push("```" + (i + 1) + ": " + optionTitles[i] + "```")
                        }
    
                        var descriptions = [""]
                        var descriptionIndex = -1;
                        var nextIndex = true;
                        for(var i = 0; i < descriptionFields.length; i++)
                        {
                            if(!nextIndex)
                            {
                                if((descriptions[descriptionIndex] + descriptionFields[i]).length > 2048)
                                {
                                    nextIndex = true;
                                    descriptions.push(descriptionFields[i]);
                                }
                                else
                                    descriptions[descriptionIndex] = descriptions[descriptionIndex] + descriptionFields[i];
                            }
                            else
                            {
                                descriptionIndex += 1;
                                nextIndex = false;
                                descriptions[descriptionIndex] = descriptions[descriptionIndex] + descriptionFields[i];
                            }
                        }
    
                        for(var i = 0; i < descriptions.length; i++)
                        {
                            if(i > 0)
                                message.channel.send("", {embed: {description: descriptions[i], color: 25394}}).catch(error => console.log("Send Error - " + error));
                            else
                                message.channel.send("***" + title + "***", {embed: {title: title.toString(), description: descriptions[i], color: 25394}}).catch(error => console.log("Send Error - " + error));
                        }
    
                        var largestVote = -1;
    
                        for(var i = 0; i < optionVotes.length; i++)
                        {
                            if(optionVotes[i] > largestVote)
                            {
                                largestVote = optionVotes[i];
                            }
                        }
    
                        var largestVotes = [];
    
                        for(var i = 0; i < optionVotes.length; i++)
                        {
                            if(optionVotes[i] == largestVote)
                            {
                                largestVotes.push(i);
                            }
                        }
    
                        if(largestVotes.length == optionVotes.length)
                        {
                            if(largestVote == 0)
                            {
                                message.channel.send("No votes were given in this poll.").catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                message.channel.send("All options have been given an equal vote of " + largestVote + " votes.").catch(error => console.log("Send Error - " + error));
                            }
                        }
                        else
                        {
                            var winnerTitle = "Highest voted option";
    
                            if(largestVotes.length > 1)
                            {
                                winnerTitle = "Highest voted options";
                            }
    
                            var winnerTitles = [];
                            var winnerFields = [];
    
                            for(var i = 0; i < largestVotes.length; i++)
                            {
                                winnerTitles.push(options[largestVotes[i]].option + " - [" + options[largestVotes[i]].users.length + "]");
                            }
    
                            for(var i = 0; i < winnerTitles.length; i++)
                            {
                                winnerFields.push("```" + (largestVotes[i] + 1) + ": " + winnerTitles[i] + "```")
                            }
    
                            var winnerDescriptions = [""]
                            var winnerDescriptionIndex = -1;
                            var nextWinnerIndex = true;
                            for(var i = 0; i < winnerFields.length; i++)
                            {
                                if(!nextWinnerIndex)
                                {
                                    if((winnerDescriptions[winnerDescriptionIndex] + winnerDescriptions[i]).length > 2048)
                                    {
                                        nextWinnerIndex = true;
                                        winnerDescriptions.push(descriptionFields[i]);
                                    }
                                    else
                                    winnerDescriptions[winnerDescriptionIndex] = winnerDescriptions[winnerDescriptionIndex] + winnerFields[i];
                                }
                                else
                                {
                                    winnerDescriptionIndex += 1;
                                    nextWinnerIndex = false;
                                    winnerDescriptions[winnerDescriptionIndex] = winnerDescriptions[winnerDescriptionIndex] + winnerFields[i];
                                }
                            }
    
                            for(var i = 0; i < winnerDescriptions.length; i++)
                            {
                                if(i > 0)
                                    message.channel.send("", {embed: {description: winnerDescriptions[i], color: 11553281}}).catch(error => console.log("Send Error - " + error));
                                else
                                    message.channel.send("***" + winnerTitle + "***", {embed: {title: winnerTitle.toString(), description: winnerDescriptions[i], color: 11553281}}).catch(error => console.log("Send Error - " + error));
                            }
                        }

                        allPolls[guildIndex].polls.splice(pollIndex, 1);
                    }
                }
                
            }
            else
            {
                message.reply("there is no on-going poll in this channel.").catch(error => console.log("Send Error - " + error));
            }
        }
        else
        {
            if(hasPoll)
            {
                //Send Info on Latest Poll
                if(args.length == 0)
                {
                    //Send Poll Details

                    var options = allPolls[guildIndex].polls[pollIndex].poll.options;
                    optionTitles = [];

                    for(var i = 0; i < options.length; i++)
                    {
                        optionTitles.push(options[i].option)
                    }

                    var descriptionFields = [];

                    for(var i = 0; i < optionTitles.length; i++)
                    {
                        descriptionFields.push("```" + (i + 1) + ": " + optionTitles[i] + "```")
                    }

                    var descriptions = [""]
                    var descriptionIndex = -1;
                    var nextIndex = true;
                    for(var i = 0; i < descriptionFields.length; i++)
                    {
                        if(!nextIndex)
                        {
                            if((descriptions[descriptionIndex] + descriptionFields[i]).length > 2048)
                            {
                                nextIndex = true;
                                descriptions.push(descriptionFields[i]);
                            }
                            else
                                descriptions[descriptionIndex] = descriptions[descriptionIndex] + descriptionFields[i];
                        }
                        else
                        {
                            descriptionIndex += 1;
                            nextIndex = false;
                            descriptions[descriptionIndex] = descriptions[descriptionIndex] + descriptionFields[i];
                        }
                    }

                    for(var i = 0; i < descriptions.length; i++)
                    {
                        if(i > 0)
                            message.channel.send("", {embed: {description: descriptions[i], color: 9633792}}).catch(error => console.log("Send Error - " + error));
                        else
                            message.channel.send("***" + title + "***", {embed: {title: title.toString(), description: descriptions[i], color: 9633792}}).catch(error => console.log("Send Error - " + error));
                    }
                }
                else
                {
                    if(isNaN(args.toString()))
                    {
                        message.reply("you must give the number of the option you wish to vote for. Use `!poll` to show the options for the current poll.").catch(error => console.log("Send Error - " + error));
                    }
                    else
                    {
                        var selectedOption = parseInt(args);
                        var selectedOptionIndex = selectedOption - 1;
                        var hasVoted = false;

                        if(allPolls[guildIndex].polls[pollIndex].poll.options[selectedOptionIndex].users != null)
                        {
                            if(allPolls[guildIndex].polls[pollIndex].poll.options[selectedOptionIndex].users.length > 0)
                            {
                                for(var i = 0; i < allPolls[guildIndex].polls[pollIndex].poll.options[selectedOptionIndex].users.length; i++)
                                {
                                    if(allPolls[guildIndex].polls[pollIndex].poll.options[selectedOptionIndex].users[i] == message.author.id)
                                    {
                                        hasVoted = true;
                                    }
                                }
                            }
                        }
                        
                        if(hasVoted)
                        {
                            message.reply("you have already voted for this poll.").catch(error => console.log("Send Error - " + error));
                        }
                        else
                        {
                            //Vote for option
                            
                            if(selectedOption >= 1 && selectedOption <= allPolls[guildIndex].polls[pollIndex].poll.options.length)
                            {
                                if(allPolls[guildIndex].polls[pollIndex].poll.options[selectedOptionIndex].users != null)
                                    allPolls[guildIndex].polls[pollIndex].poll.options[selectedOptionIndex].users.push(message.author.id);
                                else
                                    allPolls[guildIndex].polls[pollIndex].poll.options[selectedOptionIndex].users = [message.author.id];

                                message.channel.send("<@" + message.author.id + "> has voted for ***" + allPolls[guildIndex].polls[pollIndex].poll.options[selectedOptionIndex].option + "***").catch(error => console.log("Send Error - " + error));
                            }
                            else
                            {
                                message.reply("there is no option for the number you have given. Use `!poll` to show the options for the current poll.").catch(error => console.log("Send Error - " + error));
                            }
                        }
                    }
                }
            }
            else
            {
                //Create Poll
                var parameters = args.toString().split("|")

                if(parameters.length < 3)
                {
                    message.reply("a poll requires a title and at least 2 options.").catch(error => console.log("Send Error - " + error));
                }
                else
                {
                    var title = parameters[0].toString();

                    if(title.length > 256)
                    {
                        title = title.splice(256).toString();
                        message.reply("the poll title is too long. Title has been shortened.").catch(error => console.log("Send Error - " + error));
                    }

                    parameters.shift();
                    var optionTitles = parameters;

                    var options = [];

                    for(var i = 0; i < optionTitles.length; i++)
                    {
                        options.push({option: optionTitles[i].toString(), users: []})
                    }

                    var pollObject = {title: title.toString(), options: options, owner: message.author.id}
                    var poll = {key: message.channel.id, poll: pollObject}

                    allPolls[guildIndex].polls.push(poll);

                    //Send Poll Details
                    var descriptionFields = [];

                    for(var i = 0; i < optionTitles.length; i++)
                    {
                        descriptionFields.push("```" + (i + 1) + ": " + optionTitles[i] + "```")
                    }

                    var descriptions = [""]
                    var descriptionIndex = -1;
                    var nextIndex = true;
                    for(var i = 0; i < descriptionFields.length; i++)
                    {
                        if(!nextIndex)
                        {
                            if((descriptions[descriptionIndex] + descriptionFields[i]).length > 2048)
                            {
                                nextIndex = true;
                                descriptions.push(descriptionFields[i]);
                            }
                            else
                                descriptions[descriptionIndex] = descriptions[descriptionIndex] + descriptionFields[i];
                        }
                        else
                        {
                            descriptionIndex += 1;
                            nextIndex = false;
                            descriptions[descriptionIndex] = descriptions[descriptionIndex] + descriptionFields[i];
                        }
                    }

                    for(var i = 0; i < descriptions.length; i++)
                    {
                        if(i > 0)
                            message.channel.send("", {embed: {description: descriptions[i], color: 9633792}}).catch(error => console.log("Send Error - " + error));
                        else
                            message.channel.send("***" + title + "***", {embed: {title: title.toString(), description: descriptions[i], color: 9633792}}).catch(error => console.log("Send Error - " + error));
                    }
                }
            } 
        }

        for(var i = 0; i < allPolls.length; i++)
        {
            if(allPolls[i].key == message.guild.id)
            {
                firebase.database().ref("serversettings/" + message.guild.id + "/polls").set(JSON.stringify(allPolls[i].polls));
            }
        }

        message.channel.stopTyping();
    }
}

module.exports = PollCommand;