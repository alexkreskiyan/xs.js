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
test('keys', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.keys(x).toString(), 'x,b', 'keys method ok');
    var x = [1, 3];
    strictEqual(xs.keys(x).toString(), '0,1', 'keys method ok');
});
test('values', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.values(x).toString(), '1,2', 'values method ok');
    var x = [1, 3];
    strictEqual(xs.values(x).toString(), '1,3', 'values method ok');
});
test('hasKey', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.hasKey(x, 'x'), true, 'hasKey method finds ok');
    strictEqual(xs.hasKey(x, 'y'), false, 'hasKey method doesn\'t find ok');
    var x = [1, 3];
    strictEqual(xs.hasKey(x, 1), true, 'hasKey method finds ok');
    strictEqual(xs.hasKey(x, 2), false, 'hasKey method doesn\'t find ok');
});
test('has', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.has(x, '1'), false, 'has method doesn\'t find ok');
    var x = [1, 3];
    strictEqual(xs.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.has(x, '1'), false, 'has method doesn\'t find ok');
});
test('keyOf', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.keyOf(x, 1), 'x', 'keyOf method finds ok');
    strictEqual(xs.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
    var x = [1, 3];
    strictEqual(xs.keyOf(x, 3), 1, 'keyOf method finds ok');
    strictEqual(xs.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
});
test('lastKeyOf', function () {
    var x = {x: 1, b: 2, c: 2};
    strictEqual(xs.lastKeyOf(x, 2), 'c', 'lastKeyOf method finds ok');
    strictEqual(xs.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
    var x = [1, 3, 3];
    strictEqual(xs.lastKeyOf(x, 3), 2, 'lastKeyOf method finds ok');
    strictEqual(xs.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
});
test('size', function () {
    var x = {x: 1, b: 2};
    strictEqual(xs.size(x), 2, 'size method evals non-empty ok');
    strictEqual(xs.size({}), 0, 'size method evals empty ok');
    var x = [1, 2];
    strictEqual(xs.size(x), 2, 'size method evals non-empty ok');
    strictEqual(xs.size([]), 0, 'size method evals empty ok');
});
test('each', function () {
    var x = {x: 1, b: 2};
    var sum = '';
    xs.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
    var x = [1, 2];
    var sum = '';
    xs.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
});
test('eachReverse', function () {
    var x = {x: 1, b: 2};
    var sum = '';
    xs.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
    var x = [1, 2];
    var sum = '';
    xs.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
});
test('map', function () {
    var x = {x: 1, b: 2};
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.values(x).toString(), '2x,4b', 'map method runs ok');
    var x = [1, 2];
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.values(x).toString(), '2,5', 'map method runs ok');
});
test('reduce', function () {
    var x = {x: 1, b: 2, a: 3};
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '5b6a', 'reduce method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, 0), '2x4b6a', 'reduce method runs ok with memo');

    var x = [1, 2, 3];
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), 14, 'reduce method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, -1), 14, 'reduce method runs ok with memo');
});
test('reduceRight', function () {
    var x = {x: 1, b: 2, a: 3};
    strictEqual(xs.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '7b2x', 'reduceRight method runs ok without memo');
    strictEqual(xs.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, undefined, 1), '7a4b2x', 'reduceRight method runs ok with memo');

    var x = [1, 2, 3];
    strictEqual(xs.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), 10, 'reduceRight method runs ok without memo');
    strictEqual(xs.reduceRight(x, function (memo, value, name) {
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
    strictEqual(xs.find(x, function (value) {
        return value.y == 1;
    }), x.c, 'find method runs ok when result exists');
    strictEqual(xs.find(x, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.find(x, function (value) {
        return value.y == 1;
    }), x[2], 'find method runs ok when result exists');
    strictEqual(xs.find(x, function (value) {
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
    strictEqual(xs.findLast(x, function (value) {
        return value.y == 1;
    }), x.d, 'findLast method runs ok when result exists');
    strictEqual(xs.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.findLast(x, function (value) {
        return value.y == 1;
    }), x[3], 'findLast method runs ok when result exists');
    strictEqual(xs.findLast(x, function (value) {
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
    results = xs.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({c: x.c, d: x.d}), 'findAll method runs ok when result exists');
    results = xs.findAll(x, function (value) {
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
    results = xs.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([x[2], x[3]]), 'findAll method runs ok when result exists');
    results = xs.findAll(x, function (value) {
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
    results = xs.filter(x, {x: 1});
    strictEqual(results, x.a, 'filter method runs ok when result exists');
    results = xs.filter(x, {x: 3});
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.filter(x, {x: 1});
    strictEqual(results, x[0], 'filter method runs ok when result exists');
    results = xs.filter(x, {x: 3});
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
    results = xs.filterLast(x, {x: 1});
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');
    results = xs.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.filterLast(x, {x: 1});
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');
    results = xs.filterLast(x, {x: 3});
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
    results = xs.filterLast(x, {x: 1});
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');
    results = xs.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var results;
    results = xs.filterLast(x, {x: 1});
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');
    results = xs.filterLast(x, {x: 3});
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');
});
test('every', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.every(x, function (value) {
        return xs.hasKey(value, 'y');
    }), true, 'every method runs ok when result succeeds');
    strictEqual(xs.every(x, function (value) {
        return value.x === 1;
    }), false, 'every method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.every(x, function (value) {
        return xs.hasKey(value, 'y');
    }), true, 'every method runs ok when result succeeds');
    strictEqual(xs.every(x, function (value) {
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
    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds');
    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 3;
    }), false, 'some method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds');
    strictEqual(xs.some(x, function (value) {
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
    strictEqual(xs.first(x), x.a, 'first method runs ok when result succeeds');
    strictEqual(xs.first({}), undefined, 'first method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.first(x), x[0], 'first method runs ok when result succeeds');
    strictEqual(xs.first({}), undefined, 'first method runs ok when result fails');
});
test('last', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    strictEqual(xs.last(x), x.d, 'last method runs ok when result succeeds');
    strictEqual(xs.last({}), undefined, 'last method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    strictEqual(xs.last(x), x[3], 'last method runs ok when result succeeds');
    strictEqual(xs.last({}), undefined, 'last method runs ok when result fails');
});
test('shift', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var shifted = x.a;
    strictEqual(xs.shift(x), shifted, 'shift method runs ok when result succeeds');
    strictEqual(xs.keys(x).toString(), 'b,c,d', 'shift method runs ok when result succeeds');
    strictEqual(xs.shift({}), undefined, 'shift method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var shifted = x[0];
    strictEqual(xs.shift(x), shifted, 'shift method runs ok when result succeeds');
    strictEqual(xs.keys(x).toString(), '0,1,2', 'shift method runs ok when result succeeds');
    strictEqual(xs.shift({}), undefined, 'shift method runs ok when result fails');
});
test('pop', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var popped = x.d;
    strictEqual(xs.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(xs.keys(x).toString(), 'a,b,c', 'pop method runs ok when result succeeds');
    strictEqual(xs.pop({}), undefined, 'pop method runs ok when result fails');
    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var popped = x[3];
    strictEqual(xs.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(xs.keys(x).toString(), '0,1,2', 'pop method runs ok when result succeeds');
    strictEqual(xs.pop({}), undefined, 'pop method runs ok when result fails');
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
    xs.remove(x, x.a);
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.remove(x, 'a');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.remove(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.remove(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');
    xs.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"f":1}', 'remove method runs ok when result succeeds');
    xs.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'remove method runs ok when result succeeds');
    xs.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'remove method runs ok when result succeeds');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1},
        1,
        1
    ];
    xs.remove(x, x[0]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.remove(x, 0);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},{"x":1,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1,1]', 'remove method runs ok when result succeeds');
    xs.remove(x, x[1]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1]', 'remove method runs ok when result succeeds');
    xs.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'remove method runs ok when result succeeds');
    xs.remove(x, 1);
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
    xs.removeLast(x, x.a);
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.removeLast(x, 'a');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.removeLast(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.removeLast(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');
    xs.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1}', 'removeLast method runs ok when result succeeds');
    xs.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'removeLast method runs ok when result succeeds');
    xs.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'removeLast method runs ok when result succeeds');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        9,
        {x: 1, y: 1},
        9
    ];
    xs.removeLast(x, x[0]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1},9]', 'remove method runs ok when result succeeds');
    xs.removeLast(x, 9);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},9,{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.removeLast(x, x[1]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":1,"y":1}]', 'remove method runs ok when result succeeds');
    xs.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'remove method runs ok when result succeeds');
    xs.removeLast(x, 1);
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
    xs.removeAll(x, x.a, x.b, ['c', 'd'], [1, 1]);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');
    xs.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        9,
        {x: 1, y: 1},
        9
    ];
    xs.removeAll(x, x[1], x[0], [9, 9], 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'removeAll method runs ok when result succeeds');
    xs.removeAll(x, 0);
    strictEqual(JSON.stringify(x), '[]', 'removeAll method runs ok when result succeeds');
});
test('pick', function () {
    var x = {
        a: {x: 1, y: 2},
        b: {x: 2, y: 2},
        c: {x: 2, y: 1},
        d: {x: 1, y: 1}
    };
    var clone = xs.pick(x, 'a', 'b');
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.pick(x, ['a'], ['b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.pick(x, ['a', 'b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');
    var clone = xs.pick(x);
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok without args');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.pick(x, 0, 1);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.pick(x, [0], [1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.pick(x, [0, 1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');
    var clone = xs.pick(x);
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

    var clone = xs.omit(x, 'c', 'd');
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.omit(x, ['c'], ['d']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.omit(x, ['c', 'd']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.omit(x, 2, 3);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.omit(x, [2], [3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.omit(x, [2, 3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');
    var clone = xs.omit(x);
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

    var clone = xs.clone(x);
    xs.defaults(clone, {e: 1}, {f: 1});
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');
    var clone = xs.clone(x);
    xs.defaults(clone, {e: 1}, {f: 1});
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');
    var clone = xs.clone(x);
    xs.defaults(clone, {a: 1});
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without defaulting');
    var clone = xs.clone(x);
    xs.defaults(clone);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without args');

    var x = [
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];

    var clone = xs.clone(x);
    xs.defaults(clone, 1, 2, 3);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok with a set of args');
    var clone = xs.clone(x);
    xs.defaults(clone, 1, 2, 3, 4, 5);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},5]', 'defaults works ok with a set of args');
    var clone = xs.clone(x);
    xs.defaults(clone);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok without args');
});
test('compact', function () {
    var x = [0, 1, 2, undefined, false, null, true, {}, [], '', '0', '1'];
    strictEqual(JSON.stringify(xs.compact(x)), '[1,2,true,{},[],"0","1"]', 'compact method works ok');
});
test('union', function () {
    strictEqual(JSON.stringify(xs.union(1, 2, [3], [4, 5])), '[1,2,3,4,5]', 'union method works ok');
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
    var intersection = xs.intersection.apply(xs, x);
    strictEqual(JSON.stringify(intersection), '[3,4,5,null,false,{},[]]', 'intersection method works ok');
    strictEqual(xs.has(intersection, arr), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, obj), true, 'intersection method works ok');
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
    var diff = xs.difference.apply(xs, x);
    strictEqual(JSON.stringify(diff), '[8]', 'difference method works ok');
});
test('uniques', function () {
    var arr = [];
    var obj = {};
    var x = [1, 1, 2, 2, obj, null, true, false, '', obj, arr];
    var uniques = xs.uniques(x);
    strictEqual(JSON.stringify(uniques), '[1,2,{},null,true,false,"",[]]', 'uniques method works ok');
});
test('range', function () {
    strictEqual(JSON.stringify(xs.range(3)), '[0,1,2,3]', 'range works ok with a stop given');
    strictEqual(JSON.stringify(xs.range(-1, 1)), '[-1,0,1]', 'range works ok with start and stop given');
    strictEqual(JSON.stringify(xs.range(-1, 4, 2)), '[-1,1,3,5]', 'range works ok with start, stop and step given');
    strictEqual(JSON.stringify(xs.range(-1, 5, 2)), '[-1,1,3,5]', 'range works ok with start, stop and step given');
    strictEqual(JSON.stringify(xs.range(-1, 6, 2)), '[-1,1,3,5,7]', 'range works ok with start, stop and step given');
});
test('prefill', function () {
    var fn = function (a, b, c) {
        return this.x * a * b * c;
    }
    var filled = xs.prefill(fn, [1, 2, 3], {x: 5});

    strictEqual(filled(4), 5 * 4 * 2 * 3, 'prefilled ok');
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