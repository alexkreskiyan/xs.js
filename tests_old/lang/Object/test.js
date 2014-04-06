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

module('xs.lang.Object');

test('keys', function () {
    var x = {};
    strictEqual(xs.Object.keys(x).toString(), '', 'keys method ok');
    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.Object.keys(x).toString(), 'x,b', 'keys method ok');
});

test('values', function () {
    var x = {};
    strictEqual(xs.Object.values(x).toString(), '', 'values method ok');
    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.Object.values(x).toString(), '1,2', 'values method ok');
});

test('hasKey', function () {
    var x = {};
    strictEqual(xs.Object.hasKey(x, 'x'), false, 'hasKey method works ok in empty');
    strictEqual(xs.Object.hasKey(x, 'y'), false, 'hasKey method works ok in empty');

    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.Object.hasKey(x, 'x'), true, 'hasKey method finds ok');
    strictEqual(xs.Object.hasKey(x, 'y'), false, 'hasKey method doesn\'t find ok');
});

test('has', function () {
    var x = {};
    strictEqual(xs.Object.has(x, 1), false, 'has method works ok in empty');
    strictEqual(xs.Object.has(x, '1'), false, 'has method works ok in empty');

    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.Object.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.Object.has(x, '1'), false, 'has method doesn\'t find ok');
});

test('keyOf', function () {
    var x = {};
    strictEqual(xs.Object.keyOf(x, 1), undefined, 'keyOf method works ok in empty');
    strictEqual(xs.Object.keyOf(x, '1'), undefined, 'keyOf method works ok in empty');

    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.Object.keyOf(x, 1), 'x', 'keyOf method finds ok');
    strictEqual(xs.Object.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
});

test('lastKeyOf', function () {
    var x = {};
    strictEqual(xs.Object.lastKeyOf(x, 1), undefined, 'keyOf method works ok in empty');
    strictEqual(xs.Object.lastKeyOf(x, '1'), undefined, 'keyOf method works ok in empty');

    var x = {
        x: 1,
        b: 2,
        c: 2
    };
    strictEqual(xs.Object.lastKeyOf(x, 2), 'c', 'lastKeyOf method finds ok');
    strictEqual(xs.Object.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
});

test('size', function () {
    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.Object.size(x), 2, 'size method evals non-empty ok');
    strictEqual(xs.Object.size({}), 0, 'size method evals empty ok');
});

test('each', function () {
    var x = {};
    var sum = '';
    xs.Object.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'each method runs ok with empty');

    var x = {
        x: 1,
        b: 2
    };
    var sum = '';
    xs.Object.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
});

test('eachReverse', function () {
    var x = {};
    var sum = '';
    xs.Object.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'eachReverse method runs ok with empty');

    var x = {
        x: 1,
        b: 2
    };
    var sum = '';
    xs.Object.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
});

test('map', function () {
    var x = {};
    x = xs.Object.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.Object.values(x).toString(), '', 'map method runs ok');

    var x = {
        x: 1,
        b: 2
    };
    x = xs.Object.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.Object.values(x).toString(), '2x,4b', 'map method runs ok');
});

test('reduce', function () {
    var x = {};
    strictEqual(xs.Object.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), undefined, 'reduce method runs ok without memo');
    strictEqual(xs.Object.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduce method runs ok with memo');

    var x = {
        x: 1,
        b: 2,
        a: 3
    };
    strictEqual(xs.Object.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '5b6a', 'reduce method runs ok without memo');
    strictEqual(xs.Object.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), '-1x4b6a', 'reduce method runs ok with memo');
});

test('reduceRight', function () {
    var x = {};
    strictEqual(xs.Object.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), undefined, 'reduce method runs ok without memo');
    strictEqual(xs.Object.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduce method runs ok with memo');

    var x = {
        x: 1,
        b: 2,
        a: 3
    };
    strictEqual(xs.Object.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '7b2x', 'reduceRight method runs ok without memo');
    strictEqual(xs.Object.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), '3a4b2x', 'reduceRight method runs ok with memo');
});

