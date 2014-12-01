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
     * Preprocessor namespace
     * Is used to work with class namespace
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('namespace', function () {

        return true;
    }, function ( Class, descriptor ) {

        //save namespace
        Class.descriptor.namespace = {
            path: (xs.isString(descriptor.namespace) && descriptor.namespace.length) ? descriptor.namespace : undefined,
            resolve: function ( path ) {
                var me = this;

                //simply return path, if namespace is empty
                if ( !me.path ) {

                    return path;
                }

                //if name starts from namespace - resolve it
                if ( path.substring(0, 3) == 'ns.' ) {

                    return this.path + path.substring(2);
                }

                //else - simply return path
                return path;
            }
        };
    }, 'first');
})(window, 'xs');