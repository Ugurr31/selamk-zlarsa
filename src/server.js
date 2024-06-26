const config = require("./data/config");
const emoji = global.emoji = require("./data/emoji");
const systemFunction = require("./manager/Functions/system");
const log = global.log = require("./manager/Functions/log");

const { Client, ActivityType } = require("discord.js");

const client = new Client({
    intents: [3276799],
    presence: { activities: [{ name: config.ACTIVITY_NAME, type: ActivityType.Listening }] }
});

client.on("ready", client => {
    systemFunction(client);
});

client.login(config.DISCORD_BOT_TOKEN)
    .then(() => log(`${client.user.username} API bağlantısı başarılı.`))
    .catch((err) => log(`API bağlantısı başarısız oldu.`));