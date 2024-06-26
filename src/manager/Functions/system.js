const config = require("../../data/config");
const loader = require("../Loader/loader");
const selfLoader = require("../Loader/selfLoader");
const accountSchema = require("../Database/account_schema");

const { connect } = require("mongoose");
const { schedule } = require("node-cron");
const { Client } = require("discord.js-selfbot-v13");

const selfClient = new Client({
    checkUpdate: false,
});

module.exports = async client => {

    loader(client);

    selfClient.on("ready", client => {
        selfLoader(client);
    });

    connect(config.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(async () => {
        const accountData = await accountSchema.findOne({ id: "1" });

        if (accountData && accountData.accToken) {
            selfClient.login(accountData.accToken)
                .then(() => {

                    log(`${selfClient.user.username} SelfBot API bağlantısı başarılı.`);

                    const systemLogChannel = client.channels.cache.get(config.SISTEM_LOG_KANALI_ID);
                    if (systemLogChannel) systemLogChannel.send({ content: `${emoji.success} Sistemler başlatıldı, **${selfClient.user.username}** teslim hesabına giriş yapıldı.` });

                })
                .catch(() => {

                    const systemLogChannel = client.channels.cache.get(config.SISTEM_LOG_KANALI_ID);
                    if (systemLogChannel) systemLogChannel.send({ content: `${emoji.cancel} Sistemler başlatıldı, Teslim hesabı algılandı fakat giriş başarısız.` });

                });
        } else {

            const systemLogChannel = client.channels.cache.get(config.SISTEM_LOG_KANALI_ID);
            if (systemLogChannel) systemLogChannel.send({ content: `${emoji.cancel} Sistemler başlatıldı, Teslim hesabı algılanmadı.` });

        };
    }).catch(() => log(`MongoDB bağlantısı başarısız oldu.`));

    schedule("0 0 * * *", () => {
        const systemLogChannel = client.channels.cache.get(config.SISTEM_LOG_KANALI_ID);
        if (systemLogChannel) systemLogChannel.send({ content: `${emoji.notification} Yeniden başlatılmaya hazırlanılıyor...` });

        setTimeout(() => {
            process.exit(0);
        }, 3000)
    });

};