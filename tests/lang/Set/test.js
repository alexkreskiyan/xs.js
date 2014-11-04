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
    strictEqual(xs.hasKey(x, 2), false, 'hasKey method does not find ok');

    x = [];
    strictEqual(xs.hasKey(x, 0), false, 'hasKey method does not find ok');
    strictEqual(xs.hasKey(x, 1), false, 'hasKey method does not find ok');
    strictEqual(xs.hasKey(x, 2), false, 'hasKey method does not find ok');

    x = {};
    strictEqual(xs.hasKey(x, 'x'), false, 'hasKey method works ok in empty');
    strictEqual(xs.hasKey(x, 'y'), false, 'hasKey method works ok in empty');

    x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.hasKey(x, 'x'), true, 'hasKey method finds ok');
    strictEqual(xs.hasKey(x, 'y'), false, 'hasKey method does not find ok');
});

test('has', function () {
    //simple number array
    var x;
    x = [
        1,
        3
    ];
    strictEqual(xs.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.has(x, 'A'), false, 'has method does not find ok');
    //empty array
    x = [];
    strictEqual(xs.has(x, 1), false, 'has method does not find ok');
    strictEqual(xs.has(x, 'A'), false, 'has method does not find ok');
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
    strictEqual(xs.has(x, 1), false, 'has method does not find ok');

    x = {};
    strictEqual(xs.has(x, 1), false, 'has method works ok in empty');
    strictEqual(xs.has(x, '1'), false, 'has method works ok in empty');

    x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.has(x, 1), true, 'has method finds ok');
    strictEqual(xs.has(x, '1'), false, 'has method does not find ok');
});

test('keyOf', function () {
    //simples array
    var x = [
        1,
        3
    ];
    strictEqual(xs.keyOf(x, 3), 1, 'keyOf method finds ok');
    strictEqual(xs.keyOf(x, '1'), undefined, 'keyOf method does not find ok');
    //empty array
    x = [];
    strictEqual(xs.keyOf(x, 0), undefined, 'keyOf method does not find ok');
    strictEqual(xs.keyOf(x, '0'), undefined, 'keyOf method does not find ok');
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
    ]), undefined, 'keyOf method does not find ok');
    strictEqual(xs.keyOf(x, z), 0, 'keyOf method finds ok');
    strictEqual(xs.keyOf(x, '0'), undefined, 'keyOf method does not find ok');

    x = {};
    strictEqual(xs.keyOf(x, 1), undefined, 'keyOf method works ok in empty');
    strictEqual(xs.keyOf(x, '1'), undefined, 'keyOf method works ok in empty');

    x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.keyOf(x, 1), 'x', 'keyOf method finds ok');
    strictEqual(xs.keyOf(x, '1'), undefined, 'keyOf method does not find ok');
});

test('lastKeyOf', function () {
    var x = [
        1,
        3,
        3
    ];
    strictEqual(xs.lastKeyOf(x, 3), 2, 'lastKeyOf method finds ok');
    strictEqual(xs.lastKeyOf(x, '1'), undefined, 'lastKeyOf method does not find ok');
    x = [];
    strictEqual(xs.lastKeyOf(x, 3), undefined, 'lastKeyOf method does not find ok');

    x = {};
    strictEqual(xs.lastKeyOf(x, 1), undefined, 'keyOf method works ok in empty');
    strictEqual(xs.lastKeyOf(x, '1'), undefined, 'keyOf method works ok in empty');

    x = {
        x: 1,
        b: 2,
        c: 2
    };
    strictEqual(xs.lastKeyOf(x, 2), 'c', 'lastKeyOf method finds ok');
    strictEqual(xs.lastKeyOf(x, '1'), undefined, 'lastKeyOf method does not find ok');
});

