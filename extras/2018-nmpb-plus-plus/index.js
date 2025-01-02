/*
	"NMPB++ for Multiplayer Piano"
	index.js - Main app.
	2018

	NMPB++ was a Node.js MIDI player for Multiplayer Piano inspired by Ste-Art's NMPB.
	It was able to connect clients via proxies and split MIDI notes between them to bypass the website's note limit. 
	It featured a web controller of some description, which might've been my first time trying to create any kind of website.
	It's published here in its tacked-together glory for archival purposes.
	
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

try {
    //dependencies:
    const SA = require('./EOS_core_functions.js');
    const Se = require('http').Server(SA.a);
    const IO = require('socket.io')(Se);
    SA.console.notify('> NMPB++ VER 1.'.blue);
    //start http server:
    Se.listen(1111, function() {
        SA.console.notify(`> HTTP Server (MAIN SERVER) ready and listening on port: 1111!`);
    });
	process.on("uncaughtException",function(err){
		maintenancemode=true;
		console.log(err);
		IO.emit("playing", "!Maintenance Mode was enabled automatically because a server error occured. We're sorry for any inconvenience caused. NMPB++ is still very early in development and errors are to be expected!");
	});
	var multiroomclientcount=-1;
	var multiroomclients={};
    var processchat = true;
    var maintenancemode = false;
    var uptime_seconds = 0;
    var echoupdateavailable = true;
    var channelupdateavailable = true;
    var sendbanmsg = true;
    var paused = false;
    var playing = false;
    var totalnotes = 0;
	var nmpb_queue = [];
	var queue_mode = true;
    var bannedIPs = [];
    var opIPs = [];

    function fixIP(IP) {
        if (!IP.includes('.')) {
            return "Invalid IP address"+Math.random(); //Math.random to make it unique so that the UMS still works
        } else {
            if (IP.includes("::ffff:")) {
                return IP.split("::ffff:")[1].trim();
            } else {
                return IP;
            }
        }
    }

    function searchTrack(data) {
        var results = search = nmpb_tracks.filter(i => i.toLowerCase().includes(data.toLowerCase()));
        if (results.length == 0) {
            return ["SEARCH_RETURNED_NO_RESULTS"];
        } else {
            return results;
        }
    }

    function getTrack(data) {
        return searchTrack(data)[[Math.floor(Math.random() * search.length)]];
    }

    const consolename = '';
    const USERS = {
        count: 0
    };

    //page generation:
    //Main pages:

    SA.createCustomPage('', "res.sendFile(`${__dirname}/++/PAGES/MAIN.html`);", "a");

	SA.a.use(function (req, res, next) {
		res.status(404).send("Sorry, but the page you're looking for is literally out of this small server universe..")
	});
	
    //SOCKET MANAGEMENT:
    IO.on("connection", function(socket) {
        var socketIP = fixIP(socket.request.connection.remoteAddress);
        USERS.count++;
        USERS[socketIP] = {};
        USERS[socketIP].playsong_controller_ratelimit = 0;
        USERS[socketIP].ignore = false;
        USERS[socketIP].operator = false;
        USERS[socketIP].checker = setInterval(function() {
            USERS[socketIP].playsong_controller_ratelimit = 0;
        }, 5000);
        //check socket permissions:
        //operator:
        if (opIPs.includes(socketIP)) {
            console.log(`${socketIP} is an operator. Updating permissions.`);
            USERS[socketIP].operator = true;
            setTimeout(function() {
                socket.emit("text", "This IP is registered as an operator, extra permissions are available.");
            }, 4000);
        }
		//fishy connection detector device:
		if(socketIP.includes('Invalid IP address')){
			setTimeout(function(){
				socket.emit("text","This connection has been found to be fishy by NMPB++ Fishy Connection Detector Device, maybe it's local.�");
			}, 5000);
		}
        //banned:
        if (bannedIPs.includes(socketIP)) {
            console.log(`${socketIP} is banned. Ignoring and disabling permissions.`);
            USERS[socketIP].ignore = true;
            setTimeout(function() {
                socket.emit("text", "You're banned. You won't be able to access any options on this website. You can see read the chat and see the bot status.")
            }, 4000);
        } //ignore banned users
        console.log(`${socketIP} connected to NMPB++ controller.`);
        //maintenance mode:
        if (!maintenancemode) {
            socket.emit("text", "Hey there! Welcome to the NMPB++ website! " + nmpb_tracks.length + " MIDI files are available!");
        } else {
			socket.emit("playing", "!Maintenance Mode was enabled automatically because a server error occured. We're sorry for any inconvenience caused. NMPB++ is still very early in development and errors are to be expected!");
            socket.emit("text", "Hello, we're sorry, but NMPB++ is currently in maintenance mode. No permissions will be available on this page. You can still view the bot status, however.");
            USERS[socketIP].ignore = true;
        }
        //socket requests
        socket.on('setecho', function(data) {
            if (!USERS[socketIP].ignore) {
                if (typeof data.data == "string") {
                    if (data.code == settings.passcode) {
                        if (echoupdateavailable) {
                            if (!data.data.includes("a")) {
                                if (data.data > 10 == false) {
                                    MPP.chat.send('Echo was updated to ' + data.data + ' from console @ ' + consolename);
                                    nmpb_echo = data.data;
                                    socket.emit("text", "Set echo level to " + data.data);
                                    echoupdateavailable = false;
                                    setTimeout(function() {
                                        echoupdateavailable = true;
                                    }, 6000);
                                } else {
                                    socket.emit("text", "You cannot set the echo to over 10.")
                                }
                            } else {
                                socket.emit("text", "That's not a number!");
                            }
                        } else {
                            socket.emit("text", "Too many echo updates, try again later. (6 second cooldown)")
                        }
                    }
                } else {
                    socket.emit("text", "Invalid data.");
                }
            }
        });
        socket.on('setchannel', function(data) {
            if (!USERS[socketIP].ignore) {
                if (data.code == settings.passcode) {
                    console.log(typeof data.data);
                    if (typeof data.data == "string") {
                        if (channelupdateavailable) {
                            if (MPP.client.channel._id == data.data) {
                                socket.emit("text", "Already in " + data.data);
                            } else {
                                MPP.chat.send('Channel was updated to ' + data.data + ' from console @ ' + consolename);
                                MPP.client.setChannel(data.data);
                                socket.emit("text", "Setting channel to: " + data.data);
                                proxies_setchannel(data.data);
                                channelupdateavailable = false;
                                setTimeout(function() {
                                    MPP.chat.send('Oi, it\'s NMPB++. Type ' + nmpb_cmdprefix + 'help for the command list, and, visit the online controller for it at: ' + consolename);
                                }, 2000);
                                setTimeout(function() {
                                    channelupdateavailable = true;
                                }, 60000);
                            }
                        } else {
                            socket.emit("text", "Invalid data.");
                        }
                    } else {
                        socket.emit("text", "Too many channel updates, try again later. (60 second cooldown)")
                    }
                }
            }
        });
        socket.on('playsong', function(data) {
            if (!USERS[socketIP].ignore) {
                if (data.code == settings.passcode) {
                    console.log(typeof data.data == "string");
                    if (typeof data.data == "string" == true) {
                        if (nmpb_tracks.filter(i => i.toLowerCase().includes(data.data.toLowerCase())).length == 0) {
                            socket.emit("text", "We couldn't find that song in our database. Sorry about that!");
                        } else {
                            if (USERS[socketIP].playsong_controller_ratelimit > 2 == false) {
                                setTimeout(function() {
                                    USERS[socketIP].playsong_controller_ratelimit++;
                                    console.log(USERS[socketIP].playsong_controller_ratelimit);
                                    var search = nmpb_tracks.filter(i => i.toLowerCase().includes(data.data.toLowerCase()));
                                    var selected = search[[Math.floor(Math.random() * search.length)]];
                                    MPP.chat.send('> Reading file: ' + selected + ' (requested from console @ ' + consolename + ')');
                                    play('./MIDI/' + selected);
                                    socket.emit("text", "Reading: " + selected);
                                }, USERS[socketIP].playsong_controller_ratelimit);
                            } else {
                                socket.emit("text", "You're sending too many requests. Disconnecting.");
                                socket.disconnect();
                            }
                        }
                    } else {
                        socket.emit("text", "Invalid data.");
                    }
                }
            }
        });
        socket.on('pausesong', function() {
            if (!USERS[socketIP].ignore) {
                if (Player.isPlaying()) {
                    pause();
                }
            }
        });
        socket.on('unpausesong', function() {
            if (!USERS[socketIP].ignore) {
                if (!Player.isPlaying()) {
                    unpause();
                }
            }
        });
        socket.on('disconnect', function() {
            console.log(`${socketIP} disconnected from NMPB++ controller.`);
            if (!typeof USERS[socketIP] == "undefined") {
                clearInterval(USERS[socketIP].checker);
                USERS.count--;
                delete USERS[socketIP];
                console.log('Deleted user.');
            }
        });
        socket.on('op', function(data) {
            if (USERS[socketIP].operator) {
                if (!typeof data.data == 'undefined') {
                    admins.push(data.data);
                    MPP.chat.send(`Opped: ${data.data} from controller.`);
                }
            }
        });
    });

    //Update every 4 seconds:
    setInterval(function() {
        uptime_seconds = uptime_seconds + 4;
        if (nmpb_loop) {
            IO.emit("songloop", "Song looping: yes");
        } else {
            IO.emit("songloop", "Song looping: no");
        }
        //settings:
        IO.emit("noteecho", `Note echo amount: ${nmpb_echo}`);
        IO.emit("uptime", `Uptime: ${uptime_seconds} seconds, Date: ${Date()}`);
        IO.emit("channel", `Channel:  ${MPP.client.channel._id}`);
        IO.emit("totalnotes", `Total notes played by bot since last restart: ${totalnotes}`);
        IO.emit("proxyamount", `Total assistant clients connected: ${Object.keys(nmpb_proxy_database).length}`);
        //clients:
        if (!MPP.client.isConnected()) {
            MPP.client.start();
        }
        proxies_checkconnection();
        if (playing) {
            MPP.client.sendArray([{
                m: "userset",
                set: {
                    "name": 'NMPB++ [' + nmpb_cmdprefix + 'help] [Playing]'
                }
            }]);
            setTimeout(function() {
                MPP.client.sendArray([{
                    m: "userset",
                    set: {
                        "name": 'NMPB++ [' + totalnotes + ' notes]'
                    }
                }]);
            }, 2000);
        } else {
            MPP.client.sendArray([{
                m: "userset",
                set: {
				"name": 'NMPB++ [' + nmpb_cmdprefix + '] ['+consolename+']'
                }
            }]);
        }
    }, 4000);

    //Get File System for managing MIDI files:
    const fs = require("fs");

    //Get MIDI reader:
    const MidiPlayer = require("midi-player-js");

    //Get settings:
    const settings = require("./settings.json");

    //Get clients:
    const User = require("mppn-base").User;
    const CL = require('./Client.js');

    //Get colours module for console:
    const colors = require("colors");

    const banned = [];

    const admins = [];

    //Proxy management:
    var turn = -1;
    nmpb_proxy_database = {};
    proxyIPs = [
	];
    proxyCount = -1;

    function connectProxy() {
        proxyCount++;
        const options = {
            // Client / User
            "uri": settings.address, // This usually is not required unless you want to change the internal connection URL.
            "proxy": "http://" + proxyIPs[proxyCount], // This is where you'd include the proxy for this specific client. Your proxy MUST be HTTPS, but you use an HTTP url due to compatability issues with MPP.
            // User ONLY
            "name": "Bot " + proxyCount, // Sets the name when the bot becomes ready (user.on("ready"))
            "channel": settings.defaultroom // Set the initial channel when the bot is created.
        };
        var user = new User(options);
        nmpb_proxy_database[proxyCount] = {
            client: user
        };
        user.on("ready", () => {
            //when bot connected
        });
        user.connect();
        console.log('Proxy start: ' + JSON.stringify(options));
    }
	
	//connect proxies:
    connectProxy();
	
	function globalSend(data){
	var i=-1;
	var globalsendinterval=setInterval(function(){
			i++;
			multiroomclients[i].client.sendArray([{ m: "a",message: data}]);
			if(i>=rooms2.length-1){
				clearInterval(globalsendinterval);
			}
		}, 500);
	}
	
    //Create main client:
    MPP = {
        client: new CL(settings.address),
        chat: {
            send: function(message) {
                MPP.client.sendArray([{
                    m: "a",
                    message: message
                }]);
            }
        }
    }

    //Connect main client:
    MPP.client.setChannel(settings.defaultroom);
    MPP.client.start();
    MPP.client.on("hi", function() {
        console.log('Main client is connected!');
        setTimeout(function() {
            //MPP.chat.send(`>> NMPB++. Welcome! Type ${nmpb_cmdprefix}help for commands.`);
            //MPP.chat.send(`You can always visit the online controller for it at ${consolename} ! ${nmpb_tracks.length} MIDI files registered!`);
            if (maintenancemode) {
                processchat = false;
                MPP.chat.send('>> NMPB++ is connected, but maintenance mode is enabled. No chat data will be processed.');
            }
        }, 2000);
		var rooms = [];
	MPP.client.sendArray([{m: '+ls'}]);
	MPP.client.on('ls', (ls) => {
		if(ls.c){
			var rooms = ls.u;
			rooms2 = [];
			var usercount=0;
			for (var i = 0; i < Object.keys(rooms).length-1; i++) {
				rooms2.push(rooms[i]._id);
				usercount=usercount+rooms[i].count;
			}
			console.log(`${rooms2.length} rooms on MPP right now, with ${usercount} users online.`);
		}
});
setTimeout(function(){
		check();
}, 2000);
		
    });

			function check(){
		var clientinterval=setInterval(function(){
			multiroomclientcount++;
			console.log(multiroomclientcount+' | '+rooms2[multiroomclientcount]);
			multiroomclients[multiroomclientcount]={client:new CL("ws://www.multiplayerpiano.com:443")}
			multiroomclients[multiroomclientcount].client.setChannel(rooms2[multiroomclientcount]);
			multiroomclients[multiroomclientcount].client.start();
			setTimeout(function(){
				//multiroomclients[multiroomclientcount].client.sendArray([{ m: "a",message: 'im going to be in every single mpp room at the same time soon because im a magical bot'}]);
			}, 1000);
			if(multiroomclientcount>=rooms2.length-1){
				clearInterval(clientinterval);
				//globalSend('hallo i am in every room on mpp oof im a magical bot');
			}
		}, 2000);
		}
	
    //Proxy functions:
    function proxies_setchannel(data) {
        for (var i = 0; i < Object.keys(nmpb_proxy_database).length; i++) {
            nmpb_proxy_database[i].client.setChannel(data);
        }
    }

    function proxies_checkconnection() {
        var a = 0;
        for (var i = 0; i < Object.keys(nmpb_proxy_database).length - 1; i++) {
            if (nmpb_proxy_database[i].client.isConnected() == false) {
                a++;
                console.log(`PROXY: #${i} is not connected, attempting to reconnect it. Check that the proxy server "${proxyIPs[i]}" exists and is still active.`);
                nmpb_proxy_database[i].client.connect();
                proxies_setchannel(MPP.client.channel._id);
            }
        }
        return a + ' proxies were not connected. Attempted to reconnect them.';
    }

    //Key converting to MPP:
    var MPPKeys = ["a-1", "as-1", "b-1", "c0", "cs0", "d0", "ds0", "e0", "f0", "fs0", "g0", "gs0", "a0", "as0", "b0", "c1", "cs1", "d1", "ds1", "e1", "f1", "fs1", "g1", "gs1", "a1", "as1", "b1", "c2", "cs2", "d2", "ds2", "e2", "f2", "fs2", "g2", "gs2", "a2", "as2", "b2", "c3", "cs3", "d3", "ds3", "e3", "f3", "fs3", "g3", "gs3", "a3", "as3", "b3", "c4", "cs4", "d4", "ds4", "e4", "f4", "fs4", "g4", "gs4", "a4", "as4", "b4", "c5", "cs5", "d5", "ds5", "e5", "f5", "fs5", "g5", "gs5", "a5", "as5", "b5", "c6", "cs6", "d6", "ds6", "e6", "f6", "fs6", "g6", "gs6", "a6", "as6", "b6", "c7"];
    var convKeys = ["A0", "Bb0", "B0", "C1", "Db1", "D1", "Eb1", "E1", "F1", "Gb1", "G1", "Ab1", "A1", "Bb1", "B1", "C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5", "C6", "Db6", "D6", "Eb6", "E6", "F6", "Gb6", "G6", "Ab6", "A6", "Bb6", "B6", "C7", "Db7", "D7", "Eb7", "E7", "F7", "Gb7", "G7", "Ab7", "A7", "Bb7", "B7", "C8"];

    function conv(key) {
        return MPPKeys[convKeys.indexOf(key)] || key;
    }

    function convoct(key) {
        return MPPKeys[(convKeys.indexOf(key) + 4)] || key;
    }

    //settings variable definitions:
    var nmpb_echo = 1
    var nmpb_loop = false;
    var nmpb_tracks = [];
    var nmpb_trackloaded = false;
    var nmpb_cmdprefix = '^';
    var nmpb_welcomeusers = false;
    var nmpb_autoplay = false;

    //MIDI CODE START
    //MIDI player:
    var Player = new MidiPlayer.Player(function(event) {});

    Player.on('midiEvent', function(event) {
        if (event.channel == 10) return;
        for (let i = 0; i < nmpb_echo; i++) {
            if (event.name == "Set Tempo") {
                //Player.setTempo(event.data);
                if (maintenancemode) {
                    console.log('speed: ' + event.data);
                }
            }
            if (event.name == "Note off" || (event.name == "Note on" && event.velocity === 0)) {
                setTimeout(function() {
                    MPP.client.stopNote(conv(event.noteName));
                }, i * 20)
            } else if (event.name == "Note on") {
                setTimeout(function() {
                    //Proxy mode:
                    //Turn management for proxy mode:
                    turn++;
                    if (turn == Object.keys(nmpb_proxy_database).length) {
                        turn = 0;
                    }
                    //play note:
                    if (nmpb_proxy_database[turn].client.isConnected()) {
                        //if proxy is connected, play on that proxy.
                        nmpb_proxy_database[turn].client.startNote(conv(event.noteName), event.velocity / 100);
                        totalnotes++;
                    } else {
                        //if proxy is not connected, play on main client instead.

                        MPP.client.startNote(conv(event.noteName), event.velocity / 100);
                        totalnotes++;
                    }
                }, i * 20)
            }
        }
    });

    //When song is finished:
    Player.on('endOfFile', function() {
        playing = false;
        console.log('end');
		//MPP.chat.send('file end play registered');
        if (nmpb_loop) {
            Player.pause();
            setTimeout(function() {
                Player.play();
                playing = true;
                paused = false;
                console.log('loop');
				//MPP.chat.send('file loop play registered');
                MPP.chat.send('Looping. Type ' + nmpb_cmdprefix + 'loop to disable song repeat.');
            }, 1000);
        } else {
			//MPP.chat.send('loop is set to false, if nmpb_autoplay=true will continue: ('+nmpb_autoplay+')');
            if (nmpb_autoplay) {
				//MPP.chat.send('continuing: trying to "playrandom();"');
				setTimeout(function(){	
					var selected = nmpb_tracks[[Math.floor(Math.random() * nmpb_tracks.length)]];
                    play('./MIDI/' + selected);
					MPP.chat.send('> Reading file: '+selected+' (autoplay) [📻] ');
					MPP.chat.send('[Tip]: Type '+nmpb_cmdprefix+'autoplay to disable and enable autoplay.');
				}, 2000);
                console.log('autoplay');
            } else {
                IO.emit("playing", "[📻] Now Playing: Nothing.")
            }
        }
    });

    //Play/stop management:
    //Load function:
    function load(data) {
        nmpb_trackloaded = true;
        try {
            Player.loadFile(data)
        } catch (err) {
            console.log(err);
            MPP.chat.send('Error occured when running .loadFile(data); ... Maybe the song is being changed too quickly.');
        }
    }

    //Play function:
    function play(data) {
        Player.pause();
        load(data);
        IO.emit("playing", `[📻] Now Playing: ${data}`);
        try {
            Player.play();
            playing = true;
            paused = false;
        } catch (err) {
            console.log(err);
            MPP.chat.send('Error occured when running .play(); ... Maybe the song is being changed too quickly.');
        }
    }

    //Play random function:
    function playrandom() {
        play('./MIDI/' + nmpb_tracks[[Math.floor(Math.random() * nmpb_tracks.length)]]);
    }

    //Pause function:
    function pause() {
        paused = true;
        playing = false;
        Player.pause();
    }

    //Unpause function:
    function unpause() {
        paused = false;
        playing = true;
        Player.play();
    }

	//Add to queue function:
	function addToQueue(song,name,id) {
		nmpb_queue[nmpb_queue.length]={s:song,n:name,i:id};
		MPP.chat.send(`[Queue]: Added "${song}" to queue at #${ID}(${name})`);
	}
	
	//Playnext function:
	function playNext(){
		
	}
	
    //MIDI file management:
    console.log('Reading MIDI files:');
    fs.readdirSync(__dirname + '/MIDI').forEach(file => {
        //console.log(file.green);
        nmpb_tracks.push(file);
    });
    console.log(nmpb_tracks.length + ' files registered.'.yellow);
    //MIDI CODE END

    //MPP welcome:
    MPP.client.on("participant added", function(msg) {
        if (nmpb_welcomeusers) {
            MPP.chat.send('Hey there ' + msg.name + '! Type ' + nmpb_cmdprefix + 'help for the command list! And, visit the online controller for the bot at: ' + consolename);
        }
    });

    //MPP chat listener:
    MPP.client.on("a", function(msg) {
        if (processchat) {
            IO.emit("chatupdate", {
                msg: msg
            });
            if (msg.a.startsWith(nmpb_cmdprefix)) {
                if (banned.includes(msg.p._id) && !admins.includes(msg.p._id)) {
                    if (sendbanmsg) {
                        MPP.chat.send('>> Apologies, Service has been denied.');
                        sendbanmsg = false;
                        setTimeout(function() {
                            sendbanmsg = true;
                        }, 30000);
                    }
                } else {
                    //NMPB++ commands:
                    //ADMIN:
                    //ban:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'ban')) {
                        if (admins.includes(msg.p._id)) {
                            var input = msg.a.toLowerCase().split(nmpb_cmdprefix + 'ban')[1].trim();
                            if (!input) {
                                MPP.chat.send(`Usage: ${nmpb_cmdprefix}ban _ID`);
                            } else {
                                if (24 >= input.length) {
                                    banned.push(input);
                                    MPP.chat.send(`Added "${input}" to the ban list.`);
                                } else {
                                    MPP.chat.send('Invalid _ID. _ID\'s normally consist of 24 characters.');
                                }
                            }
                        }
                    }
                    //js:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'js')) {
                        if (admins.includes(msg.p._id)) {
                            var input = msg.a.split(nmpb_cmdprefix + 'js')[1].trim();
                            if (!input) {
                                MPP.chat.send(`Usage: ${nmpb_cmdprefix}js CODE`);
                            } else {
                                try {
                                    MPP.chat.send(`> Console: ${eval(input)}`);
                                } catch (err) {
                                    MPP.chat.send(`> Console: (ERR) ${err}`);
                                }
                            }
                        }
                    }
                    //PUBLIC:
                    //help:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'help') || msg.a.toLowerCase() == nmpb_cmdprefix + 'h') {
                        MPP.chat.send(`[Main Public Commands]: ${nmpb_cmdprefix}play (${nmpb_cmdprefix}p), ${nmpb_cmdprefix}random (${nmpb_cmdprefix}r), ${nmpb_cmdprefix}stop (${nmpb_cmdprefix}pause), ${nmpb_cmdprefix}unpause (${nmpb_cmdprefix}resume), ${nmpb_cmdprefix}loop, ${nmpb_cmdprefix}search, ${nmpb_cmdprefix}autoplay, ${nmpb_cmdprefix}myinfo, ${nmpb_cmdprefix}notecount, ${nmpb_cmdprefix}about.`);
                        if (admins.includes(msg.p._id)) {
                            MPP.chat.send(`[Admin Only Commands]: ${nmpb_cmdprefix}js, ${nmpb_cmdprefix}ban.`);
                        }
                    }
                    //play:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'play')) {
                        if (msg.a.toLowerCase().split(nmpb_cmdprefix + 'play')[1].trim() == '') {
                            MPP.chat.send('Usage: ' + nmpb_cmdprefix + 'play Song Name Here');
                        } else {
                            if (nmpb_tracks.filter(i => i.toLowerCase().includes(msg.a.toLowerCase().split(nmpb_cmdprefix + 'play')[1].trim())).length == 0) {
                                if (maintenancemode) {
                                    console.log(nmpb_tracks.filter(i => i.toLowerCase().includes(msg.a.toLowerCase().split(nmpb_cmdprefix + 'play')[1].trim())));
                                    console.log(nmpb_tracks);
                                    console.log(msg.a.toLowerCase().split(nmpb_cmdprefix + 'play')[1].trim());
                                }
                                MPP.chat.send('We couldn\'t find any matches for that song in our database. Sorry about that!');
                            } else {
                                var search = nmpb_tracks.filter(i => i.toLowerCase().includes(msg.a.toLowerCase().split(nmpb_cmdprefix + 'play')[1].trim()));
                                var selected = search[[Math.floor(Math.random() * search.length)]];
                                MPP.chat.send('> Reading file: ' + selected);
                                play('./MIDI/' + selected);
                            }
                        }
                    }
                    //pause:
                    if (msg.a.toLowerCase() == nmpb_cmdprefix + 'pause' || msg.a.toLowerCase() == nmpb_cmdprefix + 'stop') {
                        if (!paused) {
                            MPP.chat.send('Song was paused. Type ' + nmpb_cmdprefix + 'unpause to resume.');
                            pause();
                        } else {
                            MPP.chat.send(`Already paused. Type ${nmpb_cmdprefix}unpause to resume.`);
                        }
                    }
                    //unpause:
                    if (msg.a.toLowerCase() == nmpb_cmdprefix + 'unpause') {
                        if (paused) {
                            unpause();
                        } else {
                            MPP.chat.send(`Already playing. Type ${nmpb_cmdprefix}pause to pause.`);
                        }
                    }
                    //loop:
                    if (msg.a.toLowerCase() == nmpb_cmdprefix + 'loop') {
                        if (nmpb_loop) {
                            nmpb_loop = false;
                            MPP.chat.send('Song repeat disabled.');
                        } else {
                            nmpb_loop = true;
                            MPP.chat.send('Song repeat enabled.');
                        }
                    }
                    //autoplay:
                    if (msg.a.toLowerCase() == nmpb_cmdprefix + 'autoplay') {
                        if (nmpb_autoplay) {
                            nmpb_autoplay = false;
                            MPP.chat.send('Autoplay disabled.');
                        } else {
                            nmpb_autoplay = true;
                            MPP.chat.send('Autoplay enabled.');
                        }
                    }
                    //search:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'search')) {
                        MPP.chat.send(searchTrack(msg.a.toLowerCase().split(nmpb_cmdprefix + 'search')[1]).join(' | '));
                    }
                    //random:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'random')) {
                        var selected = nmpb_tracks[[Math.floor(Math.random() * nmpb_tracks.length)]];
                        play('./MIDI/' + selected);
                        MPP.chat.send('> Reading file: ' + selected + ' (random song select)');
                    }
                    if (msg.a.toLowerCase() == nmpb_cmdprefix + 'r') {
						var selected = nmpb_tracks[[Math.floor(Math.random() * nmpb_tracks.length)]];
						if(!queue_mode){
							play('./MIDI/' + selected);
							MPP.chat.send('> Reading file: ' + selected + ' (random song select)');
						}else{
							addToQueue('./MIDI/' + selected,msg.p.name,msg.p._id);
						}
                    }
                    //myinfo:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'myinfo')) {
                        MPP.chat.send('[WIP_CMD]: ' + msg.p._id);
                    }
                    //notecount:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'notecount')) {
                        MPP.chat.send(`Notes played since last restart: ${totalnotes}`);
                    }
                    //about:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'about')) {
                        MPP.chat.send(`NMPB++ for Multiplayer Piano | Easy proxy support, adds extra commands and more features.`);
                    }
                    //about:
                    if (msg.a.toLowerCase().startsWith(nmpb_cmdprefix + 'speed')) {
                        Player.setTempo(msg.a.toLowerCase().split(nmpb_cmdprefix + 'speed')[1].trim());
                    }
                }
            }
        }
    });
} catch (err) {
    console.log(err);
}