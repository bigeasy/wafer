require('proof')(1, require('cadence')(prove))

function prove (async, assert) {
    var parse = require('../parse')
    var stream = require('stream')
    var syslog = require('../syslog')(false)
    var Staccato = require('staccato')
    var byline = require('byline')
    async(function () {
        var input = new stream.PassThrough
        var output = new stream.PassThrough
        async(function () {
            parse(syslog, new Staccato.Readable(byline(input)), new Staccato.Writable(output), async())
            input.write('n sequence=0;\n')
            input.end()
        }, function () {
            assert(JSON.parse(output.read().toString()), { sequence: 0 }, 'parsed')
        })
    })
}
