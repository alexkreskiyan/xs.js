/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.assert', function () {

    'use strict';

    test('equal', function () {
        //incorrect throws
        throws(function () {
            xs.assert.equal([], []);
        });

        //correct is silent
        xs.assert.equal(1, 1);
    });

    test('ok', function () {
        //incorrect throws
        throws(function () {
            xs.assert.ok(1 === '1');
        });

        //correct is silent
        xs.assert.ok(1 < 2);
    });

    test('not', function () {
        //incorrect throws
        throws(function () {
            xs.assert.not(1 === 1);
        });

        //correct is silent
        xs.assert.not(1 === 2);
    });

    test('object', function () {
        //incorrect throws
        throws(function () {
            xs.assert.object([]);
        });

        //correct is silent
        xs.assert.object({});
    });

    test('array', function () {
        //incorrect throws
        throws(function () {
            xs.assert.array({});
        });

        //correct is silent
        xs.assert.array([]);
    });

    test('fn', function () {
        //incorrect throws
        throws(function () {
            xs.assert.fn([]);
        });

        //correct is silent
        xs.assert.fn(xs.emptyFn);
    });

    test('string', function () {
        //incorrect throws
        throws(function () {
            xs.assert.string([]);
        });

        //correct is silent
        xs.assert.string('');
    });

    test('number', function () {
        //incorrect throws
        throws(function () {
            xs.assert.number('1');
        });

        //correct is silent
        xs.assert.number(1);
    });

    test('boolean', function () {
        //incorrect throws
        throws(function () {
            xs.assert.boolean(undefined);
        });

        //correct is silent
        xs.assert.boolean(true);
    });

    test('regExp', function () {
        //incorrect throws
        throws(function () {
            xs.assert.regExp([]);
        });

        //correct is silent
        xs.assert.regExp(/1/);
    });

    test('error', function () {
        //incorrect throws
        throws(function () {
            xs.assert.error([]);
        });

        //correct is silent
        xs.assert.error(new Error);
    });

    test('null', function () {
        //incorrect throws
        throws(function () {
            xs.assert.null(undefined);
        });

        //correct is silent
        xs.assert.null(null);
    });

    test('iterable', function () {
        //incorrect throws
        throws(function () {
            xs.assert.iterable(null);
        });

        //correct is silent
        xs.assert.iterable({});
    });

    test('primitive', function () {
        //incorrect throws
        throws(function () {
            xs.assert.primitive([]);
        });

        //correct is silent
        xs.assert.primitive(1);
    });

    test('numeric', function () {
        //incorrect throws
        throws(function () {
            xs.assert.numeric('a');
        });

        //correct is silent
        xs.assert.numeric('1e-1');
    });

    test('defined', function () {
        //incorrect throws
        throws(function () {
            xs.assert.defined(undefined);
        });

        //correct is silent
        xs.assert.defined(null);
    });

    test('empty', function () {
        //incorrect throws
        throws(function () {
            xs.assert.empty([1]);
        });

        //correct is silent
        xs.assert.empty({});
    });

    test('Class', function () {
        //incorrect throws
        throws(function () {
            xs.assert.Class(xs.emptyFn);
        });

        //correct is silent
        xs.assert.Class(xs.Class(xs.emptyFn));
    });

    test('Interface', function () {
        //incorrect throws
        throws(function () {
            xs.assert.Class(xs.emptyFn);
        });

        //correct is silent
        xs.assert.Interface(xs.Interface(xs.emptyFn));
    });

    test('instance', function () {
        //incorrect throws
        throws(function () {
            xs.assert.instance([], {});
        });

        //correct is silent
        xs.assert.instance([], Array);
    });

    test('inherits', function () {
        var me = this;
        //incorrect throws
        throws(function () {
            xs.assert.inherits(xs.emptyFn, xs.emptyFn);
        });

        me.Class = xs.Class(xs.emptyFn, me.done);

        return false;
    }, function () {
        var me = this;
        //correct is silent
        xs.assert.inherits(me.Class, xs.class.Base);
    });

    test('implements', function () {
        var me = this;
        //incorrect throws
        throws(function () {
            xs.assert.implements(xs.emptyFn, xs.emptyFn);
        });

        me.Class = xs.Class(function () {
            this.implements = ['xs.interface.Base'];
        }, me.done);

        return false;
    }, function () {
        var me = this;
        //correct is silent
        xs.assert.implements(me.Class, xs.interface.Base);
    });

    test('mixins', function () {
        var me = this;
        //incorrect throws
        throws(function () {
            xs.assert.mixins(xs.emptyFn, xs.emptyFn);
        });

        me.Class = xs.Class(function () {
            this.mixins.base = 'xs.class.Base';
        }, me.done);

        return false;
    }, function () {
        var me = this;
        //correct is silent
        xs.assert.mixins(me.Class, xs.class.Base);
    });
});