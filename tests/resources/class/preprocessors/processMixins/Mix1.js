/**
 * Created by alex on 12/2/14.
 */
xs.define(xs.Class, 'ns.Mix1', function () {
    this.namespace = 'tests.class.preprocessors.processMixins';
    this.constant.a = 1;
    this.property.a = 2;
    this.method.printA = function () {
        return this.a;
    }
});