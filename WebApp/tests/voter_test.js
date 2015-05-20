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

			actual = NVoter.majorityVoter([
				{return: 5},
				{return: 5},
				{return: 7},
				{return: 7},
			]);

			assert.equal(actual, null);

			actual = NVoter.majorityVoter([
				{return: 1},
				{return: 2},
				{return: 3},
				{return: 4},
			]);

			assert.equal(actual, null);


			
			done();

		});

		it('should return a value when able to provide a majority result', function(done) {

			var actual = NVoter.majorityVoter([
				{return: 3},
				{return: 3},
				{return: 3},
				{return: 4},
			]);
			assert.equal(actual, 3);

			actual = NVoter.majorityVoter([
				{return: 5},
				{return: 5},
				{return: 6},
				{return: 6},
			]);
			assert.equal(actual, 5);

			actual = NVoter.majorityVoter([
				{return: 6},
				{return: 6},
				{return: 5},
				{return: 5},
			]);
			assert.equal(actual, 5);

			actual = NVoter.majorityVoter([
				{return: 5},
				{return: 5},
				{return: 5},
				{return: 6},
				{return: 6},
				{return: 6},
			]);
			assert.equal(actual, 5);

			actual = NVoter.majorityVoter([
				{return: 3},
				{return: 3},
				{return: 4},
				{return: 4},
				{return: 5},
			]);
			assert.equal(actual, 3);

			actual = NVoter.majorityVoter([
				{return: 0},
				{return: 18},
				{return: 0},
				{return: 18},
				{return: 19},
			]);
			assert.equal(actual, 18);

			actual = NVoter.majorityVoter([
				{return: 22},
				{return: 0},
				{return: 22},
				{return: 22},
			]);
			assert.equal(actual, 22);

			actual = NVoter.majorityVoter([
				{return: -1},
				{return: 5},
				{return: -1},
				{return: 0},
				{return: 5},
				{return: 5},
				{return: 6},
				{return: -1},
				{return: 5},
			]);
			assert.equal(actual, 5);

			actual = NVoter.majorityVoter([
				{return: -1},
				{return: 0},
				{return: 1},
				{return: 1},
				{return: -1},
				{return: 0},
				{return: 0},
				{return: 1},
				{return: 0},
				{return: 0},
				{return: 0},
				{return: -1},
				{return: 1},
			]);
			assert.equal(actual, 0);

			actual = NVoter.majorityVoter([
				{return: 3},
				{return: -1},
				{return: 0},
				{return: null},
				{return: 3},
				{return: 3},
				{return: 3},
				{return: 4},
				{return: -1},
				{return: 0},
				{return: -1},
				{return: 0},
				{return: 0},
				{return: 0},
				{return: 3}
			]);
			assert.equal(actual, 3);

			
			done();

		});
	});

});