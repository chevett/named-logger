var Logger = require('./index');
var expect = require('chai').expect;

describe('the constructor', function(){
	it('should work when passed a name', function(){
		var logger = new Logger('wtf');
		expect(logger).to.be.instanceof(Logger);
	});
});

