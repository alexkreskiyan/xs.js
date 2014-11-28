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
 * Registers configure pre-processor.
 * Is used to extend child class from parent class
 *
 * @ignore
 */
(function ( root, ns ) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Registers configure pre-processor.
     */
    xs.Class.registerPreprocessor( 'configure', function ( Class, desc ) {
        //combine class descriptor with inherited descriptor
        var inherits = Class.parent.descriptor;

        //constructor
        desc.constructor = desc.hasOwnProperty( 'constructor' ) &&
            xs.isFunction( desc.constructor ) ? desc.constructor : undefined;
        //const
        desc.const = xs.isObject( desc.const ) ? desc.const : {};
        //static properties and methods
        xs.isObject( desc.static ) || (desc.static = {});
        desc.static.properties = xs.isObject( desc.static.properties ) ? desc.static.properties : {};
        desc.static.methods = xs.isObject( desc.static.methods ) ? desc.static.methods : {};
        //public properties and methods
        desc.properties = xs.isObject( desc.properties ) ? desc.properties : {};
        desc.methods = xs.isObject( desc.methods ) ? desc.methods : {};
        //mixins
        if ( xs.isString( desc.mixins ) ) {
            desc.mixins = [desc.mixins];
        }
        if ( xs.isArray( desc.mixins ) ) {
            var mixins = {}, mixClass;
            xs.Array.each( desc.mixins, function ( mixin ) {
                mixClass = xs.ClassManager.get( mixin );
                xs.Array.has( mixins, mixin ) || (mixins[mixClass.label] = mixin);
            } );
            //update mixins at descriptor
            desc.mixins = mixins;
        } else if ( !xs.isObject( desc.mixins ) ) {
            desc.mixins = {};
        }

        //constructor
        desc.constructor = desc.constructor ? desc.constructor : inherits.constructor;
        //constructor
        desc.const = xs.defaults( desc.const, inherits.const );
        //static properties and methods
        desc.static.properties = xs.defaults( desc.static.properties, inherits.static.properties );
        desc.static.methods = xs.defaults( desc.static.methods, inherits.static.methods );
        //public properties and methods
        desc.properties = xs.defaults( desc.properties, inherits.properties );
        //methods are not defaulted from inherits - prototype usage covers that
        //mixins
        desc.mixins = xs.unique( xs.defaults( desc.mixins, inherits.mixins ) );
    } );
})( window, 'xs' );