xs.define(xs.Class, 'ns.tests.tap.stage.SingleTap', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'tap anywhere in sandbox';

});