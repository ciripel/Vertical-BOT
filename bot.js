const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();
var auth = require('./auth.json');
var current_block = 1;
var current_diff = 1;

/*function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}*/

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if(msg.content.substring(0, 1) === '?') {
    if(msg.webhookID === null) {
      if(msg.channel.name === 'bot-commands' || msg.channel.type === 'dm' || msg.member.roles.find('name', 'Vertical Team') || msg.member.roles.find('name', 'Vertical Admins') || msg.member.roles.find('name', 'Bot Developer')){
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        var cmd1 = args[0];
        switch(cmd) {
        case 'netinfo':
          fetch('https://explorer.vertical.ovh/api/getdifficulty')
            .then(res => res.json())
            .then(json => current_diff = Math.floor(json*1000)/1000);
          fetch('https://explorer.vertical.ovh/api/tx/latest')
            .then(res => res.json())
            .then(json => current_block = json[0].blockHeight);
          fetch('https://explorer.vertical.ovh/api/getnetworkhashps')
            .then(res => res.json())
            .then(json => {switch (true){
            case json >= Math.pow(10,12):
              msg.channel.send('• Block Height •           **' + current_block +'**\n• Network Hashrate • **' + Math.floor(json/1000000000)/1000 + '** TH/s\n• Network Difficulty • **' + current_diff + '**');
              break;
            case json >= Math.pow (10,9):
              msg.channel.send('• Block Height •           **' + current_block +'**\n• Network Hashrate • **' + Math.floor(json/1000000)/1000 + '** GH/s\n• Network Difficulty • **' + current_diff + '**');
              break;
            case json >= Math.pow (10,6):
              msg.channel.send('• Block Height •           **' + current_block +'**\n• Network Hashrate • **' + Math.floor(json/1000)/1000 + '** MH/s\n• Network Difficulty • **' + current_diff + '**');
              break;
            case json >= Math.pow (10,3):
              msg.channel.send('• Block Height •           **' + current_block +'**\n• Network Hashrate • **' + Math.floor(json)/1000 + '** KH/s\n• Network Difficulty • **' + current_diff + '**');
              break;
            default:
              msg.channel.send('• Block Height •           **' + current_block +'**\n• Network Hashrate • **' + Math.floor(json*1000)/1000 + '** H/s\n• Network Difficulty • **' + current_diff + '**');
              break;
            }
            });
          break;
        case 'help':
          msg.channel.send('-- `?help` | This is your help.\n-- `?links` | Useful links.\n-- `?netinfo` | Show current network stats.\n-- `?mninfo` | Masternodes info.\n-- `?hpow [your Kh/s]` | Approximate VTL per hour/day.\n-- `?mnrewards [no. of nodes]` | Approximate VTL reward per day.\n-- `?exchange` | Current Verticalcoin exchanges.\n-- `?pool [POOL]` | Verticalcoin mining pools [_connection info_].\n-- `?about` | Info about this bot.');
          break;
        case 'links':
          msg.channel.send('**Vertical Website** • <http://verticalcoin.io/>\n**Vertical Announcement** • <https://bitcointalk.org/index.php?topic=3921947>\n**Vertical Whitepaper** • <http://verticalcoin.io/Vertical-Whitepaper.pdf>\n**Vertical Github** • <https://github.com/verticalcoin/>\n**Vertical Wallets** • <https://github.com/verticalcoin/verticalcoin/releases>\n**Vertical Block Explorer** • <https://explorer.vertical.ovh/#/>\n**Vertical Community** • <https://twitter.com/vtlcoin/> <https://www.reddit.com/r/vtlcoin/> <https://www.youtube.com/channel/UC9sWnlAVxjAZyfCIxjolQqw/>');
          break;
        case 'about':
          msg.channel.send('• Version 1.0\n• Author: ciripel _(Discord: Amitabha#0517)_\n• Source Code: <https://github.com/ciripel/Vertical-BOT>\n• _This bot idea was born and grew with <https://akroma.io/>._');
          break;
        case 'hpow':
          fetch('https://explorer.vertical.ovh/api/getdifficulty')
            .then(res => res.json())
            .then(json => {switch (true) {
            case args[0]===undefined:
              msg.channel.send('Input your hashpower in Mh/s, like `?hpow 123`.');
              break;
            case isNaN(args[0]):
              msg.channel.send('Input your hashpower in Mh/s, like `?hpow 123`.');
              break;
            case args[0]==='0':
              msg.channel.send('Value = 0? Why stress me. You are no miner.');
              break;
            case args[0]<0:
              msg.channel.send('Hashpower must be positive number');
              break;
            default:
              msg.channel.send('Current network difficulty is **'+ Math.floor(json*1000)/1000 + '**.\n' + 'A hashrate of **'+ args[0] + ' Mh/s** will get you approximately **' + Math.floor(args[0]*3000/json*36*24/120)/1000 + ' VTL** per **hour** and **' + Math.floor(args[0]*3000/json*36*24*24/120)/1000 + ' VTL** per **day** at current network difficulty.');
              break;
            }
            });
          break;
        case 'mninfo':
          fetch('https://explorer.vertical.ovh/api/masternodecount')
            .then(res => res.json())
            .then(json => msg.channel.send('• Total nodes•      **' + json.total + '**\n• Enabled nodes• **' + json.enabled + '**\n• Install Guide • <https://github.com/Dwigt007/VerticalMasternodeSetup>'));
          break;
        case 'mnrewards':
          fetch('https://explorer.vertical.ovh/api/masternodecount')
            .then(res => res.json())
            .then(json => {switch (true) {
            case args[0]===undefined:
              msg.channel.send('**1** masternode(s) will give you approximately **' + Math.floor(3600000*24/120*8/json.enabled)/1000 + ' VTL** per **day**.');
              break;
            case isNaN(args[0]):
              msg.channel.send('Input the the number of nodes, like `?mnrewards 1`.');
              break;
            case args[0]==='0':
              msg.channel.send('0 masternodes will give u 0 coins... Really?');
              break;
            case args[0]<0:
              msg.channel.send('Yup no masternodes for you friend.');
              break;
            default:
              msg.channel.send('**'+args[0]+'** masternode(s) will give you approximately **' + Math.floor(3600000*24/120*8/json.enabled*args[0])/1000 + ' VTL** per **day**.');
              break;
            }
            });
          break;
        case 'exchange':
          switch (cmd1){
          case undefined:
            //                    msg.channel.send('• **Stocks.Exchange** • <https://stocks.exchange/trade/VTL/BTC>\n• **Graviex** • <https://graviex.net/markets/vtlbtc>\n\nUse `!exchange stats` for additional info')
            msg.channel.send('_Here you can check all the links of the exchanges and some additional information when it will be available!_\n\nUse `?exchange stats` for additional info');
            break;
          case 'stats':
            //                    fetch('https://stocks.exchange/api2/ticker')
            //                        .then(res => res.json())
            //                        .then(json => { if (json[fix].market_name != 'VTL_BTC'){
            //                           for (i=0;i<json.length;i++){
            //                            if (json[i].market_name == 'VTL_BTC') {fix=i; break;}}
            //                                          }
            //                            msg.channel.send('\n• Last price:  **' + json[fix].last +' BTC**\n• 24h Change:  **' + Math.floor((json[fix].last-json[fix].lastDayAgo)/json[fix].lastDayAgo*1000000)/10000 + '%**\n• 24h Max Buy:  **' + json[fix].ask + ' BTC**\n• 24h Min Sell:  **' + json[fix].bid + ' BTC**\n• 24h Volume:  **' + Math.floor(json[fix].vol*1000)/1000 +' AKA** | **' + Math.floor(json[fix].vol*json[fix].last*1000)/1000 + ' BTC**\n')
            msg.channel.send('_Exchange stats when it will be available!_');
            //                                      });
            break;
          default:
            msg.channel.send('Maybe you wanted to write `?exchange` or `?exchange stats`?');
            break;}
          break;
        /*  case 'vtlusd':
            fetch('https://api.vertical.io/prices')
            .then(res => res.json())
            .then (json => {switch(true) {
                case args[0]===undefined:
                    msg.channel.send('_Today the approximate price of ***1 VTL*** is ***' + json.usdRaw +'$*** and yesterday was ***' + json.usdDayAgoRaw + '$***._')
                break;
                case isNaN(args[0]):
                    msg.channel.send('_Today the approximate price of ***1 VTL*** is ***' + json.usdRaw +'$*** and yesterday was ***' + json.usdDayAgoRaw + '$***._')
                break;
                case args[0]==='0':
                    msg.channel.send('Welcome young one! We have all started with **0 VTL** zilions of aeons ago!')
                break;
                case args[0]<0:
                    msg.channel.send('Hmm! Yup! I feel sorry for you! You owe **VTL**... I feel your pain friend!')
                break;
                default:
                    msg.channel.send('**' + args[0] +' VTL** = **' + json.usdRaw*args[0] + '$**\n _Today the approximate price of ***1 VTL*** is ***' + json.usdRaw +'$*** and yesterday was ***' + json.usdDayAgoRaw + '$***._')
                break;
                               }
                           });
        break;*/
        case 'pool':
          switch (cmd1){
          case undefined:
            msg.channel.send('-- `?pool bsod` | Bsod.pw <https://bsod.pw/>\n-- `?pool hive` | TheHIVE <https://hive.gulfcoastmining.com/>\n-- `?pool umin` | UMine <https://umine.org/>\n-- `?pool icem` | IceMining <https://icemining.ca/>\n-- `?pool arcp` | ArcPool <https://arcpool.com/>\n-- `?pool tank` | AltTank Mining <https://www.alttank.ca/>\n-- `?pool fish` | Shit.Fish <https://vtl.shit.fish/>\n-- `?pool crun` | BlockCruncher <https://blockcruncher.com/>\n-- `?pool angr` | Angry Pool <http://angrypool.com/>\n-- `?pool evil` | Private Evil <http://evil.ru/>\n-- `?pool gosc` | Gos.cx <https://gos.cx/>\n-- `?pool cryp` | CryptoPool Party <https://cryptopool.party/>\n-- `?pool asia` | Asia Pool <https://asiapool.trade/>\n-- `?pool noto` | NotoHash <https://notohash.club/>\n-- `?pool coin` | COIN-Miners <https://coin-miners.club/>\n-- `?pool powr` | Power Mining <https://www.powermining.pw/>\n-- `?pool harv` | CoinHarvest <https://pool.coinharvest.io/>\n-- `?pool jgpl` | MiningJGPool <https://miningjgpool.ovh/>\n-- `?pool weed` | Weekend Pool <http://weekendpool.com/>\n-- `?pool futu` | Future Coins <https://futurecoins.club/>\n\nUse `?pool [POOL]` for specific mining details\n_Please spread the hashpower across all pools._');
            break;
          case 'bsod':
            msg.channel.send('```prolog\nTheBSODPool connection info.```\nWebsite: <https://bsod.pw/>\nDefault port: `2286`\nEU server: `eu.bsod.pw`\nUS server: `us.bsod.pw`\nAsia server: `asia.bsod.pw`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://eu.bsod.pw:2286 -u WALLET.rig -p c=VTL```');
            break;
          case 'hive':
            msg.channel.send('```prolog\nTheHIVE Pool connection info.```\nWebsite: <https://hive.gulfcoastmining.com/>\nDefault port: `4559`\nUS server: `hive.gulfcoastmining.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://hive.gulfcoastmining.com:4559 -u WALLETADDRESS.rigname -p c=VTL\nsgminer -k lyra2z -o stratum+tcp://hive.gulfcoastmining.com:4559 -u WALLETADDRESS.rigname -p c=VTL```');
            break;
          case 'umin':
            msg.channel.send('```prolog\nUMine Pool connection info.```\nWebsite: <https://umine.org/>\nDefault port: `4553`\nDefault server: `s.umine.org`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://s.umine.org:4553 -u WALLET_ADDRESS -p c=VTL -R 3```');
            break;
          case 'icem':
            msg.channel.send('```prolog\nIceMining Pool connection info.```\nWebsite: <https://icemining.ca/>\nDefault port: `4554`\nDefault server: `mine.icemining.ca`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://mine.icemining.ca:4554 -u <WALLET ADDRESS> -p c=VTL```');
            break;
          case 'arcp':
            msg.channel.send('```prolog\nArcPool connection info.```\nWebsite: <https://arcpool.com/>\nDefault port: `1728`\nEU server: `eu1.arcpool.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://eu1.arcpool.com:1728 -u <WALLET_ADDRESS> -p c=VTL```');
            break;
          case 'tank':
            msg.channel.send('```prolog\nAltTank Mining Pool connection info.```\nWebsite: <https://www.alttank.ca/>\nDefault port: `4555`\nDefault server: `pool.alttank.ca`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer ccminer -a lyra2z -o stratum+tcp://pool.alttank.ca:4555 -u <WALLET_ADDRESS>.rig1 -p c=VTL\nsgminer sgminer -k lyra2z -o stratum+tcp://pool.alttank.ca:4555 -u WALLET_ADDRESS.rig1 -p c=VTL```');
            break;
          case 'fish':
            msg.channel.send('```prolog\nShit.Fish Pool connection info.```\nWebsite: <https://vtl.shit.fish/>\nDefault port: `4553`\nDefault server: `vtl.shit.fish`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://vtl.shit.fish:4553 -u <WALLET_ADDRESS>.rig_name -p c=VTL```');
            break;
          case 'crun':
            msg.channel.send('```prolog\nBlockCruncher Pool connection info.```\nWebsite: <https://blockcruncher.com/>\nDefault port: `4553`\nDefault server: `blockcruncher.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://blockcruncher.com:4553 -u <WALLET ADDRESS> -p c=VTL```');
            break;
          case 'angr':
            msg.channel.send('```prolog\nAngry Pool connection info.```\nWebsite: <http://angrypool.com/>\nDefault port: `20077`\nDefault server: `angrypool.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://angrypool.com:20077 -u <WALLETID>.rig1 -p c=VTL```');
            break;
          case 'evil':
            msg.channel.send('```prolog\nPrivate Evil Pool connection info.```\nWebsite: <http://evil.ru/>\nDefault port: `4553`\nDefault server: `evil.ru`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://evil.ru:4553 -u <WALLETID>.rig1 -p c=VTL```');
            break;
          case 'gosc':
            msg.channel.send('```prolog\nGos.Cx Pool connection info.```\nWebsite: <https://gos.cx/>\nDefault port: `4554`\nDefault server: `stratum.gos.cx`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://stratum.gos.cx:4554 -u <WALLETID>.rig1 -p c=VTL```');
            break;
          case 'cryp':
            msg.channel.send('```prolog\nCryptoPool Party connection info.```\nWebsite: <https://cryptopool.party/>\nDefault port: `4553`\nDefault server: `cryptopool.party`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://cryptopool.party:4553 -u <WALLETID>.rig1 -p c=VTL```');
            break;
          case 'asia':
            msg.channel.send('```prolog\nAsia Pool connection info.```\nWebsite: <https://asiapool.trade/>\nDefault port: `4554`\nDefault server: `miner.asiapool.trade`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://miner.asiapool.trade:4554 -u waller-addr.rig1 -p c=VTL```');
            break;
          case 'noto':
            msg.channel.send('```prolog\nNotoHash Pool connection info.```\nWebsite: <https://notohash.club/>\nDefault port: `4553`\nDefault server: `notohash.club`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://notohash.club:4553 -u WALLET_ADDRESS -p c=VTL```');
            break;
          case 'coin':
            msg.channel.send('```prolog\nCOIN-Miners Pool connection info.```\nWebsite: <https://coin-miners.club/>\nDefault port: `4553`\nDefault server: `coin-miners.club`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://coin-miners.club:4553 -u WALLET_ADDRESS -p c=VTL```');
            break;
          case 'powr':
            msg.channel.send('```prolog\nPower Mining Pool connection info.```\nWebsite: <https://www.powermining.pw/>\nDefault port: `4553`\nDefault server: `pool.powermining.pw`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://pool.powermining.pw:4553 -u <WALLET ADDRESS> -p c=VTL\nsgminer -k lyra2z -o stratum+tcp://pool.powermining.pw:4553 -u <WALLET ADDRESS> -p c=VTL```');
            break;
          case 'harv':
            msg.channel.send('```prolog\nCoinHarvest Pool connection info.```\nWebsite: <https://pool.coinharvest.io/>\nDefault port: `4554`\nDefault server: `pool.coinharvest.io`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://pool.coinharvest.io:3554 -u WALLET_ADDRESS -p c=VTL```');
            break;
          case 'jgpl':
            msg.channel.send('```prolog\nMiningJGPool connection info.```\nWebsite: <https://miningjgpool.ovh/>\nDefault port: `4553`\nDefault server: `miningjgpool.ovh`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://miningjgpool.ovh:4553 -u YOUR_WALLET_ADDRESS -p c=VTL```');
            break;
          case 'weed':
            msg.channel.send('```prolog\nWeekend Pool connection info.```\nWebsite: <http://weekendpool.com/>\nDefault port: `4553`\nDefault server: `weekendpool.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://weekendpool.com:4553 -u YOUR_WALLET_ADDRESS -p c=VTL```');
            break;
          case 'futu':
            msg.channel.send('```prolog\nFuture Coins Pool connection info.```\nWebsite: <https://futurecoins.club/>\nDefault port: `4553`\nDefault server: `futurecoins.club`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://futurecoins.club:4553 -u YOUR_WALLET_ADDRESS -p c=VTL```');
            break;
          default:
            msg.channel.send('Unrecognized pool. Please check again.');
            break;}
          break;
        default:
          msg.channel.send('Command not recognized. `?help` to get a list of commands.');
          break;
        }
      }
    }
  }
});

client.login(auth.token);
