/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Private internal core class. All xs classes inherit xs.Base
 *
 * @author Alex Kreskiyan <brutalllord@gmail.com>
 *
 * @abstract
 *
 * @class xs.Base
 */
xs.define('xs.Base', function () {
    return {
        static: {
            methods: {
                /**
                 * Returns whether this is child of given parent
                 *
                 * For example:
                 *
                 *     Bird.isChild(Animal); //true
                 *     Bird.isChild(Transport); //false
                 *
                 * @static
                 *
                 * @method isChild
                 *
                 * @param {xs.Base} parent Class, being verified to be ancestor of this Class
                 *
                 * @return {Boolean} verification result
                 */
                isChild: function ( parent ) {
                    return this.prototype instanceof parent;
                },

                /**
                 * Returns whether this is parent of given child
                 *
                 * For example:
                 *
                 *     Animal.isParent(Bird); //true
                 *     Transport.isParent(Bird); //false
                 *
                 * @static
                 *
                 * @method isParent
                 *
                 * @param {xs.Base} child Class, being verified to be descendant of this Class
                 *
                 * @return {Boolean} verification result
                 */
                isParent: function ( child ) {
                    return child.isChild(this);
                }
            }
        },
        methods: {

            /**
             * Returns clone of this object. Basically clone is made by factory and then extended with source properties
             *
             * @method clone
             *
             * @return {xs.Base} clone object
             */
            clone: function () {
                var me = this;

                //create clone via factory
                var clone = me.self.factory.apply(me, me.initArguments);

                //assign properties
                xs.extend(clone, me);

                //return clone
                return clone;
            },

            /**
             * Completes internal object destruction
             *
             * @method destroy
             */
            destroy: xs.emptyFn
        }
    };
});