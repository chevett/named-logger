/* eslint-env mocha */

var Logger = require('./index');
var expect = require('chai').expect;

describe('the constructor', function(){
	it('should work when passed a name', function(){
		var logger = new Logger('wtf');
		expect(logger).to.be.a('function');
		expect(logger.info).to.be.a('function');
		expect(logger.debug).to.be.a('function');
		expect(logger.warn).to.be.a('function');
		expect(logger.error).to.be.a('function');
		expect(logger.loggerName).to.equal('wtf');
	});
	it('should render errors', function(){
		var logger = new Logger('wtf');
		logger.debug('hello, ', new Error('this is a problem'));
	});
});

describe('logLevel filtering', function(){
	var LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
	var origWrite;
	var output;

	beforeEach(function(){
		output = '';
		origWrite = process.stdout.write;
		process.stdout.write = function(txt){ output += txt; };
	});

	afterEach(function(){
		process.stdout.write = origWrite;
	});

	LOG_LEVELS.forEach(function(level, idx){
		it('should only print ' + level + ' and above when logLevel is ' + level, function(){
			var logger = Logger('test', level);
			LOG_LEVELS.forEach(function(l, i){
				logger[l](l + ' message');
			});
			var expectedLevels = LOG_LEVELS.slice(idx);
			expectedLevels.forEach(function(l){
				expect(output).to.match(new RegExp('\\[' + l + '\\].*' + l + ' message'));
			});
			LOG_LEVELS.slice(0, idx).forEach(function(l){
				expect(output).to.not.match(new RegExp('\\[' + l + '\\].*' + l + ' message'));
			});
		});
	});

	it('should default to debug level', function(){
		var logger = Logger('test');
		output = '';
		LOG_LEVELS.forEach(function(l){
			logger[l](l + ' message');
		});
		LOG_LEVELS.forEach(function(l){
			expect(output).to.match(new RegExp('\\[' + l + '\\].*' + l + ' message'));
		});
	});
});

describe('child loggers', function(){
	var origWrite;
	var output;

	beforeEach(function(){
		output = '';
		origWrite = process.stdout.write;
		process.stdout.write = function(txt){ output += txt; };
	});

	afterEach(function(){
		process.stdout.write = origWrite;
	});

	it('should allow child loggers to be created', function(){
		const logger = new Logger('my-app');
		const child = logger('child');
		const grandchild = child('grandchild');
		expect(child).to.be.a('function');
		expect(child.info).to.be.a('function');
		expect(grandchild).to.be.a('function');
		expect(grandchild.info).to.be.a('function');

		logger.info('hello from parent');
		expect(output).to.match(/\[.*\]\[info\]\[my-app\] hello from parent/);

		output = '';
		child.info('hello from child');
		expect(output).to.match(/\[.*\]\[info\]\[my-app\]\[child\] hello from child/);

		output = '';
		grandchild.info('hello from grandchild');
		expect(output).to.match(/\[.*\]\[info\]\[my-app\]\[child\]\[grandchild\] hello from grandchild/);
	});
});
