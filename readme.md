# pm2-exit-hook [![Build Status](https://travis-ci.org/tapppi/exit-hook.svg?branch=pm2-exit-hook)](https://travis-ci.org/tapppi/exit-hook)

> Run some code when the process exits

The `process.on('exit')` event doesn't catch all the ways a process can exit. You can also
include async handlers.

Useful for cleaning up.

Supports pm2 cluster mode.


## Install

```
$ npm install --save pm2-exit-hook
```


## Usage

```js
const exitHook = require('exit-hook');

exitHook(() => {
	console.log('exiting');
});

// you can add multiple hooks, even across files
exitHook(() => {
	console.log('exiting 2');
});

// you can add multiple hooks, even across files
exitHook(() => {
	console.log('exiting 2');
});

// you can add async hooks by accepting a callback
exitHook(callback => {
	setTimeout(() => {
		console.log('exiting 3');
		callback();
	}, 1000);
});

throw new Error('unicorns');

//=> 'exiting'
//=> 'exiting 2'
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
