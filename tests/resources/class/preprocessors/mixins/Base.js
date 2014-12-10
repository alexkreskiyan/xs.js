/**
 * Created by alex on 12/2/14.
 */
xs.define('tests.class.preprocessors.mixins.Base', function () {
    this.namespace = 'tests.class.preprocessors.mixins';
    this.imports = ['ns.Mix1'];
    this.mixins.mix1 = 'ns.Mix1';
});