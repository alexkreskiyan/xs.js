xs.define(xs.Class, 'ns.tests.xs.content.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            Change: 'ns.tests.xs.content.stage.Change',
            Input: 'ns.tests.xs.content.stage.Input',
            Select: 'ns.tests.xs.content.stage.Select'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'content';

    Class.constant.testLabel = 'content';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            input: imports.stage.Input,
            change: imports.stage.Change,
            select: imports.stage.Select
        });
    });

});