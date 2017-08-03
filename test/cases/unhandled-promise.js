'use strict';
const exitHook = require('./../../index');
const stub = require('./stub');

exitHook(cb => {
	setTimeout(() => {
		stub.called();
		cb();
	}, 50);
	stub.called();
});

exitHook(() => {
	stub.called();
});

exitHook.unhandledRejectionHandler((err, cb) => {
	setTimeout(() => {
		stub.called();
		cb();
	}, 50);
	if (!err || err.message !== 'test-promise') {
		stub.reject(`No error passed to unhandledRejectionHandler, or message not test-promise - ${err.message}`);
	}
	stub.called();
});

process.on('unhandledRejection', () => {
	// All uncaught rejection handlers should be called even though the exit hook handler was registered
	stub.called();
});

stub.addCheck(6);

(() => {
	return Promise.reject(new Error('test-promise'));
})();
