syncLoad([
    'xs.lang.Detect',
    'xs.lang.Object',
    'xs.lang.Array'
], function () {
    module('xs.lang.Array');

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
        strictEqual(xs.shift([]), undefined);

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
        strictEqual(xs.pop([]), undefined);

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

    });
});