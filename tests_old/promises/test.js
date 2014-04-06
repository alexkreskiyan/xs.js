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
module('1. Common');
asyncTest('base', function () {
    var resolved = Math.random() > 0.5;
    var fn = function () {
        var deferred = xs.create('xs.promise.Deferred');
        setTimeout(function () {
            deferred.progress(3);
        }, 5);
        setTimeout(function () {
            resolved ? deferred.resolve(1) : deferred.reject(2);
        }, 10);
        return deferred.promise;
    }
    fn().then(function (value) {
        result += 2 * value;
    }, null,function (progress) {
        result *= progress;
    }).always(function () {
            result *= 5;
        }).otherwise(function (reason) {
            result /= reason;
        });
    var result = 1;
    setTimeout(function () {
        start();
        strictEqual(result, resolved ? 25 : 7.5, 'ok');
    }, 10);
});
asyncTest('done', function () {
    var resolved = Math.random() > 0.5;
    var fn = function () {
        var deferred = xs.create('xs.promise.Deferred');
        setTimeout(function () {
            deferred.progress(3);
        }, 5);
        setTimeout(function () {
            resolved ? deferred.resolve(1) : deferred.reject(2);
        }, 10);
        return deferred.promise;
    }
    fn().then(function (value) {
        console.log('resolved', value, result);
        result += 2 * value;
    },function (reason) {
        console.log('rejected', reason, result);
        result += 3 * reason;
    },function (progress) {
        console.log('progress', progress, result);
        result *= progress;
    }).done();
    var result = 1;
    setTimeout(function () {
        start();
        strictEqual(result, resolved ? 5 : 9, 'ok');
    }, 10);
});
asyncTest('cancel', function () {
    var resolved = Math.random() > 0.5;
    var fn = function () {
        var deferred = xs.create('xs.promise.Deferred');
        setTimeout(function () {
            deferred.progress(3);
        }, 5);
        setTimeout(function () {
            resolved ? deferred.resolve(1) : deferred.reject(2);
        }, 10);
        return deferred.promise;
    }
    fn().then(function (value) {
        result += 2 * value;
    },function (reason) {
        result += 3 * reason;
    },function (progress) {
        result *= progress;
    }).cancel(7);
    var result = 1;
    setTimeout(function () {
        start();
        strictEqual(result, 1, 'ok');
    }, 10);
});
























