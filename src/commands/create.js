const config = require("../data/config");
const dataSchema = require("../manager/Database/data_schema");
const generateCode = require("../manager/Functions/generateCode");

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("oluştur")
        .setDescription("Belirtilen miktarda teslimat kodu oluşturur.")
        .addNumberOption(option =>
            option.setName("miktar")
                .setDescription("OwO cash miktarını girin.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async Init(interaction) {

        let owoCash = interaction.options.getNumber("miktar");

        generateCode()
            .then(code => {

                dataSchema.updateOne({ deliveryCode: code }, {
                    $set: {
                        owoCash: owoCash,
                        creatorID: interaction.member.id,
                        createdDate: Date.now()
                    },
                }, { upsert: true }).then(() => {

                    const infoEmbed = new EmbedBuilder()
                        .setTitle("Teslimat Kodu oluşturuldu")
                        .setColor("Random")
                        .setDescription(`**${owoCash.toLocaleString()}** owo cash değerinde teslimat kodunuz başarıyla oluşturulmuştur.`)
                        .addFields(
                            { name: "Oluşturulan Kod", value: `\`${code}\``, inline: true },
                            { name: "Miktar", value: `\`${owoCash.toLocaleString()} cash\``, inline: true },
                        )

                    interaction.reply({ embeds: [infoEmbed] });

                    const logWebhook = new WebhookClient({ url: config.LOG_CHANNEL_WEBHOOK_LINK });
                    logWebhook.send({ content: `**${interaction.member.user.username} - ${interaction.member.user.id}** tarafından <t:${new String(Date.now()).slice(0, 10)}:R> \`${owoCash.toLocaleString()} cash\` miktarında teslimat kodu oluşturulmuştur.\n\n**Oluşturulan Kod:** \`${code}\`` });

                }).catch((error) => {
                    log(`Veritabanı hatası oluştu. ${error}`);
                    interaction.reply({ content: "Veritabanı hatası oluştu. [create.js 35.]", ephemeral: true });
                });

            }).catch((error) => {
                log(`Kod oluşturulurken bir sorun oluştu. ${error}`);
                interaction.reply({ content: "Teslimat kodu oluşturulurken bir sorun oluştu. [create.js 39.]", ephemeral: true });
            })

    }
}