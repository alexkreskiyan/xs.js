'use strict';

//require used modules
var gulp = require('gulp');
var indent = require('gulp-indent');
var trimlines = require('gulp-trimlines');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');
var merge = require('gulp-merge');

//get sources file
var src = require('./source.json');

//export scripts array
module.exports = () => ({
    core: getCoreStream(['src/xs.js'], src.core),
    modules: getModulesStream(src.modules)
});

function getCoreStream(entry, core) {

    //get build stream
    var build = merge(gulp.src(entry), assemblyCoreStreams(core));

    //indent files
    build = build.pipe(indent({
        amount: 4
    }));

    //concat all files
    build = build.pipe(concat({
        path: 'xs.js'
    }, {
            newLine: '\n\n\n'
        }));

    //wrap concatenated file in framework template
    build = build.pipe(wrap({
        src: 'make/template/framework'
    }));

    //trim lines
    build = build.pipe(trimlines({
        leading: false,
        trailing: true
    }));

    return build;
}

function assemblyCoreStreams(core) {
    var names = Object.keys(core);

    var streams = [];

    var stream;

    var ungrouped = [];

    for (var i = 0; i < names.length; i++) {

        var name = names[i];
        var module = core[name];

        if (isModule(module)) {

            ungrouped.push(name);

            continue;
        }

        //add stream of ungrouped modules (if any)
        if (ungrouped.length) {

            //get stream of ungrouped files
            stream = gulp.src(ungrouped.map(getPathFromName));

            //indent
            stream = stream.pipe(indent({
                amount: 4
            }));

            //wrap
            stream = stream.pipe(wrap({
                src: 'make/template/core/module'
            }));

            //push to streams
            streams.push(stream);

            //reset ungrouped
            ungrouped = [];
        }

        //get grouped stream
        stream = gulp.src(Object.keys(module).map(getPathFromName));

        //indent
        stream = stream.pipe(indent({
            amount: 4
        }));

        //wrap
        stream = stream.pipe(wrap({
            src: 'make/template/core/group/module'
        }));

        //concat
        stream = stream.pipe(concat({
            path: 'xs.js'
        }, {
                newLine: '\n\n\n'
            }));

        //indent
        stream = stream.pipe(indent({
            amount: 4
        }));

        //wrap with wrapper
        stream = stream.pipe(wrap({
            src: 'make/template/core/group/wrapper'
        }));

        //add grouped stream to streams
        streams.push(stream);
    }

    //process trailing ungrouped modules (if any)
    if (ungrouped.length) {

        //get stream of ungrouped files
        stream = gulp.src(ungrouped.map(getPathFromName));

        //indent
        stream = stream.pipe(indent({
            amount: 4
        }));

        //wrap
        stream = stream.pipe(wrap({
            src: 'make/template/core/module'
        }));

        //push to streams
        streams.push(stream);
    }


    //return merge of streams
    return merge.apply(undefined, streams);
}

function isModule(description) {
    var keys = Object.keys(description);

    if (!keys.length) {

        return true;
    }

    for (var i = 0; i < keys.length; i++) {
        if (typeof description[keys[i]] === 'object') {
            return false;
        }
    }

    return true;
}

function getModulesStream(src) {

    //init modules list
    var modules = {};

    //assembly modules hash
    assemblyModules(modules, src);

    //get stream
    var stream = gulp.src(Object.keys(modules).map(getPathFromName));

    //wrap
    stream = stream.pipe(wrap({
        src: 'make/template/module'
    }));

    return stream;
}

function assemblyModules(list, modules, name) {
    //modules is node, if given string contract
    if (isModule(modules)) {
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