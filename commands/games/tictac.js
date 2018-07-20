const command = require("discord.js-commando");
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}

function counterCheck(channel, id) { 
    for(var i = 0; i < sessions.length; i++)
    {
        if(sessions[i].key == channel.id && sessions[i].id == id)
        {
            if(sessions[i].started)
            {
                if(sessions[i].counter >= 4)
                {
                    channel.send("The game has ended.").catch(error => console.log("Send Error - " + error));
                    sessions.splice(i, 1);
                }
                else if (sessions[i].counter == 0)
                {
                    sessions[i].counter = sessions[i].counter + 1;
                    setTimeout(function(){counterCheck(channel, id)}, 60000);
                }
                else
                {
                    sessions[i].counter = sessions[i].counter + 1;
                    channel.send("No response from players. " + (5 - sessions[i].counter) + " min(s) until the game is ended if there is no response.").catch(error => console.log("Send Error - " + error));
                    setTimeout(function(){counterCheck(channel, id)}, 60000);
                }
            }
        }
    }
}

var removeGame = function(index,  channel)
{
    for(var i = 0; i < sessions.length; i++)
    {
        if(sessions[i].key == channel.id)
        {
            if(sessions[i].started)
            {
                channel.send("The game has ended.").catch(error => console.log("Send Error - " + error));
                sessions.splice(index, 1);
            }
        }
    }
}

var sessions = [{key: "Key", id: "", started: false, counter: 0, turn: false, owner: "", user: "", a1: 0, a2: 0, a3: 0, b1: 0, b2: 0, b3: 0, c1: 0, c2: 0, c3: 0}];

