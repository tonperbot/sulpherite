const afkArray = require('../../helpers/afkUpdater.js').afkArray;

async function afkcheck(cli, cfg, data){
	const args = data.content.split(' ');

	// define the chan, type, location
	if (!args[1] || isNaN(args[1]) || (!isNaN(args[1]) && (args[1] > cfg.shattersServer.raidingChannelsAmount || args[1] < 1))) return data.channel.send(`Please use a valid channel (1-${cfg.shattersServer.raidingChannelsAmount})!`);
	if (!args[2]) return data.channel.send(`Specify the type of afk you're trying to use! ie. shatters (s), void (v), cult (c), fungal (fc).`);
	var location = data.content.substr(args[0].length+args[1].length+args[2].length+3);
	if (location.length < 3) return data.channel.send(`Set a valid location for the afk check!`);

	// define chan objects
	const vcChannel = cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id);
	const afkChannel = cli.channels.cache.get(cfg.shattersServer.afkchecks);
	const cpChannel = cli.channels.cache.get(cfg.shattersServer.rlcommands);
	const shattersAfkReactions = [...cfg.shattersHcReactions, '686223984907255808', '699664632469782599'];
	const voidAfkReactions = [...cfg.voidHcReactions, '686223984907255808', '699664632469782599'];
	const cultAfkReactions = [...cfg.cultHcReactions, '686223984907255808', '699664632469782599'];
	const fungalAfkReactions = [...cfg.fungalHcReactions, '686223984907255808', '699664632469782599'];

	if (!cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(data.author.id).voice.channel || cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(data.author.id).voice.channel.id != cfg.shattersServer.vc[args[1]].id) return data.channel.send(`i'm not sure you want to afk in a channel you're not in, safety first buddy`); 
	// types
	if (args[2].toLowerCase() == "s" || args[2].toLowerCase() == "shatters"){
		// Shatters one
		const afkObj = {
			type: 'shatters',
			host: data.author.id,
			channel: vcChannel.id,
			channelNumber: args[1],
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			nitro: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
				priest: [],
				mystic: [],
				assassin: [],
			},
			rushers: { first: [], second: [], secret: [] },
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const afkMsg = await afkChannel.send(`@here Shatters (${cli.emojis.cache.get('679186863264628736')}) started by ${cli.users.cache.get(afkObj['host'])} in ${cfg.shattersServer.vc[args[1]].name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${cfg.shattersServer.vc[args[1]].name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;

		try {
			await shattersAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(r))});
			await cpMsg.react(cli.emojis.cache.get('699664632469782599'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id).createOverwrite(cfg.shattersServer.raiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id).setName(`${cfg.shattersServer.vc[args[1]].name} <-- Join!`);

		// push to the array the object and open reaction collector
		afkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/regHandlers/shattersReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/regHandlers/shattersReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new afk check in ${cfg.shattersServer.vc[args[1]].name} by ${cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(afkObj['host']).displayName}`);

	} else if (args[2].toLowerCase() == "v" || args[2].toLowerCase() == "void"){
		// Shatters one
		const afkObj = {
			type: 'void',
			host: data.author.id,
			channel: vcChannel.id,
			channelNumber: args[1],
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			vial: [],
			nitro: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
			},
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const afkMsg = await afkChannel.send(`@here Void Entity (${cli.emojis.cache.get('686217948880568384')}) started by ${cli.users.cache.get(afkObj['host'])} in ${cfg.shattersServer.vc[args[1]].name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${cfg.shattersServer.vc[args[1]].name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;

		try {
			await voidAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(r))});
			await cpMsg.react(cli.emojis.cache.get('699664632469782599'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id).createOverwrite(cfg.shattersServer.raiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id).setName(`${cfg.shattersServer.vc[args[1]].name} <-- Join!`);

		// push to the array the object and open reaction collector
		afkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/regHandlers/voidReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/regHandlers/voidReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new afk check in ${cfg.shattersServer.vc[args[1]].name} by ${cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(afkObj['host']).displayName}`);
	} else if (args[2].toLowerCase() == "c" || args[2].toLowerCase() == "cult"){
		// Shatters one
		const afkObj = {
			type: 'cult',
			host: data.author.id,
			channel: vcChannel.id,
			channelNumber: args[1],
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			nitro: [],
			rusher: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
				priest: [],
			},
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const afkMsg = await afkChannel.send(`@here Cultist Hideout (${cli.emojis.cache.get('686217948918185994')}) started by ${cli.users.cache.get(afkObj['host'])} in ${cfg.shattersServer.vc[args[1]].name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${cfg.shattersServer.vc[args[1]].name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;

		try {
			await cultAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(r))});
			await cpMsg.react(cli.emojis.cache.get('699664632469782599'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id).createOverwrite(cfg.shattersServer.raiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id).setName(`${cfg.shattersServer.vc[args[1]].name} <-- Join!`);

		// push to the array the object and open reaction collector
		afkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/regHandlers/cultReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/regHandlers/cultReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new afk check in ${cfg.shattersServer.vc[args[1]].name} by ${cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(afkObj['host']).displayName}`);
	} else if (args[2].toLowerCase() == "fc" || args[2].toLowerCase() == "fungal"){
		// Shatters one
		const afkObj = {
			type: 'fungal',
			host: data.author.id,
			channel: vcChannel.id,
			channelNumber: args[1],
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			nitro: [],
			rusher: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
				priest: [],
				trickster: [],
			},
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const afkMsg = await afkChannel.send(`@here Fungal Cavern (${cli.emojis.cache.get('686223695827828774')}) started by ${cli.users.cache.get(afkObj['host'])} in ${cfg.shattersServer.vc[args[1]].name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${cfg.shattersServer.vc[args[1]].name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;

		try {
			await fungalAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(r))});
			await cpMsg.react(cli.emojis.cache.get('699664632469782599'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id).createOverwrite(cfg.shattersServer.raiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(cfg.shattersServer.vc[args[1]].id).setName(`${cfg.shattersServer.vc[args[1]].name} <-- Join!`);

		// push to the array the object and open reaction collector
		afkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/regHandlers/fungalReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/regHandlers/fungalReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new afk check in ${cfg.shattersServer.vc[args[1]].name} by ${cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(afkObj['host']).displayName}`);
	}
	 else {
		return data.channel.send(`Unknown afk type! ie. shatters (s), void (v), cult (c), fungal (fc).`);
	}
}

module.exports = afkcheck;