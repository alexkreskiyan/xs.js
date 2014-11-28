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
     * Preprocessor singleton
     * Is used to mark class as singleton
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add( 'singleton', function () {

        return true;
    }, function ( Class, descriptor ) {
        Class.descriptor.singleton = !!descriptor.singleton;
    } );
})( window, 'xs' );