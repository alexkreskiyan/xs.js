xs.define(xs.Class, 'ns.tests.xs.tap.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            SingleTap: 'ns.tests.xs.tap.stage.SingleTap',
            DoubleTap: 'ns.tests.xs.tap.stage.DoubleTap'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'tap';

    Class.constant.testLabel = 'Tap';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            SingleTap: imports.stage.SingleTap,
            DoubleTap: imports.stage.DoubleTap
        });
    });

});