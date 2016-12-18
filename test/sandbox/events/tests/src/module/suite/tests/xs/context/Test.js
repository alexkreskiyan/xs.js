xs.define(xs.Class, 'ns.tests.xs.context.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            Resize: 'ns.tests.xs.context.stage.Resize',
            VisibilityChange: 'ns.tests.xs.context.stage.VisibilityChange'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'context';

    Class.constant.testLabel = 'context';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            resize: imports.stage.Resize,
            visibilityChange: imports.stage.VisibilityChange
        });
    });

});