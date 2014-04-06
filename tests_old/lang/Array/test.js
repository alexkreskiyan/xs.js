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
module('xs.lang.Array');
test('keys', function() {
    var x = [1, 3];
    strictEqual(xs.Array.keys(x).toString(), '0,1', 'keys method ok');
    x = [];
    strictEqual(xs.Array.keys(x).toString(), '', 'keys method ok');
});
test('values', function() {
    var x = [1, 3];
    strictEqual(xs.Array.values(x).toString(), '1,3', 'values method ok');
    x = [];
    strictEqual(xs.Array.values(x).toString(), '', 'values method ok');
});
test('hasKey', function() {
    var x = [1, 3];
    strictEqual(xs.Array.hasKey(x, 0), true, 'hasKey method finds ok');
    strictEqual(xs.Array.hasKey(x, 1), true, 'hasKey method finds ok');
    strictEqual(xs.Array.hasKey(x, 2), false, 'hasKey method doesn\'t find ok');
    x = [];
    strictEqual(xs.Array.hasKey(x, 0), false, 'hasKey method doesn\'t find ok');
    strictEqual(xs.Array.hasKey(x, 1), false, 'hasKey method doesn\'t find ok');
    strictEqual(xs.Array.hasKey(x, 2), false, 'hasKey method doesn\'t find ok');
});
test('has', function() {
    //simple number array
    var x = [1, 3];
    strictEqual(xs.Array.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.Array.has(x, 'A'), false, 'has method doesn\'t find ok');
    //empty array
    var x = [];
    strictEqual(xs.Array.has(x, 1), false, 'has method doesn\'t find ok');
    strictEqual(xs.Array.has(x, 'A'), false, 'has method doesn\'t find ok');
    //array of array of integer
    x = [
        [0, 1],
        [1, 0]
    ];
    strictEqual(xs.Array.has(x, x[0]), true, 'has method finds ok');
    strictEqual(xs.Array.has(x, 1), false, 'has method doesn\'t find ok');

});
test('keyOf', function() {
    //simples aray
    var x = [1, 3];
    strictEqual(xs.Array.keyOf(x, 3), 1, 'keyOf method finds ok');
    strictEqual(xs.Array.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
    //empty array
    x = [];
    strictEqual(xs.Array.keyOf(x, 0), undefined, 'keyOf method doesn\'t find ok');
    strictEqual(xs.Array.keyOf(x, '0'), undefined, 'keyOf method doesn\'t find ok');
    //array of array
    x = [
        [0, 1],
        ['a', 'b']
    ];
    var z = x[0];
    strictEqual(xs.Array.keyOf(x, [0, 1]), undefined, 'keyOf method doesn\'t find ok');
    strictEqual(xs.Array.keyOf(x, z), 0, 'keyOf method finds ok');
    strictEqual(xs.Array.keyOf(x, '0'), undefined, 'keyOf method doesn\'t find ok');
});
test('lastKeyOf', function() {
    var x = [1, 3, 3];
    strictEqual(xs.Array.lastKeyOf(x, 3), 2, 'lastKeyOf method finds ok');
    strictEqual(xs.Array.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
    x = [];
    strictEqual(xs.Array.lastKeyOf(x, 3), undefined, 'lastKeyOf method doesn\'t find ok');
});
test('each', function() {
    //simple array of integer
    var x = [1, 2];
    var sum = '';
    xs.Array.each(x, function(value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
    //empty array
    var x = [];
    var sum = '';
    xs.Array.each(x, function(value) {
        sum += value;
    });
    strictEqual(sum, '', 'each method runs ok');
});

test('eachReverse', function() {
    //array of integer
    var x = [1, 2];
    var sum = '';
    xs.Array.eachReverse(x, function(value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
    //empty array
    var x = [];
    var sum = '';
    xs.Array.eachReverse(x, function(value) {
        sum += value;
    });
    strictEqual(sum, '', 'eachReverse method runs ok');
});

test('find', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];

    strictEqual(xs.Array.find(x, function(value) {
        return value.y == 1;
    }), x[2], 'find method runs ok when result exists');

    var x = [];

    strictEqual(xs.Array.find(x, function(value) {
        return value.y == 1;
    }), undefined, 'find method runs ok when result not exists');
});

test('findLast', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];
    strictEqual(xs.Array.findLast(x, function(value) {
        return value.y == 1;
    }), x[3], 'findLast method runs ok when result exists');
    strictEqual(xs.Array.findLast(x, function(value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');

    x = [];
    strictEqual(xs.Array.findLast(x, function(value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');
});

test('findAll', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];
    var results;
    results = xs.Array.findAll(x, function(value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([x[2], x[3]]), 'findAll method runs ok when result exists');

    results = xs.Array.findAll(x, function(value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'findAll method runs ok when result doesn\'t exist');

    x = [];
    results = xs.Array.findAll(x, function(value) {
        return value.a = 'trololo';
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'findAll method runs ok when array is empty');
});

test('filter', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];

    var results;
    results = xs.Array.filter(x, {
        x: 1
    });
    strictEqual(results, x[0], 'filter method runs ok when result exists');

    results = xs.Array.filter(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');

    x = [];
    results = xs.Array.filter(x, {
        x: 'A'
    });
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');
});

test('filterLast', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];
    var results;

    results = xs.Array.filterLast(x, {
        x: 1
    });
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');

    results = xs.Array.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');

    x = [];
    results = xs.Array.filterLast(x, {
        x: 'A'
    });
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');
});

test('filterAll', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];
    var results;
    results = xs.Array.filterLast(x, {
        x: 1
    });
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');
    results = xs.Array.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');

    x = [];
    results = xs.Array.filterAll(x, {
        x: 'A'
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'filter method runs ok when result doesn\'t exist');
});

test('every', function() {

    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];

    strictEqual(xs.Array.every(x, function(value) {
        return value.hasOwnProperty('y');
    }), true, 'every method runs ok when result succeeds');

    strictEqual(xs.Array.every(x, function(value) {
        return value.x === 1;
    }), false, 'every method runs ok when result fails');

    x = [];

    strictEqual(xs.Array.every(x, function(value) {
        return !value.hasOwnProperty('y');
    }), true, 'every method runs ok when x is empty');
});

test('some', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];

    strictEqual(xs.Array.some(x, function(value) {
        return value.x == 1 && value.y == 1;
    }, -1), true, 'some method runs ok when result succeeds with given count less than 0');

    strictEqual(xs.Array.some(x, function(value) {
        return value.x == 1 && value.y == 1;
    }, 0), true, 'some method runs ok when result succeeds with given count equal to 0');

    strictEqual(xs.Array.some(x, function(value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds with default count');

    strictEqual(xs.Array.some(x, function(value) {
        return value.x == 1 && value.y == 1;
    }, 2), false, 'some method runs ok when result succeeds with given count greater then 0');


    strictEqual(xs.Array.some(x, function(value) {
        return value.x == 1 && value.y == 3;
    }), false, 'some method runs ok when result fails');

    strictEqual(xs.Array.some({}, function(value) {
        return value.x == 1 && value.y == 1;
    }), false, 'some method runs ok when source is empty');
});

test('first', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];

    strictEqual(xs.Array.first(x), x[0], 'first method runs ok when result succeeds');
    strictEqual(xs.Array.first([]), undefined, 'first method runs ok when result fails');

});
test('last', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];

    strictEqual(xs.Array.last(x), x[3], 'last method runs ok when result succeeds');
    strictEqual(xs.Array.last([]), undefined, 'last method runs ok when result fails');
});

test('remove', function() {
    var x = [{
            x: 1,
            y: 2
        }, {
            x: 2,
            y: 2
        }, {
            x: 2,
            y: 1
        }, {
            x: 1,
            y: 1
        },
        1,
        1
    ];

    xs.Array.remove(x, x[0]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},1,1]', 'remove method runs ok when result succeeds');

    xs.Array.remove(x, 0);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},{"x":1,"y":1},1,1]', 'remove method runs ok when result succeeds');

    xs.Array.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1,1]', 'remove method runs ok when result succeeds');

    xs.Array.remove(x, x[1]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1]', 'remove method runs ok when result succeeds');

    xs.Array.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'remove method runs ok when result succeeds');

    xs.Array.remove(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'remove method runs ok when result succeeds');

    x = [];
    xs.Array.remove(x, 1);
    strictEqual(JSON.stringify(x), '[]', 'remove method runs ok when result succeeds');
});

