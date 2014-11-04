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
module('xs.lang.List');

test('keys', function () {
    var x;
    x = [
        1,
        3
    ];
    strictEqual(JSON.stringify(xs.keys(x)), '[0,1]', 'keys method ok');
    x = [];
    strictEqual(JSON.stringify(xs.keys(x)), '[]', 'keys method ok');

    x = {};
    strictEqual(JSON.stringify(xs.keys(x)), '[]', 'keys method ok');
    x = {
        x: 1,
        b: 2
    };
    strictEqual(JSON.stringify(xs.keys(x)), '["x","b"]', 'keys method ok');
});

test('values', function () {
    var x;
    x = [
        1,
        3
    ];
    strictEqual(JSON.stringify(xs.values(x)), '[1,3]', 'values method ok');
    x = [];
    strictEqual(JSON.stringify(xs.values(x)), '[]', 'values method ok');

    x = {};
    strictEqual(JSON.stringify(xs.values(x)), '[]', 'values method ok');
    x = {
        x: 1,
        b: '2'
    };
    strictEqual(JSON.stringify(xs.values(x)), '[1,"2"]', 'values method ok');
});

test('hasKey', function () {
    var x;
    x = [
        1,
        3
    ];
    strictEqual(xs.hasKey(x, 0), true, 'hasKey method finds ok');
    strictEqual(xs.hasKey(x, 1), true, 'hasKey method finds ok');
    strictEqual(xs.hasKey(x, 2), false, 'hasKey method doesn\'t find ok');

    x = [];
    strictEqual(xs.hasKey(x, 0), false, 'hasKey method doesn\'t find ok');
    strictEqual(xs.hasKey(x, 1), false, 'hasKey method doesn\'t find ok');
    strictEqual(xs.hasKey(x, 2), false, 'hasKey method doesn\'t find ok');

    x = {};
    strictEqual(xs.hasKey(x, 'x'), false, 'hasKey method works ok in empty');
    strictEqual(xs.hasKey(x, 'y'), false, 'hasKey method works ok in empty');

    x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.hasKey(x, 'x'), true, 'hasKey method finds ok');
    strictEqual(xs.hasKey(x, 'y'), false, 'hasKey method doesn\'t find ok');
});

test('has', function () {
    //simple number array
    var x = [
        1,
        3
    ];
    strictEqual(xs.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.has(x, 'A'), false, 'has method doesn\'t find ok');
    //empty array
    var x = [];
    strictEqual(xs.has(x, 1), false, 'has method doesn\'t find ok');
    strictEqual(xs.has(x, 'A'), false, 'has method doesn\'t find ok');
    //array of array of integer
    x = [
        [
            0,
            1
        ],
        [
            1,
            0
        ]
    ];
    strictEqual(xs.has(x, x[0]), true, 'has method finds ok');
    strictEqual(xs.has(x, 1), false, 'has method doesn\'t find ok');

    var x = {};
    strictEqual(xs.has(x, 1), false, 'has method works ok in empty');
    strictEqual(xs.has(x, '1'), false, 'has method works ok in empty');

    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.has(x, '1'), false, 'has method doesn\'t find ok');
});

test('keyOf', function () {
    //simples aray
    var x = [
        1,
        3
    ];
    strictEqual(xs.keyOf(x, 3), 1, 'keyOf method finds ok');
    strictEqual(xs.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
    //empty array
    x = [];
    strictEqual(xs.keyOf(x, 0), undefined, 'keyOf method doesn\'t find ok');
    strictEqual(xs.keyOf(x, '0'), undefined, 'keyOf method doesn\'t find ok');
    //array of array
    x = [
        [
            0,
            1
        ],
        [
            'a',
            'b'
        ]
    ];
    var z = x[0];
    strictEqual(xs.keyOf(x, [
        0,
        1
    ]), undefined, 'keyOf method doesn\'t find ok');
    strictEqual(xs.keyOf(x, z), 0, 'keyOf method finds ok');
    strictEqual(xs.keyOf(x, '0'), undefined, 'keyOf method doesn\'t find ok');

    var x = {};
    strictEqual(xs.keyOf(x, 1), undefined, 'keyOf method works ok in empty');
    strictEqual(xs.keyOf(x, '1'), undefined, 'keyOf method works ok in empty');

    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.keyOf(x, 1), 'x', 'keyOf method finds ok');
    strictEqual(xs.keyOf(x, '1'), undefined, 'keyOf method doesn\'t find ok');
});

