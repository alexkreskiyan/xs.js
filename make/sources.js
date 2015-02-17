'use strict';

//get sources file
var src = require('./source.json');

//init scripts array
var scripts = ['src/xs.js'];

//add core modules to scripts list
scripts = scripts.concat(Object.keys(src.core).map(getPathFromName));

//init modules list
var modules = {};

//assembly modules hash
assemblyModules(modules, src.modules);

//add modules to scripts list
scripts = scripts.concat(Object.keys(modules).map(getPathFromName));

//export scripts
module.exports = scripts;

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