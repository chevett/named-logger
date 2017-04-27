var moment = require('moment');
var isError = require('lodash.iserror');
var PrettyError = require('pretty-error');
var prettyError = new PrettyError();
prettyError.withoutColors();

function Logger(name){
	var self = this || {};
	self.name = name;

	['debug', 'info', 'warn', 'error'].forEach(function(level){
		self[level] = log.bind(self, level);
	});
	
	function log(level){
		var data = Array.prototype.slice.call(arguments, 1);
		var value = data.map(function(arg){
			if (isError(arg)){
				return prettyError.render(arg);
			}

			if (typeof arg === 'string') return arg;
			return JSON.stringify(arg);
		}).join(' ');


		var prefix = '[' +moment().format('MMM DD HH:mm:ss.SSSA')+']['+level+ ']' + '[' + name + '] ';
		var txt = prefix+value+'\n';
		process.stdout.write(txt);
	}

	self.info('starting ', name);
	return self;
}

module.exports = Logger;