test('lastKeyOf', function () {
    var x = [
        1,
        3,
        3
    ];
    strictEqual(xs.lastKeyOf(x, 3), 2, 'lastKeyOf method finds ok');
    strictEqual(xs.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
    x = [];
    strictEqual(xs.lastKeyOf(x, 3), undefined, 'lastKeyOf method doesn\'t find ok');

    var x = {};
    strictEqual(xs.lastKeyOf(x, 1), undefined, 'keyOf method works ok in empty');
    strictEqual(xs.lastKeyOf(x, '1'), undefined, 'keyOf method works ok in empty');

    var x = {
        x: 1,
        b: 2,
        c: 2
    };
    strictEqual(xs.lastKeyOf(x, 2), 'c', 'lastKeyOf method finds ok');
    strictEqual(xs.lastKeyOf(x, '1'), undefined, 'lastKeyOf method doesn\'t find ok');
});

test('size', function () {
    var x = [
        2,
        3
    ];
    strictEqual(xs.size(x), 2, 'size method evals non-empty ok');
    strictEqual(xs.size([]), 0, 'size method evals empty ok');

    var x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.size(x), 2, 'size method evals non-empty ok');
    strictEqual(xs.size({}), 0, 'size method evals empty ok');
});

test('each', function () {
    //simple array of integer
    var x = [
        1,
        2
    ];
    var sum = '';
    xs.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
    //empty array
    var x = [];
    var sum = '';
    xs.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'each method runs ok');

    var x = {};
    var sum = '';
    xs.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'each method runs ok with empty');

    var x = {
        x: 1,
        b: 2
    };
    var sum = '';
    xs.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '12', 'each method runs ok');
});

test('eachReverse', function () {
    //array of integer
    var x = [
        1,
        2
    ];
    var sum = '';
    xs.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
    //empty array
    var x = [];
    var sum = '';
    xs.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'eachReverse method runs ok');

    var x = {};
    var sum = '';
    xs.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'eachReverse method runs ok with empty');

    var x = {
        x: 1,
        b: 2
    };
    var sum = '';
    xs.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '21', 'eachReverse method runs ok');
});

test('map', function () {
    var x = [];
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.values(x).toString(), '', 'map method runs ok');

    var x = [
        4,
        3
    ];
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.values(x).toString(), '8,7', 'map method runs ok');

    var x = {};
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.values(x).toString(), '', 'map method runs ok');

    var x = {
        x: 1,
        b: 2
    };
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(xs.values(x).toString(), '2x,4b', 'map method runs ok');
});

test('reduce', function () {
    var x = [];
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduce method runs ok with memo with empty source');

    var x = [
        6,
        5,
        4
    ];
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), 27, 'reduce method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), 30, 'reduce method runs ok with memo');

    var x = {};
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), undefined, 'reduce method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduce method runs ok with memo');

    var x = {
        x: 1,
        b: 2,
        a: 3
    };
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '5b6a', 'reduce method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), '-1x4b6a', 'reduce method runs ok with memo');
});

test('reduceRight', function () {
    var x = [];
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduceRight method runs ok with memo');

    var x = [
        6,
        5,
        4
    ];
    strictEqual(xs.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), 27, 'reduceRight method runs ok without memo');
    strictEqual(xs.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), 30, 'reduceRight method runs ok with memo');

    var x = {};
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), undefined, 'reduceRight method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduceRight method runs ok with memo');

    var x = {
        x: 1,
        b: 2,
        a: 3
    };
    strictEqual(xs.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), '7b2x', 'reduceRight method runs ok without memo');
    strictEqual(xs.reduceRight(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), '3a4b2x', 'reduceRight method runs ok with memo');
});

test('find', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];

    strictEqual(xs.find(x, function (value) {
        return value.y == 1;
    }), x[2], 'find method runs ok when result exists');

    var x = [];

    strictEqual(xs.find(x, function (value) {
        return value.y == 1;
    }), undefined, 'find method runs ok when result not exists');

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
    strictEqual(xs.find(x, function (value) {
        return value.y == 1;
    }), x.c, 'find method runs ok when result exists');

    strictEqual(xs.find({}, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result doesn\'t exist');

    strictEqual(xs.find(x, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result doesn\'t exist');
});

