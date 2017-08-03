'use strict';
const stub = require('./stub');
const exitHook = require('./../../index');

exitHook(() => {
	stub.called();
});

exitHook(() => {
	stub.called();
});

process.on('exit', () => {
	stub.called();
});

stub.addCheck(3);
