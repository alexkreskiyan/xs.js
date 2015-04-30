/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.lang.Function', function () {

    'use strict';

    test('bind', function () {
        throws(function () {
            xs.bind([]);
        });

        //init test function
        var fn = function (a, b, c) {
            return this.x + (a - b) * c;
        };

        //get bind
        var binded = xs.bind(fn, {
            x: 5
        });

        //check bind
        strictEqual(binded(2, 3, 4), 5 + (2 - 3) * 4);
    });

    test('memorize', function () {
        throws(function () {
            xs.memorize([]);
        });

        //init memorized function
        var fn = function (obj) {
            obj.x++;
        };
        //init scope
        var obj = {
            x: 1
        };

        //get memorized function
        var one = xs.memorize(fn);

        //test memorize
        one(obj);
        strictEqual(obj.x, 2);
        one(obj);
        strictEqual(obj.x, 2);
    });

    test('wrap', function () {
        throws(function () {
            xs.wrap([]);
        });

        throws(function () {
            xs.wrap(function () {
            }, null);
        });

        //init wrapped function
        var fn = function (val) {
            return 2 * val;
        };

        //get wrapped
        var wrapped = xs.wrap(fn, function (func, a, b, c) {
            return this.x + a + func(b) + c;
        }, {
            x: 1
        });

        //test wrapped
        strictEqual(wrapped(1, 2, 3), 9);
    });

    test('getName', function () {
        throws(function () {
            xs.Function.getName([]);
        });

        //test anonymous function
        strictEqual(xs.Function.getName(function () {
        }), '');

        //test named function
        strictEqual(xs.Function.getName(function demo123Asd() {
        }), 'demo123Asd');
    });

    test('getArguments', function () {
        throws(function () {
            xs.Function.getArguments([]);
        });

        //test empty arguments
        strictEqual(xs.Function.getArguments(function () {
        }).toString(), '');

        //test arguments
        strictEqual(xs.Function.getArguments(function demo123Asd(demo123AsD, asd123ASD) {
        }).toString(), 'demo123AsD,asd123ASD');
    });

    test('getBody', function () {
        throws(function () {
            xs.Function.getBody([]);
        });

        //test empty body
        strictEqual(xs.Function.getBody(function () {
            'use strict';
        }).trim(), '\'use strict\';');

        //test named function
        strictEqual(xs.Function.getBody(function demo123Asd(demo123AsD, asd123ASD) {
            'use strict';

            return demo123AsD + asd123ASD;
        }).trim(), '\'use strict\';' + (xs.isWindows ? '\r\n\r\n' : '\n\n') + '            return demo123AsD + asd123ASD;');
    });

    test('parse', function () {
        throws(function () {
            xs.Function.parse([]);
        });

        //get parse data
        var data = xs.Function.parse(function demo123Asd(demo123AsD, asd123ASD) {
            'use strict';

            return demo123AsD + asd123ASD;
        });

        //test parsing results
        strictEqual(data.name, 'demo123Asd');
        strictEqual(data.args.toString(), 'demo123AsD,asd123ASD');
        strictEqual(data.body.trim(), '\'use strict\';' + (xs.isWindows ? '\r\n\r\n' : '\n\n') + '            return demo123AsD + asd123ASD;');
    });

});