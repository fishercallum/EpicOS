/*
	"NMPB++ for Multiplayer Piano"
	EOS_core_functions.js - For common functions.
	2018
	
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

module.exports={
	colors:require('colors'), //for the console functions.
	sendmail:require('sendmail')(), //for XVESA's user registration system via email.
	//console log functions:
	console:{
		log:function(data){
			console.log(data.green);
		},
		notify:function(data){
			console.log(data.yellow);
		},
		warn:function(data){
			console.log(data.red);
		}
	},
	a:require('express')(), //express for main server
	b:require('express')(), //express for ai server
	//quick page creation functions:
	createCustomPage:function(name,code,express){
		module.exports.console.log(`Created a custom page: "${name}" with code: "${code}"`)
		module.exports[express].get(`/${name}`, function (req, res) {
			eval(code);
		});
	},
	createPage:function(name,express){
		module.exports.console.log(`Created a page: "${name}"`);
		module.exports[express].get(`/${name}`, function (req, res) {
			res.sendFile(`${__dirname}/pages/${name}.html`)
		});
	},
	//exit:
	exit:function(){
		module.exports.console.warn('Shutting down.');
		process.exit();
	},
	//send an email function:
	sendEmail:function(to,subject,txt){
		module.exports.sendmail({
			from: '',
			to: to,
			subject: subject,
			html: txt,
		}, function(err, reply) {
			// console.log(err && err.stack);
			// console.dir(reply);
			module.exports.console.notify('Sent an email to: '+to);
		}); 			
	},
	//Return whether it's morning or afternoon function:
	mor_aft:function(){
		var dt = new Date();
		var h = dt.getHours(),
		m = dt.getMinutes();
		var _time = (h > 12) ? ('PM') : ('AM');
		if (_time == 'AM' == true) {
		return 'morning';
		} else {
			return 'evening/afternoon';
		};
	}
}

//module loaded notification:
module.exports.console.notify('> XVESA AUTOMATION function module was loaded!');