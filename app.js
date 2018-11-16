if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const fs = require("fs");
const PlutoBot = require("./PlutoBot/PlutoBot");
const collection = require("./PlutoBot/util/Collection");

const client = new PlutoBot.Client({ room: "lobby" });
client.logger = require("./PlutoBot/util/Logger");
client.config = require("./data/config.json");

const init = async () => {
    client.commands = new collection();
    const commandFiles = await fs.readdirSync('./data/commands').filter(file => file.endsWith('.js'));
    client.logger.log(`Loading a total of ${commandFiles.length} commands...`, "okay");
    commandFiles.forEach(file => {
        const command = require(`./data/commands/${file}`);
        client.commands.set(command.name, command);
        client.logger.log(`Loaded the ${command.name} command.`, "okay")
    });
    client.logger.log("All commands loaded.\n", "okay");

    const eventFiles = await fs.readdirSync('./data/events/');
    client.logger.log(`Loading a total of ${eventFiles.length} events...`, "okay");
    eventFiles.forEach(file => {
        const eventName = file.split(".")[0];
        const event = require(`./data/events/${file}`)
        client.on(eventName, event.bind(null, client));
        client.logger.log(`Loaded the ${eventName} event.`, "okay");
    });
    client.logger.log("All events loaded.\n", "okay");

    client.start();
}
client.cooldowns = new collection();

init();