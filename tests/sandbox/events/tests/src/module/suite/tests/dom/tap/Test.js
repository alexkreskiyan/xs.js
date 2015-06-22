xs.define(xs.Class, 'ns.tests.dom.tap.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            Click: 'ns.tests.dom.tap.stage.Click',
            DoubleClick: 'ns.tests.dom.tap.stage.Click'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'tap';

    Class.constant.testLabel = 'Tap';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            Click: imports.stage.Click,
            DoubleClick: imports.stage.DoubleClick
        });
    });

});