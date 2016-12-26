'use strict';

module.exports = options => () => {
    const {gulp, del, concat, merge, uglify, sources, pure, outputName} = options;
    const buildPath = 'build/release';

    //remove old files
    del(buildPath);


    //get build stream
    var build = merge(sources.core, sources.modules);

    //concat all files
    build = build.pipe(concat({
        path: outputName
    }, { newLine: '\n\n\n' }));

    //uglify
    build = build.pipe(uglify({
        mangle: true,
        compress: {
            pure_funcs: Array.prototype.concat.apply([], [
                pure.log.internal,
                pure.log.contract,
                pure.assert.internal,
                pure.assert.contract
            ])
        }
    }));


    //save build
    return build.pipe(gulp.dest(buildPath));
};