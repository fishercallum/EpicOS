/*
	"EpicOS for Discord"
	DiscordBot - Main program.
	2018.11.02

	This is a pretty barebones Node.js Discord version of EpicOS from 2018. Published for archival purposes.
	It welcomed users to the server and featured a 'temporary message' command that would automatically delete your message.
	I have:
	- Standardized tab spaces.
	- Removed secrets (user ids, role ids and bot tokens, etc.)
	Other than that, the original (bad) code structure remains.

	Repository: https://github.com/cffisher/EpicOS

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
//const Database = require('Database')
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

var DMprefix = '!';
var prefix = 'e^';

var DCbots = {};
var DCbots_id = -1;

function newDCbot(token, activity) {
    setTimeout(function() {
		if(typeof activity == 'object' || typeof activity == 'undefined') {
			DCbots_id++;
			if(typeof activity !== 'undefined') {
				DCbots[DCbots_id] = {
					client: new Discord.Client(),
					activity: {
						name: activity.name,
						type: activity.type
					}
				};
			} else {
				DCbots[DCbots_id] = {
					client: new Discord.Client(),
				};
			}
			console.log(`Created bot: ${DCbots_id}`)
			eval(`
			DCbots[DCbots_id].client.on('ready', () => {
				console.log('#${DCbots_id}: Logged in as '+DCbots[${DCbots_id}].client.user.tag+'!');
			});`);
			DCbots[DCbots_id].client.login(token);
		} else {
			if(typeof activity !== 'undefined') {
				var err = new Error(`#${DCbots_id+1} not created ERROR: typeof "activity" was not an object.\nPlease provide a valid bot activity object!`);
				console.error(err);
			}
		}
	}, DCbots_id + 1 + '000');
}

newDCbot('', {name: 'the Discord server 0-o', type: 'WATCHING'});
newDCbot('', {name: 'stars', type: 'WATCHING'});

setTimeout(function() {
	a={};
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
		DCbots[0].client.user.setActivity(DCbots[0].activity.name, { type: DCbots[0].activity.type });
		if(msg.author.id !== DCbots[0].client.user.id)
		if (admins.includes(msg.author.id)) {
			if (msg.content.toLowerCase().substring(0, `${DMprefix}js`.length) == `${DMprefix}js`) {
				var input = msg.content.split(`${DMprefix}js`)[1].trim();
				console.log(`${msg.author.username} is running code: ${input}`)
					try {
						msg.reply(`\`\`\`javascript\n [S]: ${eval(input)}\`\`\``);
					} catch (err) {
						msg.reply(`\`\`\`javascript\n [E]: ${err}\`\`\``);
					}
			}
		}
	});
	
	DCbots[1].client.on('message', msg => {
		DCbots[1].client.user.setActivity(DCbots[1].activity.name, { type: DCbots[1].activity.type });
		if(msg.author.id == DCbots[1].client.user.id) return;
		//admin commands:
		if (admins.includes(msg.author.id)) {
			//eval:
			if (msg.content.toLowerCase().substring(0, `${prefix}eval`.length) == `${prefix}eval`) {
				var input = msg.content.split(`${prefix}eval`)[1].trim();
				console.log(`${msg.author.username} is running code: ${input}`)
				try {
					msg.reply(`\`\`\`javascript\n [S]: ${eval(input)}\`\`\``);
				} catch (err) {
					msg.reply(`\`\`\`javascript\n [E]: ${err}\`\`\``);
				}
			}
			//cleartemp:
			if (msg.content.toLowerCase().substring(0, `${prefix}cleartemp`.length) == `${prefix}cleartemp`) {
				var input = msg.content.split(`${prefix}cleartemp`)[1].trim();
				if(msg.deletable){
					msg.channel.send('Please wait. This is a global command and will affect all servers.')
					.then(message => message.delete(2000))
					.catch(console.error);
					for (var i in a) {
						a[i].delete().catch(function() {
							console.log(`Failed to delete a message.`);
						});
					}
					a={};
					msg.delete();
					msg.reply('**Gone without a trace!**')
					.then(message =>
						message.delete(2000)
					)
				} else {
					msg.channel.send('Sorry, but that cannot be completed here.\nMaybe I don\'t have the "Manage Messages" permission here.');
				}
			}
		}
		
		//regular commands:
		//test:
		if(msg.content.toLowerCase().substring(0, `${prefix}test`.length) == `${prefix}test`) {
			var input = msg.content.split(`${prefix}test`)[1].trim();
			if (input.length>0) {
				msg.channel.send(`Test response. Input: ${input}`);
			} else {
				msg.channel.send(`Test response. Input: [*blank*]`);
			}
		}
		//temp:
		if(msg.content.toLowerCase().substring(0, `${prefix}temp`.length) == `${prefix}temp`) {
			var input = msg.content.split(`${prefix}temp`)[1].trim();
			msg.channel.send('You can request to delete a message by adding "--temp", without quotes, anywhere in the message!\nThe message will stay longer depending on how long it is.')
		}
		
		//general msg reactions:
		if (msg.content.toLowerCase().includes('delet this')) {
			if (msg.deletable) {
				msg.delete(2000);
			} else {
				msg.channel.send('The delet this service is not available on your message :^(\nMaybe I don\'t have the "Manage Messages" permission here.');
			}
		}
		
		if (msg.content.toLowerCase().includes('--temp')) {
			if(msg.deletable){
				msg.channel.send('*^ Temporary message.*')
				.then(message => setTimeout(function(){
					a[Object.keys(a).length] = message;
					message.edit(`**There was a message by ${msg.author.username} here, but it was removed.** > Use ${prefix}temp for more information.`);
				}, (msg.content.length*140)-'--temp'.length))
				.catch(console.error);
			setTimeout(function() {
				msg.delete();
			}, (msg.content.length*140)-'--temp'.length);
			} else {
				msg.channel.send('Sorry, but your message cannot be deleted.\nMaybe I don\'t have the "Manage Messages" permission here.');
			}
		}
	});
	console.log('Running bot code.');
}, 6000);
