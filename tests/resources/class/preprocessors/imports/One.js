/**
 * Created by alex on 12/2/14.
 */
xs.define('ns.One', function () {
    this.namespace = 'tests.class.preprocessors.imports';
    this.imports = ['ns.Mix1'];
    this.mixins.mix1 = 'ns.Mix1';
});