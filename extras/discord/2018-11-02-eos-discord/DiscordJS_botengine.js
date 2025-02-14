/*
    "EpicOS for Discord"
	DiscordJS_botengine.js - For handling multiple Discord bots.
    2018.11.02

    This is a pretty barebones Node.js Discord version of EpicOS from 2018. Published for archival purposes.
    It welcomed users to the server and featured a 'temporary message' command that would automatically delete your message.

    A directory of all published EpicOS projects is available: https://pastebin.com/QGyDuUGe

    Callum Fisher <fishercallum@proton.me>

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
var deleteJS=true;
var deleteJSoutput=true;
var think=true;
var admins = [];
var DCbots = {};
var DCbots_id = -1;

function newDCbot(token){
	setTimeout(function(){
	DCbots_id++;
	DCbots[DCbots_id] = {client:new Discord.Client()};
	console.log(`Created bot: ${DCbots_id}`)
	eval(`
	DCbots[DCbots_id].client.on('ready', () => {
		console.log('#${DCbots_id}: Logged in as '+DCbots[${DCbots_id}].client.user.tag+'!');
	});`);
	DCbots[DCbots_id].client.login(token);
	}, DCbots_id+1+'000');
}

newDCbot('');
newDCbot('');
newDCbot('');
newDCbot('');
newDCbot(''); //EpicOS

// DCbots[0].client.on('guildMemberAdd', member => {
  // console.log('User' + member.user.tag + 'has joined the server!');

  // var role = member.guild.roles.find('name', 'user');
  // member.addRole(role);
// });

setTimeout(function(){
	DCbots[0].client.on('message', msg => {
		if(msg.content.toLowerCase().includes('think')){
		setTimeout(function(){
			if(think){
		 msg.react('🤔').then(() => {
                console.log("Reacted to a think message")
            }).catch(reason => {
                console.log(`Problem while reacting to a think message: ${reason}`);
            });
			}
		}, 4000);
		}
		if (msg.content.toLowerCase().startsWith('^ljs')){
			if(admins.includes(msg.author.id)){
			var js=msg.content.split('^ljs')[1].trim();
			msg.delete(4000);
			console.log(js)
			try {
				msg.reply('```js\n'+eval(js)+'```')
				.then(message => message.delete(8000));
			} catch (err) {
				msg.reply('```js\n'+err.toString()+'```')
				.then(message => message.delete(5000));
			}
			}
		}
	});
	
	// DCbots[3].client.on('message', msg => {
		// if (msg.content.toLowerCase().startsWith('randomchannel')){
			// var ch=msg.content.split('randomchannel')[1].trim();
			// console.log(ch)
			// makeChannel(msg);
			// makeChannel(msg);
			// makeChannel(msg);
			// makeChannel(msg);
			// makeChannel(msg);
			// makeChannel(msg);
			// msg.delete();
		// }
	// });
	var a = {};
	var chc=0;
	function makeChannel(message){
		chc++
		var server = message.guild;
		var name = message.author.username;
		server.createChannel("Hey this is a test"+chc, "text");
	}
	DCbots[4].client.on('message', msg => {
		console.log(msg.author.username+': '+msg.content);
		//console.log(msg.channel.id);
		if(msg.author.tag !== DCbots[0].client.user.tag)
		if (msg.content.toLowerCase().includes('delet this')) {
			if(msg.deletable){
			setTimeout(function() {
				//msg.channel.send('ok, i am delet this')
				//.then(message => message.delete(1000))
				//.catch(console.error);
				msg.delete();
			}, 2000);
			} else {
				msg.channel.send('The delet this service is not available on your message :(');
			}
		}
		if (msg.content.toLowerCase().includes('--temp')) {
			if(msg.deletable){
				msg.channel.send('*^ Temporary message.*')
				.then(message => setTimeout(function(){
					a[Object.keys(a).length] = message;
					message.edit('**There was a message by '+msg.author.username+' here, but it was removed automatically.\nYou can request to remove a message automatically by adding --temp anywhere in your message.**');
				}, (msg.content.length*140)-'--temp'.length))
				.catch(console.error);
			setTimeout(function() {
				msg.delete();
			}, (msg.content.length*140)-'--temp'.length);
			} else {
				msg.channel.send('Sorry, but your message cannot be deleted.');
			}
		}
		if (msg.content.toLowerCase().startsWith('^js')){
			if(admins.includes(msg.author.id)){
			var js=msg.content.split('^js')[1].trim();
			msg.delete(4000);
			console.log(js)
			try {
				msg.reply('```js\n'+eval(js)+'```')
				.then(message => message.delete(8000));
			} catch (err) {
				msg.reply('```js\n'+err.toString()+'```')
				.then(message => message.delete(5000));
			}
			}
		}
		// if (msg.content.toLowerCase().startsWith('^makechannel')){
			// var ch=msg.content.split('^makechannel')[1].trim();
			// console.log(ch)
			// makeChannel(msg)
		// }
		if (msg.content.toLowerCase().includes('^cleartemp')) {
			if(admins.includes(msg.author.id)){
			if(msg.deletable){
				msg.channel.send('Please wait.')
				.then(message => message.delete(4000))
				.catch(console.error);
			for (var i in a) {
				a[i].delete().catch(function() {
					console.log(`Failed to delete a message.`);
				});
			}
			a={};
				msg.delete();
				msg.reply('**Done.**')
				.then(message =>
					message.delete(5000)
				)
			} else {
				msg.channel.send('Sorry, but that cannot be completed here.');
			}
			}
		}
		if (msg.content.toLowerCase().startsWith('^del')) {
			if(admins.includes(msg.author.id)){
				   var amount = Number(msg.content.toLowerCase().split('^del')[1].trim());
    var adding = 1;
    var newamount = amount + adding;
  let messagecount = newamount.toString();
  msg.channel
    .fetchMessages({
      limit: messagecount
    })
    .then(messages => {
      msg.channel.bulkDelete(messages);
      // Logging the number of messages deleted on both the channel and console.
      msg.channel
        .send(
          "Removed " +
            newamount + ' messages.'
        )
        .then(message => message.delete(5000));
      console.log(
        "Deletion of messages successful. \n Total messages deleted including command: " +
          newamount
      );
    })
    .catch(err => {
      console.log("Error while doing Bulk Delete");
      console.log(err);
    });
			}
		}
		if (msg.content.toLowerCase().startsWith('^avatar')) {
			    msg.reply(msg.author.avatarURL);
		}
		if(msg.content.toLowerCase().startsWith('activate the magic test thing')){
			msg.reply('k');
			msg.guild.channels.find('name', 'audio').connect();
		}
	});
	console.log('Running bot code.');
}, 4000);
