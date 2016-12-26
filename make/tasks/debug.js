'use strict';

module.exports = options => () => {
    const {gulp, del, concat, merge, sources, outputName} = options;
    const buildPath = 'build/debug';

    //remove old files
    del(buildPath);

    //get build stream
    var build = merge(sources.core, sources.modules);

    //concat all files
    build = build.pipe(concat({
        path: outputName
    }, { newLine: '\n\n\n' }));


    //save build
    return build.pipe(options.gulp.dest(buildPath));
};