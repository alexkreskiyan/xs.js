/**
 * Created by alex on 12/2/14.
 */
xs.define('ns.Mix1', function () {
    this.namespace = 'tests.class.preprocessors.mixins';
    this.imports = ['ns.Mix2'];
    this.constants.a = 1;
    this.properties.a = 2;
    this.methods.printA = function () {
        return this.a;
    }
});