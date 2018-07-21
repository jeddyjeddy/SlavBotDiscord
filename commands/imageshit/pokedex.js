const command = require("discord.js-commando");
const pokemonGif = require('pokemon-gif');
var CommandCounter = require("../../index.js")

class PokedexCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "pokedex",
            group: "imageshit",
            memberName: "pokedex",
            description: "Get a GIF of a Pokemon from the Pokedex by a Pokemon's name, Pokedex number (1-721) or using *random*.",
            examples: ["`!pokedex <pokemon-name>`", "`!pokedex <pokedex-number>`", "`!pokedex random`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter(message.author.id)
        var url = "";
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }
        if(args.length > 0)
        {
            if(args.toString() == "random")
            {
                url = pokemonGif(Math.floor(Math.random() * 721) + 1);
            }
            else if (!isNaN(args))
            {
                if(parseInt(args) >= 1 && parseInt(args) <= 721)
                    url = pokemonGif(parseInt(args));
                else
                {
                    message.reply("use a pokedex number ranging from 1-721").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
            }
            else
            {
                url = pokemonGif(args.toString().toLowerCase());
                if(url.indexOf("Invalid") > -1)
                {
                    message.reply(url).catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }
            }
        }
        else
        {
            message.reply("please fill the parameters for the command. Use `" + commandPrefix + "help pokedex` for help.").catch(error => console.log("Send Error - " + error));
            message.channel.stopTyping();
            return;
        }

        console.log(url);

        console.log("got pokemon");

        message.channel.send(url.replace("http://www.pokestadium.com/sprites/xy/", ""), {
            files: [url]
        }).then(function(){
            message.channel.stopTyping();
        }).catch(function (err) {
            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
            console.log(err.message);
            message.channel.stopTyping();
        });
        console.log("Message Sent"); 
    }
}

module.exports = PokedexCommand;
