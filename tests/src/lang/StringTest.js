require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.String'
], function () {
    module('xs.lang.String');
    test('translate', function () {
        var str = xs.translate('My fox is small and brown. I love my small brown fox', {
            small: 'big',
            brown: 'black',
            fox:   'bear'
        });
        strictEqual(str, 'My bear is big and black. I love my big black bear');
    });
});