/**
 * Created by alex on 12/2/14.
 */
xs.define('ns.Mix2', function () {
    this.namespace = 'tests.class.preprocessors.mixins';
    this.imports = ['ns.Base'];
    this.constants.b = 1;
    this.properties.b = 2;
    this.methods.printB = function () {
        return this.b;
    }
});