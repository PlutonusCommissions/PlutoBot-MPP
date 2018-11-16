module.exports = async (client, msg) => {
    const collection = require("../../PlutoBot/util/Collection");

    if(!msg.a.startsWith(client.config.prefix)) return;
    var args = msg.a.slice(client.config.prefix.length).split(/ +/);
    var command = args.shift().toLowerCase();
    
    if(!client.commands.has(command)) return;

    if(client.commands.get(command).admin) {
        if(client.config.masters.indexOf(msg.p.name) < 0) return client.sendChat(`You don't have permission to use this command, ${msg.p.name}.`);
    }

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

        timestamps.set(msg.p._id, now);
        setTimeout(() => timestamps.delete(msg.p._id), cooldownAmount)
    }

    try {
        client.commands.get(command).execute(client, msg, args);
        client.logger.log(`${msg.p.name} has executed the ${command.name} command.`, "exec");
    } catch(err) {
        console.log(err);
    }
}