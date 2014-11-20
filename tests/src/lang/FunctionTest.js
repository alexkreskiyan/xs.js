require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Function'
], function () {
    module('xs.lang.Function');

    test('bind', function () {
        var fn = function (a, b, c) {
            return this.x + (a - b) * c;
        };
        var binded = xs.bind(fn, {x: 5}, [
            2,
            3
        ]);

        strictEqual(binded(4), 5 + (2 - 3) * 4);
    });

    test('prefill', function () {
        var fn = function (a, b, c) {
            return this.x + (a - b) * c;
        };
        var filled = xs.prefill(fn, [
            1,
            2,
            3
        ], {x: 5});

        strictEqual(filled(4), 5 + (4 - 2) * 3);
    });

    test('once', function () {
        var fn = function (obj) {
            obj.x++;
        };
        var obj = {x: 1};
        var one = xs.once(fn);

        one(obj);
        strictEqual(obj.x, 2);
        one(obj);
        strictEqual(obj.x, 2);
    });

    test('wrap', function () {
        var fn = function (val) {
            return 2 * val;
        };
        var wrapped = xs.wrap(fn, function (func, a, b, c) {
            return this.x + a + func(b) + c;
        }, {x: 1});

        strictEqual(wrapped(1, 2, 3), 9);
    });

    test('getName', function () {
        //test anonymous function
        strictEqual(xs.Function.getName(function () {
        }), '');
        //test named function
        strictEqual(xs.Function.getName(function demo123_Asd() {
        }), 'demo123_Asd');
    });

    test('getArguments', function () {
        //test empty arguments
        strictEqual(JSON.stringify(xs.Function.getArguments(function () {
        })), '[]');
        //test arguments
        strictEqual(JSON.stringify(xs.Function.getArguments(function demo123_Asd(demo123_Asd, asd_123_ASD) {
        })), '["demo123_Asd","asd_123_ASD"]');
    });

    test('getBody', function () {
        //test empty body
        strictEqual(xs.Function.getBody(function () {
        }).trim(), '');
        //test named function
        strictEqual(xs.Function.getBody(function demo123_Asd(demo123_Asd, asd_123_ASD) {
            return demo123_Asd + asd_123_ASD + "";
        }).trim(), 'return demo123_Asd + asd_123_ASD + "";');
    });

    test('parse', function () {
        var data = xs.Function.parse(function demo123_Asd(demo123_Asd, asd_123_ASD) {
            return demo123_Asd + asd_123_ASD + "";
        });
        strictEqual(data.name, 'demo123_Asd');
        strictEqual(JSON.stringify(data.arguments), '["demo123_Asd","asd_123_ASD"]');
        strictEqual(data.body.trim(), 'return demo123_Asd + asd_123_ASD + "";');
    });
});