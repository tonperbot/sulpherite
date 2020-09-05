const Discord = require('discord.js');
const cli = new Discord.Client({ fetchAllMembers: true, sync: true });
const cfg = require('./config.js');

// heroku part
const express = require('express');
const http = require("http");
const path = require('path');
const app = express()

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/static/index.html'));
})

app.listen(process.env.PORT, function () {
	console.log('heroku is on')
})

cli.on('ready', async () => {
	cli.user.setActivity(cfg.status, { type: ``});
	console.log('Cheems is on Shatters!');

	setInterval(function() {
        require('./helpers/afkUpdater.js')(cli, cfg);
        require('./helpers/vetAfkUpdater.js')(cli, cfg);
        console.log(`afk update, ones existing: ${require('./helpers/afkUpdater.js').afkArray}, vet ones: ${require('./helpers/vetAfkUpdater.js').vetAfkArray}`);
    }, 5000);

	// ping heroku
	setInterval(function() {
    	http.get("http://sulpherite.herokuapp.com");
	}, 300000); // every 5 minutes (300000

})


// Main handle
cli.on('message', async (data) => {
	if (data.author.bot) return;

	// commands (wip: separate user and rl commands before handling them)
	if (data.channel.type != 'dm' && data.guild.id == cfg.shattersServer.id){
		// check if bot is alive slurp : rl side
		// rl chans -> raiding commands, everything else: everywhere, then separate with roles needed for a command
		return require('./commands/commands.js')(cli, cfg, data);
	}
})


// Login with token
cli.login(process.env.TOKEN);