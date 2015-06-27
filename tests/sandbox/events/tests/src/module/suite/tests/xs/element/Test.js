xs.define(xs.Class, 'ns.tests.xs.element.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            Blur: 'ns.tests.xs.element.stage.Blur',
            Focus: 'ns.tests.xs.element.stage.Focus',
            Scroll: 'ns.tests.xs.element.stage.Scroll'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'element';

    Class.constant.testLabel = 'element';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            focus: imports.stage.Focus,
            blur: imports.stage.Blur,
            scroll: imports.stage.Scroll
        });
    });

});