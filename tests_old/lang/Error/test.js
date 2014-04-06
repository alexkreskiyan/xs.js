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
module('xs.lang.Error');
test('raise', function () {
    function CustomError(message) {
        this.message = message;
    }

    throws(function () {
        xs.Error.raise();
    }, Error, 'raises error correctly with default message and default type');
    throws(function () {
        xs.Error.raise();
    }, /$/, 'raises error correctly with default message and default type');

    throws(function () {
        xs.Error.raise('test');
    }, Error, 'raises error correctly with default type');
    throws(function () {
        xs.Error.raise('test');
    }, /test$/, 'raises error correctly with default type');

    throws(function () {
        xs.Error.raise('test', CustomError);
    }, CustomError, 'raises error correctly');
    throws(function () {
        xs.Error.raise('test', CustomError);
    }, /test$/, 'raises error correctly');
});
test('raiseReference', function () {
    throws(function () {
        xs.Error.raiseReference();
    }, ReferenceError, 'raises error correctly with default message');
    throws(function () {
        xs.Error.raiseReference();
    }, /$/, 'raises error correctly with default message');

    throws(function () {
        xs.Error.raiseReference('test');
    }, ReferenceError, 'raises error correctly');
    throws(function () {
        xs.Error.raiseReference('test');
    }, /test$/, 'raises error correctly');
});
test('raiseSyntax', function () {
    throws(function () {
        xs.Error.raiseSyntax();
    }, SyntaxError, 'raises error correctly with default message');
    throws(function () {
        xs.Error.raiseSyntax();
    }, /$/, 'raises error correctly with default message');

    throws(function () {
        xs.Error.raiseSyntax('test');
    }, SyntaxError, 'raises error correctly');
    throws(function () {
        xs.Error.raiseSyntax('test');
    }, /test$/, 'raises error correctly');
});
test('raiseType', function () {
    throws(function () {
        xs.Error.raiseType();
    }, TypeError, 'raises error correctly with default message');
    throws(function () {
        xs.Error.raiseType();
    }, /$/, 'raises error correctly with default message');

    throws(function () {
        xs.Error.raiseType('test');
    }, TypeError, 'raises error correctly');
    throws(function () {
        xs.Error.raiseType('test');
    }, /test$/, 'raises error correctly');
});