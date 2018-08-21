const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class AnthemCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "anthem",
            group: "textshit",
            memberName: "anthem",
            description: "The lyrics to our motherland's anthem.",
            examples: ["`!anthem`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        message.channel.send("Rossia - sviashennaia nasha derzhava, \nRossia - lubimaia nasha strana! \nMoguchaia volia, velikaia slava - \nTvoio dostoianie na vse vremena! \n\n***CHORUS***: \nSlavsia, Otechestvo nashe svobodnoe, \nBratskikh narodov soiuz vekovoi, \nPredkami dannaia mudrost' narodnaia! \nSlavsia, strana! My gordimsia toboi! \n\nOt yuzhykh morei do poliarnogo kraia \nRaskinulis nashi lesa i polia. \nOdna ty na svete! Odna ty takaia - \nKhranimaia Bogom rodnaia zemlia! \n\n***CHORUS*** \n\nShirokii prostor dlia mechty i dlia zhizni \nGriadushie nam otkryvaiut goda. \nNam silu daiot nasha vernost otchizne. \nTak bylo, tak est' i tak budet vsegda! \n\n***CHORUS***", {files: ["anthem.mp3"]}).then(function(){
            message.channel.send(":flag_ru:").catch(error => console.log("Send Error - " + error));
        }).catch(error => console.log("Send Error - " + error));
    }
}

module.exports = AnthemCommand;