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

    var log = new xs.log.Logger('xs.class.preprocessors.abstract');

    /**
     * Directive abstract
     *
     * Is used to mark class as abstract. Abstract class can not be instantiated.
     *
     * Possible use cases are:
     *
     * - Single-like object, that has only static properties/methods
     * - Abstract base class for group of some similar classes
     * - Mixin class. Usually, mixins are desired to be abstract ones
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.mixins.CanBuy', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.namespace = 'app.start.login';
     *
     *         this.abstract = true; //Typical mixin class is specified as abstract
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property abstract
     */
    xs.class.preprocessors.add('abstract', function () {

        return true;
    }, function (Class, descriptor) {
        log.trace(Class.label ? Class.label : 'undefined');
        Class.descriptor.abstract = Boolean(descriptor.abstract);
    });

})(window, 'xs');