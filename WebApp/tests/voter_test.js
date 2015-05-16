var fs = require('fs'),
		voter = require('../voter.js'),
		http = require('http'),
		assert = require('assert');

var wsdl_sources = [];
var NVoter = new voter(wsdl_sources);


describe('Voter', function() {

	describe('Majority function', function() {

		it('should return null when unable to provide a majority result', function(done) {

			var actual = NVoter.majorityVoter([
				{return: 5},
				{return: 2},
				{return: 7},
				{return: 4},
			]);

			assert.equal(actual, null);

			actual = NVoter.majorityVoter([
				{return: 5},
				{return: null},
				{return: 6},
				{return: 3},
			]);

			assert.equal(actual, null);

			actual = NVoter.majorityVoter([
				{return: 5},
				{return: 5},
				{return: null},
				{return: null},
			]);

			assert.equal(actual, null);
			
			done();

		});
	});

});