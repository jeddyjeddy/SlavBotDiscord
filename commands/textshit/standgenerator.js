const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const uniqueNamesGenerator = require('unique-names-generator');
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
            description: "Generate a stand for yourself or another user.",
            examples: ["`!standgenerator`", "`!standgenerator @User`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        var otherUser = false;
        var userID = "";

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
        }
        
        if(!otherUser)
        {
            userID = message.author.id;
        }


        var standText = "***『Stand User』<@" + userID + ">***\n\n***『Stand Name』" + toTitleCase(uniqueNamesGenerator.generate(' ')) + "***\n\n*Power - " + ranks[Math.floor(Math.random() * ranks.length)]
        + "*\n\n*Speed - " + ranks[Math.floor(Math.random() * ranks.length)] + "*\n\n*Range - " + ranks[Math.floor(Math.random() * ranks.length)] + "*\n\n"
        + "*Durability - " + ranks[Math.floor(Math.random() * ranks.length)] + "*\n\n*Precision - " + ranks[Math.floor(Math.random() * ranks.length)] + "*\n\n*Potential - " + ranks[Math.floor(Math.random() * ranks.length)] + "*"

        message.channel.send(standText, {files: ["jojo.gif"]}).then(() => {message.channel.send("***" + responses[Math.floor(Math.random() * responses.length) + "***"]).catch(error => console.log("Send Error - " + error));}).catch(error => console.log("Send Error - " + error));
    }
}

module.exports = StandGeneratorCommand;