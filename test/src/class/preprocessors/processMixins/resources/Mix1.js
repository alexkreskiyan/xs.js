xs.define(xs.Class, 'ns.Mix1', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.class.preprocessors.processMixins.resources';

    Class.constant.a = 1;

    Class.property.a = 2;

    Class.method.printA = function () {

        return this.a;
    };

});