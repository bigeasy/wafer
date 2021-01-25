require('proof')(4, async okay => {
    const fs = require('fs').promises
    const stream = require('stream')
    const bin = require('../wafer.bin')
    {
        const child = bin([ 'parse' ], {
            $stdin: new stream.PassThrough,
            $stdout: new stream.PassThrough
        })
        child.options.$stdin.write('n sequence=0;\n')
        child.options.$stdin.end()
        okay(await child.exit, 0, 'exit stdio')
        okay(JSON.parse(child.options.$stdout.read().toString()), { sequence: 0 }, 'stdio')
    }
    {
        const child = bin([ 'parse', '-o', 'test/fixtures/wafer.log.out', 'test/fixtures/wafer.log.in' ])
        okay(await child.exit, 0, 'exit fs')
        okay(JSON.parse(await fs.readFile('test/fixtures/wafer.log.out', 'utf8')), { sequence: 1 }, 'fs')
    }
})
