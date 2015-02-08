/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var log = new xs.log.Logger('xs.class.postprocessors.asserter');

    /**
     * This postprocessor automatically creates and saves asserter instance for this class as Class.assert
     *
     * This is made to automatically create asserter instances, that use Class.label as category.
     *
     * Later, asserter can be accessed via self.assert
     *
     * @member xs.class.postprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property asserter
     */
    xs.class.postprocessors.add('asserter', function () {

        return true;
    }, function (Class) {
        log.trace(Class.label ? Class.label : 'undefined');

        Class.Error = function (message) {
            this.message = Class.label + '::' + message;
        };

        Class.Error.prototype = new Error();

        //assign asserter instance
        Class.assert = new xs.assert.Asserter(Class.log, Class.Error);
    });
})(window, 'xs');