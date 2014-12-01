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
     * Preprocessor constructor
     * Is used to work with class constructor
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('constructor', function () {

        return true;
    }, function ( Class, descriptor ) {

        //inherited
        //get inherited constructor from parent descriptor
        var inherited = xs.hasKey(Class.parent.descriptor, 'constructor') ? Class.parent.descriptor.constructor : undefined;
        xs.log('xs.class.preprocessor.constructor. Inherited:', inherited);


        //own
        //get own methods from raw descriptor
        var own = xs.hasKey(descriptor, 'constructor') ? descriptor.constructor : undefined;
        xs.log('xs.class.preprocessor.constructor. Own:', own);


        //apply (comparison to Object guarantees, that constructor was really assigned)
        if ( own ) {
            Class.descriptor.constructor = own;
        } else if ( inherited ) {
            Class.descriptor.constructor = inherited;
        }
        xs.log('xs.class.preprocessor.constructor. Resulting:', Class.descriptor.constructor);

    });
})(window, 'xs');