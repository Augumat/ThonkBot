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
// loads the ping limits for each authorization level
const PING_LIMIT = config.pingLimit;
// loads the hard character limit to discord messages
const CHAR_LIMIT = config.charLimit;

// loads minesweeper data
const minesweeperCode = config.minesweeperValues;

// STUB load channels
const lounge = bot.channels.find("name", "lounge")
const testChannel = bot.channels.find("name", "bot-commands")
// fail messages
const THONK_EMOTE = `<:thonkBot:493850310217826354>`;
const AUTH_FAILED = `Hmmmmmmmm ` + THONK_EMOTE + `\nDo you have the authorization to use that command?`;
const ARGS_FAILED = `Hmmmmmmmm ` + THONK_EMOTE + `\nDo you have the right arguments for that command? \nHave you tried passing "help" as your only argument for the function?`;
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

// method to check whether the first input contains the second
// toCheck is the larger String and waldo is the phrase to find inside toCheck
function contains(toCheck, waldo)
{
	if (toCheck.length < waldo.length)
	{
		return false;
	}
	for (i = 0; i < toCheck.length - waldo.length; i++)
	{
		if (toCheck.substring(i, i + waldo.length) == waldo)
		{
			return true;
		}
	}
	return false;
}





// function to generate a board of the specified size and return it
function generateBoard(sideLength)
{
	// creates a board of the size specified
	var newBoard = new Array(sideLength);
	for (i = 0; i < newBoard.length; i++)
	{
		newBoard[i] = new Array(sideLength);
		console.log(newBoard[i]);
	}
	// Initializes the values at every index of the board to 0
	for (x = 0; x < newBoard.length; x++)
	{
		for (y = 0; y < newBoard[x].length; y++)
		{
			newBoard[x][y] = 0;
		}
	}
	console.log("Generate;\n" + newBoard);
	// Returns the newly created board of zeros
	return newBoard;
}

// function to seed a board with 8s (bombs)
function seedBoard(board, seedPercentage)
{
	// Iterates through board and sets random values to zero according to the seed percentage
	for (x = 0; x < board.length; x++)
	{
		for (y = 0; y < board[x].length; y++)
		{
			if (Math.random() < seedPercentage)
			{
				board[x][y] = 9;
			}
		}
	}
	console.log("Seed;\n" + board);
	return board;
}

// function to populate a board
function populateBoard(board)
{
	for (x = 0; x < board.length; x++)
	{
		for (y = 0; y < board[x].length; y++)
		{
			// Only count if the current tile is not a bomb
			if (board[x][y] != 9)
			{
				// Gets a list of the surrounding values
				var adj = getSurrounding(board, x, y, board.length);
				
				// Checks how many of the surrounding values are bombs
				var adjCounter = 0;
				for (i = 0; i < adj.length; i++)
				{
					if (adj[i] == 9)
					{
						adjCounter++;
					}
				}
				
				// Returns the number of bombs in the surrounding 8 squares
				board[x][y] = adjCounter;
			}
		}
	}
	console.log("Populate;\n" + board);
	return board;
}
// function to get a list of the values in the surrounding indeces, helper for populateboard
function getSurrounding(board, x, y, size)
{
	if (x == 0)
	{
		if (y == 0)
		{
			return [board[x+1][y], board[x][y+1], board[x+1][y+1]];
		}
		else if (y == size - 1)
		{
			return [board[x][y-1], board[x+1][y-1], board[x+1][y]];
		}
		else
		{
			return [board[x][y-1], board[x+1][y-1], board[x+1][y], board[x][y+1], board[x+1][y+1]];
		}
	}
	else if (y == 0)
	{
		if (x == size - 1)
		{
			return [board[x-1][y], board[x-1][y+1], board[x][y+1]];
		}
		else
		{
			return [board[x-1][y], board[x+1][y], board[x-1][y+1], board[x][y+1], board[x+1][y+1]];
		}
	}
	else if (x == size - 1)
	{
		if (y == size - 1)
		{
			return [board[x-1][y-1], board[x][y-1], board[x-1][y]];
		}
		else
		{
			return [board[x-1][y-1], board[x][y-1], board[x-1][y], board[x-1][y+1], board[x][y+1]];
		}
	}
	else if (y == size - 1)
	{
		return [board[x-1][y-1], board[x][y-1], board[x+1][y-1], board[x-1][y], board[x+1][y]];
	}
	else
	{
		return [board[x-1][y-1], board[x][y-1], board[x+1][y-1], board[x-1][y], board[x+1][y], board[x-1][y+1], board[x][y+1], board[x+1][y+1]];
	}
}

// stringify the board for messaging
function exportBoard(board)
{
	var stringBoard = "New Board;\n";
	for (x = 0; x < board.length; x++)
	{
		for (y = 0; y < board[x].length; y++)
		{
			stringBoard += "" + minesweeperCode[board[x][y]];
		}
		stringBoard += "\n";
	}
	console.log("Export;\n" + stringBoard);
	return [stringBoard];
}

