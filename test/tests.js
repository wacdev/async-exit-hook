// Tests have to happen in a subprocess to test the exit functionality
'use strict';

var fork = require('child_process').fork;
var path = require('path');

var test = require('ava');

/**
 * Starts a test file in a subprocess, returns a promise that resolves with the subprocess
 * exit code and output in an array ([code, output])
 *
 * @async
 * @param {String} test Filename without path or extension
 * @param {String} signal Signal (or 'shutdown' for message) to send to the process
 * @return {Promise.<[Number, String]>} Array with the exit code and output of the subprocess
 */
function testInSub(test, signal) {
	return new Promise(resolve => {
		var proc = fork(
			path.resolve(__dirname, './cases/' + test + '.js'),
			{
				env: process.env,
				silent: true
			}
		);

		var output = '';

		proc.stdout.on('data', function (data) {
			output += data.toString();
		});

		proc.stderr.on('data', function (data) {
			output += data.toString();
		});

		proc.on('exit', code => {
			resolve([code, output]);
		});

		if (signal === 'shutdown') {
			proc.send(signal);
		} else if (signal) {
			proc.kill(signal);
		}
	});
}

test('API: test adding and removing and listing hooks', t => {
	var exitHook = require('./../');

	t.plan(3);

	// Enable hooks
	exitHook(() => {});

	// Ensure SIGBREAK hook
	exitHook.hookEvent('SIGBREAK', 128 + 21);
	t.not(exitHook.hookedEvents().indexOf('SIGBREAK'), -1);

	// Unhook SIGBREAK
	exitHook.unhookEvent('SIGBREAK');
	t.is(exitHook.hookedEvents().indexOf('SIGBREAK'), -1);

	// Rehook SIGBREAK
	exitHook.hookEvent('SIGBREAK', 128 + 21);
	t.not(exitHook.hookedEvents().indexOf('SIGBREAK'), -1);
});

test('sync handlers', t => {
	t.plan(2);
	return testInSub('sync', 'shutdown')
		.then(([code, output]) => {
			t.is(output, 'SUCCESS');
			t.is(code, 0);
		});
});

test('async handlers', t => {
	t.plan(2);
	return testInSub('async', 'shutdown')
		.then(([code, output]) => {
			t.is(output, 'SUCCESS');
			t.is(code, 0);
		});
});

test('async uncaught exception handler', t => {
	t.plan(2);
	return testInSub('async-err')
		.then(([code, output]) => {
			t.is(output, 'SUCCESS');
			t.is(code, 0);
		});
});

test('async exit timeout', t => {
	t.plan(2);
	return testInSub('async-exit-timeout')
		.then(([code, output]) => {
			t.is(output, 'SUCCESS');
			t.is(code, 0);
		});
});