test('find', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    strictEqual(xs.Object.find(x, function (value) {
        return value.y == 1;
    }), x.c, 'find method runs ok when result exists');

    strictEqual(xs.Object.find({}, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result doesn\'t exist');

    strictEqual(xs.Object.find(x, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result doesn\'t exist');
});

test('findLast', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    strictEqual(xs.Object.findLast(x, function (value) {
        return value.y == 1;
    }), x.d, 'findLast method runs ok when result exists');

    strictEqual(xs.Object.findLast({}, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');

    strictEqual(xs.Object.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');
});

test('findAll', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    var results;

    results = xs.Object.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({
        c: x.c,
        d: x.d
    }), 'findAll method runs ok when result exists');

    results = xs.Object.findAll(x, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({}), 'findAll method runs ok when result doesn\'t exist');

    results = xs.Object.findAll({}, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({}), 'findAll method runs ok when source hash is empty');
});

test('filter', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    var results;
    results = xs.Object.filter(x, {
        x: 1
    });
    strictEqual(results, x.a, 'filter method runs ok when result exists');

    results = xs.Object.filter(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');

    results = xs.Object.filter({}, {
        x: 3
    });
    strictEqual(results, undefined, 'filter method runs ok when source hash is empty');
});

test('filterLast', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    var results;

    results = xs.Object.filterLast(x, {
        x: 1
    });
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');

    results = xs.Object.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');

    results = xs.Object.filterLast({}, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when source hash is empty');
});

test('filterAll', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    var results;

    results = xs.Object.filterLast(x, {
        x: 1
    });
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');

    results = xs.Object.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');


    results = xs.Object.filterLast({}, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when source hash is empty');
});

test('every', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };

    strictEqual(xs.Object.every(x, function (value) {
        return xs.Object.hasKey(value, 'y');
    }), true, 'every method runs ok when result succeeds');

    strictEqual(xs.Object.every(x, function (value) {
        return value.x === 1;
    }), false, 'every method runs ok when result fails');

    strictEqual(xs.Object.every({}, function (value) {
        return value.x === 1;
    }), true, 'every method runs ok when source hash is empty');
});

test('some', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };

    strictEqual(xs.Object.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, -1), true, 'some method runs ok when result succeeds with given count less than 0');

    strictEqual(xs.Object.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, 0), true, 'some method runs ok when result succeeds with given count equal to 0');

    strictEqual(xs.Object.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds with default count');

    strictEqual(xs.Object.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, 2), false, 'some method runs ok when result succeeds with given count greater then 0');


    strictEqual(xs.Object.some(x, function (value) {
        return value.x == 1 && value.y == 3;
    }), false, 'some method runs ok when result fails');

    strictEqual(xs.Object.some({}, function (value) {
        return value.x == 1 && value.y == 1;
    }), false, 'some method runs ok when source is empty');
});

test('first', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    strictEqual(xs.Object.first(x), x.a, 'first method runs ok when result succeeds');
    strictEqual(xs.Object.first({}), undefined, 'first method runs ok when result fails');
});

test('last', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    strictEqual(xs.Object.last(x), x.d, 'last method runs ok when result succeeds');
    strictEqual(xs.Object.last({}), undefined, 'last method runs ok when result fails');
});

test('shift', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    var shifted = x.a;
    strictEqual(xs.Object.shift(x), shifted, 'shift method runs ok when result succeeds');
    strictEqual(xs.Object.keys(x).toString(), 'b,c,d', 'shift method runs ok when result succeeds');
    strictEqual(xs.Object.shift({}), undefined, 'shift method runs ok when result fails');
});

test('pop', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    var popped = x.d;
    strictEqual(xs.Object.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(xs.Object.keys(x).toString(), 'a,b,c', 'pop method runs ok when result succeeds');
    strictEqual(xs.Object.pop({}), undefined, 'pop method runs ok when result fails');
});

test('remove', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        },
        e: 1,
        f: 1
    };
    xs.Object.remove(x, x.a);
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');

    xs.Object.remove(x, 'a');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');

    xs.Object.remove(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');

    xs.Object.remove(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'remove method runs ok when result succeeds');

    xs.Object.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"f":1}', 'remove method runs ok when result succeeds');

    xs.Object.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'remove method runs ok when result succeeds');

    xs.Object.remove(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'remove method runs ok when result succeeds');

    var x = {};
    xs.Object.remove(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'remove method runs ok with empty source');
});

test('removeLast', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        },
        e: 1,
        f: 1
    };

    xs.Object.removeLast(x, x.a);
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');

    xs.Object.removeLast(x, 'a');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');

    xs.Object.removeLast(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');

    xs.Object.removeLast(x, 'b');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'removeLast method runs ok when result succeeds');

    xs.Object.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1}', 'removeLast method runs ok when result succeeds');

    xs.Object.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'removeLast method runs ok when result succeeds');

    xs.Object.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'removeLast method runs ok when result succeeds');

    var x = {};
    xs.Object.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'remove method runs ok with empty source');
});

