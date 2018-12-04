console.log("Starting Bot")
const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js', { token: process.env.BOT_TOKEN, totalShards: 3 });
Manager.spawn();
Manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));

Manager.on("message", (shard, message) => {
    Manager.shards.forEach(shardToUse => {
        if(message.toString().indexOf("token2") > -1)
        {
            if(shardToUse.id == shard.id + 1)
            {
                var data = JSON.parse(message)
                shardToUse.eval(`this.fetchUser(${data["user"]}).then(user => {user.send("Thank you for voting, you have received " + ${data["token1"]} + " tokens. You now have " + ${data["token2"]} + " tokens. You can now use the \`dailyspin\` command. Use \`help ww\` for more info on these tokens and \`help dailyspin\` for info on Daily Spins.").catch(error => console.log("Send Error - " + error));}, rejection => {this.shard.send(${JSON.stringify(data)});});`)
            }
        }
    })
})