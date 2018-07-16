const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();
const auth = require('./auth.json');
let current_block = 1;
let current_diff = 1;
let total_supply = 1;
let fix = 0;
let i = 0;
let ticker_vtlltc = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  fetch('https://explorer.vertical.ovh/api/tx/latest')
    .then(res => res.json())
    .then(json => current_block = json[0].blockHeight)
    .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/tx/latest.\nError: \n-----------\n${error}\n-----------`));
  fetch('https://explorer.vertical.ovh/api/getdifficulty')
    .then(res => res.json())
    .then(json => current_diff = Math.floor(json*1000)/1000)
    .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/getdifficulty.\nError: \n-----------\n${error}\n-----------`));
  fetch('https://explorer.vertical.ovh/api/supply')
    .then(res => res.json())
    .then(json => total_supply = json.t)
    .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/supply.\nError: \n-----------\n${error}\n-----------`));
  fetch('https://safe.trade/api/v2/tickers/vtlltc')
    .then(res => res.json())
    .then(json => ticker_vtlltc = json)
    .catch(error => console.log(`Can't connect to https://safe.trade/api/v2/tickers/vtlltc.\nError: \n-----------\n${error}\n-----------`));
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
            .then(json => current_diff = Math.floor(json*1000)/1000)
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/getdifficulty.\nError: \n-----------\n${error}\n-----------`));
          fetch('https://explorer.vertical.ovh/api/tx/latest')
            .then(res => res.json())
            .then(json => current_block = json[0].blockHeight)
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/tx/latest.\nError: \n-----------\n${error}\n-----------`));
          fetch('https://explorer.vertical.ovh/api/getnetworkhashps')
            .then(res => res.json())
            .then(json => {switch (true){
            case json >= Math.pow(10,12):
              msg.channel.send(`• Block Height •           **${current_block}**\n• Network Hashrate • **${Math.floor(json/1000000000)/1000}** TH/s\n• Network Difficulty • **${current_diff}**`);
              break;
            case json >= Math.pow (10,9):
              msg.channel.send(`• Block Height •           **${current_block}**\n• Network Hashrate • **${Math.floor(json/1000000)/1000}** GH/s\n• Network Difficulty • **${current_diff}**`);
              break;
            case json >= Math.pow (10,6):
              msg.channel.send(`• Block Height •           **${current_block}**\n• Network Hashrate • **${Math.floor(json/1000)/1000}** MH/s\n• Network Difficulty • **${current_diff}**`);
              break;
            case json >= Math.pow (10,3):
              msg.channel.send(`• Block Height •           **${current_block}**\n• Network Hashrate • **${Math.floor(json)/1000}** KH/s\n• Network Difficulty • **${current_diff}**`);
              break;
            default:
              msg.channel.send(`• Block Height •           **${current_block}**\n• Network Hashrate • **${Math.floor(json*1000)/1000}** H/s\n• Network Difficulty • **${current_diff}**`);
              break;
            }
            })
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/getnetworkhashps.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'help':
          msg.channel.send('-- `?help` | This is your help.\n-- `?links` | Useful links.\n-- `?netinfo` | Show current network stats.\n-- `?mninfo` | Masternodes info.\n-- `?hpow [your Kh/s]` | Approximate VTL per hour/day.\n-- `?mnrewards [no. of nodes]` | Approximate VTL reward per day.\n-- `?vtlusd [amount]` | Current price in USD.\n-- `?coininfo` | Show coin info.\n-- `?exchange [EXCHANGE]` | Current Verticalcoin exchanges [_exchange info_].\n-- `?pool [POOL]` | Verticalcoin mining pools [_connection info_].\n-- `?about` | Info about this bot.');
          break;
        case 'links':
          msg.channel.send('**Vertical Website** • <http://verticalcoin.io/>\n**Vertical Announcement** • <https://bitcointalk.org/index.php?topic=3921947>\n**Vertical Whitepaper** • <http://verticalcoin.io/Vertical-Whitepaper.pdf>\n**Vertical Github** • <https://github.com/verticalcoin/>\n**Vertical Wallets** • <https://github.com/verticalcoin/verticalcoin/releases>\n**Vertical Block Explorer** • <https://explorer.vertical.ovh/#/>\n**Vertical Community** • <https://twitter.com/vtlcoin/> <https://www.reddit.com/r/vtlcoin/> <https://www.youtube.com/channel/UC9sWnlAVxjAZyfCIxjolQqw/>');
          break;
        case 'about':
          msg.channel.send('• Version 1.2\n• Author: ciripel _(Discord: Amitabha#0517)_\n• Source Code: <https://github.com/ciripel/Vertical-BOT>\n• _This bot idea was born and grew with <https://akroma.io/>._');
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
              msg.channel.send('Hashpower must be positive number, don\'t you think?:thinking:');
              break;
            default:
              msg.channel.send(`Current network difficulty is **${Math.floor(json*1000)/1000}**.\nA hashrate of **${args[0]} Mh/s** will get you approximately **${Math.floor(args[0]*3000/json*36*24/120)/1000} VTL** per **hour** and **${Math.floor(args[0]*3000/json*36*24*24/120)/1000} VTL** per **day** at current network difficulty.`);
              break;
            }
            })
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/getdifficulty.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'mninfo':
          fetch('https://explorer.vertical.ovh/api/masternodecount')
            .then(res => res.json())
            .then(json => msg.channel.send(`• Total nodes•      **${json.total}**\n• Enabled nodes• **${json.enabled}**\n• Install Guide • <https://github.com/Dwigt007/VerticalMasternodeSetup>`))
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/masternodecount.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'mnrewards':
          fetch('https://explorer.vertical.ovh/api/masternodecount')
            .then(res => res.json())
            .then(json => {switch (true) {
            case args[0]===undefined:
              msg.channel.send(`**1** masternode(s) will give you approximately **${Math.floor(3600000*24/120*8/json.enabled)/1000} VTL** per **day**.`);
              break;
            case isNaN(args[0]):
              msg.channel.send('Input the the number of nodes, like `?mnrewards 1`.');
              break;
            case args[0]==='0':
              msg.channel.send('0 masternodes will give u 0 coins... Really?');
              break;
            case args[0]<0:
              msg.channel.send('Yup no masternodes for you friend. Looks like someone else got your masternodes.');
              break;
            default:
              msg.channel.send(`**${args[0]}** masternode(s) will give you approximately **${Math.floor(3600000*24/120*8/json.enabled*args[0])/1000} VTL** per **day**`);
              break;
            }
            })
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/masternodecount.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'exchange':
          switch (cmd1){
          case undefined:
            msg.channel.send('-- `?exchange grav` | **Graviex** • <https://graviex.net/markets/vtlbtc>\n-- `?exchange brid` | **CryptoBridge** • <https://wallet.crypto-bridge.org/market/BRIDGE.VTL_BRIDGE.BTC>\n-- `?exchange safe` | **Safe.Trade** • <https://safe.trade/trading/vtlsafe> | <https://safe.trade/trading/vtlltc>\n\nUse `?exchange [EXCHANGE]` for additional info');
            break;
          case 'grav':
            fetch('https://graviex.net/api/v2/tickers/vtlbtc')
              .then(res => res.json())
              .then(json =>
                msg.channel.send(`• Last price:  **${json.ticker.last} BTC**\n• 24h Change:  **${Math.floor(json.ticker.change*1000)/1000}%**\n• 24h Max Buy:  **${json.ticker.high} BTC**\n• 24h Min Sell:  **${json.ticker.low} BTC**\n• 24h Volume:  **${Math.floor(json.ticker.vol*1000)/1000} VTL** | **${Math.floor(json.ticker.volbtc*1000)/1000} BTC**`)
              )
              .catch(error => console.log(`Can't connect to https://graviex.net/api/v2/tickers/vtlbtc.\nError: \n-----------\n${error}\n-----------`));
            break;
          case 'brid':
            fetch('https://api.crypto-bridge.org/api/v1/ticker')
              .then(res => res.json())
              .then(json => { if (json[fix].id != 'VTL_BTC'){
                for (i=0;i<json.length;i++){
                  if (json[i].id == 'VTL_BTC') {fix=i; break;}}
              }
              msg.channel.send(`• Last price:  **${json[fix].last} BTC**\n• 24h Max Buy:  **${json[fix].ask} BTC**\n• 24h Min Sell:  **${json[fix].bid} BTC**\n• 24h Volume:  **${Math.floor(json[fix].volume*1000)/1000} BTC**`);
              })
              .catch(error => console.log(`Can't connect to https://api.crypto-bridge.org/api/v1/ticker.\nError: \n-----------\n${error}\n-----------`));
            break;
          case 'safe':
            fetch('https://safe.trade/api/v2/tickers/vtlltc')
              .then(res => res.json())
              .then(json => ticker_vtlltc = json)
              .catch(error => console.log(`Can't connect to https://safe.trade/api/v2/tickers/vtlltc.\nError: \n-----------\n${error}\n-----------`));
            fetch('https://safe.trade/api/v2/tickers/vtlsafe')
              .then(res => res.json())
              .then(json =>
                msg.channel.send(`• Last price:  **${json.ticker.last} SAFE**\n• Current buy price:  **${json.ticker.buy} SAFE**\n• Current sell price:  **${json.ticker.sell} SAFE**\n• 24h Max Buy:  **${json.ticker.high} SAFE**\n• 24h Min Sell:  **${json.ticker.low} SAFE**\n• 24h Volume:  **${Math.floor(json.ticker.vol*1000)/1000} VTL**\n---------------------------------\n• Last price:  **${ticker_vtlltc.ticker.last} LTC**\n• Current buy price:  **${ticker_vtlltc.ticker.buy} LTC**\n• Current sell price:  **${ticker_vtlltc.ticker.sell} LTC**\n• 24h Max Buy:  **${ticker_vtlltc.ticker.high} LTC**\n• 24h Min Sell:  **${ticker_vtlltc.ticker.low} LTC**\n• 24h Volume:  **${Math.floor(ticker_vtlltc.ticker.vol*1000)/1000} VTL**`)
              )
              .catch(error => console.log(`Can't connect to https://graviex.net/api/v2/tickers/vtlbtc.\nError: \n-----------\n${error}\n-----------`));
            break;
          default:
            msg.channel.send('Maybe you wanted to write `?exchange` or `?exchange [EXCHANGE]`?');
            break;}
          break;
        case 'vtlusd':
          fetch('https://explorer.vertical.ovh/api/coin')
            .then(res => res.json())
            .then (json => {switch(true) {
            case args[0]===undefined:
              msg.channel.send(`_Today the approximate price of ***1 VTL*** is ***${Math.floor(json.usd*1000)/1000}$.***_`);
              break;
            case isNaN(args[0]):
              msg.channel.send(`_Today the approximate price of ***1 VTL*** is ***${Math.floor(json.usd*1000)/1000}$.***_`);
              break;
            case args[0]==='0':
              msg.channel.send('Welcome young one! We have all started with **0 VTL** zilions of aeons ago!');
              break;
            case args[0]<0:
              msg.channel.send('Hmm! Yup! I feel sorry for you! You owe **VTL**... I feel your pain friend!');
              break;
            default:
              msg.channel.send(`**${args[0]} VTL** = **${Math.floor(json.usd*args[0]*1000/1000)}$**\n_Today the approximate price of ***1 VTL*** is ***${Math.floor(json.usd*1000)/1000}$***_`);
              break;
            }
            })
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/coin.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'coininfo':
          fetch('https://explorer.vertical.ovh/api/supply')
            .then(res => res.json())
            .then(json => total_supply = json.t)
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/supply.\nError: \n-----------\n${error}\n-----------`));
          fetch('https://explorer.vertical.ovh/api/coin')
            .then(res => res.json())
            .then(json => msg.channel.send(`• Current Price•          **${json.btc} BTC** | **${Math.floor(json.usd*1000)/1000}$**\n• Market Cap•             **${Math.floor(json.usd*total_supply*1000)/1000}$**\n• Circulating Supply• **${Math.floor(total_supply)} VTL**\n• Locked Coins•          **${3750*(json.mnsOn+json.mnsOff)} VTL**`))
            .catch(error => console.log(`Can't connect to https://explorer.vertical.ovh/api/coin.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'pool':
          switch (cmd1){
          case undefined:
            msg.channel.send('-- `?pool bsod` | Bsod.pw <https://bsod.pw/>\n-- `?pool hive` | QueenBee HIVE <https://hive.gulfcoastmining.com/>\n-- `?pool fair` | Fair Mine <https://fairmine.pro/>\n-- `?pool more` | MinerMore <https://minermore.com/>\n-- `?pool gosc` | Gos.cx <https://gos.cx/>\n-- `?pool mktp` | MKTECH Pools <http://mktechpools.xyz/>\n-- `?pool angr` | Angry Pool <http://angrypool.com/>\n-- `?pool umin` | UMine <https://umine.org/>\n-- `?pool rush` | Rush Hour Mining <http://rushhourmining.com/>\n-- `?pool zpol` | Zpool <https://zpool.ca/>\n-- `?pool zerg` | Zergpool <https://zergpool.com/>\n-- `?pool phip` | Phi Phi Pool <http://www.phi-phi-pool.com/>\n-- `?pool roas` | RoastedGarlicPool <http://roastedgarlicpool.fun/>\n-- `?pool blaz` | Blazepool <http://blazepool.com/>\n-- `?pool arcp` | ArcPool <https://arcpool.com/>\n-- `?pool cvmp` | CVM pool <https://cvmpool.pw/>\n-- `?pool powr` | Power Mining <https://www.powermining.pw/>\n-- `?pool rare` | RarePool <http://rarepool.com/>\n\nUse `?pool [POOL]` for specific mining details\n_Please spread the hashpower across all pools._');
            break;
          case 'bsod':
            msg.channel.send('```prolog\nTheBSODPool connection info.```\nWebsite: <https://bsod.pw/>\nDefault port: `2286`\nEU server: `eu.bsod.pw`\nUS server: `us.bsod.pw`\nAsia server: `asia.bsod.pw`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://eu.bsod.pw:2286 -u WALLET.rig -p c=VTL```');
            break;
          case 'hive':
            msg.channel.send('```prolog\nQueenBee HIVE Pool connection info.```\nWebsite: <https://hive.gulfcoastmining.com/>\nDefault port: `4559`\nUS server: `hive.gulfcoastmining.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://hive.gulfcoastmining.com:4559 -u WALLETADDRESS.rigname -p c=VTL\nsgminer -k lyra2z -o stratum+tcp://hive.gulfcoastmining.com:4559 -u WALLETADDRESS.rigname -p c=VTL```');
            break;
          case 'fair':
            msg.channel.send('```prolog\nFair Mine Pool connection info.```\nWebsite: <https://fairmine.pro/>\nDefault port: `4552`\nDefault server: `eu1.fairmine.pro`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://eu1.fairmine.pro:4552 -u <WALLET_ADDRESS> -p c=VTL```');
            break;
          case 'more':
            msg.channel.send('```prolog\nMinerMore Pool connection info.```\nWebsite: <https://minermore.com/>\nDefault port: `3737`\nDefault server: `pool.minermore.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://pool.minermore.com:3737 -u WALLET_ADDRESS -p c=VTL```');
            break;
          case 'gosc':
            msg.channel.send('```prolog\nGos.Cx Pool connection info.```\nWebsite: <https://gos.cx/>\nDefault port: `4554`\nDefault server: `stratum.gos.cx`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://stratum.gos.cx:4554 -u <WALLETID>.rig1 -p c=VTL```');
            break;
          case 'mktp':
            msg.channel.send('```prolog\nMKTECH Pools connection info.```\nWebsite: <http://mktechpools.xyz/>\nDefault port: `4556`\nDefault server: `mktechpools.xyz`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://mktechpools.xyz:4556 -u WALLET_ADDRESS -p c=VTL```');
            break;
          case 'angr':
            msg.channel.send('```prolog\nAngry Pool connection info.```\nWebsite: <http://angrypool.com/>\nDefault port: `20077`\nDefault server: `angrypool.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://angrypool.com:20077 -u <WALLETID>.rig1 -p c=VTL```');
            break;
          case 'umin':
            msg.channel.send('```prolog\nUMine Pool connection info.```\nWebsite: <https://umine.org/>\nDefault port: `4553`\nDefault server: `s.umine.org`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://s.umine.org:4553 -u WALLET_ADDRESS -p c=VTL -R 3```');
            break;
          case 'rush':
            msg.channel.send('```prolog\nRush Hour Pool connection info.```\nWebsite: <http://rushhourmining.com/>\nDefault port: `4553`\nDefault server: `rushhourmining.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://rushhourmining.com:4553 -u <WALLET_ADDRESS> -p c=VTL```');
            break;
          case 'zpol':
            msg.channel.send('```prolog\nZpool.Ca connection info.```\nWebsite: <https://zpool.ca/>\nDefault port: `4553`\nDefault server: `lyra2z.mine.zpool.ca`\n\nPlease check the pool site to download a miner for this autoexchange mining pool.\n**Examples:**\n```-o stratum+tcp://lyra2z.mine.zpool.ca:4553 -u <WALLET_ADDRESS> -p c=VTL,mc=VTL```');
            break;
          case 'zerg':
            msg.channel.send('```prolog\nZergpool connection info.```\nWebsite: <https://zergpool.com/>\nDefault port: `4553`\nDefault server: `lyra2z.mine.zergpool.com`\n\nPlease check the pool site to download a miner for this autoexchange mining pool.\n**Examples:**\n```-o stratum+tcp://lyra2z.mine.zergpool.com:4553 -u <WALLET_ADDRESS> -p c=VTL,mc=VTL```');
            break;
          case 'phip':
            msg.channel.send('```prolog\nPhi Phi Pool connection info.```\nWebsite: <http://www.phi-phi-pool.com/>\nDefault port: `4553`\nDefault server: `pool1.phi-phi-pool.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://pool1.phi-phi-pool.com:4553 -u <WALLET_ADDRESS> -p c=VTL```');
            break;
          case 'roas':
            msg.channel.send('```prolog\nRoastedGarlicPool connection info.```\nWebsite: <http://roastedgarlicpool.fun/>\nDefault port: `32323`\nDefault server: `roastedgarlicpool.fun`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://roastedgarlicpool.fun:32323 -u <WALLET_ADDRESS> -p c=VTL```');
            break;
          case 'blaz':
            msg.channel.send('```prolog\nBlazepool connection info.```\nWebsite: <http://blazepool.com/>\nDefault port: `4553`\nDefault server: `lyra2z.mine.blazepool.com`\n\nPlease check the pool site to download a miner for this autoexchange mining pool. At the moment this pool only support transforming coins to BTC only\n**Examples:**\n```-o stratum+tcp://lyra2z.mine.blazepool.com:4553 -u <WALLET_ADDRESS> -p c=BTC```');
            break;
          case 'arcp':
            msg.channel.send('```prolog\nArcPool connection info.```\nWebsite: <https://arcpool.com/>\nDefault port: `1728`\nEU server: `eu1.arcpool.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://eu1.arcpool.com:1728 -u <WALLET_ADDRESS> -p c=VTL```');
            break;
          case 'cvmp':
            msg.channel.send('```prolog\nCVM Pool connection info.```\nWebsite: <https://cvmpool.pw/>\nDefault port: `2507`\nDefault server: `cvmpool.pw`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://cvmpool.pw:2507 -u <WALLET_ADDRESS>.<RIG_NAME> -p c=VTL```');
            break;
          case 'powr':
            msg.channel.send('```prolog\nPower Mining Pool connection info.```\nWebsite: <https://www.powermining.pw/>\nDefault port: `4553`\nDefault server: `pool.powermining.pw`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://pool.powermining.pw:4553 -u <WALLET_ADDRESS> -p c=VTL```');
            break;
          case 'rare':
            msg.channel.send('```prolog\nRarePool connection info.```\nWebsite: <http://rarepool.com/>\nDefault port: `4553`\nDefault server: `rarepool.com`\n\nTo mine Verticalcoin u can use any lyra2z miner.\n**Examples:**\n```ccminer -a lyra2z -o stratum+tcp://rarepool.com:4553 -u <WALLET_ADDRESS> -p c=VTL```');
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
