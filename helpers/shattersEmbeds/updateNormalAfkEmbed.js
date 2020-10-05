async function updateNormalAfkEmbed(cli, cfg, afkObj){
	const shattersReact = cli.emojis.cache.get('760021427545440276');
	const hostUser = cli.guilds.cache.get(cfg.shattersServer.id).members.cache.get(afkObj['host']);
	const channelName = cli.channels.cache.get(afkObj['channel']).name;

	const embed = {
		description: `We are starting an afk check now, join \`${channelName}\` and react with ${shattersReact} to not get moved out! If you react with keys or classes and do not bring them, you may be suspended. **Make sure to react with the classes you're bringing!**\n\nStarting in ${((afkObj['timeleft']/60).toString()).charAt(0)} minutes and ${(afkObj['timeleft']%60)} seconds! In addition to reacting with ${shattersReact} also react...`,
		color: '#008502',
		timestamp: afkObj['started'],
		footer: {
		text: `Raiders accounted for: ${afkObj['raiders']}`
		},
		author: {
		name: `Shatters started by ${hostUser.displayName} in ${channelName}`,
		icon_url: cli.users.cache.get(afkObj['host']).avatarURL
		},
/*		fields: [
		{
			name: "If you are bringing a key, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "760021468863266817")}`,
			inline: true
		},
		{
			name: "If you are bringing a warrior, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "760021468863266817")}`,
			inline: true
		},
		{
			name: "If you are bringing a paladin, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "760021397832990750")}`,
			inline: true
		},
		{
			name: "If you are bringing a knight, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "760021377042087977")}`,
			inline: true
		},
		{
			name: "If you are bringing a priest, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "760021407366381578")}`,
			inline: true
		},
		{
			name: "If your ability is armor break, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "760021315015933953")}`,
			inline: true
		},
		{
			name: "If you are bringing a mystic, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "760021387674255370")}`,
			inline: true
		},
		{
			name: "If your mystic has an aether orb, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187061785362472")}`,
			inline: true
		},
		{
			name: "If you are bringing an assassin, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "760021324902563840")}`,
			inline: true
		},
		{
			name: "If you are rushing 1st, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "762762960279437353")}`,
			inline: true
		},
		{
			name: "If you are rushing 2nd, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "762762960799006721")}`,
			inline: true
		},
		{
			name: "If you are rushing secret, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "762762961487134750")}`,
			inline: true
		}
		]*/
	};

	return embed;
}

module.exports = updateNormalAfkEmbed;