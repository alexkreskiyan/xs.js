/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

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

        //if parent is not defined or is processing - throw errors
        if (!xs.ContractsManager.has(extended)) {
            throw new ProcessExtendsError('[' + Interface.label + ']: parent interface "' + extended + '" is not defined. Move it to imports section, please');
        } else {
            //get parent reference
            var Parent = xs.ContractsManager.get(extended);

            if (Parent.isProcessing) {
                throw new ProcessExtendsError('[' + Interface.label + ']: parent interface "' + Parent.label + '" is not processed yet. Move it to imports section, please');
            }
        }

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
        var fn = function () {
        };

        //assign prototype for fake constructor
        fn.prototype = parent.prototype;

        //assign new fake constructor's instance as child prototype, establishing correct prototype chain
        child.prototype = new fn();

        //assign correct constructor instead fake constructor
        child.prototype.constructor = child;

        //save reference to parent
        xs.constant(child, 'parent', parent);
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