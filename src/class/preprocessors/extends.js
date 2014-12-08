/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function ( root, ns ) {

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
    }, function ( Class, descriptor, ns, dependencies, ready ) {
        var extended = descriptor.extends;

        xs.log('xs.class.preprocessor.extends. Extended:', extended);
        //if no parent given - extend from xs.Base
        if ( !xs.isDefined(extended) ) {
            xs.log('xs.class.preprocessor.extends. Extending xs.Base');
            _extend(Class, xs.Base);

            return;
            //if extended is not string (empty string) - throw respective error
        } else if ( !xs.isString(extended) || !extended ) {
            throw new ExtendsError('incorrect extended name');
        }

        extended = Class.descriptor.namespace.resolve(extended);

        xs.log('xs.class.preprocessor.extends. Extending', extended);
        //extend from parent, if exists
        if ( xs.ClassManager.has(extended) ) {
            xs.log('xs.class.preprocessor.extends. Parent', extended, 'was in class manager, extending');
            //apply extends
            _applyExtends(Class, extended);

            return;
        }

        xs.log('xs.class.preprocessor.extends. Loading parent class', extended);
        //require async
        xs.require(extended, function () {

            xs.log('xs.class.preprocessor.extends. Parent', extended, 'loaded, applying dependency');
            //create new dependency
            dependencies.add(Class, [extended], function () {

                xs.log('xs.class.preprocessor.extends. Parent', extended, 'processed, extending');
                //apply extends
                _applyExtends(Class, extended);

                //call ready to notify processor stack, that import succeed
                ready();
            });
        });

        //return false to sign async processor
        return false;
    }, 'after', 'imports');

    /**
     * Core extends function. Saves imported classes by aliases
     *
     * @ignore
     *
     * @method applyImports
     *
     * @param {Object} target target class
     * @param {Object} extended extended class name
     */
    var _applyExtends = function ( target, extended ) {
        //extend
        _extend(target, xs.ClassManager.get(extended));

        //save extends to descriptor
        target.descriptor.extends = extended;
    };

    /**
     * Core extend function
     *
     * @ignore
     *
     * @param {Function} child child class
     * @param {Function} parent parent class
     */
    var _extend = function ( child, parent ) {
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
    function ExtendsError ( message ) {
        this.message = 'xs.class.preprocessors.extends :: ' + message;
    }

    ExtendsError.prototype = new Error();
})(window, 'xs');