/**
 * Created by alex on 12/2/14.
 */
xs.define(xs.Class, 'ns.Mix1', function () {
    this.namespace = 'tests.class.preprocessors.processMixins';
    this.constants.a = 1;
    this.properties.a = 2;
    this.methods.printA = function () {
        return this.a;
    }
});