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

    /**
     * Preprocessor processExtends
     * Is used to extend child interface from parent interface
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('processExtends', function () {

        return true;
    }, function (Interface, descriptor) {
        var extended = descriptor.extends;

        xs.log('xs.interface.preprocessors.processExtends[', Interface.label, ']. Extended:', extended);
        //if no parent given - extend from xs.interface.Base
        if (!xs.isDefined(extended)) {
            xs.log('xs.interface.preprocessors.extends[', Interface.label, ']. Extending xs.interface.Base');
            _extend(Interface, xs.interface.Base);

            return;

            //else - extended is specified
        } else {

            //resolve parent name
            extended = Interface.descriptor.resolveName(extended);
        }

        //assert, that parent is defined
        xs.assert.ok(xs.ContractsManager.has(extended), ProcessExtendsError, '[$Interface]: parent interface "$extended" is not defined. Move it to imports section, please', {
            $Interface: Interface.label,
            $extended: extended
        });

        //get parent reference
        var Parent = xs.ContractsManager.get(extended);

        //check that parent is interface
        xs.assert.Interface(Parent, ProcessExtendsError, '[$Interface]: contract "$Parent" is not Interface', {
            $Interface: Interface.label,
            $Parent: Parent.label
        });

        //check that interface is ready
        xs.assert.not(Parent.isProcessing, ProcessExtendsError, '[$Interface]: parent interface "$Parent" is not processed yet. Move it to imports section, please', {
            $Interface: Interface.label,
            $Parent: Parent.label
        });

        xs.log('xs.interface.preprocessors.extends[', Interface.label, ']. Extending', Parent.label);
        //apply extends
        _applyExtends(Interface, Parent);
    });

    /**
     * Core extends function. Saves imported interfaces by aliases
     *
     * @ignore
     *
     * @method applyImports
     *
     * @param {Function} target target interface
     * @param {Function} parent extended interface
     */
    var _applyExtends = function (target, parent) {
        //extend
        _extend(target, parent);

        //save extends to descriptor
        target.descriptor.extends = parent.label;
    };

    /**
     * Core extend function
     *
     * @ignore
     *
     * @param {Function} child child interface
     * @param {Function} parent parent interface
     */
    var _extend = function (child, parent) {
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

        //add inherits method
        xs.constant(child, 'inherits', function (parent) {
            return this.prototype instanceof parent;
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
        this.message = 'xs.interface.preprocessors.processExtends::' + message;
    }

    ProcessExtendsError.prototype = new Error();
})(window, 'xs');