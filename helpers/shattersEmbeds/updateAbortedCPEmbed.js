async function updateAbortedCP(cli, cfg, afkObj){
	if (afkObj['classes']['mystic'] == undefined || afkObj['classes']['mystic'].length < 1){ var mysticMessage = 'None'; } else {
	var mysticMessage = (('<@!' + afkObj['classes']['mystic'].join(', ').replace(/,/gi, '>, <@!').split(' ').join('') + '>').split(',').join(', ')); }

	if (afkObj['nitro'] == undefined || afkObj['nitro'].length < 1){ var ntrMsg = 'None'; } else {
	var ntrMsg = (('<@!' + afkObj['nitro'].join(', ').replace(/,/gi, '>, <@!').split(' ').join('') + '>').split(',').join(', ')); }

	if (afkObj['key'] == undefined){ var keyMsg = 'None'; } else { var keyMsg = afkObj['key'] };

	const channelName = cli.channels.cache.get(afkObj['channel']).name;
	const embed = {
		color: '#008502',
		footer: {
		text: `The afk check has been aborted by ${cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(afkObj['host']).displayName}`
		},
		author: {
		name: `AFK Check control panel for ${channelName}`
		},
		fields: [
		{
			name: "Our current keys are...",
			value: `${cli.emojis.cache.find(e => e.id === "760021468863266817")} ${keyMsg}`
		},
		{
			name: "Location of the run:",
			value: `> ${afkObj['location']}`
		},
		{
			name: "Our mystics are:",
			value: `${cli.emojis.cache.find(e => e.id === "760021387674255370")} ${mysticMessage}`
		},
		{
			name: "Nitro boosters with location:",
			value: `${cli.emojis.cache.find(e => e.id === "686223984907255808")} ${ntrMsg}`
		}
		]
	};

	return embed;
}

module.exports = updateAbortedCP;