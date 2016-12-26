module.exports = options => [
    'clean',
    'source', //concat core only
    'debug', //concat only
    'preview', //concat, no asserts, no logs
    'candidate', //concat, uglify, no logs. Is needed for performance tests
    'release' //concat, uglify, no logs, no asserts
];