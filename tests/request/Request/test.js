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
module('xs.request.Request');
test('fromQueryString', function () {
    var decode = function (str) {
        return JSON.stringify(xs.request.Request.fromQueryString(str));
    };
    //decode empty string
    equal(decode(), '{}', 'from empty args');
    equal(decode(''), '{}', 'from empty string');
    //decode simple string
    equal(decode('x'), '{"x":""}', 'from simple string without value 1');
    equal(decode('x&y'), '{"x":"","y":""}', 'from simple string without value 2');
    equal(decode('x=тест&y=25tsdf^*^fsdf`"'), '{"x":"тест","y":"25tsdf^*^fsdf`\\""}', 'from simple string without value 2');
    //decode simple encoded string
    equal(decode('x=%D1%82%D0%B5%D1%81%D1%82&y=25tsdf%5E%26*%5E%26fsdf%60%22'), '{"x":"тест","y":"25tsdf^&*^&fsdf`\\""}', 'from simple encoded string');
    //decode complex string
    equal(decode('x[]'), '{"x":[""]}', 'from complex string without value 1');
    equal(decode('x[][]'), '{"x":[[""]]}', 'from complex string without value 2');
    equal(decode('x[][]=1&x[][]=2&x[]=3&x[]=4'), '{"x":[[1],[2],3,4]}', 'from complex string without value 2');
    //decode complex encoded string
    equal(decode('x[]=%D1%82%D0%B5%D1%81%D1%82'), '{"x":["тест"]}', 'from complex encoded string 1');
    equal(decode('x[][]=%D1%82%D0%B5%D1%81%D1%82'), '{"x":[["тест"]]}', 'from complex encoded string 2');
    equal(decode('x[][]=1&x[][]=%D1%82%D0%B5%D1%81%D1%82&x[]=3&x[]=4'), '{"x":[[1],["тест"],3,4]}', 'from complex encoded string 3');
    equal(decode('x[a][b]=1&x[a][]=%D1%82%D0%B5%D1%81%D1%82&x[]=3&x[]=4'), '{"x":{"0":3,"1":4,"a":{"0":"тест","b":1}}}', 'from complex encoded string 3');
});

test('toQueryString', function () {
    var encode = function (str, encode) {
        return xs.request.Request.toQueryString(str, encode);
    };
    //encode simples
    equal(encode(), '', 'from empty args');
    equal(encode([]), '', 'from empty array');
    equal(encode({}), '', 'from empty hash');
    //encode simple object
    equal(encode({x: ''}), 'x=', 'from simple string without value 1');
    equal(encode({x: '', y: ''}), 'x=&y=', 'from simple string without value 2');
    equal(encode({x: 'тест', y: '25tsdf^*^fsdf`"'}), 'x=тест&y=25tsdf^*^fsdf`"', 'from simple string without value 2');
    //encode simple object with URIencode
    equal(encode({x: 'тест', y: '25tsdf^*^fsdf`"'}, true), 'x=%D1%82%D0%B5%D1%81%D1%82&y=25tsdf%5E*%5Efsdf%60%22', 'from simple string without value 2');
    //encode complex objects
    equal(encode({x: []}), 'x=', 'from complex string without value 1');
    equal(encode({x: [
        []
    ]}), 'x[0]=', 'from complex string without value 1');
    equal(encode({x: [
        [1, 2],
        3,
        4
    ]}), 'x[0][0]=1&x[0][1]=2&x[1]=3&x[2]=4', 'from complex string without value 2');
    //encode complex objects with URIencode
    equal(encode({x: ['тест']}), 'x[0]=тест', 'from complex string without value 1');
    equal(encode({x: ['тест']}, true), 'x[0]=%D1%82%D0%B5%D1%81%D1%82', 'from complex string without value 1');
    equal(encode({x: {'тест': 'тест'}}), 'x[тест]=тест', 'from complex string without value 1');
    equal(encode({x: {'тест': 'тест'}}, true), 'x[%D1%82%D0%B5%D1%81%D1%82]=%D1%82%D0%B5%D1%81%D1%82', 'from complex string without value 1');
    equal(encode({x: [
        [],
        'тест'
    ]}, true), 'x[0]=&x[1]=%D1%82%D0%B5%D1%81%D1%82', 'from complex string without value 1');
    equal(encode({x: [
        [1, 'тест'],
        3,
        4
    ]}, true), 'x[0][0]=1&x[0][1]=%D1%82%D0%B5%D1%81%D1%82&x[1]=3&x[2]=4', 'from complex string without value 2');
});
test('constructor', function () {
    //test constructor without any params
    //test constructor with all params
    equal(true, true, '');
});
//test('method', function () {
//
//    equal(true, true, '');
//});
//test('url', function () {
//
//    equal(true, true, '');
//});
//test('params', function () {
//
//    equal(true, true, '');
//});
//test('user', function () {
//
//    equal(true, true, '');
//});
//test('password', function () {
//
//    equal(true, true, '');
//});
//test('async', function () {
//
//    equal(true, true, '');
//});
//test('credentials', function () {
//
//    equal(true, true, '');
//});
//test('headers', function () {
//
//    equal(true, true, '');
//});
//test('timeout', function () {
//
//    equal(true, true, '');
//});
//test('isXHr', function () {
//
//    equal(true, true, '');
//});
//test('deferred', function () {
//
//    equal(true, true, '');
//});
//test('postContentType', function () {
//
//    equal(true, true, '');
//});
//test('open', function () {
//    //test open in wrong mode
//    //test correct opened
//    equal(true, true, '');
//});
//test('send', function () {
//    //test send in wrong mode
//    //test send in correct mode
//    equal(true, true, '');
//});
//test('abort', function () {
//
//    equal(true, true, '');
//});
//test('loaded', function () {
//
//    equal(true, true, '');
//});
//test('timedout', function () {
//
//    equal(true, true, '');
//});
//test('aborted', function () {
//
//    equal(true, true, '');
//});
