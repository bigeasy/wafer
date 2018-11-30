var Staccato = require('staccato')
var cadence = require('cadence')

module.exports = cadence(function (async, syslog, input, output) {
    async.loop([], function () {
        async(function () {
            input.read(async())
        }, function (line) {
            if (line == null) {
                return [ async.break ]
            }
            output.write(JSON.stringify(syslog(line.toString())) + '\n', async())
        })
    })
})
