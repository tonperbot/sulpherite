const afkArray = [];
const powerCalculation = require('../commands/commands.js').powerCalculation;

async function afkUpdate(cli, cfg){
	// update all afks
	await afkArray.forEach(async afk => {
		const afkMsg = await cli.channels.cache.find(chan => chan.id == cfg.shattersServer.afkchecks).messages.fetch(afk['afkcheck']);
		const cpMsg = await cli.channels.cache.find(chan => chan.id == cfg.shattersServer.rlcommands).messages.fetch(afk['controlpanel']);
		if (afkMsg == undefined || cpMsg == undefined) return;

		// setup directory
		var directoryEmbed;
		if (afk['type'] == 'shatters') directoryEmbed = `shattersEmbeds`;
		if (afk['type'] == 'void') directoryEmbed = `voidEmbeds`;
		if (afk['type'] == 'cult') directoryEmbed = `cultEmbeds`;
		if (afk['type'] == 'fungal') directoryEmbed = `fungalEmbeds`;

		// setup portal reaction
		var portalReact;
		if (afk['type'] == 'shatters') portalReact = `679186863264628736`; // shatters portal
		if (afk['type'] == 'void') portalReact = `686217948880568384`; // void portal
		if (afk['type'] == 'cult') portalReact = `686217948918185994`; // cult portal
		if (afk['type'] == 'fungal') portalReact = `686223695827828774`; // fungal portal

		afk['timeleft'] -= 5;

		// handle embeds
		if (!afk['aborted']){
			if (!afk['ended']){
				if (afk['timeleft'] <= 0){
					if (!afk['postafk']){
						// move out, normal -> post afk
						if (afkMsg.reactions.cache.get('699664632469782599') != undefined) await afkMsg.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
						if (cpMsg.reactions.cache.get('699664632469782599') != undefined) await cpMsg.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
						await afkMsg.react(cli.emojis.cache.get('699664632469782599'));
						afk['postafk'] = true;
						afk['timeleft'] = 30;

						// Move out to afk
						var reactedPortal = [];
						var reactIDS = await afkMsg.reactions.cache.get(portalReact).users.fetch();
						for (var i of reactIDS){ reactedPortal.push(i[0]); }
						await cli.channels.cache.get(afk['channel']).members.forEach(async function(raiders){ if (!reactedPortal.includes(raiders.user.id) && await powerCalculation(cli, cfg, raiders.user.id) < 2) await cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(raiders.user.id).voice.setChannel(cli.channels.cache.get('635413437647683602')).catch(err => console.error(err)); }) // Afk channel

						// locks the channel
						await cli.channels.cache.get(afk['channel']).createOverwrite(cfg.shattersServer.raiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': false, 'SPEAK': false });
   						await cli.channels.cache.get(afk['channel']).setName(cfg.shattersServer.vc[afk['channelNumber']].name);
					} else {
						// post afk -> ended
						if (afkMsg.reactions.cache.get('699664632469782599') != undefined) await afkMsg.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
						afk['ended'] = true;
					}
				} else {
					if (!afk['postafk']){
						// normal embed
						let afkEmbed = await require(`./${directoryEmbed}/updateNormalAfkEmbed.js`)(cli, cfg, afk);
						let cpEmbed = await require(`./${directoryEmbed}/updateNormalCPEmbed.js`)(cli, cfg, afk);
						await afkMsg.edit({ embed: afkEmbed });
						await cpMsg.edit('', { embed: cpEmbed });

					} else {
						// post afk embed
						let afkEmbed = await require(`./${directoryEmbed}/updatePostAfkEmbed.js`)(cli, cfg, afk);
						let cpEmbed = await require(`./${directoryEmbed}/updatePostCPEmbed.js`)(cli, cfg, afk);
						await afkMsg.edit({ embed: afkEmbed });
						await cpMsg.edit('', { embed: cpEmbed });
					}
				}
			} else {
				// ended embed then remove from afk array
				let afkEmbed = await require(`./${directoryEmbed}/updateEndedAfkEmbed.js`)(cli, cfg, afk);
				let cpEmbed = await require(`./${directoryEmbed}/updateEndedCPEmbed.js`)(cli, cfg, afk);
				await afkMsg.edit('', { embed: afkEmbed });
				await cpMsg.edit('', { embed: cpEmbed });

				// auto logging runs done + key
				var reactIDS = await afkMsg.reactions.cache.get(portalReact).users.fetch();

				let index = afkArray.indexOf(afk);
				if (index > -1) {
  					afkArray.splice(index, 1);
				}
				console.log(`removed afk from array because of end`);
			}
		} else {
			// aborted embed then remove from afk array
			let afkEmbed = await require(`./${directoryEmbed}/updateAbortedAfkEmbed.js`)(cli, cfg, afk);
			let cpEmbed = await require(`./${directoryEmbed}/updateAbortedCPEmbed.js`)(cli, cfg, afk);
			await afkMsg.edit('', { embed: afkEmbed });
			await cpMsg.edit('', { embed: cpEmbed });

			// lock channel
			await cli.channels.cache.get(afk['channel']).createOverwrite(cfg.shattersServer.raiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': false, 'SPEAK': false });
   			await cli.channels.cache.get(afk['channel']).setName(cfg.shattersServer.vc[afk['channelNumber']].name);

   			// remove from array
			let index = afkArray.indexOf(afk);
			if (index > -1) {
  				afkArray.splice(index, 1);
			}
			if (afkMsg.reactions.cache.get('699664632469782599') != undefined) await afkMsg.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
			console.log(`removed afk from array because of abort`);
		}
	})
}

module.exports = afkUpdate;
module.exports.afkArray = afkArray;