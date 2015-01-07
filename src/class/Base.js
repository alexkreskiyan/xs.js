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
xs.define(xs.Class, 'xs.class.Base', function () {

    'use strict';

    var me = this;

    /**
     *
     * @type {boolean}
     */
    me.property.isDestroyed = {
        set: xs.emptyFn
    };

    /**
     * Returns clone of this object. Basically clone is made by factory and then extended with source properties
     *
     * @method clone
     *
     * @return {xs.class.Base} clone object
     */
    me.method.clone = function () {
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
     * @template
     *
     * @method destroy
     */
    me.method.destroy = function () {
        this.private.isDestroyed = true;
    };
});