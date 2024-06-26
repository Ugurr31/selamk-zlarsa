const config = require("../../data/config");

const { Collection, REST, Routes } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = client => {

    // Command Loader

    client.commands = new Collection();
    const commands = [];

    readdirSync("./src/commands", { encoding: "utf8" })
        .forEach(file => {
            const command = require(`../../commands/${file}`);
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        });

    const rest = new REST().setToken(config.DISCORD_BOT_TOKEN);

    (async () => {

        try {

            rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.SUNUCU_ID), { body: commands });

        } catch (error) {
            log(`Komut kaydı yapılırken bir sorun oluştu. ${error}`);
        };

    })();

    // Event Loader

    readdirSync("./src/events/Bot", { encoding: "utf8" })
        .forEach(file => {
            const event = require(`../../events/Bot/${file}`);
            client.on(file.split(".")[0], event.bind(client));
        });

}