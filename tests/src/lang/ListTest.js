syncLoad([
    'xs.lang.Detect',
    'xs.lang.List'
], function () {
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
        strictEqual(JSON.stringify(xs.keys(x)), '[0,1]');
        x = [];
        strictEqual(JSON.stringify(xs.keys(x)), '[]');

        x = {};
        strictEqual(JSON.stringify(xs.keys(x)), '[]');
        x = {
            x: 1,
            b: 2
        };
        strictEqual(JSON.stringify(xs.keys(x)), '["x","b"]');
    });

    test('values', function () {
        var x;
        x = [
            1,
            3
        ];
        strictEqual(JSON.stringify(xs.values(x)), '[1,3]');
        x = [];
        strictEqual(JSON.stringify(xs.values(x)), '[]');

        x = {};
        strictEqual(JSON.stringify(xs.values(x)), '[]');
        x = {
            x: 1,
            b: '2'
        };
        strictEqual(JSON.stringify(xs.values(x)), '[1,"2"]');
    });

    test('hasKey', function () {
        var x;
        x = [
            1,
            3
        ];
        strictEqual(xs.hasKey(x, 0), true);
        strictEqual(xs.hasKey(x, 1), true);
        strictEqual(xs.hasKey(x, 2), false);

        x = [];
        strictEqual(xs.hasKey(x, 0), false);
        strictEqual(xs.hasKey(x, 1), false);
        strictEqual(xs.hasKey(x, 2), false);

        x = {};
        strictEqual(xs.hasKey(x, 'x'), false);
        strictEqual(xs.hasKey(x, 'y'), false);

        x = {
            x: 1,
            b: 2
        };
        strictEqual(xs.hasKey(x, 'x'), true);
        strictEqual(xs.hasKey(x, 'y'), false);
    });

    test('has', function () {
        //simple number array
        var x;
        x = [
            1,
            3
        ];
        strictEqual(xs.has(x, 1), true);
        strictEqual(xs.has(x, 'A'), false);
        //empty array
        x = [];
        strictEqual(xs.has(x, 1), false);
        strictEqual(xs.has(x, 'A'), false);
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
        strictEqual(xs.has(x, x[0]), true);
        strictEqual(xs.has(x, 1), false);

        x = {};
        strictEqual(xs.has(x, 1), false);
        strictEqual(xs.has(x, '1'), false);

        x = {
            x: 1,
            b: 2
        };
        strictEqual(xs.has(x, 1), true);
        strictEqual(xs.has(x, '1'), false);
    });

    test('keyOf', function () {
        //simples array
        var x = [
            1,
            3
        ];
        strictEqual(xs.keyOf(x, 3), 1);
        strictEqual(xs.keyOf(x, '1'), undefined);
        //empty array
        x = [];
        strictEqual(xs.keyOf(x, 0), undefined);
        strictEqual(xs.keyOf(x, '0'), undefined);
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
        ]), undefined);
        strictEqual(xs.keyOf(x, z), 0);
        strictEqual(xs.keyOf(x, '0'), undefined);

        x = {};
        strictEqual(xs.keyOf(x, 1), undefined);
        strictEqual(xs.keyOf(x, '1'), undefined);

        x = {
            x: 1,
            b: 2
        };
        strictEqual(xs.keyOf(x, 1), 'x');
        strictEqual(xs.keyOf(x, '1'), undefined);
    });

    test('lastKeyOf', function () {
        var x = [
            1,
            3,
            3
        ];
        strictEqual(xs.lastKeyOf(x, 3), 2);
        strictEqual(xs.lastKeyOf(x, '1'), undefined);
        x = [];
        strictEqual(xs.lastKeyOf(x, 3), undefined);

        x = {};
        strictEqual(xs.lastKeyOf(x, 1), undefined);
        strictEqual(xs.lastKeyOf(x, '1'), undefined);

        x = {
            x: 1,
            b: 2,
            c: 2
        };
        strictEqual(xs.lastKeyOf(x, 2), 'c');
        strictEqual(xs.lastKeyOf(x, '1'), undefined);
    });

    test('size', function () {
        var x = [
            2,
            3
        ];
        strictEqual(xs.size(x), 2);
        strictEqual(xs.size([]), 0);

        x = {
            x: 1,
            b: 2
        };
        strictEqual(xs.size(x), 2);
        strictEqual(xs.size({}), 0);
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
        strictEqual(sum, '12');
        //empty array
        x = [];
        sum = '';
        xs.each(x, function (value) {
            sum += value;
        });
        strictEqual(sum, '');

        x = {};
        sum = '';
        xs.each(x, function (value) {
            sum += value;
        });
        strictEqual(sum, '');

        x = {
            x: 1,
            b: 2
        };
        sum = '';
        xs.each(x, function (value) {
            sum += value;
        });
        strictEqual(sum, '12');
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
        strictEqual(sum, '21');
        //empty array
        x = [];
        sum = '';
        xs.eachReverse(x, function (value) {
            sum += value;
        });
        strictEqual(sum, '');

        x = {};
        sum = '';
        xs.eachReverse(x, function (value) {
            sum += value;
        });
        strictEqual(sum, '');

        x = {
            x: 1,
            b: 2
        };
        sum = '';
        xs.eachReverse(x, function (value) {
            sum += value;
        });
        strictEqual(sum, '21');
    });

    test('map', function () {
        var x = [];
        x = xs.map(x, function (value, name) {
            return value * 2 + name;
        });
        strictEqual(JSON.stringify(x), '[]');

        x = [
            4,
            3
        ];
        x = xs.map(x, function (value, name) {
            return value * 2 + name;
        });
        strictEqual(JSON.stringify(x), '[8,7]');

        x = {};
        x = xs.map(x, function (value, name) {
            return value * 2 + name;
        });
        strictEqual(JSON.stringify(x), '{}');

        x = {
            x: 1,
            b: 2
        };
        x = xs.map(x, function (value, name) {
            return value * 2 + name;
        });
        strictEqual(JSON.stringify(x), '{"x":"2x","b":"4b"}');
    });

    test('reduce', function () {
        var x = [];
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }, -3), -3);

        x = [
            6,
            5,
            4
        ];
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }), 25);
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }, -3), 30);

        x = {};
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }), undefined);
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }, -3), -3);

        x = {
            x: 1,
            b: 2,
            a: 3
        };
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }), '5b6a');
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }, -3), '-1x4b6a');
    });

    test('reduceRight', function () {
        var x = [];
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }, -3), -3);

        x = [
            6,
            5,
            4
        ];
        strictEqual(xs.reduceRight(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }), 27);
        strictEqual(xs.reduceRight(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }, -3), 30);

        x = {};
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }), undefined);
        strictEqual(xs.reduce(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }, -3), -3);

        x = {
            x: 1,
            b: 2,
            a: 3
        };
        strictEqual(xs.reduceRight(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }), '7b2x');
        strictEqual(xs.reduceRight(x, function (memo, value, name) {
            return memo + 2 * value + name;
        }, -3), '3a4b2x');
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
        }), x[2]);

        x = [];

        strictEqual(xs.find(x, function (value) {
            return value.y == 1;
        }), undefined);

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
        }), x.c);

        strictEqual(xs.find({}, function (value) {
            return value.y == 3;
        }), undefined);

        strictEqual(xs.find(x, function (value) {
            return value.y == 3;
        }), undefined);
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
        }), x[3]);
        strictEqual(xs.findLast(x, function (value) {
            return value.y == 3;
        }), undefined);

        x = [];
        strictEqual(xs.findLast(x, function (value) {
            return value.y == 3;
        }), undefined);

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
        }), x.d);

        strictEqual(xs.findLast({}, function (value) {
            return value.y == 3;
        }), undefined);

        strictEqual(xs.findLast(x, function (value) {
            return value.y == 3;
        }), undefined);
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
        ]));

        results = xs.findAll(x, function (value) {
            return value.y == 3;
        });
        strictEqual(JSON.stringify(results), JSON.stringify([]));

        x = [];
        results = xs.findAll(x, function (value) {
            return value.a = 'aa';
        });
        strictEqual(JSON.stringify(results), JSON.stringify([]));

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
        }));

        results = xs.findAll(x, function (value) {
            return value.y == 3;
        });
        strictEqual(JSON.stringify(results), JSON.stringify({}));

        results = xs.findAll({}, function (value) {
            return value.y == 3;
        });
        strictEqual(JSON.stringify(results), JSON.stringify({}));
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
        strictEqual(results, x[0]);

        results = xs.filter(x, {
            x: 3
        });
        strictEqual(results, undefined);

        x = [];
        results = xs.filter(x, {
            x: 'A'
        });
        strictEqual(results, undefined);

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

        results = xs.filter(x, {
            x: 1
        });
        strictEqual(results, x.a);

        results = xs.filter(x, {
            x: 3
        });
        strictEqual(results, undefined);

        results = xs.filter({}, {
            x: 3
        });
        strictEqual(results, undefined);
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
        strictEqual(results, x[3]);

        results = xs.filterLast(x, {
            x: 3
        });
        strictEqual(results, undefined);

        x = [];
        results = xs.filterLast(x, {
            x: 'A'
        });
        strictEqual(results, undefined);

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
        strictEqual(results, x.d);

        results = xs.filterLast(x, {
            x: 3
        });
        strictEqual(results, undefined);

        results = xs.filterLast({}, {
            x: 3
        });
        strictEqual(results, undefined);
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
        results = xs.filterAll(x, {
            x: 1
        });
        strictEqual(results.length, 2);
        strictEqual(results[0], x[0]);
        strictEqual(results[1], x[3]);

        results = xs.filterAll(x, {
            x: 3
        });
        strictEqual(results.length, 0);

        x = [];
        results = xs.filterAll(x, {
            x: 'A'
        });
        strictEqual(results.length, 0);

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

        results = xs.filterAll(x, {
            x: 1
        });
        strictEqual(xs.size(results), 2);
        strictEqual(results.a, x.a);
        strictEqual(results.d, x.d);

        results = xs.filterAll(x, {
            x: 3
        });
        strictEqual(xs.size(results), 0);

        results = xs.filterAll({}, {
            x: 3
        });
        strictEqual(xs.size(results), 0);
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
        }), true);

        strictEqual(xs.every(x, function (value) {
            return value.x === 1;
        }), false);

        x = [];

        strictEqual(xs.every(x, function (value) {
            return !value.hasOwnProperty('y');
        }), true);

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
        }), true);

        strictEqual(xs.every(x, function (value) {
            return value.x === 1;
        }), false);

        strictEqual(xs.every({}, function (value) {
            return value.x === 1;
        }), true);
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
        }), true);

        strictEqual(xs.some(x, function (value) {
            return value.x == 1 && value.y == 1;
        }, 2), false, 'some method runs ok when result succeeds with given count greater then 0');

        strictEqual(xs.some(x, function (value) {
            return value.x == 1 && value.y == 3;
        }), false);

        strictEqual(xs.some({}, function (value) {
            return value.x == 1 && value.y == 1;
        }), false);

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
        }), true);

        strictEqual(xs.some(x, function (value) {
            return value.x == 1 && value.y == 1;
        }, 2), false, 'some method runs ok when result succeeds with given count greater then 0');

        strictEqual(xs.some(x, function (value) {
            return value.x == 1 && value.y == 3;
        }), false);

        strictEqual(xs.some({}, function (value) {
            return value.x == 1 && value.y == 1;
        }), false);
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
        }), false);

        strictEqual(xs.none(x, function (value) {
            return value.x === 3;
        }), true);

        x = [];

        strictEqual(xs.none(x, function (value) {
            return !value.hasOwnProperty('y');
        }), true);

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
        }), false);

        strictEqual(xs.none(x, function (value) {
            return value.x === 3;
        }), true);

        strictEqual(xs.none({}, function (value) {
            return value.x === 1;
        }), true);
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

        strictEqual(xs.first(x), x[0]);
        strictEqual(xs.first([]), undefined);

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
        strictEqual(xs.first(x), x.a);
        strictEqual(xs.first({}), undefined);

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

        strictEqual(xs.last(x), x[3]);
        strictEqual(xs.last([]), undefined);

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
        strictEqual(xs.last(x), x.d);
        strictEqual(xs.last({}), undefined);
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
        strictEqual(xs.shift(x), shifted);
        strictEqual(JSON.stringify(xs.keys(x)), '[0,1,2]');
        strictEqual(xs.shift({}), undefined);

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
        strictEqual(xs.shift(x), shifted);
        strictEqual(JSON.stringify(xs.keys(x)), '["b","c","d"]');
        strictEqual(xs.shift({}), undefined);
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
        strictEqual(xs.pop(x), popped);
        strictEqual(JSON.stringify(xs.keys(x)), '[0,1,2]');
        strictEqual(xs.pop({}), undefined);

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
        strictEqual(xs.pop(x), popped);
        strictEqual(JSON.stringify(xs.keys(x)), '["a","b","c"]');
        strictEqual(xs.pop({}), undefined);
    });

    test('deleteAt', function () {
        var x = [
            1,
            3,
            2
        ];

        strictEqual(xs.deleteAt(x, 1), true);
        strictEqual(JSON.stringify(x), '[1,2]');

        strictEqual(xs.deleteAt(x, 2), false);
        strictEqual(JSON.stringify(x), '[1,2]');

        x = {
            a: 1,
            b: 2,
            c: 3
        };

        strictEqual(xs.deleteAt(x, 'b'), true);
        strictEqual(JSON.stringify(x), '{"a":1,"c":3}');

        strictEqual(xs.deleteAt(x, 'd'), false);
        strictEqual(JSON.stringify(x), '{"a":1,"c":3}');
    });

    test('delete', function () {
        var item = {x: 1};
        var itemString = JSON.stringify(item);
        var x = [
            3,
            item,
            2,
            item
        ];

        strictEqual(xs.delete(x, item), true);
        strictEqual(JSON.stringify(x), '[3,2,' + itemString + ']');

        strictEqual(xs.delete(x, 1), false);
        strictEqual(JSON.stringify(x), '[3,2,' + itemString + ']');

        x = {
            a: 1,
            b: item,
            d: item,
            c: 3
        };

        strictEqual(xs.delete(x, item), true);
        strictEqual(JSON.stringify(x), '{"a":1,"d":' + itemString + ',"c":3}');

        strictEqual(xs.delete(x, 2), false);
        strictEqual(JSON.stringify(x), '{"a":1,"d":' + itemString + ',"c":3}');
    });

    test('deleteLast', function () {
        var item = {x: 1};
        var itemString = JSON.stringify(item);
        var x = [
            3,
            item,
            2,
            item
        ];

        strictEqual(xs.deleteLast(x, item), true);
        strictEqual(JSON.stringify(x), '[3,' + itemString + ',2]');

        strictEqual(xs.deleteLast(x, 1), false);
        strictEqual(JSON.stringify(x), '[3,' + itemString + ',2]');

        x = {
            a: 1,
            b: item,
            d: item,
            c: 3
        };

        strictEqual(xs.deleteLast(x, item), true);
        strictEqual(JSON.stringify(x), '{"a":1,"b":' + itemString + ',"c":3}');

        strictEqual(xs.deleteLast(x, 2), false);
        strictEqual(JSON.stringify(x), '{"a":1,"b":' + itemString + ',"c":3}');
    });

    test('deleteAll', function () {
        var item = {x: 1};
        var itemString = JSON.stringify(item);
        var x = [
            1,
            2,
            item,
            item,
            2,
            item,
            1
        ];

        strictEqual(xs.deleteAll(x, 2), 2);
        strictEqual(JSON.stringify(x), '[1,' + itemString + ',' + itemString + ',' + itemString + ',1]');

        strictEqual(xs.deleteAll(x, 3), 0);
        strictEqual(JSON.stringify(x), '[1,' + itemString + ',' + itemString + ',' + itemString + ',1]');

        strictEqual(xs.deleteAll(x, item), 3);
        strictEqual(JSON.stringify(x), '[1,1]');

        strictEqual(xs.deleteAll(x), 2);
        strictEqual(JSON.stringify(x), '[]');

        strictEqual(xs.deleteAll(x), 0);
        strictEqual(JSON.stringify(x), '[]');

        x = {
            a: 1,
            b: 2,
            c: item,
            d: item,
            e: 2,
            f: item,
            g: 1
        };

        strictEqual(xs.deleteAll(x, 2), 2);
        strictEqual(JSON.stringify(x), '{"a":1,"c":' + itemString + ',"d":' + itemString + ',"f":' + itemString + ',"g":1}');

        strictEqual(xs.deleteAll(x, 3), 0);
        strictEqual(JSON.stringify(x), '{"a":1,"c":' + itemString + ',"d":' + itemString + ',"f":' + itemString + ',"g":1}');

        strictEqual(xs.deleteAll(x, item), 3);
        strictEqual(JSON.stringify(x), '{"a":1,"g":1}');

        strictEqual(xs.deleteAll(x), 2);
        strictEqual(JSON.stringify(x), '{}');

        strictEqual(xs.deleteAll(x), 0);
        strictEqual(JSON.stringify(x), '{}');
    });

    test('clone', function () {
        var item = {x: 1};
        var x, clone;
        x = [
            1,
            2,
            item
        ];
        clone = xs.clone(x);
        //keys are equal
        strictEqual(JSON.stringify(xs.keys(clone)), JSON.stringify(xs.keys(x)));
        //values are equal
        strictEqual(xs.every(x, function (value, key) {
            return clone[key] === x[key];
        }), true);
        //links are saved
        strictEqual(x[2] === clone[2], true);
        x = {
            a: 1,
            c: 2,
            b: item
        };
        clone = xs.clone(x);
        //keys are equal
        strictEqual(JSON.stringify(xs.keys(clone)), JSON.stringify(xs.keys(x)));
        //values are equal
        strictEqual(xs.every(x, function (value, key) {
            return clone[key] === x[key];
        }), true);
        //links are saved
        strictEqual(x.b === clone.b, true);
    });

    test('extend', function () {
        var a = {a: 1};
        var b = {b: 1};
        var c = {c: 1};
        var x = {
            a: a,
            b: b,
            c: c,
            d: 1,
            e: xs.clone(a)
        };
        xs.extend(x, {a: b}, 3, [
            4,
            5
        ], {b: 1}, {e: a});
        //check replacements
        strictEqual(x.a, b);
        strictEqual(x.b, 1);
        strictEqual(x.c, c);
        strictEqual(x.d, 1);
        strictEqual(x.e, a);
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
        strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]');

        clone = xs.clone(x);
        xs.defaults(clone, 1, 2, 3, 4, 5);
        strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},5]');

        clone = xs.clone(x);
        xs.defaults(clone);
        strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]');

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
        strictEqual(JSON.stringify(clone), '{"e":1,"f":1}');

        clone = xs.clone(x);
        xs.defaults(clone, {
            e: 1
        }, {
            f: 1
        });
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.clone(x);
        xs.defaults(clone, {
            a: 1
        });
        strictEqual(JSON.stringify(clone), JSON.stringify(x));

        clone = xs.clone(x);
        xs.defaults(clone);
        strictEqual(JSON.stringify(clone), JSON.stringify(x));
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

        strictEqual(JSON.stringify(xs.compact(x)), '[1,2,true,{},[],"0","1"]');

        x = [];
        strictEqual(JSON.stringify(xs.compact(x)), '[]');

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

        strictEqual(JSON.stringify(xs.compact(x)), '{"b":1,"c":2,"g":true,"h":{},"i":[],"k":"0","l":"1"}');

        x = {};
        strictEqual(JSON.stringify(xs.compact(x)), '{}');
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
        strictEqual(JSON.stringify(unique), '[1,2,{},null,true,false,"",[]]');

        unique = xs.unique([]);
        strictEqual(JSON.stringify(unique), '[]');

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
        strictEqual(JSON.stringify(unique), '{"a":1,"c":true,"d":[],"f":{}}');
        strictEqual(xs.has(unique, arr), true);
        strictEqual(xs.has(unique, obj), true);

        unique = xs.unique({});
        strictEqual(JSON.stringify(unique), '{}');
    });

    test('shuffle', function () {
        var item = {x: 1};
        var x, clone;
        x = [
            0,
            1,
            2,
            item,
            item,
            item,
            item,
            item,
            item,
            item,
            item,
            item,
            item,
            item,
            item,
            item,
            item
        ];

        clone = xs.clone(x);
        xs.shuffle(x);
        //check items all saved
        strictEqual(true, xs.every(clone, function (value) {
            return xs.has(x, value);
        }));
        //check all keys exist
        strictEqual(true, xs.every(clone, function (value, key) {
            return xs.hasKey(x, key);
        }));
        //check order is changed
        strictEqual(false, xs.every(clone, function (value) {
            return xs.keyOf(x, value) === xs.keyOf(clone, value);
        }));

        x = {
            a: 0,
            b: 1,
            c: 2,
            d: item,
            e: item,
            f: item,
            g: item,
            h: item,
            k: item,
            l: item,
            m: item,
            n: item,
            o: item,
            p: item
        };

        clone = xs.clone(x);
        xs.shuffle(x);
        //check items all saved
        strictEqual(true, xs.every(clone, function (value) {
            return xs.has(x, value);
        }));
        //check all keys exist
        strictEqual(true, xs.every(clone, function (value, key) {
            return xs.hasKey(x, key);
        }));
        //check order is changed
        strictEqual(false, JSON.stringify(xs.keys(x)) == JSON.stringify(xs.keys(clone)));
    });

    test('union', function () {
        strictEqual(JSON.stringify(xs.union(null, undefined, 1, 2, [3], [
            4,
            5
        ])), '[null,null,1,2,3,4,5]');

        strictEqual(JSON.stringify(xs.union(null, undefined, 1, 2, [3], [
            4,
            5
        ])), '[null,null,1,2,3,4,5]');

        strictEqual(JSON.stringify(xs.union([], [], [])), '{}');

        strictEqual(JSON.stringify(xs.union()), '{}');

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
        strictEqual(JSON.stringify(xs.union.apply(xs, x)), '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}');

        strictEqual(JSON.stringify(xs.union.apply(xs, [x])), '[{"a":1},{"b":2},{"c":3},{"d":4},{"e":5},{"f":6}]');

        strictEqual(JSON.stringify(xs.union({}, {}, [
            {},
            {}
        ])), '{}');

        strictEqual(JSON.stringify(xs.union()), '{}');
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
        strictEqual(JSON.stringify(intersection), '[3,4,5,null,false,{},[]]');
        strictEqual(xs.has(intersection, arr), true);
        strictEqual(xs.has(intersection, obj), true);

        intersection = xs.intersection([], obj, arr);
        strictEqual(JSON.stringify(intersection), '{}');

        intersection = xs.intersection([arr], [
            obj,
            arr
        ]);
        strictEqual(xs.has(intersection, arr), true);

        intersection = xs.intersection();
        strictEqual(JSON.stringify(intersection), '{}');

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
        strictEqual(JSON.stringify(intersection), correct);
        strictEqual(xs.has(intersection, arr), true);
        strictEqual(xs.has(intersection, obj), true);
        strictEqual(xs.has(intersection, c), true);
        strictEqual(xs.has(intersection, d), true);
        strictEqual(xs.has(intersection, e), true);

        intersection = xs.intersection({a: a}, {a: a});
        strictEqual(JSON.stringify(intersection), '{"a":{"a":1}}');

        intersection = xs.intersection();
        strictEqual(JSON.stringify(intersection), '{}');
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
        strictEqual(JSON.stringify(diff), '[8]');

        diff = xs.difference(x[0], []);
        strictEqual(JSON.stringify(diff), JSON.stringify(x[0]));

        diff = xs.difference([], x[0]);
        strictEqual(JSON.stringify(diff), JSON.stringify([]));

        diff = xs.difference([]);
        strictEqual(JSON.stringify(diff), JSON.stringify([]));

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
        strictEqual(JSON.stringify(diff), '{"a":{"a":1},"e":[{"e":5},{"f":6}],"h":false,"i":""}');

        diff = xs.difference(x[0], {});
        strictEqual(JSON.stringify(diff), JSON.stringify(x[0]));

        diff = xs.difference({}, x[0]);
        strictEqual(JSON.stringify(diff), JSON.stringify({}));

        diff = xs.difference({});
        strictEqual(JSON.stringify(diff), JSON.stringify({}));
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
        var correctKeys = '[0,1]';

        var clone = xs.pick(x, 0, 1);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.pick(x, [0], [1]);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.pick(x, [
            0,
            1
        ]);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.pick(x);
        strictEqual(JSON.stringify(clone), '[]');

        clone = xs.pick(x, 'a');
        strictEqual(JSON.stringify(clone), '[]');

        clone = xs.pick([], 'a');
        strictEqual(JSON.stringify(clone), '[]');

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
        correctKeys = '["a","b"]';

        clone = xs.pick(x, 'a', 'b', 'e');
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.pick(x, ['a'], ['b']);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.pick(x, [
            'a',
            'b'
        ]);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.pick(x);
        strictEqual(JSON.stringify(clone), '{}');

        clone = xs.pick(x, 'n');
        strictEqual(JSON.stringify(clone), '{}');

        clone = xs.pick({}, 'n');
        strictEqual(JSON.stringify(clone), '{}');
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
        var correctKeys = '[0,1]';

        var clone = xs.omit(x, 2, 3);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.omit(x, [2], [3]);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.omit(x, [
            2,
            3
        ]);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.omit(x);
        strictEqual(JSON.stringify(clone), JSON.stringify(x));

        clone = xs.omit(x, 'a');
        strictEqual(JSON.stringify(clone), JSON.stringify(x));

        clone = xs.omit([], 'a');
        strictEqual(JSON.stringify(clone), '[]');

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
        correctKeys = '["a","b"]';

        clone = xs.omit(x, 'c', 'd', 'e');
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.omit(x, ['c'], ['d']);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.omit(x, [
            'c',
            'd'
        ]);
        strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
        strictEqual(JSON.stringify(clone), correct);

        clone = xs.omit(x);
        strictEqual(JSON.stringify(clone), JSON.stringify(x));

        clone = xs.omit(x, 'n');
        strictEqual(JSON.stringify(clone), JSON.stringify(x));

        clone = xs.omit({}, 'n');
        strictEqual(JSON.stringify(clone), '{}');
    });
});