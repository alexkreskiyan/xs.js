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
test('find', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.object.find(x, function (value) {
        return value.y == 1;
    }), x.c, 'find method runs ok when result exists');
    strictEqual(xs.object.find(x, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result doesn\'t exist');
});
test('findLast', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.object.findLast(x, function (value) {
        return value.y == 1;
    }), x.d, 'findLast method runs ok when result exists');
    strictEqual(xs.object.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');
});
test('findAll', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var results;
    results = xs.object.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({c: x.c, d: x.d}), 'findAll method runs ok when result exists');
    results = xs.object.findAll(x, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({}), 'findAll method runs ok when result doesn\'t exist');
});
test('filter', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var results;
    results = xs.object.filter(x, {x: 1});
    strictEqual(results, x.a, 'filter method runs ok when result exists');
    results = xs.object.filter(x, {x: 3});
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');
});
test('filterLast', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var results;
    results = xs.object.filterLast(x, {x: 1});
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');
    results = xs.object.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
});
test('filterAll', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var results;
    results = xs.object.filterLast(x, {x: 1});
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');
    results = xs.object.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
});
test('every', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.object.every(x, function (value) {
        return xs.object.hasKey(value, 'y');
    }), true, 'every method runs ok when result succeeds');
    strictEqual(xs.object.every(x, function (value) {
        return value.x === 1;
    }), false, 'every method runs ok when result fails');
});
test('some', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.object.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds');
    strictEqual(xs.object.some(x, function (value) {
        return value.x == 1 && value.y == 3;
    }), false, 'some method runs ok when result fails');
});
test('first', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.object.first(x), x.a, 'first method runs ok when result succeeds');
    strictEqual(xs.object.first({}), undefined, 'first method runs ok when result fails');
});
test('last', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.object.last(x), x.d, 'last method runs ok when result succeeds');
    strictEqual(xs.object.last({}), undefined, 'last method runs ok when result fails');
});
test('shift', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.object.shift(x), x.a, 'shift method runs ok when result succeeds');
    strictEqual(xs.object.keys(x).toString(), 'b,c,d', 'shift method runs ok when result succeeds');
    strictEqual(xs.object.shift({}), undefined, 'shift method runs ok when result fails');
});
test('pop', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.object.pop(x), x.d, 'pop method runs ok when result succeeds');
    strictEqual(xs.object.keys(x).toString(), 'a,b,c', 'pop method runs ok when result succeeds');
    strictEqual(xs.object.pop({}), undefined, 'pop method runs ok when result fails');
});
test('clone', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var clone = xs.object.clone(x);
    console.log(clone);
    strictEqual(xs.object.every(clone, function (value, name) {
        console.log(name, this[name], value);
        return xs.object.hasKey(this, name) && this[name] == value;
    }, x), true, 'clone direct comparison succeeds');
    strictEqual(xs.object.every(x, function (value, name) {
        return xs.object.hasKey(this, name) && this[name] == value;
    }, clone), true, 'clone revers comparison succeeds');
});
test('extend', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var clone = xs.object.clone(x);
    xs.object.extend(clone, {d: 5}, {a: 3}, {a: 5}, {e: {x: 1, y: 5}});
    var correct = '{"a":5,"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":5,"e":{"x":1,"y":5}}';
    strictEqual(JSON.stringify(clone), correct, 'extends works ok with a set of args');
    xs.object.extend(clone);
    strictEqual(JSON.stringify(clone), correct, 'extends works ok with a set of args');
});




















