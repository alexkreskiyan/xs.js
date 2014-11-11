syncLoad([
    'xs.lang.Detect', 'xs.lang.List'
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

    module('xs.Detect');

    test('isArray', function () {
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: true
            },
            {
                data: [1],
                ok: true
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isArray(test.data), test.ok, 'isArray method ok');
        });

    });

    test('isObject', function () {
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: true
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: true
            },
            {
                data: {
                    a: 1
                },
                ok: true
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isObject(test.data), test.ok, 'isObject method ok ' + JSON.stringify(test));
        });
    });

    test('isIterable', function () {
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: true
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: true
            },
            {
                data: {
                    a: 1
                },
                ok: true
            },
            {
                data: [],
                ok: true
            },
            {
                data: [1],
                ok: true
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isIterable(test.data), test.ok, 'isIterable method ok ' + JSON.stringify(test));
        });
    });

    test('isPrimitive', function () {
        var tests = [
            {
                data: null,
                ok: true
            },
            {
                data: undefined,
                ok: true
            },
            {
                data: true,
                ok: true
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: true
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: true
            },
            {
                data: 'a',
                ok: true
            },
            {
                data: '',
                ok: true
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isPrimitive(test.data), test.ok, 'isPrimitive method ok ' + JSON.stringify(test));
        });
    });

    test('isFunction', function () {
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: true
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isFunction(test.data), test.ok, 'isFunction method ok ' + JSON.stringify(test));
        });
    });

    test('isString', function () {
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: true
            },
            {
                data: 'a',
                ok: true
            },
            {
                data: '',
                ok: true
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isString(test.data), test.ok, 'isString method ok ' + JSON.stringify(test));
        });
    });

    test('isNumeric', function () {
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: true
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: true
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isNumeric(test.data), test.ok, 'isNumeric method ok ' + JSON.stringify(test));
        });
    });

    test('isNumber', function () {
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: true
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isNumber(test.data), test.ok, 'isNumber method ok ' + JSON.stringify(test));
        });
    });

    test('isNull', function () {
        var tests = [
            {
                data: null,
                ok: true
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isNull(test.data), test.ok, 'isNull method ok ' + JSON.stringify(test));
        });
    });

    test('isDefined', function () {
        var tests = [
            {
                data: null,
                ok: true
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: true
            },
            {
                data: new Date(),
                ok: true
            },
            {
                data: function () {
                },
                ok: true
            },
            {
                data: {},
                ok: true
            },
            {
                data: {
                    a: 1
                },
                ok: true
            },
            {
                data: [],
                ok: true
            },
            {
                data: [1],
                ok: true
            },
            {
                data: 1,
                ok: true
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: true
            },
            {
                data: 'a',
                ok: true
            },
            {
                data: '',
                ok: true
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isDefined(test.data), test.ok, 'isDefined method ok ' + JSON.stringify(test));
        });
    });

    test('isBoolean', function () {
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: true
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isBoolean(test.data), test.ok, 'isDefined method ok ' + JSON.stringify(test));
        });
    });

    test('isEmpty', function () {
        var tests = [
            {
                data: null,
                ok: true
            },
            {
                data: undefined,
                ok: true
            },
            {
                data: true,
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: true
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: true
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: true
            }
        ];
        xs.each(tests, function (test) {
            strictEqual(xs.isEmpty(test.data), test.ok, 'isDefined method ok ' + JSON.stringify(test));
        });
    });
});