test('findLast', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];
    strictEqual(xs.findLast(x, function (value) {
        return value.y == 1;
    }), x[3], 'findLast method runs ok when result exists');
    strictEqual(xs.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');

    x = [];
    strictEqual(xs.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');

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
    strictEqual(xs.findLast(x, function (value) {
        return value.y == 1;
    }), x.d, 'findLast method runs ok when result exists');

    strictEqual(xs.findLast({}, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');

    strictEqual(xs.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result doesn\'t exist');
});

test('findAll', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];
    var results;
    results = xs.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([
        x[2],
        x[3]
    ]), 'findAll method runs ok when result exists');

    results = xs.findAll(x, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'findAll method runs ok when result doesn\'t exist');

    x = [];
    results = xs.findAll(x, function (value) {
        return value.a = 'trololo';
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'findAll method runs ok when array is empty');

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

    results = xs.findAll(x, function (value) {
        return value.y == 1;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({
        c: x.c,
        d: x.d
    }), 'findAll method runs ok when result exists');

    results = xs.findAll(x, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({}), 'findAll method runs ok when result doesn\'t exist');

    results = xs.findAll({}, function (value) {
        return value.y == 3;
    });
    strictEqual(JSON.stringify(results), JSON.stringify({}), 'findAll method runs ok when source hash is empty');
});

test('filter', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];

    var results;
    results = xs.filter(x, {
        x: 1
    });
    strictEqual(results, x[0], 'filter method runs ok when result exists');

    results = xs.filter(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');

    x = [];
    results = xs.filter(x, {
        x: 'A'
    });
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');

});

test('filterLast', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];
    var results;

    results = xs.filterLast(x, {
        x: 1
    });
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');

    results = xs.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');

    x = [];
    results = xs.filterLast(x, {
        x: 'A'
    });
    strictEqual(results, undefined, 'filter method runs ok when result doesn\'t exist');

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

    results = xs.filterLast(x, {
        x: 1
    });
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');

    results = xs.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');

    results = xs.filterLast({}, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when source hash is empty');
});

test('filterAll', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];
    var results;
    results = xs.filterLast(x, {
        x: 1
    });
    strictEqual(results, x[3], 'filterLast method runs ok when result exists');
    results = xs.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');

    x = [];
    results = xs.filterAll(x, {
        x: 'A'
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'filter method runs ok when result doesn\'t exist');

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

    results = xs.filterLast(x, {
        x: 1
    });
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');

    results = xs.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result doesn\'t exist');

    results = xs.filterLast({}, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when source hash is empty');
});

test('every', function () {

    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];

    strictEqual(xs.every(x, function (value) {
        return value.hasOwnProperty('y');
    }), true, 'every method runs ok when result succeeds');

    strictEqual(xs.every(x, function (value) {
        return value.x === 1;
    }), false, 'every method runs ok when result fails');

    x = [];

    strictEqual(xs.every(x, function (value) {
        return !value.hasOwnProperty('y');
    }), true, 'every method runs ok when x is empty');

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

    strictEqual(xs.every(x, function (value) {
        return xs.hasKey(value, 'y');
    }), true, 'every method runs ok when result succeeds');

    strictEqual(xs.every(x, function (value) {
        return value.x === 1;
    }), false, 'every method runs ok when result fails');

    strictEqual(xs.every({}, function (value) {
        return value.x === 1;
    }), true, 'every method runs ok when source hash is empty');
});

test('some', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, -1), true, 'some method runs ok when result succeeds with given count less than 0');

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, 0), true, 'some method runs ok when result succeeds with given count equal to 0');

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds with default count');

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, 2), false, 'some method runs ok when result succeeds with given count greater then 0');

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 3;
    }), false, 'some method runs ok when result fails');

    strictEqual(xs.some({}, function (value) {
        return value.x == 1 && value.y == 1;
    }), false, 'some method runs ok when source is empty');

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

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, -1), true, 'some method runs ok when result succeeds with given count less than 0');

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, 0), true, 'some method runs ok when result succeeds with given count equal to 0');

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }), true, 'some method runs ok when result succeeds with default count');

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 1;
    }, 2), false, 'some method runs ok when result succeeds with given count greater then 0');

    strictEqual(xs.some(x, function (value) {
        return value.x == 1 && value.y == 3;
    }), false, 'some method runs ok when result fails');

    strictEqual(xs.some({}, function (value) {
        return value.x == 1 && value.y == 1;
    }), false, 'some method runs ok when source is empty');
});

