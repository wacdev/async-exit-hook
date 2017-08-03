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

stub.addCheck(3);
