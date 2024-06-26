const config = require("../../data/config");

/**
 * 
 * @param {import("discord.js").BaseInteraction} interaction 
 */

module.exports = async interaction => {

    if (!config.BOT_SAHIPLERI.includes(interaction.user.id)) return;

    if (!interaction.isChatInputCommand) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        command.Init(interaction);
    } catch (error) {
        log(`${command.name} komutunda bir hata var. ${error}`);
        interaction.reply({ content: `${emoji.cancel} Bu komut üzerinde bir hata bulunuyor.`, ephemeral: true });
    };

};