test('first', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];

    strictEqual(xs.first(x), x[0], 'first method runs ok when result succeeds');
    strictEqual(xs.first([]), undefined, 'first method runs ok when result fails');

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
    strictEqual(xs.first(x), x.a, 'first method runs ok when result succeeds');
    strictEqual(xs.first({}), undefined, 'first method runs ok when result fails');

});

test('last', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];

    strictEqual(xs.last(x), x[3], 'last method runs ok when result succeeds');
    strictEqual(xs.last([]), undefined, 'last method runs ok when result fails');

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
    strictEqual(xs.last(x), x.d, 'last method runs ok when result succeeds');
    strictEqual(xs.last({}), undefined, 'last method runs ok when result fails');
});

test('shift', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];
    var shifted = x[0];
    strictEqual(xs.shift(x), shifted, 'shift method runs ok when result succeeds');
    strictEqual(xs.keys(x).toString(), '0,1,2', 'shift method runs ok when result succeeds');
    strictEqual(xs.shift({}), undefined, 'shift method runs ok when result fails');

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
    strictEqual(xs.shift(x), shifted, 'shift method runs ok when result succeeds');
    strictEqual(xs.keys(x).toString(), 'b,c,d', 'shift method runs ok when result succeeds');
    strictEqual(xs.shift({}), undefined, 'shift method runs ok when result fails');
});

test('pop', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];
    var popped = x[x.length - 1];
    strictEqual(xs.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(xs.keys(x).toString(), '0,1,2', 'pop method runs ok when result succeeds');
    strictEqual(xs.pop({}), undefined, 'pop method runs ok when result fails');

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
    strictEqual(xs.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(xs.keys(x).toString(), 'a,b,c', 'pop method runs ok when result succeeds');
    strictEqual(xs.pop({}), undefined, 'pop method runs ok when result fails');
});

test('remove', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
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

    x = [];
    xs.remove(x, 1);
    strictEqual(JSON.stringify(x), '[]', 'remove method runs ok when result succeeds');

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

    var x = {};
    xs.remove(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'remove method runs ok with empty source');
});

test('removeLast', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        9,
        {
            x: 1,
            y: 1
        },
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

    x = [];
    xs.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '[]', 'remove method runs ok when result succeeds');

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

    var x = {};
    xs.removeLast(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'remove method runs ok with empty source');
});

test('removeAll', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        9,
        {
            x: 1,
            y: 1
        },
        9
    ];

    xs.removeAll(x, x[1], [
        x[0],
        x[1]
    ], [
        9,
        9
    ], 1);
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'removeAll method runs ok when result succeeds');

    xs.removeAll(x, 0);
    strictEqual(JSON.stringify(x), '[]', 'removeAll method runs ok when result succeeds');

    x = [];

    xs.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '[]', 'removeAll method runs ok when result succeeds');

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
    xs.removeAll(x, x.a, x.b, [
        'c',
        'd'
    ], [
        1,
        1
    ]);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');

    xs.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok when result succeeds');

    var x = {};
    xs.removeAll(x, 1);
    strictEqual(JSON.stringify(x), '{}', 'removeAll method runs ok with empty source');
});

test('compact', function () {
    var x = [
        0,
        1,
        2,
        undefined,
        false,
        null,
        true,
        {},
        [],
        '',
        '0',
        '1'
    ];

    strictEqual(JSON.stringify(xs.compact(x)), '[1,2,true,{},[],"0","1"]', 'compact method works ok');

    x = [];
    strictEqual(JSON.stringify(xs.compact(x)), '[]', 'compact method works ok');

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

    strictEqual(JSON.stringify(xs.compact(x)), '{"b":1,"c":2,"g":true,"h":{},"i":[],"k":"0","l":"1"}', 'compact method works ok');

    x = {};
    strictEqual(JSON.stringify(xs.compact(x)), '{}', 'compact method works ok');
});

