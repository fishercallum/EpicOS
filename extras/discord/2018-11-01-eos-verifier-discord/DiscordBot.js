/*
	"Epic's Discord Server Verification Bot"
	DiscordBot.js - Main program.
	2018.11.01

	This is a pretty barebones Node.js Discord bot from 2018. Recovered from a CD-RW on 2023.12.08. Published for archival purposes.
	It welcomed users to the Discord server and assigned them bot/user roles.
	I have:
	- Standardized tab spaces.
	- Removed secrets (user ids, role ids and bot tokens, etc.)
	Other than that, the original (bad) code structure remains.

	Repository: https://github.com/slowstone72/EpicOS

	Callum Fisher <cf.fisher.bham@gmail.com>

	This is free and unencumbered software released into the public domain.

	Anyone is free to copy, modify, publish, use, compile, sell, or
	distribute this software, either in source code form or as a compiled
	binary, for any purpose, commercial or non-commercial, and by any
	means.

	In jurisdictions that recognize copyright laws, the author or authors
	of this software dedicate any and all copyright interest in the
	software to the public domain. We make this dedication for the benefit
	of the public at large and to the detriment of our heirs and
	successors. We intend this dedication to be an overt act of
	relinquishment in perpetuity of all present and future rights to this
	software under copyright law.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
	OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
	ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

	For more information, please refer to <https://unlicense.org/>
*/

const Discord = require('discord.js'); //Discord.js

var admins = [
	''
];

var channels = {
    welcome: ''
}

var roles = {
	Registered: '',
	Bot: ''
}

var guild = ''

var prefix = '^';

var DCbots = {};
var DCbots_id = -1;

function newDCbot(token, code) {
	setTimeout(function() {
		DCbots_id++;
		DCbots[DCbots_id] = {
			client: new Discord.Client(),
			code: code
		};
		console.log(`Created bot: ${DCbots_id}`)
		eval(`
		DCbots[DCbots_id].client.on('ready', () => {
			console.log('#${DCbots_id}: Logged in as '+DCbots[${DCbots_id}].client.user.tag+'!');
		});`);
		DCbots[DCbots_id].client.login(token);
	}, DCbots_id + 1 + '000');
}

newDCbot('');

setTimeout(function() {
	DCbots[0].client.on('guildMemberAdd', member => {
		console.log('User ' + member.user.tag + ' has joined the server!');
		setTimeout(function() {
		if(!member.user.bot) {
			DCbots[0].client.channels.get(channels.welcome).send(`\`\`\`\n${member.user.tag} has joined the server!\`\`\`\nHi, ${member.user.username}.\nWait please, you'll be allowed access shortly!`);
		} else {
			DCbots[0].client.channels.get(channels.welcome).send(`\`\`\`\n${member.user.tag} has joined the server!\`\`\`\nBot added to server: ${member.user.username}.`);
		}
		var userrole = DCbots[0].client.guilds.get(guild).roles.get(roles.Registered);
		var botrole = DCbots[0].client.guilds.get(guild).roles.get(roles.Bot);
		setTimeout(function(){
			if(!member.user.bot) {
				if(!member.roles.has(roles.Registered)) {
					member.addRole(userrole);
					DCbots[0].client.channels.get(channels.welcome).send(`[<@${member.user.id}>]: An admin hasn't registered you yet, so I've done it myself.\nI hope we can trust you! Welcome to Epic's Discord Server!`);
				}
			} else {
				if(!member.roles.has(roles.Bot)||!member.roles.has(roles.Registered)) {
					member.addRole(botrole);
					member.addRole(userrole);
					DCbots[0].client.channels.get(channels.welcome).send(`[<@${member.user.id}>]: You're now a registered bot! We have plenty of robo-friends for you to talk with!`);
				}
			}
		}, 240000);
		}, 4000);
	});

	DCbots[0].client.on('message', msg => {
		console.log(`(#${msg.channel.name}) ${msg.author.username}: ${msg.content}`);
		DCbots[0].client.user.setActivity('Epic\'s Discord Server', { type: 'WATCHING' });
		if (admins.includes(msg.author.id)) {
			if (msg.content.toLowerCase().substring(0, `${prefix}js`.length) == `${prefix}js`) {
				var js = msg.content.split(`${prefix}js`)[1].trim();
				console.log(`${msg.author.username} is running code: ${js}`)
					try {
 						msg.reply(`\`\`\`javascript\n [S]: ${eval(js)}\`\`\``);
					} catch (err) {
						msg.reply(`\`\`\`javascript\n [E]: ${err}\`\`\``);
					}
  			}
		}
	});
	console.log('Running bot code.');
}, 6000);