test('removeAll', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        },
        e: 1,
        f: 1
    };
    xs.Object.removeAll(x, x.a, x.b, ['c', 'd'], [1, 1]);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');

    xs.Object.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');

    var x = {};
    xs.Object.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok with empty source');

});

test('extend', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        }
    };

    var correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2},"c":1,"d":{"x":3,"y":3}}';
    var c = {c: 1};
    var d = {d: {x: 3, y: 3}};

    var clone = xs.Object.clone(x);
    xs.Object.extend(clone, c, d);
    strictEqual(JSON.stringify(clone), correct, 'extend works ok with a set of args');

    var clone = xs.Object.clone(x);
    xs.Object.extend(clone, [c], [d]);
    strictEqual(JSON.stringify(clone), correct, 'extend works ok with a set of args');

    var clone = xs.Object.clone(x);
    xs.Object.extend(clone, [c, d]);
    strictEqual(JSON.stringify(clone), correct, 'extend works ok with a set of args');

    var clone = xs.Object.clone(x);
    xs.Object.extend(clone, {b: 1});
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":1}', 'extend work ok with rewrite');

    var clone = xs.Object.clone(x);
    xs.Object.extend(clone, {b: 1}, {b: 2});
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":2}', 'extend works ok with continious rewrite');

    var clone = xs.Object.clone(x);
    xs.Object.extend(clone, {a: 2}, {b: 1});
    strictEqual(JSON.stringify(clone), '{"a":2,"b":1}', 'extend work ok with massive rewrite');

    var clone = xs.Object.clone(x);
    xs.Object.extend(clone, {a: 4}, {a: 3}, {b: 1}, {b: 2});
    strictEqual(JSON.stringify(clone), '{"a":3,"b":2}', 'extend works ok with massive continious rewrite');

    var clone = xs.Object.extend({});
    xs.Object.extend(clone, {a: 2});
    xs.Object.extend(clone, {b: 1});
    strictEqual(JSON.stringify(clone), '{"a":2,"b":1}', 'extend works ok with continious extend');
});

test('compact', function () {
    var x = {
        a: 0,
        b: 1,
        c: 2,
        d: undefined,
        e: false,
        f: null,
        g: true,
        h: {},
        i: [],
        j: '',
        k: '0',
        l: '1'
    };

    strictEqual(JSON.stringify(xs.Object.compact(x)), '{"b":1,"c":2,"g":true,"h":{},"i":[],"k":"0","l":"1"}', 'compact method works ok');

    x = {};
    strictEqual(JSON.stringify(xs.Object.compact(x)), '{}', 'compact method works ok');
});

test('union', function () {
    var x = [
        {a: 1},
        {b: 2},
        [
            {c: 3}
        ],
        [
            {d: 4}
        ],
        [
            {e: 5},
            {f: 6}
        ]
    ];
    strictEqual(JSON.stringify(xs.Object.union.apply(xs.Object, x)), '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}', 'union method works ok');

    strictEqual(JSON.stringify(xs.Object.union.apply(xs.Object, [x])), '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}', 'union method works ok');

    strictEqual(JSON.stringify(xs.Object.union({}, {}, [
        {},
        {}
    ])), '{}', 'union method works ok');

    strictEqual(JSON.stringify(xs.Object.union()), '{}', 'union method works ok');
});

test('intersection', function () {
    var arr = [];
    var obj = {};
    var a = {a: 1};
    var b = {b: 2};
    var c = [
        {c: 3}
    ];
    var d = [
        {d: 4}
    ];
    var e = [
        {e: 5},
        {f: 6}
    ];

    var x = [
        {a: a, b: b, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr},
        {b: b, c: c, d: d, e: e, f: null, g: false, h: obj, i: arr},
        {a: a, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr}
    ];
    var intersection = xs.Object.intersection(x[0], x[1], x[2]);
    var correct = '{"c":[{"c":3}],"d":[{"d":4}],"e":[{"e":5},{"f":6}],"f":null,"h":false,"j":{},"k":[]}';
    strictEqual(JSON.stringify(intersection), correct, 'intersection method works ok');
    strictEqual(xs.Object.has(intersection, arr), true, 'intersection method works ok');
    strictEqual(xs.Object.has(intersection, obj), true, 'intersection method works ok');
    strictEqual(xs.Object.has(intersection, c), true, 'intersection method works ok');
    strictEqual(xs.Object.has(intersection, d), true, 'intersection method works ok');
    strictEqual(xs.Object.has(intersection, e), true, 'intersection method works ok');

    var intersection = xs.Object.intersection({a: a}, {a: a});
    strictEqual(JSON.stringify(intersection), '{"a":{"a":1}}', 'intersection method works ok');

    var intersection = xs.Object.intersection();
    strictEqual(JSON.stringify(intersection), '{}', 'intersection method works ok');
});

