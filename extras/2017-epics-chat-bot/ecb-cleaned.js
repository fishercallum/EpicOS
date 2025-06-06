/*
	"Epic's Chat Bot (Crystal) - Cleaned"
	Recovered in the 2017.10.04 archive.
	2017

	This is an old alternate bot for Multiplayer Piano. I have:
	- Slightly improved basic formatting.
	- Removed Google search code.
	Other than that, it's in the same state as I left it in 2017.
	
	Repository: https://github.com/cffisher/EpicOS

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

clientWebsite = 'multiplayerpiano.com';
clientWebsitePort = '8080';
clientWebsocket = 'ws://' + clientWebsite + ':' + clientWebsitePort;
cstartroom = 'lolwutsecretlobbybackdoor';

MPP.chat.send('Starting Crystal... (Connection Information: Website: ' + clientWebsite + ' | Port: ' + clientWebsitePort + ' |: ' + clientWebsocket + ')');

crystal = new Client(clientWebsocket);
crystal.setChannel(cstartroom);
crystal.start();

const csend = function (message) {
	crystal.sendArray([{m:"a", message: message}]);
}

setTimeout(function() {
csend('Greetings everyone, I am Crystal. I\'m a chat bot created with javascript. You can type ' + c_prefix + 'help to view my command list.');
}, 3000);

//Variable Defines.
let commandsEnabled = true;
let c_prefix = '^';
let banned = [];
let Cchat_buffer = [];
let botname = 'Crystal';
let History = [];
let banMSG = true;
//Variable Defines.

//Interval Defines.
chatInt = setInterval(function() { var msg = Cchat_buffer.shift(); if (msg) crystal.sendArray([{m: "a", message: 'System: ' + msg }]); }, 1900);
autoUpdateName = setInterval(function() {updateName('~' + botname + ' (' + c_prefix + 'Help)~')}, 5000);
//Interval Defines.

//Function Defines.
function CsendChat(msg) {
	msg.match(/.{0,511}/g).forEach(function(x, i) {
		if(x == "") return; 
		if (i !== 0) x = "..." + x; Cchat_buffer.push(x);
	});
}

function updateName (name) {
	crystal.sendArray([{
		m: "userset", 
		set: {
			name: name
		}
	}]);
}

csend = CsendChat;

function reverse(s) {
  var o = '';
  for (var i = s.length - 1; i >= 0; i--)
    o += s[i];
  return o;
}
//Function Defines.

// crystal.on('a', function(msg) { var msgArr = msg.a.split(' '); if (msgArr[0] == c_prefix+'js' && msg.p._id == MPP.client.getOwnParticipant()._id) { try { csend('> '+JSON.stringify(eval(msg.a.substr(msgArr[0].length).trim()))); } catch (error) { E.chat.send('> (Error detected in code!)'+error); } } }); }, 1000);

crystal.on("a", function(msg) {

	data = msg;

	if (msg.a.toLowerCase().substring(0,1) == c_prefix) {

		if (banned.includes(msg.p._id)) {

			if (banMSG) {
				csend('I cannot serve you at this time.');
				banMSG = false;
			}

		} else {

			if (commandsEnabled) {

				banMSG = true;
				command1 = data.a.toLowerCase().split(c_prefix)[1];

				command2 = command1.split(' ')[0];

				input = command1.split(command2)[1].trim();

				if (command2 == 'help') {csend('Commands [1]: ' + c_prefix + 'help, ' + c_prefix + 'search, ' + c_prefix + 'myinfo, ' + c_prefix + 'reverse.')}
				if (command2 == 'search') { if(input=='') { csend('You are using this command incorrectly. Usage: ' + c_prefix + 'search <Whatever you want to search for>') } else { gcseCallback(input);  } }
				if (command2 == 'myinfo') {if(input=='') {csend('[|MYINFO|]: You are ' + data.p.name + '. | Your _id is: ' + data.p._id + '. | Your id is: ' + data.p.id + '. | Your color, in hex, is: ' + data.p.color + '. | Your name is: ' + msg.p.name.length + ' characters long.'); } else {csend('[|MYINFO|]: They are ' + info(input).name + '.')}} 
				if (command2 == 'reverse') { if(input=='') {csend('You are using this command incorrectly. Usage: ' + c_prefix + 'reverse text here');} else {csend('[|REVERSE|]: ' + reverse(input));}} 
			
			} else {

				csend('I\'m sorry, ' + data.p.name + ', I can\'t do that right now.');

			}
		}

	}

});