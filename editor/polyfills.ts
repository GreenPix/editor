// Polyfills

// import 'ie-shim'; // Internet Explorer
// import 'es6-shim';
// import 'es6-promise';
// import 'es7-reflect-metadata';

// Prefer CoreJS over the polyfills above
import 'core-js/client/shim';
import 'reflect-metadata';
import 'zone.js/dist/zone';

if (IS_PRODUCTION) {
  // Production


} else {
  // Development

  (Error as any).stackTraceLimit = Infinity;

  require('zone.js/dist/long-stack-trace-zone');

}
