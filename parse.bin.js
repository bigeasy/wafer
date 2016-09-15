/*
    ___ usage ___ en_US ___
    usage: wafer parse <options>

    options:

        -o, --output         <string>   name of an output file
        -s, --syslog                    parse a leading syslog record
            --help                      display this message

    ___ $ ___ en_US ___

    ___ . ___
*/
require('arguable')(module, require('cadence')(function (async, program) {
    var parse = require('./parse')

    program.helpIf(program.ultimate.help)

    var fs = require('fs')
    var syslog = require('./syslog')(program.ultimate.syslog)
    var Staccato = require('staccato')
    var byline = require('byline')
    var delta = require('delta')

    var output = program.ultimate.output
               ? new Staccato(fs.createWriteStream(program.ultimate.output), true)
               : new Staccato(program.stdout)

    async(function () {
        output.ready(async())
    }, function () {
        if (program.argv.length == 0) {
            parse(syslog, new Staccato(byline(program.stdin)), output, async())
        } else {
            async.forEach(function (path) {
                var input = fs.createReadStream(path)
                async(function () {
                    delta(async()).ee(input).on('open')
                }, function () {
                    parse(syslog, new Staccato(byline(input)), output, async())
                })
            })(program.argv)
        }
    })
}))
