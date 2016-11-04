// Stub to make sure that the required callbacks are called by exit-hook

var c = 0;
var noCallback = true;

// Increment the called count
exports.called = function () {
	c++;
};

// Exit with error
exports.reject = function (s, code) {
	process.stdout.write('FAILURE: ' + s);
	// eslint-disable-next-line xo/no-process-exit
	process.exit(code === null || code === undefined ? 1 : code);
};

// Exit with success
exports.done = function () {
	process.stdout.write('SUCCESS');
	// eslint-disable-next-line xo/no-process-exit
	process.exit(0);
};

// Add the exit check with a specific expected called count
exports.addCheck = function (num) {
	noCallback = false;

	// Only call exit once, and save uncaught errors
	var called = false;
	var ucErrStr;

	// Save errors that do not start with 'test'
	process.on('uncaughtException', function (err) {
		if (err.message.indexOf('test') !== 0) {
			ucErrStr = err.stack;
		}
	});
	// Save rejections that do not start with 'test'
	process.on('unhandledRejection', function (reason) {
		if ((reason.message || reason).indexOf('test') !== 0) {
			ucErrStr = reason.message || reason;
		}
	});

	// Check that there were no unexpected errors and all callbacks were called
	function onExitCheck(timeout) {
		if (called) {
			return;
		}
		called = true;

		if (timeout) {
			exports.reject('Test timed out');
		} else if (ucErrStr) {
			exports.reject(ucErrStr);
		} else if (c === num) {
			exports.done();
		} else {
			exports.reject('Expected ' + num + ' callback calls, but ' + c + ' received');
		}
	}

	process.once('exit', onExitCheck.bind(null, null));
	setTimeout(onExitCheck.bind(null, true), 10000);
};

// If the check isn't added, throw on exit
process.once('exit', function () {
	if (noCallback) {
		exports.reject('FAILURE, CHECK NOT ADDED');
	}
});
