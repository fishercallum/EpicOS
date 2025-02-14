/*
	"Epic's Socket Bot - Cleaned"
	2017

	Recovered in the 2017.10.04 archive. Published for archival purposes.

	Formatted with https://beautifier.io/
	
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

introduce = false;
MainClient_name = 'AutoPlayer 2';
fishingID = "";
website = 'multiplayerpiano.com';
port = '8080';
room = 'lolwutsecretlobbybackdoor';
RELOCATE = 'RELOCATE';
SENDCHAT = 'SENDCHAT';
fishingMode = false;
RENAME = 'RENAME';
MOVECURSOR = 'MOVECURSOR';
admins = [];
selectedID = '';
buildNumber = '6270';
versionNumber = '1.2';
MainClient = new Client("ws://" + website + ":" + port);
MainClient.start();
MainClient.setChannel(room);
console.log('Starting system');
console.log('Room for sockets to connect to: ' + room + ' | selectedID: ' + selectedID + ' | Websocket info: Website:' + website + ' Port: ' + port + ' | ' + 'ws://' + website + ':' + port);
setInterval(function() {
	MainClient.sendArray([{
		m: "userset",
		set: {
			name: MainClient_name
		}
	}]);
}, 2000);

function MainClient_send(message) {
	MainClient.sendArray([{
		m: "a",
		message: message
	}]);
}
timer = -1;
ips = [];
system_1 = {};
ESB = {
	start: function() {
		$.getJSON('//freegeoip.net/json/?callback=?', function(data) {
			ProxyIP = JSON.stringify(data.ip, null, 2);
		});
		setTimeout(function() {
			ProxyIP = '';
			ips = [];
			if (ips.includes(ProxyIP) == false) {
				timer++;
				system_1[timer] = new Client("ws://" + website + ":" + port);
				system_1[timer].setChannel(room);
				system_1[timer].start();
				console.log('Proxy #' + timer + ' connected.');
				if (introduce) {
					setTimeout(function() {
						system_1[timer].sendArray([{
							m: "a",
							message: 'Hello. I am proxy #' + timer + '. I was connected with ESB (Epic\'s Socket Bot).'
						}]);
					}, 4000);
				}
			} else {
				console.log('IP didn\'t connect. The IP is already connected. TRY AGAIN.');
			}
		}, 4000);
	},
	relocate: function(data) {
		MainClient.setChannel(data);
		timer2 = -1;
		RELOCATE = setInterval(function() {
			timer2++;
			system_1[timer2].setChannel(data);
			setInterval(function() {
				if (timer2 == Object.keys(system_1).length == true) {
					clearInterval(RELOCATE);
					timer2 = -1
				}
			}, 0);
		}, 0);
	},
	sendchat: function(data) {
		timer3 = -1;
		SENDCHAT = setInterval(function() {
			timer3++;
			system_1[timer3].sendArray([{
				m: "a",
				message: data
			}]);
			setInterval(function() {
				if (timer3 == Object.keys(system_1).length == true) {
					clearInterval(SENDCHAT);
					timer3 = -1
				}
			}, 0);
		}, 0);
	},
	rename: function(data) {
		timer4 = -1;
		RENAME = setInterval(function() {
			timer4++;
			system_1[timer4].sendArray([{
				m: "userset",
				set: {
					name: data
				}
			}]);
			setInterval(function() {
				if (timer4 == Object.keys(system_1).length == true) {
					clearInterval(RENAME);
					timer4 = -1
				}
			}, 0);
		}, 0);
	},
	rsn: function(data) {
		timer5 = -1;
		RSN = setInterval(function() {
			timer5++;
			system_1[timer5].sendArray([{
				m: "userset",
				set: {
					name: data + '_' + timer5
				}
			}]);
			setInterval(function() {
				if (timer5 == Object.keys(system_1).length == true) {
					clearInterval(RSN);
					timer5 = -1
				}
			}, 0);
		}, 0);
	},
	mc: function(x, y) {
		timer6 = -1;
		MC = setInterval(function() {
			timer6++;
			system_1[timer6].sendArray([{
				m: "m",
				x: x,
				y: y
			}]);
			setInterval(function() {
				if (timer6 == Object.keys(system_1).length == true) {
					clearInterval(MC);
					timer6 = -1
				}
			}, 0);
		}, 0);
	},
	playnote: function(note) {
		timer7 = -1;
		PLAYNOTE = setInterval(function() {
			timer7++;
			system_1[timer7].startNote(note);
			setInterval(function() {
				if (timer7 == Object.keys(system_1).length == true) {
					clearInterval(PLAYNOTE);
					timer7 = -1
				}
			}, 0);
		}, 0);
	},
	_mc: function(x, y) {
		timer8 = -1;
		_MC = setInterval(function() {
			y += 2;
			timer8++;
			system_1[timer8].sendArray([{
				m: "m",
				x: x,
				y: y
			}]);
			setInterval(function() {
				if (timer8 == Object.keys(system_1).length == true) {
					clearInterval(_MC);
					timer8 = -1
				}
			}, 0);
		}, 1000);
	},
	stop: function() {
		timer9 = -1;
		STOP = setInterval(function() {
			timer9++;
			timer = -1;
			system_1[timer9].stop();
			setInterval(function() {
				if (timer9 == Object.keys(system_1).length == true) {
					clearInterval(STOP);
					timer9 = -1;
					players = [];
					system_1 = {};
				}
			}, 0);
		}, 0);
	},
	shutdown: function() {
		ESB.rename('Schedule shutdown?');
		MainClient_send('Please wait...');
		a = prompt('Shutdown ESB? (Y or N)');
		if (a.toLowerCase() == 'y') {
			setTimeout(function() {
				MainClient_send('Shutting down system..');
			}, 2000);
			setTimeout(function() {
				MainClient_send('3');
			}, 4000);
			setTimeout(function() {
				MainClient_send('2');
			}, 8000);
			setTimeout(function() {
				MainClient_send('1');
			}, 10);
			setTimeout(function() {
				MainClient_send('0');
			}, 11000);
		} else {
			setTimeout(function() {
				MainClient_send('Shutdown cancelled.');
			}, 2000);
		}
	}
}
$.getJSON('//freegeoip.net/json/?callback=?', function(data) {
	ProxyIP = JSON.stringify(data.ip, null, 2);
});

function sendChat(message) {
	Number = Math.floor(Math.random() * (Object.keys(system_1).length - 0 + 1 - 1)) + 0;
	console.log('MSG SENT: PROXY ID: (' + Number + '): MSG: ' + message);
	system_1[Number].sendArray([{
		m: "a",
		message: message
	}]);
}

cl = new Client("ws://multiplayerpiano.com:8080"); //This is the client which sends and receives data between rooms.
cl.start();
cl.setChannel("esb"); //Private room name here

banned = [];
enabled = true;
prefix = '^';
//The heart of the system. 
//Do not mess with the below code unless you know what you are doing!
MainClient.on("a", function(msg) {
	if (msg.a.substring(0, 1) == prefix) {
		if (banned.includes(msg.p._id)) {} else {
			if (enabled) {
				if (msg.a.toLowerCase().includes('admin')) {
					MainClient_send('Nope.')
				} else {
					if (msg.a.toLowerCase() == prefix + 'about') {
						MainClient_send('Although this system has sockets connected to it, this is not the official NMPB Socket Build.');
						MainClient_send('This is the regular version of NMPB (Build: ' + buildNumber + ' | Version: ' + versionNumber + ') modified with a script entirely made with javascript.');
					} else {
						if (msg.a.toLowerCase() == prefix + 'stop') {
							if (stopping == false) {
								MainClient_send('I\'m sorry, the stop command is not available right now, probably because you keep spamming it.')
							} else {
								cl.sendArray([{
									m: "a",
									message: '/stop'
								}]);
							}
						} else {
							if (msg.a.toLowerCase().substring(0, 5) == prefix + 'echo') {
								if (msg.a.toLowerCase().split(prefix + 'echo')[1].trim() == '') {
									MainClient_send('Usage: ' + prefix + 'echo [1-4] To disable echo mode, use ' + prefix + 'echo 1.')
								} else {
									if (msg.a.toLowerCase().split(prefix + 'echo')[1].trim() < 1) {
										MainClient_send('Usage: ' + prefix + 'echo [1-4] To disable echo mode, use ' + prefix + 'echo 1.');
									} else {
										if (msg.a.toLowerCase().split(prefix + 'echo')[1].trim() > 4) {
											MainClient_send('Echo level set to: 4. (You cannot go any higher) To disable echo mode, use ' + prefix + 'echo 1.');
											echo = 4;
										} else {
											echo = msg.a.toLowerCase().split(prefix + 'echo')[1].trim();
											MainClient_send('Echo level set to: ' + msg.a.toLowerCase().split(prefix + 'echo')[1].trim() + '. To disable echo mode, use ' + prefix + 'echo 1.');
										}
									}
								}
							} else {
								if (msg.a.toLowerCase().substring(0, (prefix + 'mode').length) == prefix + 'mode') {
									if (msg.a.toLowerCase() == prefix + 'mode') {
										MainClient_send('Usage: ' + prefix + 'mode [all/autoturn/notes] <-- Use this command to change the way the proxies play songs.');
										MainClient_send('all - Each note is played by a different proxy.');
										MainClient_send('autoturn - The proxy turn will change every ' + autoturn_delay + ' ms.');
										MainClient_send('notes - The proxy turn will change every time ' + autoturn_notes_nextcount + ' notes are played by the proxies.');
									}
									if (msg.a.toLowerCase() == prefix + 'mode all') {
										if (msg.a.toLowerCase == prefix + 'mode' == false) {
											MainClient_send('The playing mode has been set to "all"');
											autoturn = false;
											autoturn_notes = false
										}
									}
									if (msg.a.toLowerCase() == prefix + 'mode autoturn') {
										if (msg.a.toLowerCase == prefix + 'mode' == false) {
											MainClient_send('The playing mode has been set to "autoturn"');
											autoturn_notes = false;
											autoturn = true
										}
									}
									if (msg.a.toLowerCase() == prefix + 'mode notes') {
										if (msg.a.toLowerCase == prefix + 'mode' == false) {
											MainClient_send('The playing mode has been set to "notes"');
											autoturn = false;
											autoturn_notes = true;
										}
									}
								} else {
									if (msg.a.toLowerCase().substring(0, (prefix + 'ban').length) == prefix + 'ban') {
										if (admins.includes(msg.p._id)) {
											id = msg.a.toLowerCase().split(prefix + 'ban')[1].trim();
											banned.push(id);
											if (id.length == 24 == false) {
												MainClient_send('Please check that is an _id and not an id. _ids consist of 24 characters, specifically numbers and letters.');
											} else {
												MainClient_send('ID: ' + id + ' is now banned.');
											}
										} else {
											MainClient_send('You do not have permission to access this command at this time.');
										}
									} else {
										setTimeout(function() {
											if (msg.a.toLowerCase() == prefix + 'help' || msg.a.toLowerCase() == prefix + 'h') {
												MainClient_send('Modded Commands: ' + prefix + 'mode.');
											}
											cl.sendArray([{
												m: "a",
												message: msg.a.replace(prefix, '/')
											}]);
										}, 2000);
									}
								}
							}
						}
					}
				}
			} else {
				MainClient_send('You do not have permission to access this command at this time.')
			}
		}
	}
});

cl.on("a", function(msg) {
	if (msg.p._id == selectedID) {
		if (msg.a.substring(0, "Welcome,".length) == "Welcome," || msg.a == "Use /help [command] for command info.") {
			return;
		}
		if (msg.a == 'Not found.') {
			MainClient_send('The file was not found! You can use ' + prefix + 'list for a list of songs. Sorry about that!');
		} else {
			MainClient_send(msg.a.replace(/\//g, prefix));
		}
	}
});
setTimeout(function() {
	console.clear();
	console.log('Starting setup..');
	ESB.start();
	console.log('First proxy connected.');
	MainClient_send = sendChat;
	console.log('Chat function redefined.');
	MPP.client._events.n.pop();
	cl.setChannel('esb');
	console.log('To avoid lag, receiving notes has been disabled.');
	console.log('Waiting for user to connect clients with ESB.start(); and start the system with start();');
}, 3000);

function start() {
	console.clear();
	turn = 0;
	echo = 1;
	players = [];
	ESB.rename('Please wait...');
	MainClient_send('Please wait.. adding proxies to player list...');
	ApplyPlayers_counter = -1;
	enabled = false;
	ApplyPlayers = setInterval(function() {
		ApplyPlayers_counter++;
		players.push(system_1[ApplyPlayers_counter]);
		if (ApplyPlayers_counter == Object.keys(system_1).length) {
			clearInterval(ApplyPlayers);
			MainClient_send('Complete. System ready for use.');
			console.log('* * * [ESB ONLINE AND READY FOR USE] * * *')
			enabled = true;
			ESB.rsn('ESB');
		}
	}, 1000);
	cl.on('m', msg => {
		MainClient.sendArray([{
			"m": "m",
			"x": msg.x,
			"y": msg.y
		}]);
	});

	//Note Receiving & Sending
	cl.on("n", function(msg) {
		var time = msg.t;
		for (var ns = 0; ns < msg.n.length; ns++) {
			for (var i = 0; i < echo; i++) {
				if (turn == Object.keys(system_1).length || turn > Object.keys(system_1).length) {
					turn = 0;
				}
				notes = [];
				notes.push(msg.n[ns]);
				players[turn].sendArray([{
					m: "n",
					t: time + (30 * i),
					n: notes
				}]);
				notecounter++;
				notecounter2++;
				if (autoturn == false) {
					if (autoturn_notes == false) {
						turn++;
					} else {
						if (notecounter2 == autoturn_notes_nextcount || notecounter2 > autoturn_notes_nextcount) {
							turn++;
							notecounter2 = 0
						}
					}
				}
			}
		}
	});

	circleFollow_(MPP.client.findParticipantById(MainClient.getOwnParticipant().id));
	setTimeout(function() {
		circleFollow(MPP.client.findParticipantById(MainClient.getOwnParticipant().id))
	}, 2000);
}
//if(autoturn==false) {
//turn++}

autoturn_notes = false;
autoturn_notes_nextcount = 100;
turn = 0;
autoturn = true;
autoturn_delay = 5000;
autoturn_interval =
	setInterval(function() {
		if (autoturn) {
			if (turn == Object.keys(system_1).length) {
				turn = 0;
			}
			turn++;
		}
	}, autoturn_delay);
setTimeout(function() {
	system_1[0].setChannel(room);
}, 20);
notecounter = 0;
notecounter2 = 0;
stopping = true;
welcomeusers = true;
users = [];

function start_IB() {
	IB = new Client("ws://" + website + ":" + port);
	IB.setChannel(room);
	IB.start();
	IB_AR =
		setInterval(function() {
			IB.sendArray([{
				m: "userset",
				set: {
					name: '|Turn: ' + turn + '|Notes: ' + notecounter + '|AT: ' + autoturn + '|'
				}
			}]);
		}, 0);
}
MainClient.on("participant added", function(msg) {
	if (welcomeusers) {
		if (users.includes(msg.name == false)) {
			MainClient_send('Welcome, ' + msg.name + ' (' + new Color(msg.color).getName().split("A shade of")[2] + ') Use ' + prefix + 'help for the command list.');
			users.push(msg.name)
		}
	}
});

function relocateALL(room) {
	system_1[0].setChannel(room);
	setTimeout(function() {
		MainClient.setChannel(room);
		ESB.relocate(room);
		IB.setChannel(room);
		MPP.client.setChannel(room);
	}, 5000);
}

function checkProxies() {
	MainClient.sendArray([{
		m: "a",
		message: 'Checking proxies...'
	}]);
	proxyCheck_connected = [];
	proxyCheck_notconnected = [];
	for (var i = 0; i < Object.keys(system_1).length; i++) {
		if (system_1[i].isConnected) {
			proxyCheck_connected.push(i)
		} else {
			proxyCheck_notconnected.push(i)
		}
	}
	MainClient.sendArray([{
		m: "a",
		message: 'Proxy check complete. Proxies that are connected: ' + proxyCheck_connected + ' | Proxies that are not connected: ' + proxyCheck_notconnected
	}]);
}

function circleFollow(part) {
	// redacted
}

function circleFollow_(part) {
	// redacted
}

function circleFollow__(part) {
	// redacted
}

function reset() {
	clearInterval(intervalId1);
	clearInterval(intervalId2);
	clearInterval(intervalId3);
	ESB.mc(100, 100);
	setTimeout(function() {
		circleFollow(MPP.client.findParticipantById(MainClient.getOwnParticipant().id));
		setTimeout(function() {
			circleFollow_(MPP.client.findParticipantById(MainClient.getOwnParticipant().id));
			setTimeout(function() {
				circleFollow__(MPP.client.findParticipantById(MainClient.getOwnParticipant().id))
			}, 2000);
		}, 2000);
	}, 2000);
}
players = [];
turn = 0;

function adminCommands() {
	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase() == '*stopproxyconnect') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				MPP.chat.send('Stopping autoproxyconnect...');
				clearInterval(autoproxyconnect2);
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase() == '*help') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				if (MPP.client.isOwner() == false) {
					MPP.chat.send('[' + msg.p._id + '] AVBL CMDS: *help - *call - *start - *stop - *disconnect - *stopproxyconnect - *proxyconnect - *killclients - *moveto - *rename - *numrename - *say - *allsay - *executecode');
				} else {
					setTimeout(function() {
						MPP.chat.send('[' + msg.p._id + ']');
						MPP.chat.send('AVBL CMDS:');
						MPP.chat.send('*help');
						MPP.chat.send('*call');
					}, 4000);
					setTimeout(function() {
						MPP.chat.send('*start');
						MPP.chat.send('*stop');
						MPP.chat.send('*disconnect');
						MPP.chat.send('*stopproxyconnect');
					}, 8000);
					setTimeout(function() {
						MPP.chat.send('*proxyconnect');
						MPP.chat.send('*killclients');
						MPP.chat.send('*moveto');
						MPP.chat.send('*rename');
					}, 12000);
					setTimeout(function() {
						MPP.chat.send('*numrename');
						MPP.chat.send('*say');
						MPP.chat.send('*allsay');
						MPP.chat.send('*executecode');
					}, 16000);
				}
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase() == '*call') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				MPP.chat.send('Relocating ESB to the room "' + MPP.client.channel._id + '".');
				ESB.relocate(currentroom)
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase() == '*start') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				MPP.chat.send('Starting autoconnect');
				autoproxyconnect = setInterval(function() {
					ESB.start();
				}, 3000);
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase() == '*disconnect') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				MPP.chat.send('Stopping connections...');
				ESB.stop();
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase() == '*stop') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				MPP.chat.send('Stopping autoconnect');
				clearInterval(autoproxyconnect);
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase() == '*killclients') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				MPP.chat.send('Stopping all clients...');
				ESB.stop();
				MainClient.stop();
				cl.stop();
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase().substring(0, '*proxyconnect'.length) == '*proxyconnect') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				num = msg.a.toLowerCase().split('*proxyconnect')[1].trim();
				if (num == '' == false) {
					MPP.chat.send('Attempting to start [' + num + '] clients in the room [' + room + ']..');
					countervar = 0;
					autoproxyconnect2 = setInterval(function() {
						countervar++;
						ESB.start();
						if (countervar == num) {
							clearInterval(autoproxyconnect2);
							MPP.chat.send('Complete. Proxies connected.');
						}
					}, 3000);
				}
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.substring(0, '*moveto'.length) == '*moveto') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				num = msg.a.toLowerCase().split('*moveto')[1].trim();
				if (num == '' == false) {
					MPP.chat.send('Relocating system to ' + num);
					ESB.relocate(num);
				}
			}
		}
	});

	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase().substring(0, '*rename'.length) == '*rename') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				num = msg.a.split('*rename')[1].trim();
				if (num == '' == false) {
					MPP.chat.send('Renaming system to ' + num + ' without numbers');
					ESB.rename(num);
				}
			}
		}
	});
	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase().substring(0, '*numrename'.length) == '*numrename') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				num = msg.a.split('*numrename')[1].trim();
				if (num == '' == false) {
					MPP.chat.send('Renaming system to ' + num + ' with numbers.');
					ESB.rsn(num);
				}
			}
		}
	});
	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase().substring(0, '*say'.length) == '*say') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				num = msg.a.split('*say')[1].trim();
				if (num == '' == false) {
					MPP.chat.send('Saying ' + num + ' with one proxy');
					MainClient_send(num);
				}
			}
		}
	});
	MPP.client.on("a", function(msg) {
		if (admins.includes(msg.p._id)) {
			if (msg.a.toLowerCase().substring(0, '*allsay'.length) == '*allsay') {
				currentroom = MPP.client.channel._id;
				if (currentroom == 'lobby') {
					currentroom = 'lolwutsecretlobbybackdoor'
				};
				num = msg.a.split('*allsay')[1].trim();
				if (num == '' == false) {
					MPP.chat.send('Saying ' + num + ' with all proxies');
					ESB.sendchat(num);
				}
			}
		}
	});
	console.log('Control Panel active. ESB Administrators can use *help to view the list of commands.');
	cpn = 'Admin Control Panel';
	setInterval(function() {
		MPP.client.sendArray([{
			m: "userset",
			set: {
				name: cpn
			}
		}]);
	}, 1000);

}

function getNames() {
	nameDataBase = {};
	var _counter_2 = -1;
	INTERVALID = setInterval(function() {
		_counter_2++;
		name = system_1[_counter_2].getOwnParticipant().name;
		nameDatabase[_counter_2] = {
			name
		};
		if (_counter_2 == Object.keys().length) {
			clearInterval(INTERVALID);
			console.log('Complete.');
			MainClient_send('Complete.');
		}
	}, 100);
}

function setupProxyFishingMode() {
	var _counter_ = -1;
	SPFM = setInterval(function() {
		_counter_++;
		eval("system_1[" + _counter_ + "].on('a', function(msg) {if(msg.a.includes(nameDatabase[" + _counter_ + "]+' caught')||msg.a.includes(nameDatabase[" + _counter_ + "]+' is getting a bite')) {system.sendArray([{m:'a', message: data}]);}});");
	}, 500);
}