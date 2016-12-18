xs.define(xs.Class, 'ns.Base', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.class.preprocessors.processMixins.resources';

    Class.requires = [ 'ns.Mix1' ];

    Class.mixins.mix1 = 'ns.Mix1';

});