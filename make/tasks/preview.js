'use strict';

module.exports = options => () => {
    const {gulp, del, concat, merge, uglify, sources, pure, outputName} = options;
    const buildPath = 'build/preview';

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
        mangle: false,
        output: {
            beautify: true,
            comments: true,
            semicolons: false
        },
        compress: {
            pure_funcs: Array.prototype.concat.apply([], [
                pure.log.internal,
                pure.log.contract,
                pure.assert.internal,
                pure.assert.contract
            ]),
            sequences: false,
            unused: false
        }
    }));


    //save build
    return build.pipe(gulp.dest('build/preview'));
};