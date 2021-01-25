require('proof')(2, async okay => {
    const parse = require('../parse')
    const stream = require('stream')
    const syslog = require('../syslog')(false)
    const Staccato = require('staccato/redux')
    const byline = require('byline')
    {
        const input = new stream.PassThrough
        const output = new stream.PassThrough
        const promise = parse(syslog, new Staccato(byline(input)), new Staccato(output))
        input.write('n sequence=0;\n')
        input.end()
        await promise
        okay(JSON.parse(output.read().toString()), { sequence: 0 }, 'parse')
    }
    try {
        const input = new stream.PassThrough
        const output = new stream.PassThrough
        const promise = parse(syslog, new Staccato(byline(input)), new Staccato(output))
        output.emit('error', new Error('error'))
        input.write('n sequence=0;\n')
        input.end()
        await promise
    } catch (error) {
        okay(error.errors[0].message, 'error', 'handle error')
    }
})
