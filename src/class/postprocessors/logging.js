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

    var logger = new xs.log.Logger('xs.class.postprocessors.logging');

    /**
     * This postprocessor automatically creates and saves logger instance for this class as Class.log
     *
     * This is made to automatically create logging instances, that use Class.label as category.
     *
     * Later, logger can be accessed via self.label
     *
     * @member xs.class.postprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property logging
     */
    xs.class.postprocessors.add('logging', function () {

        return true;
    }, function (Class) {
        logger.trace(Class.label ? Class.label : 'undefined');

        //assign logger instance
        Class.log = new xs.log.Logger(Class.label ? Class.label : 'undefined');
    });
})(window, 'xs');