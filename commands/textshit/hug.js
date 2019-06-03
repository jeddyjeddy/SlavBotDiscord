const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
var gifs = null, gifsLonely = null;
const https = require('https');

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

// callback for the top 8 GIFs of search
function tenorCallback_search(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    gifs = response_objects["results"];

    console.log("GIFs Loaded")
    return;
}

function tenorCallback_search2(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    gifsLonely = response_objects["results"];

    console.log("GIFs Loaded")
    return;
}

// function to call the trending and category endpoints
function grab_data(anon_id)
{
    // set the apikey and limit
    var apikey = process.env.TENOR_API;
    console.log("TENOR API - " + apikey)
    var lmt = 50;

    // test search term
    var search_term = "anime-hug";

    // using default locale of en_US
    var search_url = "https://api.tenor.com/v1/search?tag=" + search_term + "&key=" +
            apikey + "&limit=" + lmt + "&anon_id=" + anon_id;
            

    httpGetAsync(search_url,tenorCallback_search);

    var search_term2 = "lonely-anime-hug";

    // using default locale of en_US
    var search_url2 = "https://api.tenor.com/v1/search?tag=" + search_term2 + "&key=" +
            apikey + "&limit=" + lmt + "&anon_id=" + anon_id;

    httpGetAsync(search_url2,tenorCallback_search2);    

    // data will be loaded by each call's callback
    return;
}


// callback for anonymous id -- for first time users
function tenorCallback_anonid(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    anon_id = response_objects["anon_id"];

    // pass on to grab_data
    grab_data(anon_id);
}

var url = "https://api.tenor.com/v1/anonid?key=" + process.env.TENOR_API;

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
        
        if(otherUser && userID != message.author.id)
        {
            if(gifs != null)
            {
                var randomGif = Math.floor(Math.random() * gifs.length)
                var url = gifs[randomGif]["media"][0]["gif"]["url"]
                message.channel.send("<@" + message.author.id + "> ***hugged*** <@" + userID + ">", {
                    files: [url]
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                    console.log(err.message);
                });
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> ***gave*** <@" + userID + "> ***a hug.***").catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                    console.log(err.message);
                });
                httpGetAsync(url,tenorCallback_anonid); 
            }
        }
        else
        {
            if(gifsLonely != null)
            {
                var randomGif = Math.floor(Math.random() * gifsLonely.length)
                var url = gifsLonely[randomGif]["media"][0]["gif"]["url"]
                message.channel.send("<@" + message.author.id + "> ***hugged themselves***", {
                    files: [url]
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                    console.log(err.message);
                });
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> ***hugged themselves***").catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                    console.log(err.message);
                });
                httpGetAsync(url,tenorCallback_anonid); 
            }
        }
    }
}

module.exports = HugCommand;