// ==UserScript==
// @name         EpicOS (v1) - Rewritten
// @namespace    https://github.com/slowstone72/EpicOS
// @version      2025.01.04
// @license      Unlicense
// @description  A rewrite of the original 2015 web browser version of EpicOS for Multiplayer Piano.
// @author       Callum Fisher <cf.fisher.bham@gmail.com>
// @match        https://mppclone.com/*
// @match        https://mpp.8448.space/*
// @match        https://multiplayerpiano.com/*
// @match        https://multiplayerpiano.net/*
// @match        https://multiplayerpiano.org/*
// @match        https://piano.mpp.community/*
// @match        https://mpp.autoplayer.xyz/*
// @match        https://mpp.hyye.tk/*
// @match        https://mppclone.hri7566.info/*
// @match        https://piano.ourworldofpixels.com/*
// @match        https://mpp.hri7566.info/*
// @match        https://mppclone.hri7566.info/*
// @grant        none
// ==/UserScript==

/*
	"EpicOS (v1) - Rewritten"
	2024.12.21 - 2025.01.04

	This is a rewrite of the original 2015 web browser version of EpicOS. I have:
	- Compiled separate message listeners into one
	- Changed the command handler to a switch statement
	- Removed unnecessary type coercion
	- Added an anti-spam chat send function

	Userscript: https://greasyfork.org/scripts/521353
	
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

const startEOS = () => {

	// User-defined settings:

	let cmdChar = '/'; // What a message should start with to be recognized as a command - You can change this to anything
	let welcomeUsers = false; // Whether or not to welcome users that enter the room (true/false)
	let sendStartUpMsg = false; // Whether or not to send a greeting message on start-up (true/false)
	let antiSpamTimeout = 40000; // Time in milliseconds before the bot can repeat its last chat message - Can be any value in milliseconds

	// Define settings:

	let selfID = MPP.client.getOwnParticipant()._id; // Your _ID on Multiplayer Piano

	// Define & compile command list:

	let commands = cmdChar + [
		'help',
		'lol',
		'test',
		'say',
		'encode (Encode Text)',
		'decode (Decode Text)',
		'binary (Turn Text to Binary)',
		'myinfo',
		'8ball',
		'about'
	].join(', ' + cmdChar);

	// Define message send function:

	let lastMessage = {
		t: Date.now(),
		m: ''
	}

	let sendMessage = input => {
		if (input === lastMessage.m && Date.now() - lastMessage.t < antiSpamTimeout) return;
		lastMessage = {
			t: Date.now(),
			m: input
		}
		MPP.chat.send(input);
	}

	// Send a start-up message:

	if (sendStartUpMsg) sendMessage(`EpicOS (v1) is here! Type ${cmdChar}help for the command list.`);

	// Listen for 'hi' message & fetch _ID:

	MPP.client.on('hi', () => {
		selfID = MPP.client.getOwnParticipant()._id;
	});

	// Listen for chat messages:

	MPP.client.on('a', msg => {

		selfID = MPP.client.getOwnParticipant()._id;
		// if (msg.p._id === selfID) return;
		if (!msg.a.startsWith(cmdChar) || msg.a === cmdChar) return;

		let name = msg.p.name;
		let _id = msg.p._id;
		let color = msg.p.color;

		let cmd = msg.a.split(cmdChar)[1].split(' ')[0].trim();
		let input = msg.a.split(cmd)[1].trim();

		switch (cmd) {
			// Public commands:
			case 'help':
				sendMessage(`✨✨ EpicOS commands: ${commands} ✨✨`);
				break;
			case 'test':
				sendMessage(`The bot is active and working correctly, ${name}!`);
				break;
			case 'myinfo':
			case 'info':
				sendMessage(`Hi, ${name}. Your _ID is '${_id}'. ${_id === msg.p.id ? '' : 'Your ID is: \'' + msg.p.id + '\'. '}Your colour is ${color} (${new Color(color).getName()}). That's all I have!`);
				break;
			case 'lol':
				sendMessage(`${name} laughs so hard they begin to choke. *Hands ${name} a glass of water.*`);
				break;
			case 'say':
			case 'echo':
				if (!input) {
					sendMessage(`Please input a word/sentence for me to say! :P (Example: ${cmdChar}${cmd} Hello!)`);
					return;
				} else if (input.startsWith(cmdChar)) {
					sendMessage('Not today.');
					return;
				}
				sendMessage(input);
				break;
			case '8ball':
				if (!input) {
					sendMessage(`Please input something for the (ⁿᵒᵗ⁻ˢᵒ⁻ᵐᵃᵍᶦᶜ)8ball to respond to! (Example: ${cmdChar}${cmd} Are you clever?)`);
					return;
				}
				let responses = ['xD Lol no.', 'Hell no!', 'Are you kidding??? xD Lol no', 'Never.', 'Maybe.', 'Go away pls.', 'Yes. No question about it.', 'Yep, sure, whatever.', 'Did you say something?', 'Could you speak louder? I couldn\'t read that'];
				sendMessage(`8ball: ${responses[Math.floor(Math.random() * responses.length)]}`);
				break;
			case 'encode':
				if (!input) {
					sendMessage(`Please input something for me to encode! (Example: ${cmdChar}${cmd} Hello!)`);
					return;
				}
				sendMessage(encode(input));
				break;
			case 'decode':
				if (!input) {
					sendMessage(`Please input something for me to decode! (Example: ${cmdChar}${cmd} SGVsbG8h)`);
					return;
				}
				try {
					sendMessage(`Here: ${decode(input)}`);
				} catch (err) {
					sendMessage('Try something that has already been encoded.');
				}
				break;
			case 'binary':
				if (!input) {
					sendMessage(`Please input something for me to convert to binary (Example: ${cmdChar}${cmd} Hello!)`);
					return;
				}
				sendMessage(toBinary(input));
				break;
			case 'about':
				sendMessage('EpicOS (v1) [2015] - Rewritten | 2024.12.21 - 2025.01.04 | Source: https://greasyfork.org/scripts/521353');
				break;
				// Private commands:
			case 'welcome':
				if (_id !== selfID) return;
				if (!input) {
					welcomeUsers = !welcomeUsers;
				} else {
					input = input.toLowerCase();
					welcomeUsers = input === 'on';
				}
				sendMessage(`Welcome messages are ${welcomeUsers ? 'on' : 'off'}.`);
				break;
			case 'clear':
				if (_id !== selfID) return;
				MPP.chat.clear();
            break;
		}

	});

	// MPP.client.on("a", function(msg) { if (msg.a.split(' ')[0] == "hi" || msg.a.split(' ')[0] == "hey" || msg.a.split(' ')[0] == "hello") { if (msg.p._id == selfID) {} else { sendMessage('EpicOS: Hi there, ' + msg.p.name + '!, how may i help you?') } }})

	// Listen for new users:

	MPP.client.on('participant added', msg => {
		if (msg.id && msg.id === MPP.client.getOwnParticipant().id) return;
		if (welcomeUsers) sendMessage(`Welcome, ${msg.name}! Feel free to try out my commands by sending ${cmdChar}help`);
	});

	const toBinary = input => {
		let output = '';
		for (let i = 0; i < input.length; i++) {
			let e = input[i].charCodeAt(0);
			let s = '';
			do {
				let a = e % 2;
				e = (e - a) / 2;
				s = a + s;
			} while (e !== 0);
			while (s.length < 8) {
				s = '0' + s;
			}
			output += s + ' ';
		}
		return output;
	}

	const encode = input => {
		return window.btoa(unescape(encodeURIComponent(input)));
	}

	const decode = input => {
		return decodeURIComponent(escape(window.atob(input)));
	}
}

// Start:

if (!window.addEventListener) {
	window.attachEvent('onload', startEOS);
} else {
	window.addEventListener('load', startEOS);
}