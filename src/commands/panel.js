const config = require("../data/config");
const accountSchema = require("../manager/Database/account_schema");

const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Teslim hesabını ayarlar.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async Init(interaction) {

        let accountTokens = config.SELFBOT_TOKENS;

        if (accountTokens.length <= 25) {
            const select = new StringSelectMenuBuilder()
                .setCustomId("account_select")
                .setPlaceholder("Teslim hesabınızı seçin.");

            accountTokens.forEach((acc, index) => {
                select.addOptions({
                    label: `Hesap ${index + 1}`,
                    value: `acc_${index + 1}`
                });
            });


            const selectRow = new ActionRowBuilder().addComponents(select);
            interaction.reply({ content: `${emoji.notification} Teslim hesabınızı seçim menüsü yardımıyla seçebilirsiniz.`, components: [selectRow] })
                .then(msg => {

                    var filter = (interaction) => interaction.user.id == interaction.member.id;
                    const collector = msg.createMessageComponentCollector({ filter });

                    collector.on("collect", async interaction => {

                        if (interaction.customId === "account_select") {

                            const accountIndex = interaction.values[0].replace("acc_", "") - 1
                            let acc = accountTokens[accountIndex];

                            saveData(interaction, acc, accountTokens, accountIndex);

                        };

                    });

                })

        };

    }
};

async function saveData(interaction, acc, accountTokens, index) {

    await accountSchema.updateOne({ id: "1" }, {
        $set: {
            accToken: accountTokens[index]
        }
    }, { upsert: true })
        .then(async () => {
            await interaction.reply({ content: `Başarıyla **${index + 1}.** hesap teslim hesabı olarak ayarlanmıştır. Lütfen sistem yeniden başlatılırken bekleyin...` });
            const systemLogChannel = interaction.client.channels.cache.get(config.SISTEM_LOG_KANALI_ID);
            if (systemLogChannel) await systemLogChannel.send({ content: `${emoji.notification} Teslim hesabı **${interaction.member.user.username} - (${interaction.member.id})** tarafından **${index + 1}.** hesap olarak ayarlandı.` });
            process.exit(0);
        })
        .catch((error) => {
            log(`Teslim hesabı ayarlanırken bir sorun oluştu. ${error}`);
            interaction.reply({ content: "Veritabanı hatası oluştu.", ephemeral: true });
        })

};