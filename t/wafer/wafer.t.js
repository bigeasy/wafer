require('proof')(14, prove)

function prove (assert) {
    var Wafer = require('../..')
    assert(Wafer.stringify({ a: 1 }), 'a=1;', 'stringify')
    assert(Wafer.parse('a=1;'), { a: 1 }, 'parse')
    assert(Wafer.parse('a=1; b.c=1; b.d=1;'), { a: 1, b: { c: 1, d: 1 } }, 'parse multi')
    assert(Wafer.stringify({ a: [ 1, 2, 3 ] }), 'a.0=1; a.1=2; a.2=3;', 'stringify array')
    assert(Wafer.stringify({ a: '=+;' }), 'a=%3d+%3b;', 'escape')
    assert(Wafer.parse('a=%3d+%3b;'), { a: '=+;' }, 'unescape')
    assert(Wafer.stringify({ a: null }), 'a;', 'stringify null')
    assert(Wafer.parse('a;'), { a: null }, 'parse null')
    assert(Wafer.stringify({ a: 1, b: undefined }), 'a=1;', 'stringify undefined')
    assert(Wafer.stringify({}), '', 'stringify empty')
    assert(Wafer.parse(''), {}, 'parse empty')
    assert(Wafer.stringify({ a: { b: 1 } }), 'a.b=1;', 'stringify nested')
    assert(Wafer.stringify({ a: { b: false } }), 'a.b=false;', 'stringify boolean')
    assert(Wafer.stringify({ a: { b: '\n' } }), 'a.b=%0a;', 'stringify padded')
}
