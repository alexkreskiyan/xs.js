xs.define(xs.Class, 'ns.tests.dom.keyboard.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            Key: 'ns.tests.dom.keyboard.stage.Key'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'keyboard';

    Class.constant.testLabel = 'keyboard';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            key: imports.stage.Key
        });
    });

});