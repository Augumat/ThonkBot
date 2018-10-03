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
// STUB load channels
const lounge = bot.channels.find("name", "lounge")
const testChannel = bot.channels.find("name", "bot-commands")

// authorization fail message
const AUTH_FAILED = '`hmmmm` :thonkBot: `It seems you do not have authorization to use that command`';
// method to check authLevel
function isAuth(user, levelRequired)
{
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

bot.on("ready", () =>
{
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  bot.user.setActivity(`with its config files`);
});

// command listener
//bot.on('message', function(user, userID, channelID, message, evt)
bot.on('message', function(message)
{
	// the key prefix for thonkBot is `?`
    if (message.content.substring(0, 1) == config.prefix)
	{
		// STUB logs every recieved command in console
		console.log(message.content);
		// STUB respond with joke for testing
		message.channel.send("oi")
			.then(message => console.log("Sent response: " + message.content))
			.catch(console.error);
		// get command name and passed args
        var args = message.content.substring(1).split(' ');
		console.log(args);
        var cmd = args[0];
        args = args.splice(1);
		console.log(args);
        switch(cmd)
		{
            // ?ping <recipient> <number of pings>
            case 'ping':
				for (i = 0; i < args[1]; i++)
				{
					message.channel.send(args[0]);
				}
            break;
			default:
			break;
         }
	}
});

bot.login(config.token);