test('union', function () {
    strictEqual(JSON.stringify(xs.union(null, undefined, 1, 2, [3], [
        4,
        5
    ])), '[null,null,1,2,3,4,5]', 'union method works ok');

    strictEqual(JSON.stringify(xs.union([
        null,
        undefined,
        1,
        2,
        [3],
        [
            4,
            5
        ]
    ])), '[null,null,1,2,3,4,5]', 'union method works ok');

    strictEqual(JSON.stringify(xs.union([], [], [])), '{}', 'union method works ok');

    strictEqual(JSON.stringify(xs.union()), '{}', 'union method works ok');

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
    strictEqual(JSON.stringify(xs.union.apply(xs, x)), '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}', 'union method works ok');

    strictEqual(JSON.stringify(xs.union.apply(xs, [x])), '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}', 'union method works ok');

    strictEqual(JSON.stringify(xs.union({}, {}, [
        {},
        {}
    ])), '{}', 'union method works ok');

    strictEqual(JSON.stringify(xs.union()), '{}', 'union method works ok');
});

test('intersection', function () {
    var arr = [];
    var obj = {};
    var x = [
        [
            1,
            2,
            3,
            4,
            5,
            null,
            true,
            false,
            '',
            obj,
            arr
        ],
        [
            2,
            3,
            4,
            5,
            null,
            false,
            '',
            obj,
            arr
        ],
        [
            1,
            7,
            3,
            4,
            null,
            5,
            false,
            obj,
            arr
        ],
        [
            7,
            2,
            3,
            4,
            5,
            false,
            true,
            obj,
            arr,
            null
        ]
    ];
    var intersection = xs.intersection(x[0], x[1], x[2], x[3]);
    strictEqual(JSON.stringify(intersection), '[3,4,5,null,false,{},[]]', 'intersection method works ok');
    strictEqual(xs.has(intersection, arr), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, obj), true, 'intersection method works ok');

    var intersection = xs.intersection([], obj, arr);
    strictEqual(JSON.stringify(intersection), '[]', 'intersection method works ok');

    var intersection = xs.intersection([arr], [
        obj,
        arr
    ]);
    strictEqual(xs.has(intersection, arr), true, 'intersection method works ok');

    var intersection = xs.intersection();
    strictEqual(JSON.stringify(intersection), '{}', 'intersection method works ok');

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
    var intersection = xs.intersection(x[0], x[1], x[2]);
    var correct = '{"c":[{"c":3}],"d":[{"d":4}],"e":[{"e":5},{"f":6}],"f":null,"h":false,"j":{},"k":[]}';
    strictEqual(JSON.stringify(intersection), correct, 'intersection method works ok');
    strictEqual(xs.has(intersection, arr), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, obj), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, c), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, d), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, e), true, 'intersection method works ok');

    var intersection = xs.intersection({a: a}, {a: a});
    strictEqual(JSON.stringify(intersection), '{"a":{"a":1}}', 'intersection method works ok');

    var intersection = xs.intersection();
    strictEqual(JSON.stringify(intersection), '{}', 'intersection method works ok');
});

test('difference', function () {
    var arr = [];
    var obj = {};

    var x = [
        [
            1,
            2,
            3,
            4,
            5,
            8,
            null,
            true,
            false,
            '',
            obj,
            arr
        ],
        [
            2,
            3,
            4,
            5,
            null,
            false,
            '',
            obj,
            arr
        ],
        [
            1,
            7,
            3,
            4,
            null,
            5,
            false,
            obj,
            arr
        ],
        [
            7,
            2,
            3,
            4,
            5,
            false,
            true,
            obj,
            arr,
            null
        ]
    ];

    var diff = xs.difference(x[0], x[1], x[2], x[3]);
    strictEqual(JSON.stringify(diff), '[8]', 'difference method works ok');

    var diff = xs.difference(x[0], []);
    strictEqual(JSON.stringify(diff), JSON.stringify(x[0]), 'difference method works ok');

    var diff = xs.difference([], x[0]);
    strictEqual(JSON.stringify(diff), JSON.stringify([]), 'difference method works ok');

    var diff = xs.difference([]);
    strictEqual(JSON.stringify(diff), JSON.stringify([]), 'difference method works ok');

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

    var diff = xs.difference(x[0], x[1], x[2]);
    strictEqual(JSON.stringify(diff), '{"a":{"a":1},"e":[{"e":5},{"f":6}],"h":false,"i":""}', 'difference method works ok');

    var diff = xs.difference(x[0], {});
    strictEqual(JSON.stringify(diff), JSON.stringify(x[0]), 'difference method works ok');

    var diff = xs.difference({}, x[0]);
    strictEqual(JSON.stringify(diff), JSON.stringify({}), 'difference method works ok');

    var diff = xs.difference({});
    strictEqual(JSON.stringify(diff), JSON.stringify({}), 'difference method works ok');
});

