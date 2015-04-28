/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.uri.HTTP', function () {

    'use strict';

    test('constructor', function () {
        var url;

        //empty one
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        strictEqual(url.scheme, undefined);
        strictEqual(url.host, undefined);
        strictEqual(url.port, undefined);
        strictEqual(url.path, '');
        strictEqual(url.query.toString(), '');
        strictEqual(url.hash, undefined);

        //via url
        url = new xs.uri.HTTP('https://сайт.рф/тест?ф=б&x=y#фыв;;$$asd', xs.uri.query.QueryString);
        strictEqual(url.scheme, 'https');
        strictEqual(url.host, 'сайт.рф');
        strictEqual(url.port, undefined);
        strictEqual(url.path, '/тест');
        strictEqual(JSON.stringify(url.query.params), '{"ф":"б","x":"y"}');
        strictEqual(url.hash, 'фыв;;$$asd', 'hash');
    });

    test('scheme', function () {
        var url = new xs.uri.HTTP(xs.uri.query.QueryString);
        strictEqual(url.scheme, undefined);

        //test non-string
        throws(function () {
            url.scheme = null;
        });

        //test unsupported
        throws(function () {
            url.scheme = 'ftp';
        });

        //test correct value
        url.scheme = 'https';
        strictEqual(url.scheme, 'https');
    });

    test('user', function () {
        var url = new xs.uri.HTTP(xs.uri.query.QueryString);

        //test non-string
        throws(function () {
            url.user = null;
        });

        //test incorrect user
        throws(function () {
            url.user = 'name@';
        });

        //test correct behavior
        strictEqual(url.user, undefined);
        url.user = 'name';
        strictEqual(url.user, 'name');
        url.user = undefined;
        strictEqual(url.user, undefined);
    });

    test('host', function () {
        var url = new xs.uri.HTTP(xs.uri.query.QueryString);

        //test non-string
        throws(function () {
            url.host = null;
        });

        //test incorrect host
        throws(function () {
            url.host = 'xs.js/';
        });

        //test correct behavior
        strictEqual(url.host, undefined);
        url.host = 'xs.js';
        strictEqual(url.host, 'xs.js');
        url.host = undefined;
        strictEqual(url.host, undefined);
    });

    test('port', function () {
        var url = new xs.uri.HTTP(xs.uri.query.QueryString);

        //test non-number
        throws(function () {
            url.port = null;
        });

        //test correct behavior
        strictEqual(url.port, undefined);
        url.port = 1;
        strictEqual(url.port, 1);
        url.port = undefined;
        strictEqual(url.port, undefined);
    });

    test('path', function () {
        var url = new xs.uri.HTTP(xs.uri.query.QueryString);

        //test non-string
        throws(function () {
            url.path = null;
        });

        //test incorrect host
        throws(function () {
            url.path = '/?';
        });

        //test correct behavior
        strictEqual(url.path, '');
        url.path = '/some/path.txt';
        strictEqual(url.path, '/some/path.txt');
        url.path = '';
        strictEqual(url.path, '');
    });

    test('query', function () {
        var url = new xs.uri.HTTP(xs.uri.query.QueryString);

        //test incorrect
        throws(function () {
            url.query = null;
        });

        //test correct behavior
        strictEqual(Object.keys(url.query.params).length, 0);
        url.query.params = {
            a: 1
        };
        strictEqual(url.query.toString(), 'a=1');
    });

    test('hash', function () {
        var url = new xs.uri.HTTP(xs.uri.query.QueryString);

        //test non-string
        throws(function () {
            url.hash = null;
        });

        //test correct behavior
        strictEqual(url.hash, undefined);
        url.hash = '#a';
        strictEqual(url.hash, '#a');
        url.hash = undefined;
        strictEqual(url.hash, undefined);
    });

    test('toString', function () {
        var url;

        //
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        strictEqual(url.toString(), '');

        //port
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.port = 80;
        strictEqual(url.toString(), '');

        //host
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.host = 'xs.js';
        strictEqual(url.toString(), url.host);

        //host,port
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.host = 'xs.js';
        url.port = 80;
        strictEqual(url.toString(), url.host + ':' + url.port);

        //user
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.user = 'name';
        strictEqual(url.toString(), '');

        //user,port
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.user = 'name';
        url.port = 80;
        strictEqual(url.toString(), '');

        //user,host
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.user = 'name';
        url.host = 'xs.js';
        strictEqual(url.toString(), url.user + '@' + url.host);

        //user,host,port
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.user = 'name';
        url.host = 'xs.js';
        url.port = 80;
        strictEqual(url.toString(), url.user + '@' + url.host + ':' + url.port);

        //scheme
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.scheme = 'http';
        strictEqual(url.toString(), '');

        //scheme,port
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.scheme = 'http';
        url.port = 80;
        strictEqual(url.toString(), '');

        //scheme,host
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.scheme = 'http';
        url.host = 'xs.js';
        strictEqual(url.toString(), url.scheme + '://' + url.host);

        //scheme,host,port
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.scheme = 'http';
        url.host = 'xs.js';
        url.port = 80;
        strictEqual(url.toString(), url.scheme + '://' + url.host + ':' + url.port);

        //scheme,user
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.scheme = 'http';
        url.user = 'name';
        strictEqual(url.toString(), '');

        //scheme,user,port
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.scheme = 'http';
        url.user = 'name';
        url.port = 80;
        strictEqual(url.toString(), '');

        //scheme,user,host
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.scheme = 'http';
        url.user = 'name';
        url.host = 'xs.js';
        strictEqual(url.toString(), url.scheme + '://' + url.user + '@' + url.host);

        //scheme,user,host,port
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.scheme = 'http';
        url.user = 'name';
        url.host = 'xs.js';
        url.port = 80;
        strictEqual(url.toString(), url.scheme + '://' + url.user + '@' + url.host + ':' + url.port);

        //
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        strictEqual(url.toString(), '');

        //hash
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.hash = 'anchor';
        strictEqual(url.toString(), '');

        //query
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.query.params = {
            a: 1
        };
        strictEqual(url.toString(), '');

        //query,hash
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.query.params = {
            a: 1
        };
        url.hash = 'anchor';
        strictEqual(url.toString(), '');

        //path,
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.path = '/go';
        strictEqual(url.toString(), url.path);

        //path,hash
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.path = '/go';
        url.hash = 'anchor';
        strictEqual(url.toString(), url.path + '#' + url.hash);

        //path,query
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.path = '/go';
        url.query.params = {
            a: 1
        };
        strictEqual(url.toString(), url.path + '?' + url.query.toString());

        //path,query,hash
        url = new xs.uri.HTTP(xs.uri.query.QueryString);
        url.path = '/go';
        url.query.params = {
            a: 1
        };
        url.hash = 'anchor';
        strictEqual(url.toString(), url.path + '?' + url.query.toString() + '#' + url.hash);
    });

});