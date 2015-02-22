/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * xs.data.operation.Operation provides base operation information
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.Operation
 *
 * @extends xs.class.Base
 *
 * @mixins xs.ux.Promise
 */
xs.define(xs.Class, 'ns.operation.Operation', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';


    Class.mixins.promise = 'xs.ux.Promise';

    Class.constructor = function () {
        var me = this;

        //call promise constructor
        self.mixins.promise.call(me);
    };

});