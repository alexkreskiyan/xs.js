/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Private internal core class. All xs classes inherit xs.class.Base
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.class.Base
 */
xs.define('xs.class.Base', function () {
    var me = this;
    /**
     * Returns whether this is child of given parent
     *
     * For example:
     *
     *     Bird.inherits(Animal); //true
     *     Bird.inherits(Transport); //false
     *
     * @static
     *
     * @method inherits
     *
     * @param {xs.class.Base} parent Class, being verified to be ancestor of this Class
     *
     * @return {Boolean} verification result
     */
    me.static.methods.inherits = function (parent) {
        return this.prototype instanceof parent;
    };

    /**
     * Returns clone of this object. Basically clone is made by factory and then extended with source properties
     *
     * @method clone
     *
     * @return {xs.class.Base} clone object
     */
    me.methods.clone = function () {
        var me = this;

        //create clone via factory
        var clone = me.self.factory.apply(me, me.initArguments);

        //assign properties
        xs.extend(clone, me);

        //return clone
        return clone;
    };

    /**
     * Completes internal object destruction
     *
     * @method destroy
     */
    me.methods.destroy = xs.emptyFn;
});