test('unique', function () {
    var arr = [];
    var obj = {};
    var x = [
        1,
        1,
        2,
        2,
        obj,
        null,
        true,
        false,
        '',
        obj,
        arr
    ];
    var unique = xs.unique(x);
    strictEqual(JSON.stringify(unique), '[1,2,{},null,true,false,"",[]]', 'uniques method works ok');

    var unique = xs.unique([]);
    strictEqual(JSON.stringify(unique), '[]', 'uniques method works ok');

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
    var unique = xs.unique(x);
    strictEqual(JSON.stringify(unique), '{"a":1,"c":true,"d":[],"f":{}}', 'unique method works ok');
    strictEqual(xs.has(unique, arr), true, 'links to objects saved');
    strictEqual(xs.has(unique, obj), true, 'links to objects saved');

    var unique = xs.unique({});
    strictEqual(JSON.stringify(unique), '{}', 'uniques method works ok');
});

test('pick', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.pick(x, 0, 1);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');

    var clone = xs.pick(x, [0], [1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');

    var clone = xs.pick(x, [
        0,
        1
    ]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');

    var clone = xs.pick(x, 99);
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    var clone = xs.pick(x, 'a');
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    x = [];

    var clone = xs.pick(x, 99);
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    var clone = xs.pick(x, 'a');
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

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

    var clone = xs.pick(x, 'a', 'b', 'e');
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    var clone = xs.pick(x, ['a'], ['b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    var clone = xs.pick(x, [
        'a',
        'b'
    ]);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    var clone = xs.pick(x);
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok without args');

    var clone = xs.pick({}, 'a');
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok with empty source');

    var clone = xs.pick({});
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok with empty source');
});

test('omit', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
    ];
    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';

    var clone = xs.omit(x, 2, 3);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.omit(x, [2], [3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.omit(x, [
        2,
        3
    ]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    var clone = xs.omit(x, 99);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    var clone = xs.omit(x, 'a');
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok with wrong args');

    x = [];

    var clone = xs.omit(x, 99);
    strictEqual(JSON.stringify(clone), JSON.stringify([]), 'omit works ok with wrong args');

    var clone = xs.omit(x, 'a');
    strictEqual(JSON.stringify(clone), JSON.stringify([]), 'omit works ok with wrong args');

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

    var clone = xs.omit(x, 'c', 'd', 'e');
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.omit(x, ['c'], ['d']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.omit(x, [
        'c',
        'd'
    ]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    var clone = xs.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    var clone = xs.omit({}, 'a');
    strictEqual(JSON.stringify(clone), '{}', 'omit works ok with empty source');

    var clone = xs.omit({});
    strictEqual(JSON.stringify(clone), '{}', 'omit works ok with empty source');
});

test('defaults', function () {
    var x = [
        {
            x: 1,
            y: 2
        },
        {
            x: 2,
            y: 2
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        }
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

    var clone = xs.clone({});
    xs.defaults(clone, {
        e: 1
    }, {
        f: 1
    });
    strictEqual(JSON.stringify(clone), '{"e":1,"f":1}', 'defaults works ok with empty object');

    var clone = xs.clone(x);
    xs.defaults(clone, {
        e: 1
    }, {
        f: 1
    });
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');

    var clone = xs.clone(x);
    xs.defaults(clone, {
        a: 1
    });
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without defaulting');

    var clone = xs.clone(x);
    xs.defaults(clone);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without args');
});