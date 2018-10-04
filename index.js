// import the "discord.js" library
const Discord = require("discord.js");
// import the config file
const config = require("./config.json");

// create an instance of the Discord client and log in with the provided token in config.json
var bot = new Discord.Client();

// load variables from the config
const AUTH_LEVEL_NAME = config.authNames;
// authorization levels 0=none, 1=basic priveleges, 2=trusted privileges, 3=admin
const DEFAULT = 0;
const INITIATED = 1;
const TRUSTED = 2;
const ADMIN = 3;
//
const PING_LIMIT = config.pingLimit;
// STUB load channels
const lounge = bot.channels.find("name", "lounge")
const testChannel = bot.channels.find("name", "bot-commands")
// fail messages
const THONK_EMOTE = `<:thonkBot:493850310217826354>`;
const AUTH_FAILED = `hmmmm ` + THONK_EMOTE + `\nDo you have the authorization to use that command?`;
const NOT_COMMAND = `Is that a real command? ` + THONK_EMOTE;

// method to check authLevel
function getAuth(user, levelRequired)
{
	// STUB TEMP
	return true;
	switch (levelRequired)
	{
		case DEFAULT:
			if (user.roles.includes(AUTH_LEVEL_NAME[DEFAULT]))
			{
				return true;
			}
		case INITIATED:
			if (user.roles.includes(AUTH_LEVEL_NAME[INITIATED]))
			{
				return true;
			}
		case TRUSTED:
			if (user.roles.includes(AUTH_LEVEL_NAME[TRUSTED]))
			{
				return true;
			}
		case ADMIN:
			if (user.roles.includes(AUTH_LEVEL_NAME[ADMIN]))
			{
				return true;
			}
		default:
			return false;
	}
}

// triggers whenever the bot first initializes
bot.on("ready", () =>
{
	// a simple console login confirm message
	console.log(`ThonkBot has started thonking about ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers.`); 
	// changes what the bot is displayed as "playing"
	bot.user.setActivity(`with its config files`);
});

// command listener
bot.on('message', function(message)
{
	// the key prefix for thonkBot is `?`
    if (message.content.substring(0, 1) == config.prefix)
	{
		// STUB logs every attempted command in console
		console.log(message.content);
		// get permission level of author
		// STUB TEMP for testing
		var authPermLevel = 3;
		// get command name and passed args
        var args = message.content.substring(1).split(' ');
		console.log(args);
		// isolates the command
        var cmd = args[0];
		// trims the command out of args
        args = args.splice(1);
		
		console.log(message.author + ' called "' + cmd + '" in' + message.channel + '.');
        switch(cmd)
		{
            // ?ping <recipient> <number of pings> <extra message>
			// spaces are acceptable in the extra message
			case 'ping':
				console.log(message.author + " is limited to " + PING_LIMIT[authPermLevel] + " pings.");
				if (authPermLevel >= INITIATED && +args[1] > PING_LIMIT[authPermLevel])
				{
					message.channel.send('I think that may be too many messages, ' + message.author + '... ' + THONK_EMOTE);
				}
				else if (authPermLevel >= INITIATED)
				{
					for (i = 3; i < args.length; i++)
					{
						args[2] += " " + args[i];
					}
					for (i = 0; i < args[1]; i++)
					{
						message.channel.send(args[0] + " " + args[2]);
					}
				}
				else
				{
					message.channel.send(AUTH_FAILED);
				}
            break;
//			case 'pingwall':
//				if (isAuth(message.author, ADMIN) && args[1] > config.pingLimit[ADMIN])
//				{
//					message.channel.send('easy there, ' + message.author);
//				}
//				else if (isAuth(message.author, ADMIN))
//				{
//					for (i = 0; i < args[1]; i++)
//					{
//						message.channel.send(args[0]);
//						await sleep(500);
//					}
//				}
//				else
//				{
//					message.channel.send(AUTH_FAILED);
//				}
//				for (i = 0; i < args[1]; i++)
//				{
//					message.channel.send(args[0]);
//				}
//			break;
			default:
				localChannel.send(NOT_COMMAND);
			break;
         }
	}
});

bot.login(config.token);






