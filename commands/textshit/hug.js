const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")
var gifs = null;

function httpGetAsync(theUrl, callback)
{
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
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


// function to call the trending and category endpoints
function grab_data(anon_id)
{
    // set the apikey and limit
    var apikey = "ZLIZMBP5A30Z";
    var lmt = 50;

    // test search term
    var search_term = "anime-hug";

    // using default locale of en_US
    var search_url = "https://api.tenor.com/v1/search?tag=" + search_term + "&key=" +
            apikey + "&limit=" + lmt + "&anon_id=" + anon_id;

    httpGetAsync(search_url,tenorCallback_search);

    // data will be loaded by each call's callback
    return;
}


// callback for anonymous id -- for first time users
function tenorCallback_anonid(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    anon_id = response_objects["anon_id"];

    user_anon_id = anon_id;

    // pass on to grab_data
    grab_data(anon_id);
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
            }
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> Tag another user to hug.").catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
            });
        }
    }
}

module.exports = HugCommand;