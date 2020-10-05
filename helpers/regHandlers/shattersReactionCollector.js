const afkArray = require('../afkUpdater.js').afkArray;

async function isInOtherClasses(userid, afkObj){
	var multiClass = false;
	if (afkObj['classes']['warrior'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['paladin'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['knight'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['priest'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['mystic'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['assassin'].includes(userid)) return multiClass = true;
	return false;
}

const powerCalculation = require('../../commands/commands.js').powerCalculation;

async function shattersReactionCollector(cli, cfg, reactionCollector){

	reactionCollector.on('collect', async (reaction, user) => {
		// adding reactions, find the afk
		var afkObj;
		await afkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) afkObj = afk; })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		// easier
		var cpMsg;
		var afkMsg;
		cpMsg = await cli.channels.cache.find(chan => chan.id == cfg.shattersServer.rlcommands).messages.fetch(afkObj['controlpanel']);
		afkMsg = await cli.channels.cache.find(chan => chan.id == cfg.shattersServer.afkchecks).messages.fetch(afkObj['afkcheck']);
		//

		if (cpMsg == undefined || afkMsg == undefined) return;

		if (reaction.emoji.id == '760021438219550720'){ // key
			if (afkObj['key'] == undefined){
				const keyMsg = await user.send(`You have reacted with ${cli.emojis.cache.find(e => e.id === "760021438219550720")}.\nIf you actually have a key, react with ✅ and if you made a mistake, ignore this message.`);
				await keyMsg.react('✅');
				const filter = (reaction, user) => reaction.emoji.name === '✅';
				await keyMsg.awaitReactions(filter, { max: 2, time: 30000 })
        		.then(async collected => {
           			// confirmed key, add temp key role then remove after 10m
           			if (collected.get('✅') != undefined && collected.get('✅').count == 2){
           				if (afkObj['key'] == undefined){
           					afkObj['key'] = user;
           					await user.send(`The raid leader has set the location to: ${afkObj['location']}. Please get there asap.\nYou are now our key popper. We ask that you check #parsemembers for raid leaders instructions.\n Please **ask** the current Raid Leader before kicking players listed in the channel.`);
           					//await cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(user.id).roles.add(cli.guilds.cache.get(cfg.shattersServer.id).roles.cache.find(r => r.id == cfg.shattersServer.tempKeyRole).id).catch(console.error);
           					//setTimeout(async function(){ await cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(user.id).roles.remove(cli.guilds.cache.get(cfg.shattersServer.id).roles.cache.find(r => r.id == cfg.shattersServer.tempKeyRole).id).catch(console.error); }, 300000);
           				} else {
							await user.send(`We have enough keys for this run, but thanks for your participation.`);
						}
           			}
           		})
			} else {
				await user.send(`We have enough keys for this run, but thanks for your participation.`);
			}
		} else if (reaction.emoji.id == '760021427545440276'){ // portal
			afkObj['raiders'] += 1;
			//if (cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(user.id).voice.channelID != undefined) await cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(user.id).voice.setChannel(cli.channels.cache.get(afkObj['channel'])).catch(err => console.error(err));
		} else if (reaction.emoji.id == '760021438219550720'){ // warrior
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021438219550720');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['warrior'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021397832990750'){ // paladin
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021397832990750');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['paladin'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021407366381578'){ // priest
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021407366381578');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['priest'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021377042087977'){ // knight
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021377042087977');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['knight'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021387674255370'){ // mystic
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021387674255370');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['mystic'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021324902563840'){ // assassin
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021324902563840');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['assassin'].push(user.id);
			}
		} else if (reaction.emoji.id == '762762960279437353'){ // first
			if (reaction.count == 3){
				cli.channels.cache.get(cfg.shattersServer.rlcommands).send(`${user} tried to react with ${cli.emojis.cache.find(r => r.id === reaction.emoji.id)} but there is already someone.`);
				await user.send(`Sorry there's already someone on this switch buddy`);
			} else {
				if (afkObj['rushers']['second'] != [] && afkObj['rushers']['second'].includes(user.id) || afkObj['rushers']['secret'] != [] && afkObj['rushers']['secret'].includes(user.id)){
					if (user.bot) return;
					let reactClass = reaction.message.reactions.cache.get('762762960279437353');
					if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
					await user.send(`You can't react with more than one switch at a time. However, if no other rusher shows up, you can ask to Raid Leader to rush multiple switches.`);
				} else if (!afkObj['rushers']['second'].includes(user.id) && !afkObj['rushers']['secret'].includes(user.id)) {
					await afkObj['rushers']['first'].push(user.id);
				}
			}
		} else if (reaction.emoji.id == '762762960799006721'){ // second
			if (reaction.count == 3){
				cli.channels.cache.get(cfg.shattersServer.rlcommands).send(`${user} tried to react with ${cli.emojis.cache.find(r => r.id === reaction.emoji.id)} but there is already someone.`);
				await user.send(`Sorry there's already someone on this switch buddy`);
			} else {
				if (afkObj['rushers']['first'] != [] && afkObj['rushers']['first'].includes(user.id) || afkObj['rushers']['secret'] != [] && afkObj['rushers']['secret'].includes(user.id)){
					if (user.bot) return;
					let reactClass = reaction.message.reactions.cache.get('762762960799006721');
					if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
					await user.send(`You can't react with more than one switch at a time. However, if no other rusher shows up, you can ask to Raid Leader to rush multiple switches.`);
				} else if (!afkObj['rushers']['first'].includes(user.id) && !afkObj['rushers']['secret'].includes(user.id)) {
					await afkObj['rushers']['second'].push(user.id);
				}
			}
		} else if (reaction.emoji.id == '762762961487134750'){ // secret
			if (reaction.count == 3){
				cli.channels.cache.get(cfg.shattersServer.rlcommands).send(`${user} tried to react with ${cli.emojis.cache.find(r => r.id === reaction.emoji.id)} but there is already someone.`);
				await user.send(`Sorry there's already someone on this switch buddy`);
			} else {
				if (afkObj['rushers']['second'] != [] && afkObj['rushers']['second'].includes(user.id) || afkObj['rushers']['first'] != [] && afkObj['rushers']['first'].includes(user.id)){
					if (user.bot) return;
					let reactClass = reaction.message.reactions.cache.get('762762961487134750');
					if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
					await user.send(`You can't react with more than one switch at a time. However, if no other rusher shows up, you can ask to Raid Leader to rush multiple switches.`);
				} else if (!afkObj['rushers']['second'].includes(user.id) && !afkObj['rushers']['first'].includes(user.id)) {
					await afkObj['rushers']['secret'].push(user.id);
				}
			}
		} else if (reaction.emoji.id == '686223984907255808'){ // nitro
			if(cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(user.id).roles.cache.find(r => r.id == cfg.shattersServer.nitroRole)) {
				if (afkObj['nitro'].length > 9) return user.send(`Sorry but the nitro limit has been set to 10, you weren't fast enough!`);
				afkObj['nitro'].push(user.id);
				await user.send(`As a nitro booster, you have access to early location: ${afkObj['location']}`);
				return true;
			}
			const reactN = reaction.message.reactions.cache.get('686223984907255808');
			if (user.bot) return;
			if (reactN != undefined) await reactN.users.remove(user).catch(error => console.error(err));
		} else if (reaction.emoji.id == '699664632469782599'){ // stop
			if (await powerCalculation(cli, cfg, user.id) < 2){
				cli.channels.cache.get(cfg.shattersServer.rlcommands).send(`${user} tried to react with stop but isn't allowed to.`);
				// remove stop reaction
				const reactX = reaction.message.reactions.cache.get('699664632469782599');
				if (user.bot) return;
				if (reactX != undefined) await reactX.users.remove(user).catch(error => console.error(err));
				return true;
			}
			if (reaction.message.reactions.cache.get('699664632469782599') != undefined) await reaction.message.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
			if (cpMsg.reactions.cache.get('699664632469782599') != undefined) await cpMsg.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
			if (!afkObj['postafk']){
				// normal to post afk (move out, lock)
				afkObj['postafk'] = true;
				afkObj['timeleft'] = 30;
				await reaction.message.react(cli.emojis.cache.get('699664632469782599'));

                // MOVE OUT
                var reactedPortal = [];
                var reactIDS = await afkMsg.reactions.cache.get('760021427545440276').users.fetch();
                for (var i of reactIDS){ reactedPortal.push(i[0]); }
                await cli.channels.cache.get(afkObj['channel']).members.forEach(async function(raiders){ if (!reactedPortal.includes(raiders.user.id) && await powerCalculation(cli, cfg, raiders.user.id) < 2) await cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(raiders.user.id).voice.setChannel(cli.channels.cache.get('635551563443863583')).catch(err => console.error(err)); }) // Afk channel


				// lock the channel
				await cli.channels.cache.get(afkObj['channel']).createOverwrite(cfg.shattersServer.raiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': false, 'SPEAK': false });
   				await cli.channels.cache.get(afkObj['channel']).setName(cfg.shattersServer.vc[afkObj['channelNumber']].name);
   				return true;
			}
			if (afkObj['postafk']){
				if (reaction.message.reactions.cache.get('699664632469782599') != undefined) await reaction.message.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
				afkObj['ended'] = true; // post afk to ended
			}
		}
	})

	reactionCollector.on('remove', async (reaction, user) => {
		// removing reactions, find the afk
		var afkObj;
		await afkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) afkObj = afk; })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		// easier
		var cpMsg;
		var afkMsg;
		cpMsg = await cli.channels.cache.find(chan => chan.id == cfg.shattersServer.rlcommands).messages.fetch(afkObj['controlpanel']);
		afkMsg = await cli.channels.cache.find(chan => chan.id == cfg.shattersServer.afkchecks).messages.fetch(afkObj['afkcheck']);
		//

		if (reaction.emoji.id == '760021438219550720'){ // key
			if (afkObj['key'] == user.id){
				user.send(`You have unreacted with ${cli.emojis.cache.find(e => e.id == "760021438219550720")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
				afkObj['key'] = undefined;
				cli.channels.cache.get(cfg.shattersServer.rlcommands).send(`${user} unreacted from being the main ${cli.emojis.cache.find(e => e.id == "760021438219550720")}.`);
				await cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(user.id).roles.remove(cli.guilds.cache.get(cfg.shattersServer.id).roles.cache.find(r => r.id == cfg.shattersServer.tempKeyRole).id).catch(console.error);
			}
		} else if (reaction.emoji.id == '760021427545440276'){ // portal
			afkObj['raiders'] -= 1;
		} else if (reaction.emoji.id == '760021438219550720'){ // warrior
			let index = afkObj['classes']['warrior'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['warrior'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021397832990750'){ // paladin
			let index = afkObj['classes']['paladin'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['paladin'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021407366381578'){ // priest
			let index = afkObj['classes']['priest'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['priest'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021377042087977'){ // knight
			let index = afkObj['classes']['knight'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['knight'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021387674255370'){ // mystic
			let index = afkObj['classes']['mystic'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['mystic'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021324902563840'){ // assassin
			let index = afkObj['classes']['assassin'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['assassin'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '762762960279437353'){ // first
			let index = afkObj['rushers']['first'].indexOf(user.id);
			if (index > -1) {
  				afkObj['rushers']['first'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '762762960799006721'){ // second
			let index = afkObj['rushers']['second'].indexOf(user.id);
			if (index > -1) {
  				afkObj['rushers']['second'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '762762961487134750'){ // secret
			let index = afkObj['rushers']['secret'].indexOf(user.id);
			if (index > -1) {
  				afkObj['rushers']['secret'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '686223984907255808'){ // nitro
			let index = afkObj['nitro'].indexOf(user.id);
			if (index > -1) {
  				afkObj['nitro'].splice(index, 1);
			}
		}
	})
}

async function controlPanelReactions(cli, cfg, reactionCollector){
	// handle aborting
	reactionCollector.on('collect', async (reaction, user) => {
		// adding reactions, find the afk
		var afkObj;
		await afkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) { afkObj = afk; afkLevel = 'rl' } })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		if (reaction.emoji.id == '699664632469782599'){ // stop
			if (await powerCalculation(cli, cfg, user.id) < 2){
				cli.channels.cache.get(cfg.shattersServer.rlcommands).send(`${user} tried to react with stop but isn't allowed to.`);
				// remove stop reaction
				const reactX = reaction.message.reactions.cache.get('699664632469782599');
				if (user.bot) return;
				if (reactX != undefined) await reactX.users.remove(user).catch(error => console.error(err));
				return true;
			}
			if (reaction.message.reactions.cache.get('699664632469782599') != undefined) await reaction.message.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
			afkObj['aborted'] = true;
		}
	})
}

module.exports = shattersReactionCollector;
module.exports.controlPanelReactions = controlPanelReactions;