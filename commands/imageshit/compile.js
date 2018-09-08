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

class CompileCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "compile",
            group: "imageshit",
            memberName: "compile",
            description: "Takes the last 4 images uploaded and compiles them into a 4 panel image.",
            examples: ["`!compile`"]
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
        message.channel.fetchMessages({ around: message.id })
        .then(messages => {
            var messageID = "";
            var messageID2 = "";
            var messageID3 = "";
            var messageID4 = "";
            var url1, url2, url3, url4;
            var arrayMessages = messages.array();
            for(var i = 0; i < arrayMessages.length; i++)
            {
                if(arrayMessages[i].attachments.first() != undefined)
                {
                    for(var i2 = arrayMessages[i].attachments.array().length - 1; i2 > -1; i2--)
                    {
                        if(arrayMessages[i].attachments.array()[i2].height > 0)
                        {
                            if(messageID == "")
                            {
                                messageID = arrayMessages[i].id;
                                url4 = arrayMessages[i].attachments.array()[i2].url;
                            }
                            else if(messageID2 == "")
                            {
                                messageID2 = arrayMessages[i].id;
                                url3 = arrayMessages[i].attachments.array()[i2].url;
                            }
                            else if(messageID3 == "")
                            {
                                messageID3 = arrayMessages[i].id;
                                url2 = arrayMessages[i].attachments.array()[i2].url;
                            }
                            else if(messageID4 == "")
                            {
                                messageID4 = arrayMessages[i].id;
                                url1 = arrayMessages[i].attachments.array()[i2].url;
                            }
                        }
                    }
                }
            }

            if(messageID == "" || messageID2 == "" || messageID3 == "" || messageID4 == "")
            {
                message.channel.send("<@" + message.author.id + "> 4 images not found, use `" + commandPrefix + "help compile` for help.").catch(error => {console.log("Send Error - " + error); });
                
                return;
            }
            message.channel.send("***taking images***").catch(error => {console.log("Send Error - " + error); });
            Jimp.read(url1).then(function (image1) {
                if(image1.bitmap.height > image1.bitmap.width)
                {
                    var y = (image1.bitmap.height - image1.bitmap.width) / 2
                    image1.crop(0, y, image1.bitmap.width, image1.bitmap.width);
                }
                else if (image1.bitmap.width > image1.bitmap.height)
                {
                    var x = (image1.bitmap.width - image1.bitmap.height) / 2
                    image1.crop(x, 0, image1.bitmap.height, image1.bitmap.height);
                }
                console.log("got image");
                Jimp.read(url2).then(function (image2) {
                    if(image2.bitmap.height > image2.bitmap.width)
                    {
                        var y = (image2.bitmap.height - image2.bitmap.width) / 2
                        image2.crop(0, y, image2.bitmap.width, image2.bitmap.width);
                    }
                    else if (image2.bitmap.width > image2.bitmap.height)
                    {
                        var x = (image2.bitmap.width - image2.bitmap.height) / 2
                        image2.crop(x, 0, image2.bitmap.height, image2.bitmap.height);
                    }
                    Jimp.read(url3).then(function (image3) {
                        if(image3.bitmap.height > image3.bitmap.width)
                        {
                            var y = (image3.bitmap.height - image3.bitmap.width) / 2
                            image3.crop(0, y, image3.bitmap.width, image3.bitmap.width);
                        }
                        else if (image3.bitmap.width > image3.bitmap.height)
                        {
                            var x = (image3.bitmap.width - image3.bitmap.height) / 2
                            image3.crop(x, 0, image3.bitmap.height, image3.bitmap.height);
                        }
                        Jimp.read(url4).then(function (image4) {
                            console.log("got avatar");
                            if(image4.bitmap.height > image4.bitmap.width)
                            {
                                var y = (image4.bitmap.height - image4.bitmap.width) / 2
                                image4.crop(0, y, image4.bitmap.width, image4.bitmap.width);
                            }
                            else if (image4.bitmap.width > image4.bitmap.height)
                            {
                                var x = (image4.bitmap.width - image4.bitmap.height) / 2
                                image4.crop(x, 0, image4.bitmap.height, image4.bitmap.height);
                            }
        
                            var largest = 0;

                            var values = [image1.bitmap.height, image2.bitmap.height, image3.bitmap.height, image4.bitmap.height]
                            for(var i = 0; i < values.length; i++)
                            {
                                if(largest < values[i])
                                {
                                    largest = values[i];
                                }
                            }
                            
                            var smallest = largest;

                            for(var i = 0; i < values.length; i++)
                            {
                                if(smallest > values[i])
                                {
                                    smallest = parseInt(values[i]);
                                }
                            }

                            console.log("Scaling")

                            if(smallest > 500)
                            {
                                smallest = 500;
                            }
                            
                            if(image1.bitmap.height != smallest)
                                image1.resize(smallest, smallest);
                            if(image2.bitmap.height != smallest)
                                image2.resize(smallest, smallest);
                            if(image3.bitmap.height != smallest)
                                image3.resize(smallest, smallest);
                            if(image4.bitmap.height != smallest)
                                image4.resize(smallest, smallest);
                            
            
                            var emptyImage = new Jimp(smallest*2, smallest*2);
                            console.log("Empty Image")
                            var mergedImage = emptyImage.composite(image1, 0, 0).composite(image2, smallest, 0).composite(image3, 0, smallest).composite(image4, smallest, smallest);

                            console.log("Merged Panels")

                            var file = shortid.generate() + ".png"
                            mergedImage.write(file, function(error){
                                if(error) { console.log(error); return;};
                                console.log("got merged image");
                                console.log(file);
                                message.channel.send("***Compiled***", {
                                    files: [file]
                                }).then(function(){
                                    
        
                                    fs.remove(file, resultHandler);
                                      
                                }).catch(function (err) {
                                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                    console.log(err.message);
                                    
                                    fs.remove(file, resultHandler);
                                });
                                console.log("Message Sent");
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
                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                    console.log(err.message);
                    
                });
            }).catch(function (err) {
                console.log(err.message);
                
            });
        }).catch(function (err) {
            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
            console.log(err.message);
            
        });
    }
}

module.exports = CompileCommand;
