var moment = require('moment');
var pretty = require('prettify-error');

function Logger(name){
	var self = this || {};
	['debug', 'info', 'warn', 'error'].forEach(function(level){
		self[level] = log.bind(self, level);
	});
	
	function log(level){
		var data = Array.prototype.slice.call(arguments, 1);
		var value = data.map(function(arg){
			var prettyError = pretty(arg);
			if (prettyError) return prettyError;

			if (typeof arg === 'string') return arg;
			return JSON.stringify(arg);
		}).join(' ');


		var prefix = '[' +moment().format('MMM DD HH:mm:ssA')+']['+level+ ']' + '[' + name + '] ';
		var txt = prefix+value+'\n';
		process.stdout.write(txt);
	}

	return self;
}

module.exports = Logger;
