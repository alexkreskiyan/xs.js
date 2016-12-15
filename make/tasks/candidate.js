'use strict';

module.exports = options => () => {
    const buildPath = 'build/candidate';

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

    //uglify
    build = build.pipe(options.uglify({
        mangle: false,
        compress: {
            pure_funcs: Array.prototype.concat.apply([], [
                options.pure.log.internal,
                options.pure.log.contract
            ]),
            sequences: false,
            unused: false
        }
    }));


    //save build
    return build.pipe(options.gulp.dest(buildPath));
};