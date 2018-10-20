console.log("Starting Bot")
const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js', { token: process.env.BOT_TOKEN });
Manager.spawn();
Manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));

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
var port = 5000;
 
webhook.listen(port, function callback () {
 
    console.log("server is listening");
 
});

async function sendUserTokens(userID)
{
    console.log("Vote made by " + userID)
    var shards = Manager.shards.array()
    var tokenData = await shards[0].eval(`var tokens = this.DatabaseFunctions.getUserTokens(${userID}); return tokens;`)
    console.log(tokenData)
    return;
    shards.forEach(async (shard) => {
        await shard.eval(``);
    })
}