test('difference', function () {
    var arr = [];
    var obj = {};
    var a = {a: 1};
    var b = {b: 2};
    var c = [
        {c: 3}
    ];
    var d = [
        {d: 4}
    ];
    var e = [
        {e: 5},
        {f: 6}
    ];

    var x = [
        {a: a, b: b, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr},
        {b: b, c: c, d: d, f: null, g: true, j: obj, k: arr},
        {c: c, d: d, f: null, g: true}
    ];

    var diff = xs.Object.difference(x[0], x[1], x[2]);
    strictEqual(JSON.stringify(diff), '{"a":{"a":1},"e":[{"e":5},{"f":6}],"h":false,"i":""}', 'difference method works ok');

    var diff = xs.Object.difference(x[0], {});
    strictEqual(JSON.stringify(diff), JSON.stringify(x[0]), 'difference method works ok');

    var diff = xs.Object.difference({}, x[0]);
    strictEqual(JSON.stringify(diff), JSON.stringify({}), 'difference method works ok');

    var diff = xs.Object.difference({});
    strictEqual(JSON.stringify(diff), JSON.stringify({}), 'difference method works ok');
});

test('unique', function () {
    var arr = [];
    var obj = {};
    var x = {
        a: 1,
        b: 1,
        c: true,
        d: arr,
        e: arr,
        f: obj,
        g: obj
    };
    var unique = xs.Object.unique(x);
    strictEqual(JSON.stringify(unique), '{"a":1,"c":true,"d":[],"f":{}}', 'unique method works ok');
    strictEqual(xs.Object.has(unique, arr), true, 'links to objects saved');
    strictEqual(xs.Object.has(unique, obj), true, 'links to objects saved');

    var unique = xs.Object.unique({});
    strictEqual(JSON.stringify(unique), '{}', 'uniques method works ok');
});

test('pick', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };

    var clone = xs.Object.pick(x, 'a', 'b', 'e');
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    var clone = xs.Object.pick(x, ['a'], ['b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    var clone = xs.Object.pick(x, ['a', 'b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    var clone = xs.Object.pick(x);
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok without args');

    var clone = xs.Object.pick({}, 'a');
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok with empty source');

    var clone = xs.Object.pick({});
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok with empty source');
});

test('omit', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };
    var correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}';

    var clone = xs.Object.omit(x, 'c', 'd', 'e');
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.Object.omit(x, ['c'], ['d']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.Object.omit(x, ['c', 'd']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.Object.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    var clone = xs.Object.omit({}, 'a');
    strictEqual(JSON.stringify(clone), '{}', 'omit works ok with empty source');

    var clone = xs.Object.omit({});
    strictEqual(JSON.stringify(clone), '{}', 'omit works ok with empty source');
});

test('defaults', function () {
    var x = {
        a: {
            x: 1,
            y: 2
        },
        b: {
            x: 2,
            y: 2
        },
        c: {
            x: 2,
            y: 1
        },
        d: {
            x: 1,
            y: 1
        }
    };

    var correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}';

    var clone = xs.Object.clone({});
    xs.Object.defaults(clone, {
        e: 1
    }, {
        f: 1
    });
    strictEqual(JSON.stringify(clone), '{"e":1,"f":1}', 'defaults works ok with empty object');

    var clone = xs.Object.clone(x);
    xs.Object.defaults(clone, {
        e: 1
    }, {
        f: 1
    });
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');

    var clone = xs.Object.clone(x);
    xs.Object.defaults(clone, {
        a: 1
    });
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without defaulting');

    var clone = xs.Object.clone(x);
    xs.Object.defaults(clone);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without args');
});