const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yardım")
        .setDescription("Bot komutlarını listeler.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async Init(interaction) {

        const commandList = interaction.client.commands.map((x) => `\`/${x.data.name} → ${x.data.description}\``).join("\n");

        const infoEmbed = new EmbedBuilder()
            .setTitle("Komutlar Listelendi")
            .setColor("Random")
            .setDescription(commandList);

        interaction.reply({ embeds: [infoEmbed], ephemeral: true });

    }
}