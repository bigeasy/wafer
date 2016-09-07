require('proof/redux')(16, prove)

function prove (assert) {
    var Wafer = require('..')
    function cycle (object, message) {
        var flattened = Wafer.stringify(object)
        console.log('flattened >', flattened)
        assert(Wafer.parse(flattened), object, message)
    }
    cycle({}, 'empty')
    cycle({ key: 'value' }, 'minimal')
    cycle({ a: 1 }, 'number')
    cycle({ a: true }, 'boolean')
    cycle({ a: { c: 1 } }, 'nested')
    cycle({ a: 'x', b: { c: 1 } }, 'muliple properties')
    cycle({ a: [ 1, '2' ] }, 'array')
    cycle({ a: [], b: 2 }, 'empty array')
    cycle({ a: '=+;\n' }, 'escape')
    cycle({ a: '', b: 1 }, 'empty string')
    cycle({ a: null, b: 1 }, 'null')
    cycle({ a: [{ one: 1 }, { two: 2 }] }, 'null')
    cycle({ a: [[{ one: 1, three: 3 }, { two: 2 }]], b: 2 }, 'array of array of objects')
    cycle({ z: [[3]], a: [[{ one: 1 }, { two: 2 }]], b: 2 }, 'arrays after arrays')
    cycle({ a: [[{ one: 1 }, 1, null, [[3]], { two: 2 }]], b: 2 }, 'heterogeneous arrays')
    cycle({ a: 1, $json: { key: 'value' },  b: 2 }, 'heterogeneous arrays')
}
