async function help(cli, cfg, data){
	const embed = {
		"title": "***All the commands you can use on your server!***",
		"color": 2900657,
		"footer": {
			"text": "Capitalization does not matter when using the commands."
		}, "fields":
		[
		{
			"name": "**__Raiding:__**", "value": "```fix\nafk; hc; location; clear; lock; unlock```"
		}]
	};

// help command
	if (!data.content.toLowerCase().split(' ')[1]){
		await data.channel.send({ embed });
	} else {
		switch(data.content.toLowerCase().split(' ')[1]){
			case 'headcount': case 'hc':
				return data.channel.send(`**\*headcount (\*hc) [type]** : *Puts up a headcount in the raid status announcement.*`);
				break;
			case 'cmds': case 'help': case 'commands':
				return data.channel.send(`**\*commands (\*help, \*cmds) (command name for help)** : *Outputs this or command description, does not work in general, loots-n-oofs or raid-chat.*`);
				break;
			case 'clear': case 'clean':
				return data.channel.send(`**\*clear (\*clean) [# (1-3)]** : *Clears a specific channel of its raiders.*`);
				break;
			case 'lock':
				return data.channel.send(`**\*lock (none) [# (1-3)]** : *Locks a specific channel for raiders to enter from.*`);
				break;
			case 'unlock':
				return data.channel.send(`**\*unlock (none) [# (1-3)]** : *Unlocks a specific channel for raiders to enter from.*`);
				break;
			case 'afk':
				return data.channel.send(`**\*afk (none) [# (1-3)] [type (s)] [location]** : *Creates an afk check in the raid status announcement.*`);
				break;
			case 'location': case 'loc':
				return data.channel.send(`**\*location [new location]** : *Sets a new location for the authors afk check.*`);
				break;
			default:
				return data.channel.send(`unknown command sir`);
				break;
		}
	}
}

module.exports = help;