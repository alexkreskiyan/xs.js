function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
test('parse', function () {
    window.url = xs.create('xs.uri.Url', {
        url: 'http://maps.google.de:8082/maps?f=q&source=s_q&hl=de&geocode=&q=Frankfurt+am+Main&sll=50.106047,8.679886&sspn=0.370369,0.833588&ie=UTF8&ll=50.116616,8.680573&spn=0.35972,0.833588&z=11&iwloc=addr#.a.3.sdf.4'
    });
    equal(true, true);
});