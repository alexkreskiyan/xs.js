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
module('xs.lang.String');
test('urlAppend', function () {
    var url,
        string = 'x=1';
    url = 'url';
    strictEqual(xs.String.urlAppend(url, string), 'url?x=1', 'ok when no question sign');
    url = 'url?s=2';
    strictEqual(xs.String.urlAppend(url, string), 'url?s=2&x=1', 'ok with question sign');
});