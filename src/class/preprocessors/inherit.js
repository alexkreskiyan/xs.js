/*!
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
/**
 * Registers extend pre-processor.
 * Is used to extend child class from parent class
 *
 * @ignore
 */
(function ( root, ns ) {

    //framework shorthand
    var xs = root[ns];

    var applyDescriptor = function ( Class, desc ) {
        //processed descriptor
        var realDesc = {
            constructor: undefined,
            const: {},
            static: {
                properties: {},
                methods: {}
            },
            properties: {},
            methods: {},
            mixins: {}
        }, each = xs.Object.each, property = xs.property, method = xs.method;

        //constructor
        realDesc.constructor = desc.constructor;

        // constants
        each( desc.const, function ( value, name ) {
            realDesc.const[name] = value;
            xs.const( Class, name, value );
        } );

        //public static properties
        each( desc.static.properties, function ( value, name ) {
            var descriptor = property.prepare( name, value );
            realDesc.static.properties[name] = descriptor;
            property.define( Class, name, descriptor );
            descriptor.hasOwnProperty( 'default' ) && (Class[name] = descriptor.default);
        } );

        //public static methods
        each( desc.static.methods, function ( value, name ) {
            var descriptor = method.prepare( name, value );
            if ( !descriptor ) {
                return;
            }
            realDesc.static.methods[name] = descriptor;
            method.define( Class, name, descriptor );
        } );

        //public properties
        each( desc.properties, function ( value, name ) {
            realDesc.properties[name] = property.prepare( name, value );
        } );

        //public methods
        each( desc.methods, function ( value, name ) {
            var descriptor = method.prepare( name, value );
            if ( !descriptor ) {
                return;
            }
            realDesc.methods[name] = descriptor;
            method.define( Class.prototype, name, descriptor );
        } );

        //mixins processing
        //define mixins storage in class
        if ( xs.Object.size( desc.mixins ) ) {
            Class.mixins = {};
            Class.prototype.mixins = {};
        }
        each( desc.mixins, function ( value, name ) {
            //leave mixin in descriptor
            realDesc.mixins[name] = value;
            //get mixClass
            var mixClass = xs.ClassManager.get( value );
            Class.mixins[name] = mixClass;
            Class.prototype.mixins[name] = mixClass.prototype;
        } );

        return realDesc;
    };

    xs.Class.registerPreprocessor( 'inherit', function ( Class, desc ) {
        //apply configured descriptor
        var descriptor = applyDescriptor( Class, desc );

        //define descriptor static property
        xs.property.define( Class, 'descriptor', {
            get: function () {
                return descriptor;
            }
        } );
    }, function () {
        return true;
    } );
})( window, 'xs' );