test('removeLast', function() {
    var x = [{
            x: 1,
            y: 2
        }, {
            x: 2,
            y: 2
        }, {
            x: 2,
            y: 1
        },
        9, {
            x: 1,
            y: 1
        },
        9
    ];

    xs.Array.removeLast(x, x[0]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1},9]', 'remove method runs ok when result succeeds');

    xs.Array.removeLast(x, 9);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1}]', 'remove method runs ok when result succeeds');

    xs.Array.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},9,{"x":1,"y":1}]', 'remove method runs ok when result succeeds');

    xs.Array.removeLast(x, x[1]);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":1,"y":1}]', 'remove method runs ok when result succeeds');

    xs.Array.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'remove method runs ok when result succeeds');

    xs.Array.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'remove method runs ok when result succeeds');

    x = [];
    xs.Array.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[]', 'remove method runs ok when result succeeds');
});

test('removeAll', function() {
    var x = [{
            x: 1,
            y: 2
        }, {
            x: 2,
            y: 2
        }, {
            x: 2,
            y: 1
        },
        9, {
            x: 1,
            y: 1
        },
        9
    ];

    xs.Array.removeAll(x, x[1], [x[0], x[1]], [9, 9], 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'removeAll method runs ok when result succeeds');

    xs.Array.removeAll(x, 0);
    strictEqual(JSON.stringify(x), '[]', 'removeAll method runs ok when result succeeds');

    x = [];

    xs.Array.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '[]', 'removeAll method runs ok when result succeeds');
});

