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
module('xs.Detect');

test('isEmpty', function () {
    strictEqual(true, true);
    var ua = xs.env.userAgent;
    console.log(ua);
    var reg = /(?!chromium)/;
    console.log(reg.exec(ua));
    console.log(xs.env.browser);
});