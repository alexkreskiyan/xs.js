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
xs.define(xs.Class, 'xs.class.Base', function (self) {

    'use strict';

    var me = this;

    /**
     * Class string representation
     *
     * @static
     *
     * @template
     *
     * @method toString
     */
    me.static.method.toString = function () {
        return '[class ' + (this.label ? this.label : 'xClass') + ']';
    };

    /**
     * Property, that returns whether object is destroyed
     *
     * @readonly
     *
     * @property isDestroyed
     *
     * @type {Boolean}
     */
    me.property.isDestroyed = {
        get: function () {
            return this.hasOwnProperty('private');
        },
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

        //get private backup
        var privates = clone.private;

        //assign properties
        xs.extend(clone, me);

        //restore private
        clone.private = privates;

        //assign privates
        xs.extend(clone.private, me.private);

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
        //assert, that destructor was not called yet
        self.assert.not(this.private.isDestroyed, 'Object is already destroyed');

        //private storage is emptied and removed
        this.private = undefined;
        delete this.private;
    };

    /**
     * Object string representation
     *
     * @template
     *
     * @method toString
     */
    me.method.toString = function () {
        return '[instance ' + (this.constructor.label ? this.constructor.label : 'xClass') + ']';
    };
});