var Staccato = require('staccato')
var cadence = require('cadence')

module.exports = cadence(function (async, syslog, input, output) {
    var loop = async(function () {
        async(function () {
            input.read(async())
        }, function (line) {
            if (line == null) {
                return [ loop.break ]
            }
            output.write(JSON.stringify(syslog(line.toString())) + '\n', async())
        })
    })()
})
