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
        set: xs.noop
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
        xs.apply(clone, me);

        //restore private
        clone.private = privates;

        //assign privates
        xs.apply(clone.private, me.private);

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

});