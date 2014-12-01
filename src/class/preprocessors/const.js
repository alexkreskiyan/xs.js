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
     * Preprocessor const
     * Is used to process class constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('const', function () {
        return true;
    }, function ( Class, descriptor ) {

        //init constants as empty hash
        var constants = {};


        xs.log('xs.class.preprocessor.const. Register constants');
        //inherited
        //get inherited constants from parent descriptor
        var inherited = Class.parent.descriptor.const;

        xs.log('xs.class.preprocessor.const. Inherited:', inherited);
        //extend constants with inherited
        xs.isObject(inherited) && xs.extend(constants, inherited);


        //own
        //get own constants from raw descriptor
        var own = descriptor.const;

        xs.log('xs.class.preprocessor.const. Own:', own);
        //extend constants with own
        xs.isObject(own) && xs.extend(constants, own);


        xs.log('xs.class.preprocessor.const. Resulting:', constants);
        //apply
        //save constants to Class.descriptor
        Class.descriptor.const = constants;

        //apply all constants
        xs.each(constants, function ( value, name ) {
            xs.const(Class, name, value);
        });
    });
})(window, 'xs');