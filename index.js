function Logger(name){
	var self = this || {};
	['verbose', 'info', 'warn', 'error'].forEach(function(level){
		self[level] = log.bind(self, level);
	});
	
	function log(level){
		var value = Array.prototype.slice(arguments, 1).map(function(arg){
			return arg.toString();
		}).join(' ');

		console.log('['+name + ']' + '[' + level + '] ' + value);
	}

	return self;
}

module.exports = Logger;
