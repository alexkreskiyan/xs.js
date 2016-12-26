xs.define(xs.Class, 'ns.tests.dom.context.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            Context: 'ns.tests.dom.context.stage.Context'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'context';

    Class.constant.testLabel = 'context';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            context: imports.stage.Context
        });
    });

});