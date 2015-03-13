/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.core.Asserter', function () {

    'use strict';

    test('equal', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.equal([], []);
        });

        //correct is silent
        assert.equal(1, 1);
    });

    test('ok', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.ok(1 === '1');
        });

        //correct is silent
        assert.ok(1 < 2);
    });

    test('not', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.not(1 === 1);
        });

        //correct is silent
        assert.not(1 === 2);
    });

    test('object', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.object([]);
        });

        //correct is silent
        assert.object({});
    });

    test('array', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.array({});
        });

        //correct is silent
        assert.array([]);
    });

    test('fn', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.fn([]);
        });

        //correct is silent
        assert.fn(xs.noop);
    });

    test('string', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.string([]);
        });

        //correct is silent
        assert.string('');
    });

    test('number', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.number('1');
        });

        //correct is silent
        assert.number(1);
    });

    test('boolean', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.boolean(undefined);
        });

        //correct is silent
        assert.boolean(true);
    });

    test('regExp', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.regExp([]);
        });

        //correct is silent
        assert.regExp(/1/);
    });

    test('error', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.error([]);
        });

        //correct is silent
        assert.error(new Error);
    });

    test('null', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.null(undefined);
        });

        //correct is silent
        assert.null(null);
    });

    test('iterable', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.iterable(null);
        });

        //correct is silent
        assert.iterable({});
    });

    test('primitive', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.primitive([]);
        });

        //correct is silent
        assert.primitive(1);
    });

    test('numeric', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.numeric('a');
        });

        //correct is silent
        assert.numeric('1e-1');
    });

    test('defined', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.defined(undefined);
        });

        //correct is silent
        assert.defined(null);
    });

    test('empty', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.empty([1]);
        });

        //correct is silent
        assert.empty({});
    });

    test('Class', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.Class(xs.noop);
        });

        //correct is silent
        assert.Class(xs.Class(xs.noop));
    });

    test('Interface', function () {
        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.Class(xs.noop);
        });

        //correct is silent
        assert.Interface(xs.Interface(xs.noop));
    });

    test('instance', function () {
        var me = this;
        me.Class = xs.Class(function () {

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            assert.instance([], {});
        });

        //simple instance works nicely
        assert.instance([], Array);

        //correct is silent
        assert.instance(new me.Class(), me.Class);
    });

    test('implements', function () {
        var me = this;
        me.assert = new xs.core.Asserter(new xs.log.Logger('tests.core.Asserter'), Error);

        //incorrect throws
        throws(function () {
            me.assert.implements(xs.noop, xs.noop);
        });

        me.Class = xs.Class(function () {
            this.implements = ['xs.interface.Base'];
        }, me.done);

        return false;
    }, function () {
        var me = this;
        //correct is silent
        me.assert.implements(new me.Class(), xs.interface.Base);
    });

});