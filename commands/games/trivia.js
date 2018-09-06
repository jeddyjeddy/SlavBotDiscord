const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const Trivia = require('trivia-api')
const trivia = new Trivia({ encoding: 'url3986' });

class TriviaCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "trivia",
            group: "games",
            memberName: "trivia",
            description: "Get a trivia question. You can assign a difficulty or category using the difficulty and category parameter. Easy questions are given by default.",
            examples: ["`!trivia`", "`!trivia <difficulty>`", "`!trivia easy/medium/hard` (3 Difficulties)", "`!trivia categories` (Get all categories)", "`!trivia <difficulty>|<category-id>`", "`!trivia easy|9`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        var difficulty = "easy";

        var options = null;

        if(args.length > 0)
        {
            if(args.toLowerCase() == "categories")
            {
                Promise.all([trivia.getCategories()]).then(results => {
                    var categories = results.trivia_categories;
                    var titles = []
                    var IDs = []
                    var messageText = "***ID - Category***";
    
                    for(var i = 0; i < categories.length; i++)
                    {
                        titles.push(categories[i].name);
                        IDs.push(categories[i].id)
                    }
    
                    for(var i = 0; i < titles.length; i++)
                    {
                        message = + "\n" + IDs[i] + " - " + titles[i]
                    }
    
                    message.channel.send(messageText).catch(error => console.log("Send Error - " + error))
                }).catch(error => console.log(error))
            }
            else
            {
                var splitArgs = args.split("|");
                var category = null;
    
                if(splitArgs.length > 1)
                {
                    if(!splitArgs[1].isNaN())
                    {
                        var ID = splitArgs[1]
                        var categories = trivia.getCategories();
                        for(var i = 0; i < categories.length; i++)
                        {
                            if(categories.id == ID)
                                category = ID;
                        }
                    }
                }
    
                if(splitArgs[0].toLowerCase() == "easy" || splitArgs[0].toLowerCase() == "medium" || splitArgs[0].toLowerCase() == "hard")
                {
                    difficulty = splitArgs[0].toLowerCase();
                }
    
                if(category == null)
                {
                    options = {
                        amount: 1,
                        difficulty: difficulty
                    };
                }
                else
                {
                    options = {
                        amount: 1,
                        difficulty: difficulty,
                        category: category
                    };
                }
    
                Promise.all([trivia.getQuestions(options)])
                .then(questions => message.channel.send(questions.results.toString()).catch(error => console.log("Send Error - " + error)))
                .catch(console.error);
            }
        }
        else
        {
            options = {
                amount: 1
            };

            Promise.all([trivia.getQuestions(options)])
            .then(questions => message.channel.send(questions.results.toString()).catch(error => console.log("Send Error - " + error)))
            .catch(error => console.log(error));
                
        }
    }
}

module.exports = TriviaCommand;
