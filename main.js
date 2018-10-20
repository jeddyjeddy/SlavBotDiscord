console.log("Starting Bot")
const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js', { token: process.env.BOT_TOKEN });
var DatabaseJS = require("./database.js")

/*const giveawayToken = 10000;

var listener = require("contentful-webhook-listener");
var webhook = listener.createServer({
    "Authorization": process.env.VOTE_AUTH
}, function requestListener (request, response) {
    console.log("request received");
    var body = []
    request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
            body = Buffer.concat(body).toString()
            if(body != [] && body !== undefined && body !== null)
            {
                var data = JSON.parse(body);
                sendUserTokens(data["user"])
            }
      });
});
var port = 3000;
 
webhook.listen(port, function callback () {
 
    console.log("server is listening");
 
});*/

async function sendUserTokens(userID)
{
    var shards = Manager.shards.array()
    var foundUser = false;
    shards.forEach(async (shard) => {
        if(!foundUser)
            foundUser = await shard.eval(`var user = await this.fetchMember(${userID});if(user != undefined && user != null){user.send("Thank you for voting, you have recieved " + numberWithCommas(giveawayToken) + " tokens. You now have " + numberWithCommas(getUserTokens(data["user"])) + " tokens. Use \`help ww\` for more info on these tokens.").catch(error => console.log("Send Error - " + error));return true;}else{return false;}`);
    })

    this.addUserTokens(userID, giveawayToken)
}


Manager.spawn();
Manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));
