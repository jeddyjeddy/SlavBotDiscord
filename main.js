console.log("Starting Bot")
const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js', { token: process.env.BOT_TOKEN });
Manager.spawn();
Manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));
