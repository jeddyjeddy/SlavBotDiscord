const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
const https = require('https');
var anon_id = null;

function httpGetAsync(theUrl, callback)
{
    https.get(theUrl, (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          callback(data);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
}

// callback for anonymous id -- for first time users
function tenorCallback_anonid(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    anon_id = response_objects["anon_id"];
}

var url = "https://api.tenor.com/v1/anonid?key=" + "ZLIZMBP5A30Z";

httpGetAsync(url,tenorCallback_anonid); 



class HugCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "hug",
            group: "textshit",
            memberName: "hug",
            description: "Hug yourself or another user.",
            examples: ["`!hug`", "`!hug @User`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        
        var search = ""

        if(args.length > 0)
        {
            search = args.toString().replace(/ /g, "-")
        }
        
        if(search != "")
        {
            var apikey = "ZLIZMBP5A30Z";
            var lmt = 50;
        
            // using default locale of en_US
            var search_url = "https://api.tenor.com/v1/search?tag=" + search + "&key=" +
                    apikey + "&limit=" + lmt + "&anon_id=" + anon_id;
        
            https.get(search_url, (resp) => {
                let data = '';
                
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    var response_objects = JSON.parse(responsetext);
                    var gifs = response_objects["results"];
                    var randomGif = Math.floor(Math.random() * gifs.length)
                    var url = gifs[randomGif]["media"][0]["gif"]["url"]
                    message.channel.send("<@" + message.author.id + "> Random GIF for ***" + args.toString() + "***", {
                        files: [url]
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                        console.log(err.message);
                    });
                });
                
                }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
            
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> Please add text to search.").catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
            });
        }
    }
}

module.exports = HugCommand;