/**
 * Created by alex on 12/2/14.
 */
xs.define(xs.Class, 'ns.Base', function () {
    this.namespace = 'tests.class.preprocessors.processMixins';
    this.imports = ['ns.Mix1'];
    this.mixins.mix1 = 'ns.Mix1';
});