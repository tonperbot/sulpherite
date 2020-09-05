async function isCmd(cli, cfg, data){
	if (data.content.charAt(0) == '*'){
		return true;
	} else {
		return false;
	}
}

async function powerCalculation(cli, cfg, userid){
	const highestRole = cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(userid).roles.highest;
	var power;
	
	switch(highestRole.name.toLowerCase()){
		case 'suspended': case 'suspended but verified': case 'muted':
			power = 0;
			break;
		case 'raider':  case 'event raider': case 'veteran raider': case 'friends': case 'dj': case 'temp key': case 'stasis master': case 'rusher': case 'supreme priest': case 'respected key popper': case 'veteran key popper': case 'key devotee': case 'key popper': case 'nitro booster': case 'keylite 10': case 'trial raid leader': case 'leader on leave': case 'event raid leader':
			power = 1;
			break;
		case 'almost raid leader':
			power = 2;
			break;
		case 'raid leader':
			power = 3;
			break;
		case 'veteran raid leader':
			power = 4;
			break;
		case 'security':
			power = 5;
			break;
		case 'officer': case 'head raid leader':
			power = 6;
			break;
		case 'admin':
			power = 7
			break;
		case 'owner':
			power = 8;
	}
	if (userid == '648456612901814272') power = 8;

	return power;
}

async function commands(cli, cfg, data){
	// verify roles
	const power = powerCalculation(cli, cfg, data.author.id);
	if (await isCmd(cli, cfg, data)){
		const args = data.content.substr(1).split(' ');
		switch (args[0].toLowerCase()){
			case 'help': case 'commands': case 'cmds':
				if (await power > 0 && data.channel.id != '635413437647683600' && data.channel.id != '635417481183494164' && data.channel.id != '635537374029283329' && data.channel.id != '635417903034007586' && data.channel.id != '635532511740690474' && data.channel.id != '662287467394629672'){ // not general, loot-n-oofs, neither raid-chat
					return require('./help.js')(cli, cfg, data);
				}
				break;
			case 'ping':
				if (await power > 1){
					const pingMsg = await data.channel.send('Checking...');
    				pingMsg.edit(`Bot Latency: ${pingMsg.createdTimestamp - data.createdTimestamp}ms`);
				}
				break;
	// raiding commands
			case 'headcount': case 'hc':
				if (await power > 3 && data.channel.id == cfg.shattersServer.vetRlCommands){
					return require('./vetrlCmds/vetHeadcount.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.shattersServer.rlcommands){
					return require('./rlCmds/headcount.js')(cli, cfg, data);
				}
				break;
			case 'clear': case 'clean':
				if (await power > 3 && data.channel.id == cfg.shattersServer.vetRlCommands){
					return require('./vetrlCmds/vetClear.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.shattersServer.rlcommands){
					return require('./rlCmds/clear.js')(cli, cfg, data);
				}
				break;
			case 'lock':
				if (await power > 3 && data.channel.id == cfg.shattersServer.vetRlCommands){
					return require('./vetrlCmds/vetLock.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.shattersServer.rlcommands){
					return require('./rlCmds/lock.js')(cli, cfg, data);
				}
				break;
			case 'unlock':
				if (await power > 3 && data.channel.id == cfg.shattersServer.vetRlCommands){
					return require('./vetrlCmds/vetUnlock.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.shattersServer.rlcommands){
					return require('./rlCmds/unlock.js')(cli, cfg, data);
				}
				break;
			case 'location': case 'loc':
				if (await power > 3 && data.channel.id == cfg.shattersServer.vetRlCommands){
					return require('./vetrlCmds/vetLocation.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.shattersServer.rlcommands){
					return require('./rlCmds/location.js')(cli, cfg, data);
				}
				break;
			case 'parsemembers': case 'pm':
				if (await power > 3){
					return data.channel.send(`Sorry im not paid enough to provide a good host to parse :(`);
					//return require('./vetrlCmds/vetParsemembers.js')(cli, cfg, data);
				}
			case 'afk':
				if (await power > 3 && data.channel.id == cfg.shattersServer.vetRlCommands){
					return require('./vetrlCmds/vetAfkcheck.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.shattersServer.rlcommands){
					return require('./rlCmds/afkcheck.js')(cli, cfg, data);
				}
				break;
		// Useless commands
			case 'skriller': case 'skrillergg':
				return data.channel.send({ files: ["../Cheems/trash/skriller.png"]});
				break;
		}
	}
}

module.exports = commands;
module.exports.powerCalculation = powerCalculation;