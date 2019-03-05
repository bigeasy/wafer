require('proof')(2, require('cadence')(prove))

function prove (async, okay) {
    var rimraf = require('rimraf')
    var bin = require('../wafer.bin'), program
    var fs = require('fs')
    async(function () {
        program = bin([ 'parse' ], async())
        program.stdin.write('n sequence=0;\n')
        program.stdin.end()
    }, function () {
        rimraf('test/fixtures/wafer.log.out', async())
    }, function () {
        okay(JSON.parse(program.stdout.read().toString()), { sequence: 0 }, 'stdio')
        program = bin([ 'parse', '-o', 'test/fixtures/wafer.log.out', 'test/fixtures/wafer.log.in' ], async())
        program.stdin.write('n sequence=0;\n')
        program.stdin.end()
    }, function () {
        fs.readFile('test/fixtures/wafer.log.out', 'utf8', async())
    }, function (body) {
        okay(JSON.parse(body), { sequence: 1 }, 'body')
    })
}
