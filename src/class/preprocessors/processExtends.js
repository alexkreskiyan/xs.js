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

    var log = new xs.log.Logger('xs.class.preprocessors.processExtends');

    var assert = new xs.core.Asserter(log, ProcessExtendsError);

    /**
     * Directive extends
     *
     * Is used to extend child class from parent class
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.namespace = 'app.start.login';
     *
     *         this.extends = 'ns.User'; //Extended base model class. If no extended specified {@link xs.class.Base} is extended
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property extends
     */
    xs.class.preprocessors.add('processExtends', function () {

        return true;
    }, function (Class, descriptor) {
        var extended = descriptor.extends;

        log.trace((Class.label ? Class.label : 'undefined') + '. Preparing to extend', {
            extended: extended
        });
        //if no parent given - extend from xs.class.Base
        if (!xs.isDefined(extended)) {
            log.trace((Class.label ? Class.label : 'undefined') + '. Extending xs.class.Base');
            extend(Class, xs.class.Base);

            return;

            //else - extended is specified
        } else {

            //resolve parent name
            extended = Class.descriptor.resolveName(extended);
        }

        //assert, that parent is defined
        assert.ok(xs.ContractsManager.has(extended), '[$Class]: parent class `$extended` is not defined. Move it to imports section, please', {
            $Class: Class.label,
            $extended: extended
        });

        //get parent reference
        var Parent = xs.ContractsManager.get(extended);

        //check that parent is class
        assert.Class(Parent, '[$Class]: contract `$Parent` is not a class', {
            $Class: Class.label,
            $Parent: Parent.label
        });

        //check that class is ready
        assert.not(Parent.isProcessing, '[$Class]: parent class `$Parent` is not processed yet. Move it to imports section, please', {
            $Class: Class.label,
            $Parent: Parent.label
        });

        log.trace((Class.label ? Class.label : 'undefined') + '. Extending ' + Parent.label);
        //apply extends
        applyExtends(Class, Parent);
    });

    /**
     * Core extends function. Saves imported classes by aliases
     *
     * @ignore
     *
     * @method applyImports
     *
     * @param {Function} target target class
     * @param {Function} parent extended class
     */
    var applyExtends = function (target, parent) {
        //extend
        extend(target, parent);

        //save extends to descriptor
        target.descriptor.extends = parent.label;
    };

    /**
     * Core extend function
     *
     * @ignore
     *
     * @param {Function} child child class
     * @param {Function} parent parent class
     */
    var extend = function (child, parent) {
        //create fake constructor
        var Fn = function () {
        };

        //assign prototype for fake constructor
        Fn.prototype = parent.prototype;

        //assign new fake constructor's instance as child prototype, establishing correct prototype chain
        child.prototype = new Fn();

        //assign correct constructor instead fake constructor
        child.prototype.constructor = child;

        //save reference to parent
        xs.constant(child, 'parent', parent);

        /**
         * Returns whether Class is inherited from given Parent
         *
         * @member xs.class.Base
         *
         * @method inherits
         *
         * @param {Function} Parent verified Parent class
         *
         * @return {Boolean} whether given Parent class is parent according to this Class
         */
        xs.constant(child, 'inherits', function (Parent) {
            //assert, that Parent is class
            assert.Class(Parent, 'Given Parent `$Parent` is not a class', {
                $Parent: Parent
            });

            return this.prototype instanceof Parent;
        });
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ProcessExtendsError
     */
    function ProcessExtendsError(message) {
        this.message = 'xs.class.preprocessors.processExtends::' + message;
    }

    ProcessExtendsError.prototype = new Error();

})(window, 'xs');