test('size', function () {
    var x = [
        2,
        3
    ];
    strictEqual(xs.size(x), 2, 'size method evaluates non-empty ok');
    strictEqual(xs.size([]), 0, 'size method evaluates empty ok');

    x = {
        x: 1,
        b: 2
    };
    strictEqual(xs.size(x), 2, 'size method evaluates non-empty ok');
    strictEqual(xs.size({}), 0, 'size method evaluates empty ok');
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
    x = [];
    sum = '';
    xs.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'each method runs ok');

    x = {};
    sum = '';
    xs.each(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'each method runs ok with empty');

    x = {
        x: 1,
        b: 2
    };
    sum = '';
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
    x = [];
    sum = '';
    xs.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'eachReverse method runs ok');

    x = {};
    sum = '';
    xs.eachReverse(x, function (value) {
        sum += value;
    });
    strictEqual(sum, '', 'eachReverse method runs ok with empty');

    x = {
        x: 1,
        b: 2
    };
    sum = '';
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
    strictEqual(JSON.stringify(x), '[]', 'map method runs ok');

    x = [
        4,
        3
    ];
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(JSON.stringify(x), '[8,7]', 'map method runs ok');

    x = {};
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(JSON.stringify(x), '{}', 'map method runs ok');

    x = {
        x: 1,
        b: 2
    };
    x = xs.map(x, function (value, name) {
        return value * 2 + name;
    });
    strictEqual(JSON.stringify(x), '{"x":"2x","b":"4b"}', 'map method runs ok');
});

