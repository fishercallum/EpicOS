// Terrible chatBuffer system

setInterval(function() {
	if (tempdata.arrays.chatbuffer.length > 0) {
		MPP.chat.send(tempdata.arrays.chatbuffer[0]);
		tempdata.arrays.chatbuffer.shift();
		if (tempdata.arrays.chatbuffer.length >= 12) {
			// tempdata.arrays.chatbuffer = [];
		}
	}
}, 2000);

function sendChat (txt) {
	if (txt.length < tempdata.maxmsglength) {
		tempdata.arrays.chatbuffer.push(txt);
	} else {
		// more complicated and slower than it needs to be, I know, but.. I like using intervals, and, it is perfectly functional.
		// I wouldn't recommend this code for anything else though, it's just here for 'novelty' purposes because I spent a while on perfecting it.
		// tempdata.arrays.chatbuffer.push(`Please wait. Splitting a large message into strings of ${tempdata.maxmsglength} characters..`);
		var splitmsgstosend = [];
		var splitmsg = txt.split('');
		var i = -1;
		var i2 = -1;
		var temparr = [];
		var int = setInterval(function() {
			i++;
			i2++;
			temparr.push(splitmsg[i2]);
			if (i == tempdata.maxmsglength-1) {
				i = 0;
				splitmsgstosend.push(temparr.join(''));
				temparr = [];
			}
			if (i2 >= splitmsg.length-1) {
				clearInterval(int2);
				clearInterval(int);
				if (i > 0 && i !== tempdata.maxmsglength-1) {
					splitmsgstosend.push(temparr.join(''));
					temparr = [];
				}
				// tempdata.arrays.chatbuffer.push(`Processed 1 string of ${txt.length} characters and converted to ${splitmsgstosend.length} lines in ${time}ms.`);
				setTimeout(function() {
					tempdata.arrays.chatbuffer = tempdata.arrays.chatbuffer.concat(splitmsgstosend);
				}, 4000);
			}
		}, 0);
		var time = 0;
		var int2 = setInterval(function() {
			time++;
		}, 1);
	}
}