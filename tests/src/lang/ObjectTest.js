require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object'
], function () {
    module('xs.lang.Object');

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
});