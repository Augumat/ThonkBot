// import the "discord.js" library
const Discord = require("discord.js");
// import the config file
const config = require("./config.json");

// load the bot token from the local config file
const TOKEN = config.token;
// create an instance of the Discord client
var bot = new Discord.client();

// triggers whenever the bot detects a message
bot.on("message", function(message) {
	console.log(message.content);
});

// logs in with the declared authentification token
bot.login(TOKEN);