class TictacCommand extends command.Command
{
    constructor(client)
    {
        super(client, {
            name: "tictac",
            group: "games",
            memberName: "tictac",
            description: "Play Tic-Tac-Toe with another user.",
            examples: ["`!tictac @User` to send a game request.", "`!tictac accept` to accept a request.", "`!tictac decline` to decline a request.", "`!tictac end` to end an on-going game session.", "`!tictac <box-location>` to mark a box."]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        var currentPrefix= "!"
        if(message.guild != null)
        {
            currentPrefix = message.guild.commandPrefix
        }
        var sessionExists = false;
        for(var index = 0; index < sessions.length; index++)
        {
            if(sessions[index].key == message.channel.id)
            {
                sessionExists = true;
            }
        }

        if(sessionExists)
        {
            for(var i = 0; i < sessions.length; i++)
            {
                if(sessions[i].key == message.channel.id)
                {
                    if(!sessions[i].started && sessions[i].user == message.author.id)
                    {
                        if(args.toString().toLowerCase() == "accept")
                        {
                            sessions[i].started = true;
                            message.channel.send("A game of Tic-Tac-Toe has started! <@" + sessions[i].owner + "> vs <@" + sessions[i].user + ">. Use `" + commandPrefix + "tictac end` to end the game. <@" + sessions[i].owner + "> goes first. Use `" + commandPrefix + "tictac <row-column>` to place your mark. Example: `" + commandPrefix + "tictac a1`", {files: ["tictac.jpg"]}).catch(error => console.log("Send Error - " + error));
                            const currentID = sessions[i].id;
                            setTimeout(function(){const sessionID = currentID; counterCheck(message.channel, sessionID)}, 60000);
                        }
                        else if(args.toString().toLowerCase() == "decline")
                        {
                            message.channel.send("Request declined.").catch(error => console.log("Send Error - " + error));
                            sessions.splice(i, 1);
                        }
                        else
                        {
                            message.reply("incorrect response.  Please respond with either `" + commandPrefix + "tictac accept` to accept or `" + commandPrefix + "tictac decline` to decline.").catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else if(sessions[i].started)
                    {
                        if(message.author.id == sessions[i].owner || message.author.id == sessions[i].user)
                        {
                            if(args.toString().toLowerCase() == "end")
                            {
                                message.channel.send("<@" + message.author.id + "> has ended the game.").catch(error => console.log("Send Error - " + error));
                                sessions.splice(i, 1);
                            }
                            else
                            {
                                if(sessions[i].turn)
                                {
                                    if(message.author.id == sessions[i].user)
                                    {
                                        var played = true;
                                        if(args.length > 2 || args.length == 0)
                                        {
                                            message.reply("incorrect format. Use `" + commandPrefix + "tictac <row-column>` to place your mark. Example: `" + commandPrefix + "tictac a1`").catch(error => console.log("Send Error - " + error))
                                        }
                                        else
                                        {
                                            if(args.toString().toLowerCase() == "a1")
                                            {
                                                if(sessions[i].a1 == 0)
                                                {
                                                    sessions[i].a1 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "a2")
                                            {
                                                if(sessions[i].a2 == 0)
                                                {
                                                    sessions[i].a2 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "a3")
                                            {
                                                if(sessions[i].a3 == 0)
                                                {
                                                    sessions[i].a3 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "b1")
                                            {
                                                if(sessions[i].b1 == 0)
                                                {
                                                    sessions[i].b1 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "b2")
                                            {
                                                if(sessions[i].b2 == 0)
                                                {
                                                    sessions[i].b2 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "b3")
                                            {
                                                if(sessions[i].b3 == 0)
                                                {
                                                    sessions[i].b3 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "c1")
                                            {
                                                if(sessions[i].c1 == 0)
                                                {
                                                    sessions[i].c1 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "c2")
                                            {
                                                if(sessions[i].c2 == 0)
                                                {
                                                    sessions[i].c2 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "c3")
                                            {
                                                if(sessions[i].c3 == 0)
                                                {
                                                    sessions[i].c3 = 2;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else
                                            {
                                                played= false;
                                                message.reply("incorrect format. Use " + commandPrefix + "tictac <row-column>` to place your mark. Example: `" + commandPrefix + "tictac a1`").catch(error => console.log("Send Error - " + error))
                                            }
                                            if(played)
                                            {
                                                sessions[i].turn = !sessions[i].turn;
                                            }
                                        }
                                        sessions[i].counter = 0;
                                    }
                                    else
                                    {
                                        message.reply("it's <@" + sessions[i].user + ">'s turn.").catch(error => console.log("Send Error - " + error));
                                    }
                                }
                                else
                                {
                                    if(message.author.id == sessions[i].owner)
                                    {
                                        var played = true;
                                        if(args.length > 2 || args.length == 0)
                                        {
                                            message.reply("incorrect format. Use `" + commandPrefix + "tictac <row-column>` to place your mark. Example: `"+ commandPrefix + "tictac a1`").catch(error => console.log("Send Error - " + error))
                                        }
                                        else
                                        {
                                            if(args.toString().toLowerCase() == "a1")
                                            {
                                                if(sessions[i].a1 == 0)
                                                {
                                                    sessions[i].a1 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "a2")
                                            {
                                                if(sessions[i].a2 == 0)
                                                {
                                                    sessions[i].a2 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "a3")
                                            {
                                                if(sessions[i].a3 == 0)
                                                {
                                                    sessions[i].a3 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "b1")
                                            {
                                                if(sessions[i].b1 == 0)
                                                {
                                                    sessions[i].b1 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "b2")
                                            {
                                                if(sessions[i].b2 == 0)
                                                {
                                                    sessions[i].b2 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "b3")
                                            {
                                                if(sessions[i].b3 == 0)
                                                {
                                                    sessions[i].b3 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "c1")
                                            {
                                                if(sessions[i].c1 == 0)
                                                {
                                                    sessions[i].c1 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "c2")
                                            {
                                                if(sessions[i].c2 == 0)
                                                {
                                                    sessions[i].c2 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else if(args.toString().toLowerCase() == "c3")
                                            {
                                                if(sessions[i].c3 == 0)
                                                {
                                                    sessions[i].c3 = 1;
                                                }
                                                else
                                                {
                                                    message.reply("that box is already occupied.").catch(error => console.log("Send Error - " + error));
                                                    played = false;
                                                }
                                            }
                                            else
                                            {
                                                played = false;
                                                message.reply("incorrect format. Use `" + commandPrefix + "tictac <row-column>` to place your mark. Example: `" + commandPrefix + "tictac a1`").catch(error => console.log("Send Error - " + error))
                                            }
                                            if(played)
                                            {
                                                sessions[i].turn = !sessions[i].turn;
                                            }
                                        }
                                        sessions[i].counter = 0;
                                    }
                                    else
                                    {
                                        message.reply("it's <@" + sessions[i].owner + ">'s turn.").catch(error => console.log("Send Error - " + error));
                                    }
                                }
                                var sessionCopy = sessions[i];
                                var indexCopy = i;
                                Jimp.read("x.png").then(function (xImage) {
                                    xImage.resize(90, 90);
                                    Jimp.read("o.png").then(function (oImage) {
                                        oImage.resize(90, 90);
                                        Jimp.read("line.jpg").then(function (lineImage) {
                                                Jimp.read("tictac.jpg").then(function (tictacImage) {
                                                    console.log("creating board");
                                                    //A
                                                    if(sessionCopy.a1 == 1)
                                                    {
                                                        var x = 120, y = 60;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.a1 == 2)
                                                    {
                                                        var x = 120, y = 60;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
        
                                                    if(sessionCopy.a2 == 1)
                                                    {
                                                        var x = 245, y = 60;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.a2 == 2)
                                                    {
                                                        var x = 245, y = 60;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
        
                                                    if(sessionCopy.a3 == 1)
                                                    {
                                                        var x = 380, y = 60;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.a3 == 2)
                                                    {
                                                        var x = 380, y = 60;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
        
                                                    //B
                                                    if(sessionCopy.b1 == 1)
                                                    {
                                                        var x = 120, y = 165;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.b1 == 2)
                                                    {
                                                        var x = 120, y = 165;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
        
                                                    if(sessionCopy.b2 == 1)
                                                    {
                                                        var x = 245, y = 165;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.b2 == 2)
                                                    {
                                                        var x = 245, y = 165;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
        
                                                    if(sessionCopy.b3 == 1)
                                                    {
                                                        var x = 380, y = 165;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.b3 == 2)
                                                    {
                                                        var x = 380, y = 165;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
        
                                                    //C
                                                    if(sessionCopy.c1 == 1)
                                                    {
                                                        var x = 120, y = 275;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.c1 == 2)
                                                    {
                                                        var x = 120, y = 275;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
        
                                                    if(sessionCopy.c2 == 1)
                                                    {
                                                        var x = 245, y = 275;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.c2 == 2)
                                                    {
                                                        var x = 245, y = 275;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
        
                                                    if(sessionCopy.c3 == 1)
                                                    {
                                                        var x = 380, y = 275;
                                                        tictacImage.composite(xImage, x, y);
                                                    }
                                                    else if (sessionCopy.c3 == 2)
                                                    {
                                                        var x = 380, y = 275;
                                                        tictacImage.composite(oImage, x, y);
                                                    }
                                                    var winner = 0;
                                                    var draw = false;
                                                    var lineType = 0;

                                                    //X
                                                    if(sessionCopy.a1 == 1)
                                                    {
                                                        if(sessionCopy.a2 == 1)
                                                        {
                                                            if(sessionCopy.a3 == 1)
                                                            {
                                                                winner = 1;
                                                                lineType = 0;
                                                            }
                                                        }
                                                        if(sessionCopy.b1 == 1)
                                                        {
                                                            if(sessionCopy.c1 == 1)
                                                            {
                                                                winner = 1;
                                                                lineType = 1;
                                                            }
                                                        }
                                                        if(sessionCopy.b2 == 1)
                                                        {
                                                            if(sessionCopy.c3 == 1)
                                                            {
                                                                winner = 1;
                                                                lineType = 2;
                                                            }
                                                        }
                                                    }
                                                    if(sessionCopy.a2 == 1)
                                                    {
                                                        if(sessionCopy.b2 == 1)
                                                        {
                                                            if(sessionCopy.c2 == 1)
                                                            {
                                                                winner = 1;
                                                                lineType = 3;
                                                            }
                                                        }
                                                    }
                                                    if(sessionCopy.a3 == 1)
                                                    {
                                                        if(sessionCopy.b3 == 1)
                                                        {
                                                            if(sessionCopy.c3 == 1)
                                                            {
                                                                winner = 1;
                                                                lineType = 4;
                                                            }
                                                        }
                                                        if(sessionCopy.b2 == 1)
                                                        {
                                                            if(sessionCopy.c1 == 1)
                                                            {
                                                                winner = 1;
                                                                lineType = 5;
                                                            }
                                                        }
                                                    }
                                                    if(sessionCopy.b1 == 1)
                                                    {
                                                        if(sessionCopy.b2 == 1)
                                                        {
                                                            if(sessionCopy.b3 == 1)
                                                            {
                                                                winner = 1;
                                                                lineType = 6;
                                                            }
                                                        }
                                                    }
                                                    if(sessionCopy.c1 == 1)
                                                    {
                                                        if(sessionCopy.c2 == 1)
                                                        {
                                                            if(sessionCopy.c3 == 1)
                                                            {
                                                                winner = 1;
                                                                lineType = 7;
                                                            }
                                                        }
                                                    }
                                                
                                                    //O
                                                    if(sessionCopy.a1 == 2)
                                                    {
                                                        if(sessionCopy.a2 == 2)
                                                        {
                                                            if(sessionCopy.a3 == 2)
                                                            {
                                                                winner = 2;
                                                                lineType = 0;
                                                            }
                                                        }
                                                        if(sessionCopy.b1 == 2)
                                                        {
                                                            if(sessionCopy.c1 == 2)
                                                            {
                                                                winner = 2;
                                                                lineType = 1;
                                                            }
                                                        }
                                                        if(sessionCopy.b2 == 2)
                                                        {
                                                            if(sessionCopy.c3 == 2)
                                                            {
                                                                winner = 2;
                                                                lineType = 2;
                                                            }
                                                        }
                                                    }
                                                    if(sessionCopy.a2 == 2)
                                                    {
                                                        if(sessionCopy.b2 == 2)
                                                        {
                                                            if(sessionCopy.c2 == 2)
                                                            {
                                                                winner = 2;
                                                                lineType = 3;
                                                            }
                                                        }
                                                    }
                                                    if(sessionCopy.a3 == 2)
                                                    {
                                                        if(sessionCopy.b3 == 2)
                                                        {
                                                            if(sessionCopy.c3 == 2)
                                                            {
                                                                winner = 2;
                                                                lineType = 4;
                                                            }
                                                        }
                                                        if(sessionCopy.b2 == 2)
                                                        {
                                                            if(sessionCopy.c1 == 2)
                                                            {
                                                                winner = 2;
                                                                lineType = 5;
                                                            }
                                                        }
                                                    }
                                                    if(sessionCopy.b1 == 2)
                                                    {
                                                        if(sessionCopy.b2 == 2)
                                                        {
                                                            if(sessionCopy.b3 == 2)
                                                            {
                                                                winner = 2;
                                                                lineType = 6;
                                                            }
                                                        }
                                                    }
                                                    if(sessionCopy.c1 == 2)
                                                    {
                                                        if(sessionCopy.c2 == 2)
                                                        {
                                                            if(sessionCopy.c3 == 2)
                                                            {
                                                                winner = 2;
                                                                lineType = 7;
                                                            }
                                                        }
                                                    }                                                    

                                                    if(winner == 0)
                                                    {
                                                        var spaces = [];

                                                        if(sessionCopy.a1 == 0)
                                                        {
                                                            spaces.push("a1");
                                                        }
                                                        if(sessionCopy.a2 == 0)
                                                        {
                                                            spaces.push("a2");
                                                        }
                                                        if(sessionCopy.a3 == 0)
                                                        {
                                                            spaces.push("a3");
                                                        }

                                                        if(sessionCopy.b1 == 0)
                                                        {
                                                            spaces.push("b1");
                                                        }
                                                        if(sessionCopy.b2 == 0)
                                                        {
                                                            spaces.push("b2");
                                                        }
                                                        if(sessionCopy.b3 == 0)
                                                        {
                                                            spaces.push("b3");
                                                        }
                                                        
                                                        if(sessionCopy.c1 == 0)
                                                        {
                                                            spaces.push("c1");
                                                        }
                                                        if(sessionCopy.c2 == 0)
                                                        {
                                                            spaces.push("c2");
                                                        }
                                                        if(sessionCopy.c3 == 0)
                                                        {
                                                            spaces.push("c3");
                                                        }

                                                        if(spaces.length == 1)
                                                        {
                                                            draw = true;
                                                            if(!sessionCopy.turn)
                                                            {
                                                                //X Draw Check
                                                                if(spaces[0] == "a1")
                                                                {
                                                                    if(sessionCopy.a2 == 1)
                                                                    {
                                                                        if(sessionCopy.a3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b1 == 1)
                                                                    {
                                                                        if(sessionCopy.c1 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 1)
                                                                    {
                                                                        if(sessionCopy.c3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "a2")
                                                                {
                                                                    if(sessionCopy.b2 == 1)
                                                                    {
                                                                        if(sessionCopy.c2 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    else if(sessionCopy.a1 == 1)
                                                                    {
                                                                        if(sessionCopy.a3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "a3")
                                                                {
                                                                    if(sessionCopy.a2 == 1)
                                                                    {
                                                                        if(sessionCopy.a1 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b3 == 1)
                                                                    {
                                                                        if(sessionCopy.c3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 1)
                                                                    {
                                                                        if(sessionCopy.c1 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "b1")
                                                                {
                                                                    if(sessionCopy.c1 == 1)
                                                                    {
                                                                        if(sessionCopy.a1 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                   
                                                                    if(sessionCopy.b2 == 1)
                                                                    {
                                                                        if(sessionCopy.b3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "b2")
                                                                {
                                                                    if(sessionCopy.c1 == 1)
                                                                    {
                                                                        if(sessionCopy.a3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }

                                                                    if(sessionCopy.a1 == 1)
                                                                    {
                                                                        if(sessionCopy.c3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.a2 == 1)
                                                                    {
                                                                        if(sessionCopy.c2 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b1 == 1)
                                                                    {
                                                                        if(sessionCopy.b3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "b3")
                                                                {
                                                                    if(sessionCopy.a3 == 1)
                                                                    {
                                                                        if(sessionCopy.c3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                   
                                                                    if(sessionCopy.b2 == 1)
                                                                    {
                                                                        if(sessionCopy.b1 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "c1")
                                                                {
                                                                    if(sessionCopy.a1 == 1)
                                                                    {
                                                                        if(sessionCopy.b1 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.c2 == 1)
                                                                    {
                                                                        if(sessionCopy.c3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 1)
                                                                    {
                                                                        if(sessionCopy.a3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "c2")
                                                                {
                                                                    if(sessionCopy.c1 == 1)
                                                                    {
                                                                        if(sessionCopy.c3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 1)
                                                                    {
                                                                        if(sessionCopy.a2 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "c3")
                                                                {
                                                                    if(sessionCopy.a3 == 1)
                                                                    {
                                                                        if(sessionCopy.b3 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.c2 == 1)
                                                                    {
                                                                        if(sessionCopy.c1 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 1)
                                                                    {
                                                                        if(sessionCopy.a1 == 1)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            else
                                                            {
                                                                if(spaces[0] == "a1")
                                                                {
                                                                    if(sessionCopy.a2 == 2)
                                                                    {
                                                                        if(sessionCopy.a3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b1 == 2)
                                                                    {
                                                                        if(sessionCopy.c1 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 2)
                                                                    {
                                                                        if(sessionCopy.c3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "a2")
                                                                {
                                                                    if(sessionCopy.b2 == 2)
                                                                    {
                                                                        if(sessionCopy.c2 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    else if(sessionCopy.a1 == 2)
                                                                    {
                                                                        if(sessionCopy.a3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "a3")
                                                                {
                                                                    if(sessionCopy.a2 == 2)
                                                                    {
                                                                        if(sessionCopy.a1 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b3 == 2)
                                                                    {
                                                                        if(sessionCopy.c3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 2)
                                                                    {
                                                                        if(sessionCopy.c1 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "b1")
                                                                {
                                                                    if(sessionCopy.c1 == 2)
                                                                    {
                                                                        if(sessionCopy.a1 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                   
                                                                    if(sessionCopy.b2 == 2)
                                                                    {
                                                                        if(sessionCopy.b3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "b2")
                                                                {
                                                                    if(sessionCopy.c1 == 2)
                                                                    {
                                                                        if(sessionCopy.a3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }

                                                                    if(sessionCopy.a1 == 2)
                                                                    {
                                                                        if(sessionCopy.c3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.a2 == 2)
                                                                    {
                                                                        if(sessionCopy.c2 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b1 == 2)
                                                                    {
                                                                        if(sessionCopy.b3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "b3")
                                                                {
                                                                    if(sessionCopy.a3 == 2)
                                                                    {
                                                                        if(sessionCopy.c3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                   
                                                                    if(sessionCopy.b2 == 2)
                                                                    {
                                                                        if(sessionCopy.b1 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "c1")
                                                                {
                                                                    if(sessionCopy.a1 == 2)
                                                                    {
                                                                        if(sessionCopy.b1 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.c2 == 2)
                                                                    {
                                                                        if(sessionCopy.c3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 2)
                                                                    {
                                                                        if(sessionCopy.a3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "c2")
                                                                {
                                                                    if(sessionCopy.c1 == 2)
                                                                    {
                                                                        if(sessionCopy.c3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 2)
                                                                    {
                                                                        if(sessionCopy.a2 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                                else if(spaces[0] == "c3")
                                                                {
                                                                    if(sessionCopy.a3 == 2)
                                                                    {
                                                                        if(sessionCopy.b3 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.c2 == 2)
                                                                    {
                                                                        if(sessionCopy.c1 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                    if(sessionCopy.b2 == 2)
                                                                    {
                                                                        if(sessionCopy.a1 == 2)
                                                                        {
                                                                            draw = false;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }

                                                        if((sessionCopy.a1 != 0 && sessionCopy.a2 != 0 && sessionCopy.a3 != 0
                                                        && sessionCopy.b1 != 0 && sessionCopy.b2 != 0 && sessionCopy.b3 != 0
                                                        && sessionCopy.c1 != 0 && sessionCopy.c2 != 0 && sessionCopy.c3 != 0) || draw)
                                                        {
                                                            message.channel.send("It's a draw!").catch(error => console.log("Send Error - " + error));
                                                            removeGame(indexCopy, message.channel);
                                                        }
                                                        else
                                                        {
                                                            if(sessionCopy.turn)
                                                            {
                                                                message.channel.send("<@" + sessionCopy.user + "> it's your turn now.").catch(error => console.log("Send Error - " + error));
                                                            }
                                                            else
                                                            {
                                                                message.channel.send("<@" + sessionCopy.owner + "> it's your turn now.").catch(error => console.log("Send Error - " + error));
                                                            }
                                                        }
                                                    }
                                                    else
                                                    {
                                                        if(lineType == 0)
                                                        {
                                                            var x = 100, y = 102.5;
                                                            tictacImage.composite(lineImage, x, y);
                                                        }
                                                        else if(lineType == 1)
                                                        {
                                                            var x = 165, y = 70;
                                                            lineImage.rotate(90);
                                                            lineImage.resize(lineImage.bitmap.width, 300);
                                                            tictacImage.composite(lineImage, x, y);
                                                        }
                                                        else if(lineType == 2)
                                                        {
                                                            var x = 120, y = 70;
                                                            lineImage.rotate(40);
                                                            tictacImage.composite(lineImage, x, y);
                                                        }
                                                        else if(lineType == 3)
                                                        {
                                                            var x = 288.5, y = 70;
                                                            lineImage.rotate(90);
                                                            lineImage.resize(lineImage.bitmap.width, 300);
                                                            tictacImage.composite(lineImage, x, y);
                                                        }
                                                        else if(lineType == 4)
                                                        {
                                                            var x = 420, y = 70;
                                                            lineImage.rotate(90);
                                                            lineImage.resize(lineImage.bitmap.width, 300);
                                                            tictacImage.composite(lineImage, x, y);
                                                        }
                                                        else if(lineType == 5)
                                                        {
                                                            var x = 145, y = 75;
                                                            lineImage.rotate(140);
                                                            tictacImage.composite(lineImage, x, y);
                                                        }
                                                        else if(lineType == 6)
                                                        {
                                                            var x = 100, y = 210;
                                                            tictacImage.composite(lineImage, x, y);
                                                        }
                                                        else if(lineType == 7)
                                                        {
                                                            var x = 100, y = 320;
                                                            tictacImage.composite(lineImage, x, y); 
                                                        }


                                                        if(winner == 1)
                                                        {
                                                            message.channel.send("<@" + sessionCopy.owner + "> has won the game!").catch(error => console.log("Send Error - " + error));
                                                        }
                                                        else
                                                        {
                                                            message.channel.send("<@" + sessionCopy.user + "> has won the game!").catch(error => console.log("Send Error - " + error));
                                                        }
                                                        removeGame(indexCopy, message.channel);
                                                    }
                                                    var file = shortid.generate() + ".png"
                                                    tictacImage.write(file, function(error){
                                                        if(error) throw error;
                                                        message.channel.send("", {
                                                            files: [file]
                                                        }).then(function(){
                                                            setTimeout(function(){
                                                                fs.unlink(file, resultHandler);
                                                                console.log("Deleted " + file);
                                                            }, 10000);
                                                        }).catch(function (err) {
                                                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                            console.log(err.message);
                                                            setTimeout(function(){
                                                                fs.unlink(file, resultHandler);
                                                                console.log("Deleted " + file);
                                                            }, 10000);
                                                        });
                                                });
                                            }).catch(function (err) {
                                                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                console.log(err.message);
                                            });
                                        }).catch(function (err) {
                                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                            console.log(err.message);
                                        });
                                    }).catch(function (err) {
                                        message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                        console.log(err.message);
                                    });
                                }).catch(function (err) {
                                    message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                    console.log(err.message);
                                });
                            }
                        }
                        else
                        {
                            message.channel.send("A game of Tic-Tac-Toe between <@" + sessions.owner + "> and <@" + sessions.user + "> is still going on.").catch(error => console.log("Send Error - " + error));
                        }
                    }
                    else
                    {
                        message.reply("a request for a game has already been made. Please wait until that game ends or the request expires.").catch(error => console.log("Send Error - " + error));
                    }
                }
            }
        }
        else
        {
            var otherUser = false;
            var userID = "";
    
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
            
            if(otherUser && userID != message.author.id && userID != message.client.user.id)
            {
                console.log(userID);
                var gameID = shortid.generate();
                message.channel.send("<@" + message.author.id + "> has requested <@" + userID + "> to play a game of Tic-Tac-Toe. Please respond with either `" + commandPrefix + "tictac accept` to accept or `" + commandPrefix + "tictac decline` to decline. This request will last for 30 seconds.").catch(error => console.log("Send Error - " + error));
                sessions.push({
                    key: message.channel.id,
                    id: gameID,
                    started: false, 
                    counter: 0,
                    turn: false,
                    owner: message.author.id, 
                    user: userID, 
                    a1: 0,
                    a2: 0,
                    a3: 0, 
                    b1: 0, 
                    b2: 0, 
                    b3: 0, 
                    c1: 0, 
                    c2: 0, 
                    c3: 0
                });

                setTimeout(function(){
                    const checkID = gameID;
                    for(var i = 0; i < sessions.length; i++)
                    {
                        if(sessions[i].key == message.channel.id && sessions[i].id == checkID)
                        {
                            if(!sessions[i].started)
                            {
                                message.channel.send("The request has timed out.").catch(error => console.log("Send Error - " + error));
                                sessions.splice(i, 1);
                            }
                        }
                    }
                }, 30000);
            }
            else
            {
                message.reply("please tag another user after the command to create a game session.").catch(error => console.log("Send Error - " + error));
                message.channel.stopTyping();
                return;
            }
        }
        message.channel.stopTyping();
    }
}

module.exports = TictacCommand;