// stringify the board for messaging (for large boards that go over the character limit)
function overflowExportBoard(board)
{
	var stringBoard = new Array(board.length + 1);
	stringBoard[0] = "New Oversized board;"
	for (x = 0; x < board.length; x++)
	{
		var lastLine = "";
		for (y = 0; y < board[x].length; y++)
		{
			lastLine += "" + minesweeperCode[board[x][y]] + " ";
		}
		stringBoard[x + 1] = lastLine;
	}
	console.log("Export;\n" + stringBoard);
	return stringBoard;
}

function minesweeper(size, difficulty)
{
	var cleanSize = Number(size);
	var cleanDiff = Number(difficulty);
	var newBoard = generateBoard(cleanSize);
	newBoard = seedBoard(newBoard, cleanDiff);
	newBoard = populateBoard(newBoard);
	if (cleanSize > 13)
	{
		return overflowExportBoard(newBoard);
	}
	return exportBoard(newBoard);
}





// triggers whenever the bot first initializes
bot.on("ready", () =>
{
	// simple console login confirm message
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
		// get permission level of author
		// STUB TEMP for testing
		var authPermLevel = 3;
		// get command name and passed args
        var args = message.content.substring(1).split(' ');
		// isolates the command
        var cmd = args[0];
		// trims the command out of args
        args = args.splice(1);
		
		// logs every attempted command in console
		console.log(message.author.username + message.author + ' attempted "' + cmd + '" in ' + message.channel + '.');
		console.log("args: " + args);
		
		// detect a command and execute that command
        switch(cmd)
		{
            // ?ping <recipient> <number of pings> <extra message>
			case 'ping':
				// help function for this command
				if (args.length == 1 && args[0] === "help")
				{
					console.log(message.author.username + message.author + ' requested help for ' + cmd + '.');
					message.channel.send('Syntax for "' + cmd + '"is `?ping <recipient> <number of pings> <extra message>*`');
					message.channel.send('*Everything after <extra message> is concatenated and included in the "extra message"');
					break;
				}
				else if (args.length < 2)
				{
					message.channel.send(ARGS_FAILED);
				}
				console.log(message.author.username + message.author + " is limited to " + PING_LIMIT[authPermLevel] + " pings.");
				if (authPermLevel >= INITIATED && +args[1] > PING_LIMIT[authPermLevel])
				{
					message.channel.send('I think that may be too many messages, ' + message.author + '... ' + THONK_EMOTE);
				}
				else if (authPermLevel >= INITIATED)
				{
					if (args.length > 2)
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
						for (i = 3; i < args.length; i++)
						{
							args[2] += " " + args[i];
						}
						for (i = 0; i < args[1]; i++)
						{
							message.channel.send(args[0]);
						}
					}
				}
				else
				{
					message.channel.send(AUTH_FAILED);
				}
			break;
			case 'minesweeper':
				if (args.length == 0)
				{
					// Take inputs (not really)
					var size = 5;
					var difficulty = 0.10;
					
					// Create and display the board
					var boardOutput = minesweeper(size, difficulty);
					for (i = 0; i < boardOutput.length; i++)
					{
						message.channel.send(boardOutput[i]);
					}
				}
				else if (args.length == 1)
				{
					if (args[0] === "help")
					{
						console.log(message.author.username + message.author + ' requested help for ' + cmd + '.');
						message.channel.send('Syntax for "' + cmd + '"is `?minesweeper <board size> <mine seed percentage>`');
						message.channel.send('*Board Size can be any integer from 3 to 128, and refers to side length.\n The default board size is 5 if left empty.');
						message.channel.send('*Mine Seed Percentage can be set to anything between 1 and 0, but some recommended values are;\n `easy`: mineDensity = 0.10\n `medium`: mineDensity = 0.14\n `hard`: mineDensity = 0.17\n `expert`: mineDensity = 0.20\n `insane`: mineDensity = 0.25\n The default difficulty is easy (0.10) if left empty.');
						break;
					}
					else
					{
						// Check the bounds of the input
						if (args[0] < 3 || args[0] > 128)
						{
							message.channel.send(ARGS_FAILED);
							break;
						}
						
						// Take inputs (only one here)
						var size = args[0];
						var difficulty = 0.10;
						
						// Create and display the board
						var boardOutput = minesweeper(size, difficulty);
						for (i = 0; i < boardOutput.length; i++)
						{
							message.channel.send(boardOutput[i]);
						}
					}
				}
				else if (args.length == 2)
				{
					// Check the bounds of the input
					if (args[0] < 3 || args[0] > 128 || args[1] < 0.0 || args[1] > 1.0)
					{
						message.channel.send(ARGS_FAILED);
						break;
					}
					
					// Take inputs
					var size = args[0];
					var difficulty = args[1];
					
					// Create and display the board
					var boardOutput = minesweeper(size, difficulty);
					for (i = 0; i < boardOutput.length; i++)
					{
						message.channel.send(boardOutput[i]);
					}
				}
				else
				{
					message.channel.send(ARGS_FAILED);
					break;
				}
			break;
			default:
				message.channel.send(NOT_COMMAND);
			break;
         }
	}
});

// login with the token specified in config.json
bot.login(config.token);
