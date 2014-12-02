/**
 * Created by alex on 12/2/14.
 */
xs.define('tests.class.preprocessors.mixins.Mix1', function () {
    this.namespace = 'tests.class.preprocessors.mixins';
    this.const.a = 1;
    this.properties.a = 2;
    this.methods.printA = function () {
        return this.a;
    }
});