async function vetlock(cli, cfg, data){
    const args = data.content.toLowerCase().split(' ');

    if (args[1] == undefined || isNaN(args[1])) return data.channel.send(`Invalid channel number (available: 1-${cfg.shattersServer.vetRaidingChannelsAmount}).`);
    if (!isNaN(args[1]) && (args[1] > cfg.shattersServer.vetRaidingChannelsAmount || args[1] < 1)) return data.channel.send(`Invalid channel number (available: 1-${cfg.shattersServer.vetRaidingChannelsAmount}).`);

    await cli.channels.cache.get(cfg.shattersServer.vetVc[args[1]].id).createOverwrite(cfg.shattersServer.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
    await cli.channels.cache.get(cfg.shattersServer.vetVc[args[1]].id).setName(`${cfg.shattersServer.vetVc[args[1]].name} <-- Join!`);
    await data.channel.send(`Unlocked channel ${cfg.shattersServer.vetVc[args[1]].name.toLowerCase()}`);
}

module.exports = vetlock;