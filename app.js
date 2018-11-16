<<<<<<< HEAD
const fs            = require("fs");
const PlutoBot      = require("./PlutoBot/PlutoBot");
const client        = new PlutoBot.Client();
const collection    = require("./PlutoBot/util/Collection");
const { prefix }    = require("./data/config.json");

client.commands = new collection();
const commandFiles = fs.readdirSync('./data/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./data/commands/${file}`);
    client.commands.set(command.name, command);
}

client.cooldowns = new collection();

client.on("debug", (text) => {
    console.log(text);
});

client.on("message", (msg) => {
    if(!msg.a.startsWith(prefix)) return;
    var args = msg.a.slice(prefix.length).split(/ +/);
    var command = args.shift().toLowerCase();
//ok
    if(!client.commands.has(command)) return;

    if(!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if(!timestamps.has(msg.p._id)) {
        timestamps.set(msg.p._id, now);
        setTimeout(() => timestamps.delete(msg.p._id), cooldownAmount);
    } else {
        const expirationTime = timestamps.get(msg.p._id) + cooldownAmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return client.sendChat(`Please wait ${timeLeft.toFixed(1)} more seconds before using this command again, ${msg.p.name}.`);
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.p._id), cooldownAmount)
    }

    try {
        client.commands.get(command).execute(client, msg, args);
    } catch(err) {
        console.log(err);
    }
});

client.start();


var exec = require('child_process').exec;
exec("electron ./main.js");
=======
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

init();
>>>>>>> master
