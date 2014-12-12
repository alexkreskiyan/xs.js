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
     * Preprocessor extends
     * Is used to extend child class from parent class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('extends', function () {

        return true;
    }, function (Class, descriptor) {
        var extended = descriptor.extends;

        xs.log('xs.class.preprocessor.extends[', Class.label, ']');
        xs.log('xs.class.preprocessor.extends[', Class.label, ']. Extended:', extended);
        //if no parent given - extend from xs.Base
        if (!xs.isDefined(extended)) {
            xs.log('xs.class.preprocessor.extends[', Class.label, ']. Extending xs.Base');
            _extend(Class, xs.Base);

            return;

            //if extended is non-empty string - resolve parent name
        } else if (xs.isString(extended) && extended) {

            //resolve parent name
            extended = Class.descriptor.resolveName(extended);
        } else {

            //if extended is not string (empty string) - throw respective error
            throw new ExtendsError('[' + Class.label + ']: incorrect extended name');
        }

        //get parent reference
        var Parent = xs.ClassManager.get(extended);

        //if parent is not defined or is processing - throw errors
        if (!Parent) {
            throw new ExtendsError('[' + Class.label + ']: parent class "' + extended + '" is not defined');
        } else if (Parent.isProcessing) {
            throw new ExtendsError('[' + Class.label + ']: parent class "' + Parent.label + '" is not processed yet. Move it to imports section, please');
        }

        xs.log('xs.class.preprocessor.extends[', Class.label, ']. Extending', Parent.label);
        //apply extends
        _applyExtends(Class, Parent);
    }, 'after', 'imports');

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
     * @param {Function} child child class
     * @param {Function} parent parent class
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
     * @class ExtendsError
     */
    function ExtendsError(message) {
        this.message = 'xs.class.preprocessors.extends :: ' + message;
    }

    ExtendsError.prototype = new Error();
})(window, 'xs');