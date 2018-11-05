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