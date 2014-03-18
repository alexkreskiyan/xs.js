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
/**
 * Tests:
 * 1. Object
 * 2. Array
 * 3. Set
 * 4. Fn
 * 5. String
 * 6. Number
 */
module('1. Object');
test('keys', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.object.keys(x).toString(), 'x,b', 'keys method ok');
});
test('values', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.object.values(x).toString(), '1,2', 'values method ok');
});
test('hasKey', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.object.hasKey(x, 'x'), true, 'hasKey method finds ok');
    strictEqual(xs.object.hasKey(x, 'y'), false, 'hasKey method doesn\'t find ok');
});
test('has', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.object.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.object.has(x, '1'), false, 'has method doesn\'t find ok');
});
test('indexOf', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.object.indexOf(x, 1), 'x', 'indexOf method finds ok');
    strictEqual(xs.object.indexOf(x, '1'), undefined, 'indexOf method doesn\'t find ok');
});
test('size', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.object.size(x), 2, 'size method evals non-empty ok');
    strictEqual(xs.object.size({}), 0, 'size method evals empty ok');
});
test('each', function () {
    var x = {x: 1, b: 2};
    var sum = '';
    xs.object.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
});
test('eachReverse', function () {
    var x = {x: 1, b: 2};
    var sum = '';
    xs.object.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
});
test('map', function () {
    var x = {x: 1, b: 2};
    x = xs.object.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.object.values(x).toString(), '2x,4b', 'map method runs ok');
});
test('reduce', function () {
    var x = {x: 1, b: 2, a: 3};
    strictEqual(xs.object.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '5b6a', 'reduce method runs ok without memo');
    strictEqual(xs.object.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, 0), '2x4b6a', 'reduce method runs ok with memo');
});
test('reduceRight', function () {
    var x = {x: 1, b: 2, a: 3};
    strictEqual(xs.object.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '7b2x', 'reduceRight method runs ok without memo');
    strictEqual(xs.object.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, 1), '7a4b2x', 'reduceRight method runs ok with memo');
});