test('compact', function() {
    var x = [0, 1, 2, undefined, false, null, true, {},
        [], '', '0', '1'
    ];

    strictEqual(JSON.stringify(xs.Array.compact(x)), '[1,2,true,{},[],"0","1"]', 'compact method works ok');

    x = [];
    strictEqual(JSON.stringify(xs.Array.compact(x)), '[]', 'compact method works ok');
});

test('union', function() {
    strictEqual(JSON.stringify(xs.Array.union(null, undefined, 1, 2, [3], [4, 5])), '[null,null,1,2,3,4,5]', 'union method works ok');

    strictEqual(JSON.stringify(xs.Array.union([null, undefined, 1, 2, [3], [4, 5]])), '[null,null,1,2,3,4,5]', 'union method works ok');

    strictEqual(JSON.stringify(xs.Array.union([], [], [])), '[]', 'union method works ok');

    strictEqual(JSON.stringify(xs.Array.union()), '[]', 'union method works ok');
});

test('intersection', function() {
    var arr = [];
    var obj = {};
    var x = [
        [1, 2, 3, 4, 5, null, true, false, '', obj, arr],
        [2, 3, 4, 5, null, false, '', obj, arr],
        [1, 7, 3, 4, null, 5, false, obj, arr],
        [7, 2, 3, 4, 5, false, true, obj, arr, null]
    ];
    var intersection = xs.Array.intersection(x[0], x[1], x[2], x[3]);
    strictEqual(JSON.stringify(intersection), '[3,4,5,null,false,{},[]]', 'intersection method works ok');
    strictEqual(xs.Array.has(intersection, arr), true, 'intersection method works ok');
    strictEqual(xs.Array.has(intersection, obj), true, 'intersection method works ok');

    var intersection = xs.Array.intersection([], obj, arr);
    strictEqual(JSON.stringify(intersection), '[]', 'intersection method works ok');

    var intersection = xs.Array.intersection([arr], [obj, arr]);
    strictEqual(xs.Array.has(intersection, arr), true, 'intersection method works ok');

    var intersection = xs.Array.intersection();
    strictEqual(JSON.stringify(intersection), '[]', 'intersection method works ok');
});

test('difference', function() {
    var arr = [];
    var obj = {};

    var x = [
        [1, 2, 3, 4, 5, 8, null, true, false, '', obj, arr],
        [2, 3, 4, 5, null, false, '', obj, arr],
        [1, 7, 3, 4, null, 5, false, obj, arr],
        [7, 2, 3, 4, 5, false, true, obj, arr, null]
    ];

    var diff = xs.Array.difference(x[0], x[1], x[2], x[3]);
    strictEqual(JSON.stringify(diff), '[8]', 'difference method works ok');

    var diff = xs.Array.difference(x[0], []);
    strictEqual(JSON.stringify(diff), JSON.stringify(x[0]), 'difference method works ok');

    var diff = xs.Array.difference([], x[0]);
    strictEqual(JSON.stringify(diff), JSON.stringify([]), 'difference method works ok');

    var diff = xs.Array.difference([]);
    strictEqual(JSON.stringify(diff), JSON.stringify([]), 'difference method works ok');
});

