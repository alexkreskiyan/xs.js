require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Array'
], function () {
    module('xs.lang.Array');

    test('shuffle', function () {
        var item = {x: 1};
        var x, clone;
        x = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
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