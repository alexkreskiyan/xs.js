function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
'use strict';
module('xs.ClassManager');
/**
 * 1. Class definition
 * - simple
 */
module('1. Singleton');
test('base', function () {
    strictEqual(5, 5, 'method "e" saved ok');
});