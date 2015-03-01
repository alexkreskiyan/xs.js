'use strict';

//get sources file
var src = require('./source.json');

//init modules list
var modules = {};

//assembly modules hash
assemblyModules(modules, src.modules);

//export scripts array
module.exports = {
    entry: ['src/xs.js'],
    core: Object.keys(src.core).map(getPathFromName),
    modules: Object.keys(modules).map(getPathFromName)
};

function assemblyModules(list, modules, name) {
    //modules is node, if given string contract
    if (typeof modules.contract === 'string') {
        list[name] = modules;

        return;
    }

    //modules is category
    Object.keys(modules).forEach(function (key) {
        assemblyModules(list, modules[key], name ? (name + '.' + key) : key);
    });
}

function getPathFromName(name) {

    return name.split('xs.').join('src/').split('.').join('/') + '.js';
}