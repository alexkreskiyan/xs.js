function speed ( fn, n ) {
    var start = Date.now();
    for ( var i = 0; i < n; i++ ) {
        fn();
    }
    var duration = Date.now() - start;
    console.log( 'duration: ', duration, 'ms for ', n, 'operations' );
    console.log( 'median: ', duration / n, 'ms per operation' );
    console.log( 'mark: about', n / duration, 'operation per ms' );
}
module( 'xs.request.Request' );
test( 'fromQueryString', function () {
    var decode = function ( str ) {
        return JSON.stringify( xs.request.Request.fromQueryString( str ) );
    };
    //decode empty string
    strictEqual( decode(), '{}', 'from empty args' );
    strictEqual( decode( '' ), '{}', 'from empty string' );
    //decode simple string
    strictEqual( decode( 'x' ), '{"x":""}', 'from simple string without value 1' );
    strictEqual( decode( 'x&y' ), '{"x":"","y":""}', 'from simple string without value 2' );
    strictEqual( decode( 'x=тест&y=25tsdf^*^fsdf`"' ), '{"x":"тест","y":"25tsdf^*^fsdf`\\""}', 'from simple string without value 2' );
    //decode simple encoded string
    strictEqual( decode( 'x=%D1%82%D0%B5%D1%81%D1%82&y=25tsdf%5E%26*%5E%26fsdf%60%22' ), '{"x":"тест","y":"25tsdf^&*^&fsdf`\\""}', 'from simple encoded string' );
    //decode complex string
    strictEqual( decode( 'x[]' ), '{"x":[""]}', 'from complex string without value 1' );
    strictEqual( decode( 'x[][]' ), '{"x":[[""]]}', 'from complex string without value 2' );
    strictEqual( decode( 'x[][]=1&x[][]=2&x[]=3&x[]=4' ), '{"x":[[1],[2],3,4]}', 'from complex string without value 2' );
    //decode complex encoded string
    strictEqual( decode( 'x[]=%D1%82%D0%B5%D1%81%D1%82' ), '{"x":["тест"]}', 'from complex encoded string 1' );
    strictEqual( decode( 'x[][]=%D1%82%D0%B5%D1%81%D1%82' ), '{"x":[["тест"]]}', 'from complex encoded string 2' );
    strictEqual( decode( 'x[][]=1&x[][]=%D1%82%D0%B5%D1%81%D1%82&x[]=3&x[]=4' ), '{"x":[[1],["тест"],3,4]}', 'from complex encoded string 3' );
    strictEqual( decode( 'x[a][b]=1&x[a][]=%D1%82%D0%B5%D1%81%D1%82&x[]=3&x[]=4' ), '{"x":{"0":3,"1":4,"a":{"0":"тест","b":1}}}', 'from complex encoded string 3' );
} );

