'use strict';
const exitHook = require('./../../index');
const stub = require('./stub');

exitHook(cb => {
	setTimeout(() => {
		stub.called();
		cb();
	}, 2000);
	stub.called();
});

exitHook(() => {
	stub.called();
});

// eslint-disable-next-line handle-callback-err
exitHook.uncaughtExceptionHandler((err, cb) => {
	setTimeout(() => {
		stub.called();
		cb();
	}, 2000);
	stub.called();
});

exitHook.forceExitTimeout(500);
stub.addCheck(3);

throw new Error('test');
