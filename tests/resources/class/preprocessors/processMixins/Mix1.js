/**
 * Created by alex on 12/2/14.
 */
xs.define(xs.Class, 'ns.Mix1', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.class.preprocessors.processMixins';
    Class.constant.a = 1;
    Class.property.a = 2;
    Class.method.printA = function () {
        return this.a;
    };

});