test( 'toQueryString', function () {
    var encode = function ( str, encode ) {
        return xs.request.Request.toQueryString( str, encode );
    };
    //encode simples
    strictEqual( encode(), '', 'from empty args' );
    strictEqual( encode( [] ), '', 'from empty array' );
    strictEqual( encode( {} ), '', 'from empty hash' );
    //encode simple object
    strictEqual( encode( {x: ''} ), 'x=', 'from simple string without value 1' );
    strictEqual( encode( {x: '', y: ''} ), 'x=&y=', 'from simple string without value 2' );
    strictEqual( encode( {x: 'тест', y: '25tsdf^*^fsdf`"'} ), 'x=тест&y=25tsdf^*^fsdf`"', 'from simple string without value 2' );
    //encode simple object with URIencode
    strictEqual( encode( {x: 'тест', y: '25tsdf^*^fsdf`"'}, true ), 'x=%D1%82%D0%B5%D1%81%D1%82&y=25tsdf%5E*%5Efsdf%60%22', 'from simple string without value 2' );
    //encode complex objects
    strictEqual( encode( {x: []} ), 'x=', 'from complex string without value 1' );
    strictEqual( encode( {x: [
        []
    ]} ), 'x[0]=', 'from complex string without value 1' );
    strictEqual( encode( {x: [
        [
            1,
            2
        ],
        3,
        4
    ]} ), 'x[0][0]=1&x[0][1]=2&x[1]=3&x[2]=4', 'from complex string without value 2' );
    //encode complex objects with URIencode
    strictEqual( encode( {x: ['тест']} ), 'x[0]=тест', 'from complex string without value 1' );
    strictEqual( encode( {x: ['тест']}, true ), 'x[0]=%D1%82%D0%B5%D1%81%D1%82', 'from complex string without value 1' );
    strictEqual( encode( {x: {'тест': 'тест'}} ), 'x[тест]=тест', 'from complex string without value 1' );
    strictEqual( encode( {x: {'тест': 'тест'}}, true ), 'x[%D1%82%D0%B5%D1%81%D1%82]=%D1%82%D0%B5%D1%81%D1%82', 'from complex string without value 1' );
    strictEqual( encode( {x: [
        [],
        'тест'
    ]}, true ), 'x[0]=&x[1]=%D1%82%D0%B5%D1%81%D1%82', 'from complex string without value 1' );
    strictEqual( encode( {x: [
        [
            1,
            'тест'
        ],
        3,
        4
    ]}, true ), 'x[0][0]=1&x[0][1]=%D1%82%D0%B5%D1%81%D1%82&x[1]=3&x[2]=4', 'from complex string without value 2' );
} );
test( 'constructor', function () {
    var req;
    var loc = xs.location;
    //test constructor without any params
    req = xs.create( 'xs.request.Request' );
    //url
    strictEqual( xs.is( req.url, xs.uri.Url ), true, 'default url created' );
    strictEqual( req.url.toString(), loc.protocol + '//' + loc.host + (loc.port ? ':' + loc.port : '') + loc.pathname +
        loc.hash, 'current url assigned' );
    //method
    strictEqual( req.method, 'get', 'default method set' );
    //params
    strictEqual( JSON.stringify( req.params ), '{}', 'default params set' );
    //user
    strictEqual( req.user, null, 'default user set' );
    //password
    strictEqual( req.password, null, 'default password set' );
    //async
    strictEqual( req.async, true, 'default async set' );
    //credentials
    strictEqual( req.credentials, false, 'default credentials set' );
    //headers
    strictEqual( JSON.stringify( req.headers ), '{}', 'default headers set' );
    //timeout
    strictEqual( req.timeout, 30000, 'default timeout set' );
    //isCrossDomain
    strictEqual( req.isCrossDomain, false, 'default isCrossDomain set' );
    //isXhr
    strictEqual( req.isXhr, true, 'default isXhr set' );
    //postContentType
    strictEqual( req.postContentType, xs.request.Request.descriptor.properties.postContentType.default, 'default postContentType set' );
    //test constructor with all params
    //test constructor without any params
    var p = {
        url: 'https://тест.me/com/[a=1]/?x=1#asd',
        reqUrl: 'https://тест.me/com/[a=1]/#asd',
        method: 'post',
        params: {x: 3},
        user: 'alex',
        password: 'lord',
        async: false,
        credentials: true,
        headers: {
            'Custom-header': 'Custom-header-value'
        },
        timeout: 500,
        isCrossDomain: true,
        isXhr: !(xs.isIE && xs.browser.major <= 9),
        postContentType: 'application/x-www-form-urlencoded'
    };
    req = xs.create( 'xs.request.Request', p );
    //url
    strictEqual( xs.is( req.url, xs.uri.Url ), true, 'url created' );
    strictEqual( req.url.toString(), p.reqUrl, 'url correctly assigned' );
    //method
    strictEqual( req.method, p.method, 'correct method set' );
    //params
    strictEqual( JSON.stringify( req.params ), JSON.stringify( p.params ), 'correct params set' );
    //user
    strictEqual( req.user, p.user, 'correct user set' );
    //password
    strictEqual( req.password, p.password, 'correct password set' );
    //async
    strictEqual( req.async, p.async, 'correct async set' );
    //credentials
    strictEqual( req.credentials, p.credentials, 'correct credentials set' );
    //headers
    strictEqual( JSON.stringify( req.headers ), JSON.stringify( p.headers ), 'correct headers set' );
    //timeout
    strictEqual( req.timeout, p.timeout, 'correct timeout set' );
    //isCrossDomain
    strictEqual( req.isCrossDomain, p.isCrossDomain, 'correct isCrossDomain set' );
    //isXhr
    strictEqual( req.isXhr, p.isXhr, 'correct isXhr set' );
    //postContentType
    strictEqual( req.postContentType, p.postContentType, 'correct postContentType set' );
} );
test( 'method', function () {
    var req = xs.create( 'xs.request.Request' );
    strictEqual( req.method, 'get', 'empty by default' );
    req.method = 'post';
    strictEqual( req.method, 'post', 'correct value set' );
    req.method = 'psot';
    strictEqual( req.method, 'post', 'incorrect value ignored' );
} );
test( 'url', function () {
    var loc = xs.location;
    var req = xs.create( 'xs.request.Request' );
    req.url = 'demo?x';
    strictEqual( req.url.toString(), loc.protocol + '//' + loc.host + (loc.port ? ':' + loc.port : '') +
        '/demo?x=', 'correct value set' );
    req.url = null;
    strictEqual( req.url.toString(), loc.protocol + '//' + loc.host + (loc.port ? ':' + loc.port : '') + loc.pathname +
        '?x=' + loc.hash, 'incorrect value ignored' );
} );
test( 'params', function () {
    var req = xs.create( 'xs.request.Request' );
    strictEqual( JSON.stringify( req.params ), '{}', 'empty by default' );
    req.params = {x: 1};
    strictEqual( JSON.stringify( req.params ), '{"x":1}', 'correct value set' );
    req.params = 'psot';
    strictEqual( JSON.stringify( req.params ), '{"x":1}', 'incorrect value ignored' );
} );
test( 'user', function () {
    var req = xs.create( 'xs.request.Request' );
    strictEqual( req.user, null, 'empty by default' );
    req.user = 'alex';
    strictEqual( req.user, 'alex', 'correct value set' );
    req.user = {};
    strictEqual( req.user, 'alex', 'incorrect value ignored' );
    req.user = null;
    strictEqual( req.user, null, 'correct value set' );
} );
test( 'password', function () {
    var req = xs.create( 'xs.request.Request' );
    strictEqual( req.password, null, 'empty by default' );
    req.password = 'alex';
    strictEqual( req.password, 'alex', 'correct value set' );
    req.password = {};
    strictEqual( req.password, 'alex', 'incorrect value ignored' );
    req.password = null;
    strictEqual( req.password, null, 'correct value set' );
} );
test( 'async', function () {
    var req = xs.create( 'xs.request.Request' );
    strictEqual( req.async, true, 'empty by default' );
    req.async = '';
    strictEqual( req.async, false, 'correct value set' );
    req.async = 'psot';
    strictEqual( req.async, true, 'correct value set' );
} );
test( 'credentials', function () {
    var req = xs.create( 'xs.request.Request' );
    strictEqual( req.credentials, false, 'empty by default' );
    req.credentials = '1';
    strictEqual( req.credentials, true, 'correct value set' );
    req.credentials = '';
    strictEqual( req.credentials, false, 'correct value set' );
} );
test( 'headers', function () {
    var req = xs.create( 'xs.request.Request' );
    strictEqual( JSON.stringify( req.headers ), '{}', 'empty by default' );
    req.headers = {x: 1};
    strictEqual( JSON.stringify( req.headers ), '{"x":1}', 'correct value set' );
    req.headers = 'psot';
    strictEqual( JSON.stringify( req.headers ), '{"x":1}', 'incorrect value ignored' );
} );
test( 'timeout', function () {
    var req = xs.create( 'xs.request.Request' );
    strictEqual( req.timeout, 30000, 'empty by default' );
    req.timeout = '1';
    strictEqual( req.timeout, 1, 'correct value set' );
    req.timeout = '';
    strictEqual( req.timeout, 1, 'correct value set' );
} );
//test('open', function () {
//    //test open in wrong mode
//    //test correct opened
//    strictEqual(true, true, '');
//});
//test('send', function () {
//    //test send in wrong mode
//    //test send in correct mode
//    strictEqual(true, true, '');
//});
//test('abort', function () {
//
//    strictEqual(true, true, '');
//});
//test('loaded', function () {
//
//    strictEqual(true, true, '');
//});
//test('timedout', function () {
//
//    strictEqual(true, true, '');
//});
//test('aborted', function () {
//
//    strictEqual(true, true, '');
//});
var sendReq = function () {
    var req = xs.create( 'xs.request.Request', {
        url: 'http://localhost:3001/data?x=1&y=2#123'
    } );
    req.send();
};