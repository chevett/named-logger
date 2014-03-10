function Logger(name){
	var self = this || {};
	['debug', 'info', 'warn', 'error'].forEach(function(level){
		self[level] = log.bind(self, level);
	});
	
	function log(level){
		
		var data = Array.prototype.slice.call(arguments, 1);
		var value = data.map(function(arg){
			console.log('hi');
			return arg.toString();
		}).join(' ');

		console.log('['+name + ']' + '[' + level + '] ' + value);
	}

	return self;
}

module.exports = Logger;
