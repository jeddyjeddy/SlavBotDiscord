console.log("Starting Bot")
const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js', { token: process.env.BOT_TOKEN, totalShards: 6, respawn: true });
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
        else if(message.toString().indexOf("respawnAlert") > -1)
        {
            var data = JSON.parse(message)
            if(data["respawnAlert"] == "all")
            {
                if(shardToUse.id == shard.id)
                {
                    Manager.respawnAll()
                }
            }
            else if(data["respawnAlert"] == "few")
            {
                if(data["amount"] != null && data["amount"] != undefined)
                {
                    var amount = data["amount"]
                    for(var i = 0; i < amount.length; i++)
                    {
                        if(amount[i] == shardToUse.id)
                        {
                            shardToUse.respawn()
                        }
                    }
                }
            }
            
        }
    })
})