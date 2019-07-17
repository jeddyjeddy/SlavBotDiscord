const command = require("discord.js-commando");
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs-extra');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}
var CommandCounter = require("../../index.js")

const Twitter = require("ts-twitter")
 
let twitter = new Twitter.Twitter(
  process.env.TWITTER_CONSUMER_KEY,
  process.env.TWITTER_CONSUMER_SECRET
);

class TweetCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "tweet",
            group: "imageshit",
            memberName: "tweet",
            description: "This command lets you generate a fake tweet by using anyone's twitter username. If a twitter user is not found, Slav Bot will make the tweet instead.",
            examples: ["`!tweet <twitter-username>|<tweet> (280 Characters Max)`", "`!tweet <tweet> (To Tweet As Slav Bot)`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)
        
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if(args.length > 0)
        {
            console.log("args are present");
            var username = ""
            var name = ""
            var imageURL = ""
            var verified = false
            var tweetContent = ""

            if(args.toString().indexOf("|") > -1)
            {
                var params = args.split("|")
                username = params[0]
                tweetContent = params[1]
            }
            else
            {
                tweetContent = args.toString()
            }

            if(tweetContent.length > 280)
            {
                message.channel.send("<@" + message.author.id + "> Max number of characters for a tweet is 280. Use `" + commandPrefix + "help tweet` for help.").catch(error => {console.log("Send Error - " + error); });
            }
            else
            {
                var promises = []
                if(username == "")
                {
                    name = "Slav Bot"
                    username = "slavbot"
                    imageURL = message.client.user.avatarURL
                    verified = true
                }
                else
                {
                    promises.push(twitter.getUser({"screen_name": username}).then((user) => {
                        name = user.name
                        imageURL = user.profile_image_url
                        verified = user.verified
                        username = user.screen_name
                        console.log("Fake Tweet For " + user.screen_name)
                    }).catch((error) => {
                        console.log("Twitter Error - " + error.message)
                    }))
                }

                Promise.all(promises).then(() => {
                    if(imageURL == "" || imageURL == null || imageURL == undefined)
                        imageURL = "twitteravatar.jpg"

                    const twitterName = name, twitterUsername = username, url = imageURL, verifiedUser = verified

                    if(twitterUsername != "")
                    {
                        message.channel.send("***generating tweet***").catch(error => {console.log("Send Error - " + error); });
                        Jimp.read("tweet.png").then(function (twitterImage) {
                            Jimp.read("blank.png").then(function (blankImage) {
                                Jimp.read(url).then(function (userImage) {
                                    Jimp.read("verified.png").then(function (verifiedImage) {
                                        Jimp.loadFont("twittername.fnt" ).then(function (font) {
                                            const file = "TempStorage/" + shortid.generate() + ".png";

                                            blankImage.resize(twitterImage.bitmap.width, twitterImage.bitmap.height + 300)
                                            userImage.cover(60, 60)
                                            blankImage.composite(userImage, 51, 40).composite(twitterImage, 0, 0).print(font, 125, 47, twitterName)
                                            //TESTING PHASE

                                            blankImage.write(file, function(error){ 
                                                if(error) { console.log(error); return;};
                                                message.channel.send("***" + twitterName + " Has Tweeted***", {
                                                            files: [file]
                                                }).then(function(){
                                                    
                                                    fs.remove(file, resultHandler);
                                                }).catch(function (err) {
                                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                                    console.log(err.message);
                                                    
                                                    fs.remove(file, resultHandler);
                                                });
                                            });
                                        });
                                    }).catch(function (err) {
                                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                        console.log(err.message); 
                                    });
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message); 
                                });
                            }).catch(function (err) {
                                console.log(err.message); 
                            });
                        }).catch(function (err) {
                            console.log(err.message); 
                        });
                    }
                    else
                    {
                        message.channel.send("Could Not Find Twitter User `@" + twitterUsername + "`. Use `" + commandPrefix + "help tweet` for help.").catch(error => {console.log("Send Error - " + error); });
                    }
                })
            }
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No text given. Use `" + commandPrefix + "help tweet` for help.").catch(error => {console.log("Send Error - " + error); });
        }
    }
}

module.exports = TweetCommand;
