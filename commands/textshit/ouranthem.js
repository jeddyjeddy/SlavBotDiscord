const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class OurAnthemCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "ouranthem",
            group: "textshit",
            memberName: "ouranthem",
            description: "The lyrics to ***OUR*** anthem.",
            examples: ["`!ouranthem`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        message.channel.send("Союз нерушимый республик свободных\nСплотила навеки Великая Русь.\nДа здравствует созданный волей народов\nЕдиный, могучий Советский Союз!\nСлавься, Отечество наше свободное,\nДружбы народов надёжный оплот!\nПартия Ленина - сила народная\nНас к торжеству коммунизма ведёт!\nSoiuz nerushimyj respublik svobodnykh\nSplotila naveki Velikaia Rus.\nDa zdravstvuet sozdannyj volej narodov\nEdinyj, moguchij Sovetskij Soiuz!\nSlavsia, Otechestvo nashe svobodnoe,\nDruzhby narodov nadiozhnyj oplot!\nPartiia Lenina - sila narodnaia\nNas k torzhestvu kommunizma vediot!\nСквозь грозы сияло нам солнце свободы,\nИ Ленин великий нам путь озарил,\nНа правое дело он поднял народы,\nНа труд и на подвиги нас вдохновил.\nСлавься, Отечество наше свободное,\nДружбы народов надёжный оплот!\nПартия Ленина - сила народная\nНас к торжеству коммунизма ведёт!\nSkvoz grozy siialo nam solntse svobody,\nI Lenin velikij nam put ozaril,\nNa pravoe delo on podnial narody,\nNa trud i na podvigi nas vdokhnovil.\nSlavsia, Otechestvo nashe svobodnoe,\nDruzhby narodov nadiozhnyj oplot!\nPartiia Lenina - sila narodnaia\nNas k torzhestvu kommunizma vediot!\nВ победе бессмертных идей коммунизма\nМы видим грядущее нашей страны\nИ Красному знамени славной Отчизны\nМы будем всегда беззаветно верны!\nСлавься, Отечество наше свободное,\nДружбы народов надёжный оплот!\nПартия Ленина - сила народная\nНас к торжеству коммунизма ведёт!\n\n\nV pobede bessmertnykh idej kommunizma\nMy vidim griadushchee nashej strany\nI Krasnomu znameni slavnoj Otchizny\nMy budem vsegda bezzavetno verny!\nSlavsia, Otechestvo nashe svobodnoe,\nDruzhby narodov nadiozhnyj oplot!\nPartiia Lenina - sila narodnaia\nNas k torzhestvu kommunizma vediot!", 
        {files: ["audio/ouranthem.mp3", "ussr.png"]}).catch(error => console.log("Send Error - " + error));
    }
}

module.exports = OurAnthemCommand;