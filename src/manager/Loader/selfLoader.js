const { readdirSync } = require("fs");

module.exports = client => {

    // Event Loader

    readdirSync("./src/events/SelfBot", { encoding: "utf8" })
        .forEach(file => {
            const event = require(`../../events/SelfBot/${file}`);
            client.on(file.split(".")[0], event.bind(client));
        });

}