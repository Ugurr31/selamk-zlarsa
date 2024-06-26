const config = require("../../data/config");
const dataSchema = require("../../manager/Database/data_schema");

const { WebhookClient, EmbedBuilder } = require("discord.js");

module.exports = async message => {

    if (message?.components?.length) {
        if (message?.member?.id === config.OWO_BOT_ID) {
            setTimeout(async () => {
                await message?.clickButton().catch(() => { });
            }, 700);
        };
    };

    if (message?.guild?.id !== config.SUNUCU_ID || !message?.guild || message.channel.id !== config.KOD_YAZILACAK_TESLIM_KANALI) return;

    let data = await dataSchema.findOne({ deliveryCode: message.content })
    if (data) {

        const webhook = await message.channel.createWebhook(message.member.user.username, {
            avatar: `${message.member.user.displayAvatarURL()}`,
            reason: "Teslimat Bilgilendirme Mesajı",
        });

        if (webhook) webhook.send({ content: config.WEBHOOK_KOD_ONAYLANDI_BILDIRIMI.replace("{emoji}", emoji.notification).replace("{member}", message.member) })

        await dataSchema.deleteOne({ deliveryCode: message.content })
            .then(async () => {

                const deliveryChannel = message.guild.channels.cache.get(config.TESLIMAT_KANALI_ID);
                if (deliveryChannel) await deliveryChannel.send({ content: config.TESLIMAT_SEKLI.replace("{user}", message.member).replace("{cash}", data.owoCash) })

                if (webhook) await webhook.send({ content: config.WEBHOOK_TESLIM_BILDIRIMI });

                setTimeout(() => {
                    webhook.delete().catch(() => { });
                }, 15000);

                sendLog(message.channel, message.content, message.member, data.owoCash, "success");

            })
            .catch((error) => {
                log(`Teslimat kodu silinirken bir sorun oluştu. [${message.channel.name} - ${message.member.user.username} - ${message.member.user.id} teslim yapılamıyor.]\n\n${error}`);
                webhook.send({ content: "Şu anda teslim yapılamıyor. Lütfen size yardımcı olması için bir yetkiliyi etiketleyin." });
                sendLog(message.channel, message.content, message.member, message.content, "error");
            })

    };

};

async function sendLog(channel, deliveryCode, member, amount, status = "success") {

    const logWebhook = new WebhookClient({ url: config.LOG_CHANNEL_WEBHOOK_LINK });

    if (status == "success") {

        const logEmbed = new EmbedBuilder()
            .setTitle(`Teslim Edildi - ${deliveryCode}`)
            .setColor("Random")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**${member.user.username} ${member.user.id}** kullanıcısı \`${Number(amount).toLocaleString()} cash\` teslim aldı.`)
            .addFields(
                { name: "Teslim Hesabı", value: `**${member.client.user.username}**`, inline: true },
                { name: "Tarih", value: `<t:${new String(Date.now()).slice(0, 10)}:R>`, inline: true }
            )

        logWebhook.send({ embeds: [logEmbed] });

    } else if (status == "error") {

        logWebhook.send({ content: `@everyone **${member.user.username} - (${member.user.id})** üyesine ${channel} kanalında teslim yapılırken bir sorun oluştu.` });

    };

};