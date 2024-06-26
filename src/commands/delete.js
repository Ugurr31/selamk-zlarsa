const config = require("../data/config");
const dataSchema = require("../manager/Database/data_schema");

const { SlashCommandBuilder, PermissionFlagsBits, WebhookClient } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sil")
        .setDescription("Belirtilen kodu siler.")
        .addStringOption(option =>
            option.setName("kod")
                .setDescription("Belirtilen kodu siler.")
        )
        .addStringOption(option =>
            option.setName("tüm-kodlar")
                .setDescription("Tüm kodları siler.")
                .addChoices(
                    { name: "Tüm kodları sil.", value: "tüm_kodları_sil" }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */

    async Init(interaction) {

        let code = interaction.options.getString("kod");
        let allCodes = interaction.options.getString("tüm-kodlar");

        if (code) {

            let data = await dataSchema.findOne({ deliveryCode: code });
            if (!data) return interaction.reply({ content: `${emoji.cancel} **${code}** koduna sahip bir kayıt bulunamadı.`, ephemeral: true });

            dataSchema.deleteOne({ deliveryCode: code }, { upsert: true })
                .then(() => {

                    interaction.reply({ content: `${emoji.success} **${code}** koduna sahip kayıt başarıyla silinmiştir.` });

                    const logWebhook = new WebhookClient({ url: config.LOG_CHANNEL_WEBHOOK_LINK });
                    logWebhook.send({ content: `**${interaction.member.user.username} - ${interaction.member.user.id}** tarafından <t:${new String(Date.now()).slice(0, 10)}:R> \`${code}\` teslimat kodu silinmiştir.` });

                })
                .catch((error) => {
                    log(`Teslimat kodu silinirken bir sorun oluştu. ${error}`);
                    interaction.reply({ content: `${emoji.cancel} Bir veritabanı hatası oluştu.`, ephemeral: true });
                });

        } else if (allCodes) {

            dataSchema.deleteMany()
                .then(() => {

                    interaction.reply({ content: `${emoji.success} Tüm kodlar başarıyla silinmiştir.` });

                    const logWebhook = new WebhookClient({ url: config.LOG_CHANNEL_WEBHOOK_LINK });
                    logWebhook.send({ content: `**${interaction.member.user.username} - ${interaction.member.user.id}** tarafından <t:${new String(Date.now()).slice(0, 10)}:R> tüm teslimat kodları silinmiştir.` });

                })
                .catch((error) => {
                    log(`Tüm kodlar silinirken bir sorun oluştu. ${error}`);
                    interaction.reply({ content: `${emoji.cancel} Bir veritabanı hatası oluştu.`, ephemeral: true });
                });

        };

    }
}