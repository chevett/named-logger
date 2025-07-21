var moment = require('moment');
var isError = require('lodash.iserror');
var PrettyError = require('pretty-error');
var prettyError = new PrettyError();
prettyError.withoutColors();

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

function Logger(name, logLevel){
	var self = this || {};
	self.loggerName = name;
	self.logLevel = logLevel || process.env.LOG_LEVEL || 'debug';
	var minLevelIdx = LOG_LEVELS.indexOf(self.logLevel);

	function logger(childName) {
		return new Logger(name + '][' + childName, self.logLevel);
	}

	Object.keys(self).forEach(function(key) {
		logger[key] = self[key];
	});

	LOG_LEVELS.forEach(function(level, idx){
		if (idx < minLevelIdx) {
			logger[level] = function(){};
			return;
		}
		logger[level] = log.bind(logger, level);
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

	logger.info('starting ', name);
	return logger;
}

module.exports = Logger;
