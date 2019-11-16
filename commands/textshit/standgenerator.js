const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const {uniqueNamesGenerator} = require('unique-names-generator');
const ranks = ["A", "B", "C", "D", "E"]
const responses = ["NANI?!", "STANDO POWA", "MUDA MUDA MUDA MUDA", "OH MY GOD", "OOOOH SHEEEET", "Yare Yare Daze...", "WHAT DID YOU SAY ABOUT MY HAIR?", "THIS, THIS IS THE TASTE OF A LIAR !", "ARRIVEDERCI", "GERMAN MEDICINE IS THE GREATEST IN THE WORLD!"]

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

class StandGeneratorCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "standgenerator",
            group: "textshit",
            memberName: "standgenerator",
            description: "Generate a stand for yourself or another user. You can also battle another user with randomly generated stands.",
            examples: ["`!standgenerator`", "`!standgenerator @User`", "!standgenerator battle @User"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        var otherUser = false;
        var userID = "";
        var battle = false;

        if(args.length > 0)
        {
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

            if(args.toLowerCase().startsWith("battle "))
            {
                battle = true;
                if(userID == message.author.id)
                {
                    message.channel.send("<@" + message.author.id + "> You must tag another user for a stand battle.").catch(error => console.log("Send Error - " + error));
                    return;
                }
            }
        }
        
        if(!otherUser)
        {
            userID = message.author.id;
        }

        if(battle)
        {
            var selfAbilities = []

            for(var i = 0; i < 6; i++)
            {
                selfAbilities.push(ranks[Math.floor(Math.random() * ranks.length)])
            }

            var opponentAbilities = []

            for(var i = 0; i < 6; i++)
            {
                opponentAbilities.push(ranks[Math.floor(Math.random() * ranks.length)])
            }

            var selfPoints = 0, opponentPoints = 0;

            for(var i = 0; i < selfAbilities.length; i++)
            {
                if(selfAbilities[i] == "A")
                {
                    selfPoints += 5;
                }
                else if(selfAbilities[i] == "B")
                {
                    selfPoints += 4;
                }
                else if(selfAbilities[i] == "C")
                {
                    selfPoints += 3;
                }
                else if(selfAbilities[i] == "D")
                {
                    selfPoints += 2;
                }
                else if(selfAbilities[i] == "E")
                {
                    selfPoints += 1;
                }
            }

            for(var i = 0; i < opponentAbilities.length; i++)
            {
                if(opponentAbilities[i] == "A")
                {
                    opponentPoints += 5;
                }
                else if(opponentAbilities[i] == "B")
                {
                    opponentPoints += 4;
                }
                else if(opponentAbilities[i] == "C")
                {
                    opponentPoints += 3;
                }
                else if(opponentAbilities[i] == "D")
                {
                    opponentPoints += 2;
                }
                else if(opponentAbilities[i] == "E")
                {
                    opponentPoints += 1;
                }
            }

            var result = ""

            if(selfPoints > opponentPoints)
            {
                result = "***<@" + message.author.id + "> has defeated <@" + userID + "> !!!***"
            }
            else if (selfPoints < opponentPoints)
            {
                result = "***<@" + userID + "> has defeated <@" + message.author.id + "> !!!***"
            }
            else
            {
                result = "***The battle has resulted in a tie!!!***"
            }

            const standName = uniqueNamesGenerator({dictionaries: [adjectives, colors, animals], length: 3, separator: " "})
            const enemyStandName = uniqueNamesGenerator({dictionaries: [adjectives, colors, animals], length: 3, separator: " "})
            var standTextSelf = "***『Stand User』<@" + message.author.id + ">***\n\n***『Stand Name』" + toTitleCase(standName) 
            + "***\n\n*Power - " + selfAbilities[0]
            + "*\n\n*Speed - " + selfAbilities[1] + "*\n\n*Range - " + selfAbilities[2] + "*\n\n"
            + "*Durability - " + selfAbilities[3] + "*\n\n*Precision - " 
            + selfAbilities[4] + "*\n\n*Potential - " 
            + selfAbilities[5] + "*"
            
            var standTextOpponent = "***『Stand User』<@" + userID + ">***\n\n***『Stand Name』"
             + toTitleCase(enemyStandName) + "***\n\n*Power - " + opponentAbilities[0]
            + "*\n\n*Speed - " + opponentAbilities[1] + "*\n\n*Range - " + opponentAbilities[2] + "*\n\n"
            + "*Durability - " + opponentAbilities[3] + "*\n\n*Precision - " + opponentAbilities[4] + "*\n\n*Potential - " 
            + opponentAbilities[5] + "*"
    
            message.channel.send("*** <@" + message.author.id + "> vs <@" + userID + ">***\n\n\n").then(() => {
                message.channel.send(standTextSelf).then(() => {
                    message.channel.send(standTextOpponent).then(() => {
                        message.channel.send(result, {files: ["jojo.gif"]}).then(() => {
                            message.channel.send("***" + responses[Math.floor(Math.random() * responses.length)] + "***").catch(error => console.log("Send Error - " + error));
                        }).catch(error => console.log("Send Error - " + error));
                    }).catch(error => console.log("Send Error - " + error));
                }).catch(error => console.log("Send Error - " + error));
            }).catch(error => console.log("Send Error - " + error));
        }
        else
        {
            const standName = uniqueNamesGenerator({dictionaries: [adjectives, colors, animals], length: 3, separator: " "})
            var standText = "***『Stand User』<@" + userID + ">***\n\n***『Stand Name』" + toTitleCase(standName) + "***\n\n*Power - " + ranks[Math.floor(Math.random() * ranks.length)]
            + "*\n\n*Speed - " + ranks[Math.floor(Math.random() * ranks.length)] + "*\n\n*Range - " + ranks[Math.floor(Math.random() * ranks.length)] + "*\n\n"
            + "*Durability - " + ranks[Math.floor(Math.random() * ranks.length)] + "*\n\n*Precision - " + ranks[Math.floor(Math.random() * ranks.length)] + "*\n\n*Potential - " + ranks[Math.floor(Math.random() * ranks.length)] + "*"
    
            message.channel.send(standText, {files: ["jojo.gif"]}).then(() => {message.channel.send("***" + responses[Math.floor(Math.random() * responses.length)] + "***").catch(error => console.log("Send Error - " + error));}).catch(error => console.log("Send Error - " + error));
        }
    }
}

module.exports = StandGeneratorCommand;