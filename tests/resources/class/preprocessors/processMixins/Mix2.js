/**
 * Created by alex on 12/2/14.
 */
xs.define(xs.Class, 'ns.Mix2', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.class.preprocessors.processMixins';
    Class.constant.b = 1;
    Class.property.b = 2;
    Class.method.printB = function () {
        return this.b;
    };
});