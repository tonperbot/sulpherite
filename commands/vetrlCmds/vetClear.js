const powerCalculation = require('../commands.js').powerCalculation;

async function clear(cli, cfg, data){
	const args = data.content.toLowerCase().split(' ');

	if (args[1] == undefined || isNaN(args[1])) return data.channel.send(`Invalid channel number (available: 1-${cfg.shattersServer.vetRaidingChannelsAmount}).`);
	if (!isNaN(args[1]) && (args[1] > cfg.shattersServer.vetRaidingChannelsAmount || args[1] < 1)) return data.channel.send(`Invalid channel number (available: 1-${cfg.shattersServer.vetRaidingChannelsAmount}).`);

	if (!cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(data.author.id).voice.channel ||cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(data.author.id).voice.channel.id != cfg.shattersServer.vetVc[args[1]].id) return data.channel.send(`i'm not sure you want to clear a channel you're not in, safety first buddy`); 
	const clearMsg = await data.channel.send(`Clearing ${cfg.shattersServer.vetVc[args[1]].name.toLowerCase()}`);
	const vcRaiders = [];

	await cli.channels.cache.get(cfg.shattersServer.vetVc[args[1]].id).members.forEach(async function(raiders){
		vcRaiders.push(raiders);
	});

	for (let i = 0; i < vcRaiders.length; i++){
		if (await powerCalculation(cli, cfg, vcRaiders[i].user.id) < 2) await vcRaiders[i].voice.setChannel('611776627478757386').catch(err => console.error(err)); // lounge
		if (i == vcRaiders.length-1){
			await data.channel.send(`Finished clearing ${cfg.shattersServer.vetVc[args[1]].name.toLowerCase()}!`);
			await clearMsg.delete();
		}
	}

}

module.exports = clear;