test('unique', function() {
    var arr = [];
    var obj = {};
    var x = [1, 1, 2, 2, obj, null, true, false, '', obj, arr];
    var unique = xs.Array.unique(x);
    strictEqual(JSON.stringify(unique), '[1,2,{},null,true,false,"",[]]', 'uniques method works ok');

    var unique = xs.Array.unique([]);
    strictEqual(JSON.stringify(unique), '[]', 'uniques method works ok');
});

test('pick', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.Array.pick(x, 0, 1);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');

    var clone = xs.Array.pick(x, [0], [1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');

    var clone = xs.Array.pick(x, [0, 1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');

    var clone = xs.Array.pick(x, 99);
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    var clone = xs.Array.pick(x, 'a');
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    x = [];

    var clone = xs.Array.pick(x, 99);
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    var clone = xs.Array.pick(x, 'a');
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');
});

test('omit', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.Array.omit(x, 2, 3);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.Array.omit(x, [2], [3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.Array.omit(x, [2, 3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.Array.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    var clone = xs.Array.omit(x, 99);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    var clone = xs.Array.omit(x, 'a');
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok with wrong args');

    x = [];

    var clone = xs.Array.omit(x, 99);
    strictEqual(JSON.stringify(clone), JSON.stringify([]), 'omit works ok with wrong args');

    var clone = xs.Array.omit(x, 'a');
    strictEqual(JSON.stringify(clone), JSON.stringify([]), 'omit works ok with wrong args');
});

test('defaults', function() {
    var x = [{
        x: 1,
        y: 2
    }, {
        x: 2,
        y: 2
    }, {
        x: 2,
        y: 1
    }, {
        x: 1,
        y: 1
    }];

    var clone = xs.Array.clone(x);
    xs.Array.defaults(clone, 1, 2, 3);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok with a set of args');
    var clone = xs.Array.clone(x);
    xs.Array.defaults(clone, 1, 2, 3, 4, 5);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},5]', 'defaults works ok with a set of args');
    var clone = xs.Array.clone(x);
    xs.Array.defaults(clone);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok without args');
});

test('range', function() {

    strictEqual(JSON.stringify(xs.Array.range(3)), '[0,1,2,3]', 'range works ok with a stop given');

    strictEqual(JSON.stringify(xs.Array.range(-1, 1)), '[-1,0,1]', 'range works ok with start and stop given');

    strictEqual(JSON.stringify(xs.Array.range(-1, 4, 2)), '[-1,1,3,5]', 'range works ok with start, stop and step given');

    strictEqual(JSON.stringify(xs.Array.range(-1, 5, 2)), '[-1,1,3,5]', 'range works ok with start, stop and step given');

    strictEqual(JSON.stringify(xs.Array.range(-1, 6, 2)), '[-1,1,3,5,7]', 'range works ok with start, stop and step given');


    strictEqual(JSON.stringify(xs.Array.range(-1, -5 )), '[-1]', 'range works ok with start, stop and step given');

    strictEqual(JSON.stringify(xs.Array.range(-1, -5, -1)), '[-1,-2,-3,-4,-5]', 'range works ok with start, stop and step given');

    strictEqual(JSON.stringify(xs.Array.range(-1, -5, 1)), '[-1]', 'range works ok with start, stop and step given');
    
    strictEqual(JSON.stringify(xs.Array.range(1, -5, -1)), '[1,0,-1,-2,-3,-4,-5]', 'range works ok with start, stop and step given');
    
    strictEqual(JSON.stringify(xs.Array.range(-5, -1, -1)), '[-5]', 'range works ok with start, stop and step given');
    
    strictEqual(JSON.stringify(xs.Array.range(-5, -1, 1)), '[-5,-4,-3,-2,-1]', 'range works ok with start, stop and step given');
});