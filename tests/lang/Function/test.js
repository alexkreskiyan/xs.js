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
module('xs.lang.Function');
test('bind', function () {
    var fn = function (a, b, c) {
        return this.x + (a - b) * c;
    }
    var binded = xs.Function.bind(fn, {x: 5}, [2, 3]);

    strictEqual(binded(4), 5 + (2 - 3) * 4, 'binded ok');
});
test('prefill', function () {
    var fn = function (a, b, c) {
        return this.x + (a - b) * c;
    }
    var filled = xs.Function.prefill(fn, [1, 2, 3], {x: 5});

    strictEqual(filled(4), 5 + (4 - 2) * 3, 'prefilled ok');
});
test('once', function () {
    var fn = function (obj) {
        obj.x++;
    }
    var obj = {x: 1};
    var one = xs.once(fn);

    one(obj);
    strictEqual(obj.x, 2, 'once ok');
    one(obj);
    strictEqual(obj.x, 2, 'once ok');
});
test('wrap', function () {
    var fn = function (val) {
        return 2 * val;
    }
    var wrapped = xs.wrap(fn, function (func, a, b, c) {
        return a + func(b) + c;
    });

    strictEqual(wrapped(1, 2, 3), 8, 'wrap ok');
});