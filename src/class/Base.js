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

    var Class = this;

    Class.abstract = true;

    /**
     * Class string representation
     *
     * @static
     *
     * @template
     *
     * @method toString
     */
    Class.static.method.toString = function () {
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
    Class.property.isDestroyed = {
        get: function () {
            return !this.hasOwnProperty('private');
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
    Class.method.clone = function () {
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
    Class.method.destroy = function () {
        var me = this;
        //assert, that destructor was not called yet
        self.assert.ok(me.hasOwnProperty('private'), 'Object is already destroyed');

        //private storage is emptied and removed
        me.private = null;
        delete me.private;

        //remove initArguments reference
        delete me.initArguments;

        //delete class reference
        delete me.self;
    };

    /**
     * Object string representation
     *
     * @template
     *
     * @method toString
     */
    Class.method.toString = function () {
        return '[instance ' + (this.constructor.label ? this.constructor.label : 'xClass') + ']';
    };

});