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
     * Core extend function
     *
     * @ignore
     *
     * @param {Function} child child class
     * @param {Function} parent parent class
     */
    var extend = function ( child, parent ) {
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
        xs.const(child, 'parent', parent);
    };

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
    }, function ( Class, descriptor, ns, ready ) {
        var extended = descriptor.extends;

        xs.log('xs.class.preprocessor.extend. Extended:', extended);
        //if incorrect/no parent given - extend from xs.Base
        if ( !xs.isString(extended) ) {
            xs.log('xs.class.preprocessor.extend. Extending xs.Base');
            extend(Class, xs.Base);

            return;
        }

        extended = Class.descriptor.namespace.resolve(extended);

        xs.log('xs.class.preprocessor.extend. Extending', extended);
        //try to get parent from ClassManager
        var parent = xs.ClassManager.get(extended);

        //extend from parent, if exists
        if ( parent ) {
            extend(Class, parent);

            xs.log('xs.class.preprocessor.extend. Parent', extended, 'was in class manager, extending');
            //save extends to descriptor
            Class.descriptor.extends = extended;

            return;
        }

        xs.log('xs.class.preprocessor.extend. Loading parent class', extended);
        //require async
        xs.require(extended, function () {
            extend(Class, xs.ClassManager.get(extended));

            xs.log('xs.class.preprocessor.extend. Parent', extended, 'loaded, extending');
            //save extends to descriptor
            Class.descriptor.extends = extended;

            ready();
        });

        //return false to sign async processor
        return false;
    }, 'after', 'imports');
})(window, 'xs');