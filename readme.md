# async-exit-hook
[![Build Status](https://api.travis-ci.org/Tapppi/async-exit-hook.svg)](https://travis-ci.org/Tapppi/async-exit-hook)

> Run some code when the process exits

The `process.on('exit')` event doesn't catch all the ways a process can exit. This module catches:

* process SIGINT, SIGTERM and SIGHUP signals  
* process beforeExit and exit events  
* PM2 clustering process shutdown message ([PM2 graceful reload](http://pm2.keymetrics.io/docs/usage/cluster-mode/#graceful-reload))  

Useful for cleaning up. You can also include async handlers, and add custom events to hook and exit on.

Forked and pretty much rewritten from [exit-hook](https://npmjs.com/package/exit-hook).


## Install

```
$ npm install --save async-exit-hook
```

## Usage
**If you use asynchronous exit hooks, DO NOT use `process.exit()` to exit.
The `exit` event DOES NOT support asynchronous code.**
>['beforeExit' is not emitted for conditions causing explicit termination, such as process.exit()]
(https://nodejs.org/api/process.html#process_event_beforeexit)

If you use custom clustering / child processes, you can gracefully shutdown your child process
by sending a shutdown message (`childProc.send('shutdown')`).

On windows `process.kill('SIGINT')` does not work fire signal events, and as such, cannot be used
to gracefully exit.

```js
const exitHook = require('async-exit-hook');

exitHook(() => {
    console.log('exiting');
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

// You can hook uncaught errors with uncaughtExceptionHandler(), consequently adding 
// async support to uncaught errors (normally uncaught errors result in a synchronous exit).
// Add the second parameter (callback) to indicate async hooks
exitHook.uncaughtExceptionHandler((err, callback) => {
    console.error(err);
    // Log to rollbar or whatever
    rollbar.handleError(err => {
        if (err) {
            console.error(err);
        }
        callback();
    });
});

// You can hook uncaught errors with uncaughtErrorHandler(), consequently adding 
// async support to uncaught errors (normally uncaught errors result in a synchronous exit)
throw new Error('unicorns');

//=> 'exiting'
//=> 'exiting 2'
//=> 'exiting 3'
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
