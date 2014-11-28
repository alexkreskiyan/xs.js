function speed ( fn, n ) {
    var start = Date.now();
    for ( var i = 0; i < n; i++ ) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
test('parse', function () {
    var url = xs.create('xs.uri.Url');
    var proto = 'https', host = 'mail.com', port = 80, path = 'asd/sdf/dsad', params = 'x=1', paramsStr = '{"x":1}', hash = 'xx.ssdas';
    //protocol-host-port-path-params-hash
    //000000 1
    url.fromString();
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //000001 2
    url.fromString('#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //000010 3
    url.fromString('?' + params);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //000011 4
    url.fromString('?' + params + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //000100 5
    url.fromString('/' + path);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //000101 6
    url.fromString('/' + path + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //000110 7
    url.fromString('/' + path + '?' + params);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //000111 8
    url.fromString('/' + path + '?' + params + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //001000 9
    url.fromString(':' + port);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, ':' + port, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //001001 10
    url.fromString(':' + port + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, ':' + port, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //001010 11
    url.fromString(':' + port + '?' + params);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, ':' + port, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //001011 12
    url.fromString(':' + port + '?' + params + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, ':' + port, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //001100 13
    url.fromString(':' + port + '/' + path);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, ':' + port + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //001101 14
    url.fromString(':' + port + '/' + path + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, ':' + port + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //001110 15
    url.fromString(':' + port + '/' + path + '?' + params);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, ':' + port + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //001111 16
    url.fromString(':' + port + '/' + path + '?' + params + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, ':' + port + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //010000 17
    url.fromString(host);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //010001 18
    url.fromString(host + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //010010 19
    url.fromString(host + '?' + params);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //010011 20
    url.fromString(host + '?' + params + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //010100 21
    url.fromString(host + '/' + path);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //010101 22
    url.fromString(host + '/' + path + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //010110 23
    url.fromString(host + '/' + path + '?' + params);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //010111 24
    url.fromString(host + '/' + path + '?' + params + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //011000 25
    url.fromString(host + ':' + port);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + ':' + port, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //011001 26
    url.fromString(host + ':' + port + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + ':' + port, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //011010 27
    url.fromString(host + ':' + port + '?' + params);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + ':' + port, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //011011 28
    url.fromString(host + ':' + port + '?' + params + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + ':' + port, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //011100 29
    url.fromString(host + ':' + port + '/' + path);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + ':' + port + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //011101 30
    url.fromString(host + ':' + port + '/' + path + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + ':' + port + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //011110 31
    url.fromString(host + ':' + port + '/' + path + '?' + params);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + ':' + port + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //011111 32
    url.fromString(host + ':' + port + '/' + path + '?' + params + '#' + hash);
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, host + ':' + port + '/' + path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //100000 33
    url.fromString(proto + '://');
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //100001 34
    url.fromString(proto + '://' + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //100010 35
    url.fromString(proto + '://' + '?' + params);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //100011 36
    url.fromString(proto + '://' + '?' + params + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //100100 37
    url.fromString(proto + '://' + '/' + path);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //100101 38
    url.fromString(proto + '://' + '/' + path + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //100110 39
    url.fromString(proto + '://' + '/' + path + '?' + params);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //100111 40
    url.fromString(proto + '://' + '/' + path + '?' + params + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //101000 41
    url.fromString(proto + '://' + ':' + port);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //101001 42
    url.fromString(proto + '://' + ':' + port + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //101010 43
    url.fromString(proto + '://' + ':' + port + '?' + params);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //101011 44
    url.fromString(proto + '://' + ':' + port + '?' + params + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //101100 45
    url.fromString(proto + '://' + ':' + port + '/' + path);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //101101 46
    url.fromString(proto + '://' + ':' + port + '/' + path + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //101110 47
    url.fromString(proto + '://' + ':' + port + '/' + path + '?' + params);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //101111 48
    url.fromString(proto + '://' + ':' + port + '/' + path + '?' + params + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, xs.location.host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //110000 49
    url.fromString(proto + '://' + host);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //110001 50
    url.fromString(proto + '://' + host + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //110010 51
    url.fromString(proto + '://' + host + '?' + params);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //110011 52
    url.fromString(proto + '://' + host + '?' + params + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //110100 53
    url.fromString(proto + '://' + host + '/' + path);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //110101 54
    url.fromString(proto + '://' + host + '/' + path + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //110110 55
    url.fromString(proto + '://' + host + '/' + path + '?' + params);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //110111 56
    url.fromString(proto + '://' + host + '/' + path + '?' + params + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //111000 57
    url.fromString(proto + '://' + host + ':' + port);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, port, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //111001 58
    url.fromString(proto + '://' + host + ':' + port + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, port, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //111010 59
    url.fromString(proto + '://' + host + ':' + port + '?' + params);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, port, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //111011 60
    url.fromString(proto + '://' + host + ':' + port + '?' + params + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, port, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
    //111100 61
    url.fromString(proto + '://' + host + ':' + port + '/' + path);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, port, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //111101 62
    url.fromString(proto + '://' + host + ':' + port + '/' + path + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, port, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, hash, 'hash');
    //111110 63
    url.fromString(proto + '://' + host + ':' + port + '/' + path + '?' + params);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, port, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, '', 'hash');
    //111111 64
    url.fromString(proto + '://' + host + ':' + port + '/' + path + '?' + params + '#' + hash);
    strictEqual(url.protocol, proto, 'protocol');
    strictEqual(url.host, host, 'host');
    strictEqual(url.port, port, 'port');
    strictEqual(url.path, path, 'path');
    strictEqual(JSON.stringify(url.params), paramsStr, 'params');
    strictEqual(url.hash, hash, 'hash');
});
test('constructor', function () {
    var url;
    //empty one
    url = xs.create('xs.uri.Url');
    strictEqual(url.protocol, null, 'protocol');
    strictEqual(url.host, '', 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, '', 'path');
    strictEqual(JSON.stringify(url.params), '{}', 'params');
    strictEqual(url.hash, '', 'hash');
    //via url
    url = xs.create('xs.uri.Url', {
        url: 'https://сайт.рф/тест?ф=б&x=y#фыв;;$$asd'
    });
    strictEqual(url.protocol, 'https', 'protocol');
    strictEqual(url.host, 'сайт.рф', 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, 'тест', 'path');
    strictEqual(JSON.stringify(url.params), '{"ф":"б","x":"y"}', 'params');
    strictEqual(url.hash, 'фыв;;$$asd', 'hash');
    //via config
    url = xs.create('xs.uri.Url', {
        protocol: 'http',
        host: 'сай2.рф',
        port: 88,
        path: 'тестовый',
        params: {
            ф: 'ыв',
            x: 'asd'
        },
        hash: 'йхуу;;$$asd'
    });
    strictEqual(url.protocol, 'http', 'protocol');
    strictEqual(url.host, 'сай2.рф', 'host');
    strictEqual(url.port, 88, 'port');
    strictEqual(url.path, 'тестовый', 'path');
    strictEqual(JSON.stringify(url.params), '{"ф":"ыв","x":"asd"}', 'params');
    strictEqual(url.hash, 'йхуу;;$$asd', 'hash');
    //both
    url = xs.create('xs.uri.Url', {
        url: 'https://сайт.рф/тест?ф=б&x=y#фыв;;$$asd',
        protocol: 'http',
        host: 'сай2.рф',
        port: 88,
        path: 'тестовый',
        params: {
            ф: 'ыв',
            x: 'asd'
        },
        hash: 'йхуу;;$$asd'
    });
    strictEqual(url.protocol, 'https', 'protocol');
    strictEqual(url.host, 'сайт.рф', 'host');
    strictEqual(url.port, null, 'port');
    strictEqual(url.path, 'тест', 'path');
    strictEqual(JSON.stringify(url.params), '{"ф":"б","x":"y"}', 'params');
    strictEqual(url.hash, 'фыв;;$$asd', 'hash');
});
test('protocol', function () {
    var url = xs.create('xs.uri.Url');
    strictEqual(url.protocol, null, 'empty by default');
    url.protocol = 'https';
    strictEqual(url.protocol, 'https', 'correct value set');
    url.protocol = 'httpd';
    strictEqual(url.protocol, 'https', 'incorrect value ignored');
});
test('host', function () {
    var url = xs.create('xs.uri.Url');
    strictEqual(url.host, '', 'empty by default');
    url.host = 'his';
    strictEqual(url.host, 'his', 'correct value set');
    url.host = {};
    strictEqual(url.host, 'his', 'incorrect value ignored');
});
test('port', function () {
    var url = xs.create('xs.uri.Url');
    strictEqual(url.port, null, 'empty by default');
    url.port = 8080;
    strictEqual(url.port, 8080, 'correct value set');
    url.port = 'httpd';
    strictEqual(url.port, 8080, 'incorrect value ignored');
});
test('path', function () {
    var url = xs.create('xs.uri.Url');
    strictEqual(url.path, '', 'empty by default');
    url.path = 'asd';
    strictEqual(url.path, 'asd', 'correct value set');
    url.path = {};
    strictEqual(url.path, 'asd', 'incorrect value ignored');
});
test('params', function () {
    var url = xs.create('xs.uri.Url');
    strictEqual(JSON.stringify(url.params), '{}', 'empty by default');
    url.params = {x: 1};
    strictEqual(JSON.stringify(url.params), '{"x":1}', 'correct value set');
    url.params = [];
    strictEqual(JSON.stringify(url.params), '{"x":1}', 'incorrect value ignored');
});
test('hash', function () {
    var url = xs.create('xs.uri.Url');
    strictEqual(url.hash, '', 'empty by default');
    url.hash = 'asd';
    strictEqual(url.hash, 'asd', 'correct value set');
    url.hash = {};
    strictEqual(url.hash, 'asd', 'incorrect value ignored');
});