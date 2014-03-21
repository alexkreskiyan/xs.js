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
test('keyOf', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.object.keyOf(x, 1), 'x', 'keyOf method finds ok');
    strictEqual(xs.object.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
});
test('lastKeyOf', function () {
    var x = {x: 1, b: 2, c: 2};
    strictEqual(xs.object.lastKeyOf(x, 2), 'c', 'lastKeyOf method finds ok');
    strictEqual(xs.object.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
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
    var shifted = x.a;
    strictEqual(xs.object.shift(x), shifted, 'shift method runs ok when result succeeds');
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
    var popped = x.d;
    strictEqual(xs.object.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(xs.object.keys(x).toString(), 'a,b,c', 'pop method runs ok when result succeeds');
    strictEqual(xs.object.pop({}), undefined, 'pop method runs ok when result fails');
});
test('remove', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1},
        e: 1,
        f: 1
    };
    xs.object.remove(x, x.a);
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.object.remove(x, 'a');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.object.remove(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.object.remove(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.object.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"f":1}', 'remove method runs ok when result succeeds');
    xs.object.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'remove method runs ok when result succeeds');
    xs.object.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'remove method runs ok when result succeeds');
});
test('removeLast', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1},
        e: 1,
        f: 1
    };
    xs.object.removeLast(x, x.a);
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.object.removeLast(x, 'a');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.object.removeLast(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.object.removeLast(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.object.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1}', 'removeLast method runs ok when result succeeds');
    xs.object.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'removeLast method runs ok when result succeeds');
    xs.object.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'removeLast method runs ok when result succeeds');
});
test('removeAll', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1},
        e: 1,
        f: 1
    };
    xs.object.removeAll(x, x.a, x.b, ['c', 'd'], [1, 1]);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');
    xs.object.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');
});
test('clone', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var clone = xs.object.clone(x);
    strictEqual(xs.object.every(clone, function (value, name) {
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
    strictEqual(JSON.stringify(clone), correct, 'extend works ok with a set of args');
    xs.object.extend(clone);
    strictEqual(JSON.stringify(clone), correct, 'extend works ok without args');
});
test('pick', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var clone = xs.object.pick(x, 'a', 'b');
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.object.pick(x, ['a'], ['b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.object.pick(x, ['a', 'b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.object.pick(x);
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok without args');
});
test('omit', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}';

    var clone = xs.object.omit(x, 'c', 'd');
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.object.omit(x, ['c'], ['d']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.object.omit(x, ['c', 'd']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.object.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');
});
test('defaults', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };

    var correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}';

    var clone = xs.object.clone(x);
    xs.object.defaults(clone, {e: 1}, {f: 1});
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');
    var clone = xs.object.clone(x);
    xs.object.defaults(clone, {e: 1}, {f: 1});
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');
    var clone = xs.object.clone(x);
    xs.object.defaults(clone, {a: 1});
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without defaulting');
    var clone = xs.object.clone(x);
    xs.object.defaults(clone);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without args');
});
module('2. Array');
test('keys', function () {
    var x = [1, 3];
    strictEqual(xs.array.keys(x).toString(), '0,1', 'keys method ok');
});
test('values', function () {
    var x = [1, 3];
    strictEqual(xs.array.values(x).toString(), '1,3', 'values method ok');
});
test('hasKey', function () {
    var x = [1, 3];
    strictEqual(xs.array.hasKey(x, 1), true, 'hasKey method finds ok');
    strictEqual(xs.array.hasKey(x, 2), false, 'hasKey method doesn\'t find ok');
});
test('has', function () {
    var x = [1, 3];
    strictEqual(xs.array.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.array.has(x, '1'), false, 'has method doesn\'t find ok');
});
test('keyOf', function () {
    var x = [1, 3];
    strictEqual(xs.array.keyOf(x, 3), 1, 'keyOf method finds ok');
    strictEqual(xs.array.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
});
test('lastKeyOf', function () {
    var x = [1, 3, 3];
    strictEqual(xs.array.lastKeyOf(x, 3), 2, 'lastKeyOf method finds ok');
    strictEqual(xs.array.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
});
test('find', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.array.find(x, function (value) {
        return value.y == 1;
    }), x[2], 'find method runs ok when result exists');
    strictEqual(xs.array.find(x, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result doesn\'t exist');
});
test('findLast', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.array.findLast(x, function (value) {
        return value.y == 1;
    }), x[3], 'findLast method runs ok when result exists');
    strictEqual(xs.array.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');
});
test('findAll', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.array.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([x[2], x[3]]), 'findAll method runs ok when result exists');
    results = xs.array.findAll(x, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'findAll method runs ok when result doesn\'t exist');
});
test('filter', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.array.filter(x, {x: 1});
    strictEqual(results, x[0], 'filter method runs ok when result exists');
    results = xs.array.filter(x, {x: 3});
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');
});
test('filterLast', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.array.filterLast(x, {x: 1});
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');
    results = xs.array.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
});
test('filterAll', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.array.filterLast(x, {x: 1});
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');
    results = xs.array.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
});
test('every', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.array.every(x, function (value) {
        return xs.object.hasKey(value, 'y');
    }), true, 'every method runs ok when result succeeds');
    strictEqual(xs.array.every(x, function (value) {
        return value.x === 1;
    }), false, 'every method runs ok when result fails');
});
test('some', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.array.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds');
    strictEqual(xs.array.some(x, function (value) {
        return value.x == 1 && value.y == 3;
    }), false, 'some method runs ok when result fails');
});
test('first', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.array.first(x), x[0], 'first method runs ok when result succeeds');
    strictEqual(xs.array.first({}), undefined, 'first method runs ok when result fails');
});
test('last', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.array.last(x), x[3], 'last method runs ok when result succeeds');
    strictEqual(xs.array.last({}), undefined, 'last method runs ok when result fails');
});
test('remove', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1},
        1,
        1
    ];
    xs.array.remove(x, x[0]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.array.remove(x, 0);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},{"x":1,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.array.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.array.remove(x, x[1]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1]', 'remove method runs ok when result succeeds');
    xs.array.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'remove method runs ok when result succeeds');
    xs.array.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'remove method runs ok when result succeeds');
});
test('removeLast', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        9,
        {x: 1, y: 1},
        9
    ];
    xs.array.removeLast(x, x[0]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1},9]', 'remove method runs ok when result succeeds');
    xs.array.removeLast(x, 9);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.array.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},9,{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.array.removeLast(x, x[1]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.array.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'remove method runs ok when result succeeds');
    xs.array.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'remove method runs ok when result succeeds');
});
test('removeAll', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        9,
        {x: 1, y: 1},
        9
    ];
    xs.array.removeAll(x, x[1], x[0], [9, 9], 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'removeAll method runs ok when result succeeds');
    xs.array.removeAll(x, 0);
    strictEqual(JSON.stringify(x), '[]', 'removeAll method runs ok when result succeeds');
});
test('clone', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var clone = xs.array.clone(x);
    strictEqual(xs.array.every(clone, function (value, name) {
        return xs.array.hasKey(this, name) && this[name] == value;
    }, x), true, 'clone direct comparison succeeds');
    strictEqual(xs.array.every(x, function (value, name) {
        return xs.array.hasKey(this, name) && this[name] == value;
    }, clone), true, 'clone revers comparison succeeds');
});
test('compact', function () {
    var x = [0, 1, 2, undefined, false, null, true, {}, [], '', '0', '1'];
    strictEqual(JSON.stringify(xs.array.compact(x)), '[1,2,true,{},[],"0","1"]', 'compact method works ok');
});
test('union', function () {
    strictEqual(JSON.stringify(xs.array.union(1, 2, [3], [4, 5])), '[1,2,3,4,5]', 'union method works ok');
});
test('intersection', function () {
    var arr = [];
    var obj = {};
    var x = [
        [1, 2, 3, 4, 5, null, true, false, '', obj, arr],
        [2, 3, 4, 5, null, false, '', obj, arr],
        [1, 7, 3, 4, null, 5, false, obj, arr],
        [7, 2, 3, 4, 5, false, true, obj, arr, null]
    ];
    var intersection = xs.array.intersection.apply(xs.array, x);
    strictEqual(JSON.stringify(intersection), '[3,4,5,null,false,{},[]]', 'intersection method works ok');
    strictEqual(xs.array.has(intersection, arr), true, 'intersection method works ok');
    strictEqual(xs.array.has(intersection, obj), true, 'intersection method works ok');
});
test('difference', function () {
    var arr = [];
    var obj = {};
    var x = [
        [1, 2, 3, 4, 5, 8, null, true, false, '', obj, arr],
        [2, 3, 4, 5, null, false, '', obj, arr],
        [1, 7, 3, 4, null, 5, false, obj, arr],
        [7, 2, 3, 4, 5, false, true, obj, arr, null]
    ];
    var diff = xs.array.difference.apply(xs.array, x);
    strictEqual(JSON.stringify(diff), '[8]', 'difference method works ok');
});
test('uniques', function () {
    var arr = [];
    var obj = {};
    var x = [1, 1, 2, 2, obj, null, true, false, '', obj, arr];
    var uniques = xs.array.uniques(x);
    strictEqual(JSON.stringify(uniques), '[1,2,{},null,true,false,"",[]]', 'uniques method works ok');
});
test('pick', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.array.pick(x, 0, 1);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.array.pick(x, [0], [1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.array.pick(x, [0, 1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.array.pick(x);
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');
});
test('omit', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.array.omit(x, 2, 3);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.array.omit(x, [2], [3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.array.omit(x, [2, 3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.array.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');
});
test('defaults', function () {
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];

    var clone = xs.array.clone(x);
    xs.array.defaults(clone, 1, 2, 3);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok with a set of args');
    var clone = xs.array.clone(x);
    xs.array.defaults(clone, 1, 2, 3, 4, 5);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},5]', 'defaults works ok with a set of args');
    var clone = xs.array.clone(x);
    xs.array.defaults(clone);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok without args');
});
test('range', function () {
    strictEqual(JSON.stringify(xs.array.range(3)), '[0,1,2,3]', 'range works ok with a stop given');
    strictEqual(JSON.stringify(xs.array.range(-1, 1)), '[-1,0,1]', 'range works ok with start and stop given');
    strictEqual(JSON.stringify(xs.array.range(-1, 4, 2)), '[-1,1,3,5]', 'range works ok with start, stop and step given');
    strictEqual(JSON.stringify(xs.array.range(-1, 5, 2)), '[-1,1,3,5]', 'range works ok with start, stop and step given');
    strictEqual(JSON.stringify(xs.array.range(-1, 6, 2)), '[-1,1,3,5,7]', 'range works ok with start, stop and step given');
});
module('3. set');
test('keys', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.set.keys(x).toString(), 'x,b', 'keys method ok');
    var x = [1, 3];
    strictEqual(xs.set.keys(x).toString(), '0,1', 'keys method ok');
});
test('values', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.set.values(x).toString(), '1,2', 'values method ok');
    var x = [1, 3];
    strictEqual(xs.set.values(x).toString(), '1,3', 'values method ok');
});
test('hasKey', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.set.hasKey(x, 'x'), true, 'hasKey method finds ok');
    strictEqual(xs.set.hasKey(x, 'y'), false, 'hasKey method doesn\'t find ok');
    var x = [1, 3];
    strictEqual(xs.set.hasKey(x, 1), true, 'hasKey method finds ok');
    strictEqual(xs.set.hasKey(x, 2), false, 'hasKey method doesn\'t find ok');
});
test('has', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.set.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.set.has(x, '1'), false, 'has method doesn\'t find ok');
    var x = [1, 3];
    strictEqual(xs.set.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.set.has(x, '1'), false, 'has method doesn\'t find ok');
});
test('keyOf', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.set.keyOf(x, 1), 'x', 'keyOf method finds ok');
    strictEqual(xs.set.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
    var x = [1, 3];
    strictEqual(xs.set.keyOf(x, 3), 1, 'keyOf method finds ok');
    strictEqual(xs.set.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
});
test('lastKeyOf', function () {
    var x = {x: 1, b: 2, c: 2};
    strictEqual(xs.set.lastKeyOf(x, 2), 'c', 'lastKeyOf method finds ok');
    strictEqual(xs.set.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
    var x = [1, 3, 3];
    strictEqual(xs.set.lastKeyOf(x, 3), 2, 'lastKeyOf method finds ok');
    strictEqual(xs.set.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
});
test('size', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.set.size(x), 2, 'size method evals non-empty ok');
    strictEqual(xs.set.size({}), 0, 'size method evals empty ok');
    var x = [1, 2];
    strictEqual(xs.set.size(x), 2, 'size method evals non-empty ok');
    strictEqual(xs.set.size([]), 0, 'size method evals empty ok');
});
test('each', function () {
    var x = {x: 1, b: 2};
    var sum = '';
    xs.set.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
    var x = [1, 2];
    var sum = '';
    xs.set.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
});
test('eachReverse', function () {
    var x = {x: 1, b: 2};
    var sum = '';
    xs.set.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
    var x = [1, 2];
    var sum = '';
    xs.set.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
});
test('map', function () {
    var x = {x: 1, b: 2};
    x = xs.set.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.set.values(x).toString(), '2x,4b', 'map method runs ok');
    var x = [1, 2];
    x = xs.set.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.set.values(x).toString(), '2,5', 'map method runs ok');
});
test('reduce', function () {
    var x = {x: 1, b: 2, a: 3};
    strictEqual(xs.set.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '5b6a', 'reduce method runs ok without memo');
    strictEqual(xs.set.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, 0), '2x4b6a', 'reduce method runs ok with memo');

    var x = [1, 2, 3];
    strictEqual(xs.set.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), 14, 'reduce method runs ok without memo');
    strictEqual(xs.set.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, -1), 14, 'reduce method runs ok with memo');
});
test('reduceRight', function () {
    var x = {x: 1, b: 2, a: 3};
    strictEqual(xs.set.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '7b2x', 'reduceRight method runs ok without memo');
    strictEqual(xs.set.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, 1), '7a4b2x', 'reduceRight method runs ok with memo');

    var x = [1, 2, 3];
    strictEqual(xs.set.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), 10, 'reduceRight method runs ok without memo');
    strictEqual(xs.set.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, -1), 14, 'reduceRight method runs ok with memo');
});
test('find', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.set.find(x, function (value) {
        return value.y == 1;
    }), x.c, 'find method runs ok when result exists');
    strictEqual(xs.set.find(x, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.set.find(x, function (value) {
        return value.y == 1;
    }), x[2], 'find method runs ok when result exists');
    strictEqual(xs.set.find(x, function (value) {
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
    strictEqual(xs.set.findLast(x, function (value) {
        return value.y == 1;
    }), x.d, 'findLast method runs ok when result exists');
    strictEqual(xs.set.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.set.findLast(x, function (value) {
        return value.y == 1;
    }), x[3], 'findLast method runs ok when result exists');
    strictEqual(xs.set.findLast(x, function (value) {
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
    results = xs.set.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({c: x.c, d: x.d}), 'findAll method runs ok when result exists');
    results = xs.set.findAll(x, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({}), 'findAll method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.set.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([x[2], x[3]]), 'findAll method runs ok when result exists');
    results = xs.set.findAll(x, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'findAll method runs ok when result doesn\'t exist');
});
test('filter', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var results;
    results = xs.set.filter(x, {x: 1});
    strictEqual(results, x.a, 'filter method runs ok when result exists');
    results = xs.set.filter(x, {x: 3});
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.set.filter(x, {x: 1});
    strictEqual(results, x[0], 'filter method runs ok when result exists');
    results = xs.set.filter(x, {x: 3});
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
    results = xs.set.filterLast(x, {x: 1});
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');
    results = xs.set.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.set.filterLast(x, {x: 1});
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');
    results = xs.set.filterLast(x, {x: 3});
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
    results = xs.set.filterLast(x, {x: 1});
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');
    results = xs.set.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.set.filterLast(x, {x: 1});
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');
    results = xs.set.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
});
test('every', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.set.every(x, function (value) {
        return xs.object.hasKey(value, 'y');
    }), true, 'every method runs ok when result succeeds');
    strictEqual(xs.set.every(x, function (value) {
        return value.x === 1;
    }), false, 'every method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.set.every(x, function (value) {
        return xs.object.hasKey(value, 'y');
    }), true, 'every method runs ok when result succeeds');
    strictEqual(xs.set.every(x, function (value) {
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
    strictEqual(xs.set.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds');
    strictEqual(xs.set.some(x, function (value) {
        return value.x == 1 && value.y == 3;
    }), false, 'some method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.set.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds');
    strictEqual(xs.set.some(x, function (value) {
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
    strictEqual(xs.set.first(x), x.a, 'first method runs ok when result succeeds');
    strictEqual(xs.set.first({}), undefined, 'first method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.set.first(x), x[0], 'first method runs ok when result succeeds');
    strictEqual(xs.set.first({}), undefined, 'first method runs ok when result fails');
});
test('last', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.set.last(x), x.d, 'last method runs ok when result succeeds');
    strictEqual(xs.set.last({}), undefined, 'last method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.set.last(x), x[3], 'last method runs ok when result succeeds');
    strictEqual(xs.set.last({}), undefined, 'last method runs ok when result fails');
});
test('shift', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var shifted = x.a;
    strictEqual(xs.set.shift(x), shifted, 'shift method runs ok when result succeeds');
    strictEqual(xs.set.keys(x).toString(), 'b,c,d', 'shift method runs ok when result succeeds');
    strictEqual(xs.set.shift({}), undefined, 'shift method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var shifted = x[0];
    strictEqual(xs.set.shift(x), shifted, 'shift method runs ok when result succeeds');
    strictEqual(xs.set.keys(x).toString(), '0,1,2', 'shift method runs ok when result succeeds');
    strictEqual(xs.set.shift({}), undefined, 'shift method runs ok when result fails');
});
test('pop', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var popped = x.d;
    strictEqual(xs.set.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(xs.set.keys(x).toString(), 'a,b,c', 'pop method runs ok when result succeeds');
    strictEqual(xs.set.pop({}), undefined, 'pop method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var popped = x[3];
    strictEqual(xs.set.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(xs.set.keys(x).toString(), '0,1,2', 'pop method runs ok when result succeeds');
    strictEqual(xs.set.pop({}), undefined, 'pop method runs ok when result fails');
});
test('remove', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1},
        e: 1,
        f: 1
    };
    xs.set.remove(x, x.a);
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 'a');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"f":1}', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'remove method runs ok when result succeeds');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1},
        1,
        1
    ];
    xs.set.remove(x, x[0]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 0);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},{"x":1,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.set.remove(x, x[1]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1]', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'remove method runs ok when result succeeds');
    xs.set.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'remove method runs ok when result succeeds');
});
test('removeLast', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1},
        e: 1,
        f: 1
    };
    xs.set.removeLast(x, x.a);
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.set.removeLast(x, 'a');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.set.removeLast(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.set.removeLast(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.set.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1}', 'removeLast method runs ok when result succeeds');
    xs.set.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'removeLast method runs ok when result succeeds');
    xs.set.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'removeLast method runs ok when result succeeds');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        9,
        {x: 1, y: 1},
        9
    ];
    xs.set.removeLast(x, x[0]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1},9]', 'remove method runs ok when result succeeds');
    xs.set.removeLast(x, 9);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.set.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},9,{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.set.removeLast(x, x[1]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.set.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'remove method runs ok when result succeeds');
    xs.set.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'remove method runs ok when result succeeds');
});
test('removeAll', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1},
        e: 1,
        f: 1
    };
    xs.set.removeAll(x, x.a, x.b, ['c', 'd'], [1, 1]);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');
    xs.set.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        9,
        {x: 1, y: 1},
        9
    ];
    xs.set.removeAll(x, x[1], x[0], [9, 9], 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'removeAll method runs ok when result succeeds');
    xs.set.removeAll(x, 0);
    strictEqual(JSON.stringify(x), '[]', 'removeAll method runs ok when result succeeds');
});
test('pick', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var clone = xs.set.pick(x, 'a', 'b');
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.set.pick(x, ['a'], ['b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.set.pick(x, ['a', 'b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.set.pick(x);
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok without args');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.set.pick(x, 0, 1);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.set.pick(x, [0], [1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.set.pick(x, [0, 1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.set.pick(x);
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');
});
test('omit', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}';

    var clone = xs.set.omit(x, 'c', 'd');
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.set.omit(x, ['c'], ['d']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.set.omit(x, ['c', 'd']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.set.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.set.omit(x, 2, 3);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.set.omit(x, [2], [3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.set.omit(x, [2, 3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.set.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');
});
test('defaults', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };

    var correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}';

    var clone = xs.set.clone(x);
    xs.set.defaults(clone, {e: 1}, {f: 1});
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');
    var clone = xs.set.clone(x);
    xs.set.defaults(clone, {e: 1}, {f: 1});
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');
    var clone = xs.set.clone(x);
    xs.set.defaults(clone, {a: 1});
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without defaulting');
    var clone = xs.set.clone(x);
    xs.set.defaults(clone);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without args');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];

    var clone = xs.set.clone(x);
    xs.set.defaults(clone, 1, 2, 3);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok with a set of args');
    var clone = xs.set.clone(x);
    xs.set.defaults(clone, 1, 2, 3, 4, 5);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},5]', 'defaults works ok with a set of args');
    var clone = xs.set.clone(x);
    xs.set.defaults(clone);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok without args');
});
module('4. Function');
test('prefill', function () {
    var fn = function (a, b, c) {
        return this.x * a * b * c;
    }
    var filled = xs.fn.prefill(fn, [1, 2, 3], {x: 5});

    strictEqual(filled(4), 5 * 4 * 2 * 3, 'prefilled ok');
});
test('once', function () {
    var fn = function (obj) {
        obj.x++;
    }
    var obj = {x: 1};
    var one = xs.fn.once(fn);

    one(obj);
    strictEqual(obj.x, 2, 'once ok');
    one(obj);
    strictEqual(obj.x, 2, 'once ok');
});
test('wrap', function () {
    var fn = function (val) {
        return 2 * val;
    }
    var wrapped = xs.fn.wrap(fn, function (func, a, b, c) {
        return a + func(b) + c;
    });

    strictEqual(wrapped(1, 2, 3), 8, 'wrap ok');
});

















