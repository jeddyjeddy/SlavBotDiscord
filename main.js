console.log("Starting Bot")
const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js', { token: process.env.BOT_TOKEN });
Manager.spawn();
Manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));
/*Manager.on("message", (shard, message) => {
    Manager.shards.forEach(shardToUse => {
        if(message.contains("token2"))
        {
            if(shardToUse.id == shard.id + 1)
            {
                var data = JSON.parse(message)
                shardToUse.eval(`this.fetchUser(${data["user"]}).then(user => {user.send("Thank you for voting, you have recieved " + ${data["token1"]} + " tokens. You now have " + ${data["token2"]} + " tokens. Use \`help ww\` for more info on these tokens.").catch(error => console.log("Send Error - " + error));}, rejection => {this.send(${JSON.stringify(data)});});`)
            }
        }
    })
})*/