test('reduce', function () {
    var x = [];
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduce method runs ok with memo with empty source');

    x = [
        6,
        5,
        4
    ];
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), 25, 'reduce method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), 30, 'reduce method runs ok with memo');

    x = {};
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), undefined, 'reduce method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduce method runs ok with memo');

    x = {
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

    x = [
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

    x = {};
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }), undefined, 'reduceRight method runs ok without memo');
    strictEqual(xs.reduce(x, function (memo, value, name) {
        return memo + 2 * value + name;
    }, -3), -3, 'reduceRight method runs ok with memo');

    x = {
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

    x = [];

    strictEqual(xs.find(x, function (value) {
        return value.y == 1;
    }), undefined, 'find method runs ok when result not exists');

    x = {
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
    }), undefined, 'find method runs ok when result does not exist');

    strictEqual(xs.find(x, function (value) {
        return value.y == 3;
    }), undefined, 'find method runs ok when result does not exist');
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
    }), undefined, 'findLast method runs ok when result does not exist');

    x = [];
    strictEqual(xs.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result does not exist');

    x = {
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
    }), undefined, 'findLast method runs ok when result does not exist');

    strictEqual(xs.findLast(x, function (value) {
        return value.y == 3;
    }), undefined, 'findLast method runs ok when result does not exist');
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
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'findAll method runs ok when result does not exist');

    x = [];
    results = xs.findAll(x, function (value) {
        return value.a = 'aa';
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'findAll method runs ok when array is empty');

    x = {
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
    strictEqual(JSON.stringify(results), JSON.stringify({}), 'findAll method runs ok when result does not exist');

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
    strictEqual(results, undefined, 'filter method runs ok when result does not exist');

    x = [];
    results = xs.filter(x, {
        x: 'A'
    });
    strictEqual(results, undefined, 'filter method runs ok when result does not exist');

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
    strictEqual(results, undefined, 'filterLast method runs ok when result does not exist');

    x = [];
    results = xs.filterLast(x, {
        x: 'A'
    });
    strictEqual(results, undefined, 'filter method runs ok when result does not exist');

    x = {
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

    results = xs.filterLast(x, {
        x: 1
    });
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');

    results = xs.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result does not exist');

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
    strictEqual(results, undefined, 'filterLast method runs ok when result does not exist');

    x = [];
    results = xs.filterAll(x, {
        x: 'A'
    });
    strictEqual(JSON.stringify(results), JSON.stringify([]), 'filter method runs ok when result does not exist');

    x = {
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

    results = xs.filterLast(x, {
        x: 1
    });
    strictEqual(results, x.d, 'filterLast method runs ok when result exists');

    results = xs.filterLast(x, {
        x: 3
    });
    strictEqual(results, undefined, 'filterLast method runs ok when result does not exist');

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

    x = {
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

    x = {
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

test('none', function () {

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

    strictEqual(xs.none(x, function (value) {
        return value.hasOwnProperty('y');
    }), false, 'none method runs ok when result succeeds');

    strictEqual(xs.none(x, function (value) {
        return value.x === 3;
    }), true, 'none method runs ok when result fails');

    x = [];

    strictEqual(xs.none(x, function (value) {
        return !value.hasOwnProperty('y');
    }), true, 'none method runs ok when x is empty');

    x = {
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

    strictEqual(xs.none(x, function (value) {
        return xs.hasKey(value, 'y');
    }), false, 'none method runs ok when result succeeds');

    strictEqual(xs.none(x, function (value) {
        return value.x === 3;
    }), true, 'none method runs ok when result fails');

    strictEqual(xs.none({}, function (value) {
        return value.x === 1;
    }), true, 'none method runs ok when source hash is empty');
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

    x = {
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

    x = {
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
    strictEqual(JSON.stringify(xs.keys(x)), '[0,1,2]', 'shift method runs ok when result succeeds');
    strictEqual(xs.shift({}), undefined, 'shift method runs ok when result fails');

    x = {
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
    shifted = x.a;
    strictEqual(xs.shift(x), shifted, 'shift method runs ok when result succeeds');
    strictEqual(JSON.stringify(xs.keys(x)), '["b","c","d"]', 'shift method runs ok when result succeeds');
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
    strictEqual(JSON.stringify(xs.keys(x)), '[0,1,2]', 'pop method runs ok when result succeeds');
    strictEqual(xs.pop({}), undefined, 'pop method runs ok when result fails');

    x = {
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
    popped = x.d;
    strictEqual(xs.pop(x), popped, 'pop method runs ok when result succeeds');
    strictEqual(JSON.stringify(xs.keys(x)), '["a","b","c"]', 'pop method runs ok when result succeeds');
    strictEqual(xs.pop({}), undefined, 'pop method runs ok when result fails');
});

test('delete', function () {
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

    strictEqual(true, xs.delete(x, x[0]), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},1,1]', 'delete method runs ok when result succeeds');

    strictEqual(true, xs.delete(x, 0), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},{"x":1,"y":1},1,1]', 'delete method runs ok when result succeeds');

    strictEqual(true, xs.delete(x, 1), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1,1]', 'delete method runs ok when result succeeds');

    strictEqual(true, xs.delete(x, x[1]), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1},1]', 'delete method runs ok when result succeeds');

    strictEqual(true, xs.delete(x, 1), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'delete method runs ok when result succeeds');

    strictEqual(false, xs.delete(x, 1), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'delete method runs ok when result succeeds');

    x = [];
    strictEqual(false, xs.delete(x, 1), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[]', 'delete method runs ok when result succeeds');

    x = {
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
    strictEqual(true, xs.delete(x, x.a), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'delete method runs ok when result succeeds');

    strictEqual(false, xs.delete(x, 'a'), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'delete method runs ok when result succeeds');

    strictEqual(true, xs.delete(x, 'b'), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'delete method runs ok when result succeeds');

    strictEqual(false, xs.delete(x, 'b'), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'delete method runs ok when result succeeds');

    strictEqual(true, xs.delete(x, 1), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"f":1}', 'delete method runs ok when result succeeds');

    strictEqual(true, xs.delete(x, 1), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'delete method runs ok when result succeeds');

    strictEqual(false, xs.delete(x, 1), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'delete method runs ok when result succeeds');

    x = {};
    strictEqual(false, xs.delete(x, 1), 'delete method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{}', 'delete method runs ok with empty source');
});

test('deleteLast', function () {
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

    strictEqual(true, xs.deleteLast(x, x[0]), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1},9]', 'deleteLast method runs ok when result succeeds');

    strictEqual(true, xs.deleteLast(x, 9), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":2,"y":1},9,{"x":1,"y":1}]', 'deleteLast method runs ok when result succeeds');

    strictEqual(true, xs.deleteLast(x, 1), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},9,{"x":1,"y":1}]', 'deleteLast method runs ok when result succeeds');

    strictEqual(true, xs.deleteLast(x, x[1]), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2},{"x":1,"y":1}]', 'deleteLast method runs ok when result succeeds');

    strictEqual(true, xs.deleteLast(x, 1), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'deleteLast method runs ok when result succeeds');

    strictEqual(false, xs.deleteLast(x, 1), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":2}]', 'deleteLast method runs ok when result succeeds');

    x = [];
    strictEqual(false, xs.deleteLast(x, 1), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[]', 'deleteLast method runs ok when result succeeds');

    x = {
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

    strictEqual(true, xs.deleteLast(x, x.a), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'deleteLast method runs ok when result succeeds');

    strictEqual(false, xs.deleteLast(x, 'a'), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'deleteLast method runs ok when result succeeds');

    strictEqual(true, xs.deleteLast(x, 'b'), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'deleteLast method runs ok when result succeeds');

    strictEqual(false, xs.deleteLast(x, 'b'), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}', 'deleteLast method runs ok when result succeeds');

    strictEqual(true, xs.deleteLast(x, 1), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1}', 'deleteLast method runs ok when result succeeds');

    strictEqual(true, xs.deleteLast(x, 1), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'deleteLast method runs ok when result succeeds');

    strictEqual(false, xs.deleteLast(x, 1), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{"c":{"x":2,"y":1},"d":{"x":1,"y":1}}', 'deleteLast method runs ok when result succeeds');

    x = {};
    strictEqual(false, xs.deleteLast(x, 1), 'deleteLast method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{}', 'deleteLast method runs ok with empty source');
});

test('deleteAll', function () {
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

    strictEqual(true, xs.deleteAll(x, x[1], [
        x[0],
        x[1]
    ], [
        9,
        9
    ], 1), 'deleteAll method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[{"x":2,"y":1}]', 'deleteAll method runs ok when result succeeds');

    strictEqual(true, xs.deleteAll(x, 0), 'deleteAll method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[]', 'deleteAll method runs ok when result succeeds');

    x = [];
    strictEqual(false, xs.deleteAll(x, 1), 'deleteAll method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '[]', 'deleteAll method runs ok when result succeeds');

    x = {
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
    strictEqual(false, xs.deleteAll(x, 1), 'deleteAll method returns ok when result succeeds');

    strictEqual(false, xs.deleteAll(x, x.a, x.b, [
        'c',
        'd'
    ], [
        1,
        1
    ]), 'deleteAll method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{}', 'deleteAll method runs ok when result succeeds');

    strictEqual(false, xs.deleteAll(x, 1), 'deleteAll method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{}', 'deleteAll method runs ok when result succeeds');

    x = {};
    strictEqual(false, xs.deleteAll(x, 1), 'deleteAll method returns ok when result succeeds');
    strictEqual(JSON.stringify(x), '{}', 'deleteAll method runs ok with empty source');
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

    x = {
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

    intersection = xs.intersection([], obj, arr);
    strictEqual(JSON.stringify(intersection), '[]', 'intersection method works ok');

    intersection = xs.intersection([arr], [
        obj,
        arr
    ]);
    strictEqual(xs.has(intersection, arr), true, 'intersection method works ok');

    intersection = xs.intersection();
    strictEqual(JSON.stringify(intersection), '{}', 'intersection method works ok');

    arr = [];
    obj = {};
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

    x = [
        {a: a, b: b, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr},
        {b: b, c: c, d: d, e: e, f: null, g: false, h: obj, i: arr},
        {a: a, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr}
    ];
    intersection = xs.intersection(x[0], x[1], x[2]);
    var correct = '{"c":[{"c":3}],"d":[{"d":4}],"e":[{"e":5},{"f":6}],"f":null,"h":false,"j":{},"k":[]}';
    strictEqual(JSON.stringify(intersection), correct, 'intersection method works ok');
    strictEqual(xs.has(intersection, arr), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, obj), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, c), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, d), true, 'intersection method works ok');
    strictEqual(xs.has(intersection, e), true, 'intersection method works ok');

    intersection = xs.intersection({a: a}, {a: a});
    strictEqual(JSON.stringify(intersection), '{"a":{"a":1}}', 'intersection method works ok');

    intersection = xs.intersection();
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

    diff = xs.difference(x[0], []);
    strictEqual(JSON.stringify(diff), JSON.stringify(x[0]), 'difference method works ok');

    diff = xs.difference([], x[0]);
    strictEqual(JSON.stringify(diff), JSON.stringify([]), 'difference method works ok');

    diff = xs.difference([]);
    strictEqual(JSON.stringify(diff), JSON.stringify([]), 'difference method works ok');

    arr = [];
    obj = {};
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

    x = [
        {a: a, b: b, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr},
        {b: b, c: c, d: d, f: null, g: true, j: obj, k: arr},
        {c: c, d: d, f: null, g: true}
    ];

    diff = xs.difference(x[0], x[1], x[2]);
    strictEqual(JSON.stringify(diff), '{"a":{"a":1},"e":[{"e":5},{"f":6}],"h":false,"i":""}', 'difference method works ok');

    diff = xs.difference(x[0], {});
    strictEqual(JSON.stringify(diff), JSON.stringify(x[0]), 'difference method works ok');

    diff = xs.difference({}, x[0]);
    strictEqual(JSON.stringify(diff), JSON.stringify({}), 'difference method works ok');

    diff = xs.difference({});
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
    strictEqual(JSON.stringify(unique), '[1,2,{},null,true,false,"",[]]', 'unique method works ok');

    unique = xs.unique([]);
    strictEqual(JSON.stringify(unique), '[]', 'unique method works ok');

    arr = [];
    obj = {};
    x = {
        a: 1,
        b: 1,
        c: true,
        d: arr,
        e: arr,
        f: obj,
        g: obj
    };
    unique = xs.unique(x);
    strictEqual(JSON.stringify(unique), '{"a":1,"c":true,"d":[],"f":{}}', 'unique method works ok');
    strictEqual(xs.has(unique, arr), true, 'links to objects saved');
    strictEqual(xs.has(unique, obj), true, 'links to objects saved');

    unique = xs.unique({});
    strictEqual(JSON.stringify(unique), '{}', 'unique method works ok');
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

    clone = xs.pick(x, [0], [1]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');

    clone = xs.pick(x, [
        0,
        1
    ]);
    strictEqual(JSON.stringify(clone), correct, 'pick works ok with a set of args');

    clone = xs.pick(x, 99);
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    clone = xs.pick(x, 'a');
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    x = [];

    clone = xs.pick(x, 99);
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    clone = xs.pick(x, 'a');
    strictEqual(JSON.stringify(clone), '[]', 'pick works ok without args');

    x = {
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

    clone = xs.pick(x, 'a', 'b', 'e');
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    clone = xs.pick(x, ['a'], ['b']);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    clone = xs.pick(x, [
        'a',
        'b'
    ]);
    strictEqual(JSON.stringify(clone), '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}', 'pick works ok with a set of args');

    clone = xs.pick(x);
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok without args');

    clone = xs.pick({}, 'a');
    strictEqual(JSON.stringify(clone), '{}', 'pick works ok with empty source');

    clone = xs.pick({});
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

    clone = xs.omit(x, [2], [3]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    clone = xs.omit(x, [
        2,
        3
    ]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    clone = xs.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    clone = xs.omit(x, 99);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    clone = xs.omit(x, 'a');
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok with wrong args');

    x = [];

    clone = xs.omit(x, 99);
    strictEqual(JSON.stringify(clone), JSON.stringify([]), 'omit works ok with wrong args');

    clone = xs.omit(x, 'a');
    strictEqual(JSON.stringify(clone), JSON.stringify([]), 'omit works ok with wrong args');

    x = {
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
    correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}';

    clone = xs.omit(x, 'c', 'd', 'e');
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    clone = xs.omit(x, ['c'], ['d']);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    clone = xs.omit(x, [
        'c',
        'd'
    ]);
    strictEqual(JSON.stringify(clone), correct, 'omit works ok with a set of args');

    clone = xs.omit(x);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'omit works ok without args');

    clone = xs.omit({}, 'a');
    strictEqual(JSON.stringify(clone), '{}', 'omit works ok with empty source');

    clone = xs.omit({});
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

    clone = xs.clone(x);
    xs.defaults(clone, 1, 2, 3, 4, 5);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},5]', 'defaults works ok with a set of args');

    clone = xs.clone(x);
    xs.defaults(clone);
    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]', 'defaults works ok without args');

    x = {
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

    clone = xs.clone({});
    xs.defaults(clone, {
        e: 1
    }, {
        f: 1
    });
    strictEqual(JSON.stringify(clone), '{"e":1,"f":1}', 'defaults works ok with empty object');

    clone = xs.clone(x);
    xs.defaults(clone, {
        e: 1
    }, {
        f: 1
    });
    strictEqual(JSON.stringify(clone), correct, 'defaults works ok with a set of args');

    clone = xs.clone(x);
    xs.defaults(clone, {
        a: 1
    });
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without defaulting');

    clone = xs.clone(x);
    xs.defaults(clone);
    strictEqual(JSON.stringify(clone), JSON.stringify(x), 'defaults works ok without args');
});