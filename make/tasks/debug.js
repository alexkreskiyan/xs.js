'use strict';

module.exports = options => () => {
    const buildPath = 'build/debug';

    //remove old files
    options.del(buildPath);


    //get core stream
    var core = options.sources().core;

    //get modules stream
    var modules = options.sources().modules;


    //get build stream
    var build = options.merge(core, modules);

    //concat all files
    build = build.pipe(options.concat({
        path: options.outputName
    }, { newLine: '\n\n\n' }));


    //save build
    return build.pipe(options.gulp.dest(buildPath));
};