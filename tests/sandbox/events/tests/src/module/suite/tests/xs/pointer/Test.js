xs.define(xs.Class, 'ns.tests.xs.pointer.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            Tap: 'ns.tests.xs.pointer.stage.Tap',
            DoubleTap: 'ns.tests.xs.pointer.stage.DoubleTap'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'pointer';

    Class.constant.testLabel = 'pointer';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            tap: imports.stage.Tap,
            doubleTap: imports.stage.DoubleTap
        });
    });

});