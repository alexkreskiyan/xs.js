'use strict';

module.exports = options => () => {
    const {gulp, del, sources} = options;
    const buildPath = 'build/source';

    //remove old files
    del(buildPath);

    //save build
    return sources.core.pipe(gulp.dest(buildPath));
};