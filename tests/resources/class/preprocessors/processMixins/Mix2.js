/**
 * Created by alex on 12/2/14.
 */
xs.define(xs.Class, 'ns.Mix2', function () {
    this.namespace = 'tests.class.preprocessors.processMixins';
    this.constant.b = 1;
    this.property.b = 2;
    this.method.printB = function () {
        return this.b;
    }
});