syncLoad([
    'xs.lang.Detect',
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