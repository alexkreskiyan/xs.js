xs.define(xs.Class, 'ns.tests.tap.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.testName = 'tap';

    Class.constant.testLabel = 'Tap';

});