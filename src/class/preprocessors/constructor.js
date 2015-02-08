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

    var log = new xs.log.Logger('xs.class.preprocessors.constructor');

    var assert = new xs.assert.Asserter(log, ConstructorError);

    /**
     * Directive constructor
     *
     * Is used to declare class instance constructor
     *
     * Constructor is used to make some work under created object after framework's internal constructor has finished it's work.
     * That way, this element is optional. If you miss it, simply nothing will be done with created class instance
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.constructor = function(message) {
     *             console.log('created!');
     *         };
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property constructor
     */
    xs.class.preprocessors.add('constructor', function () {

        return true;
    }, function (Class, descriptor) {

        log.trace(Class.label ? Class.label : 'undefined');

        //inherited
        //get inherited constructor from parent descriptor
        var inherited = Class.parent.descriptor.hasOwnProperty('constructor') ? Class.parent.descriptor.constructor : undefined;


        //own
        //get own constructor from raw descriptor
        var own = descriptor.hasOwnProperty('constructor') ? descriptor.constructor : undefined;

        //verify, that own constructor is undefined or is function
        assert.ok(!xs.isDefined(own) || xs.isFunction(own), 'own constructor is defined and is not a function');

        //apply if undefined - no own constructor property given
        if (own) {
            Class.descriptor.constructor = own;
        } else if (inherited) {
            Class.descriptor.constructor = inherited;
        }

    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ConstructorError
     */
    function ConstructorError(message) {
        this.message = 'xs.class.preprocessors.constructor::' + message;
    }

    ConstructorError.prototype = new Error();
})(window, 'xs');