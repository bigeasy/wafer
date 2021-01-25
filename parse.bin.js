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
require('arguable')(module, async arguable => {
    const parse = require('./parse')

    arguable.helpIf(arguable.ultimate.help)

    const fs = require('fs')
    const syslog = require('./syslog')(arguable.ultimate.syslog)
    const Staccato = require('staccato/redux')
    const byline = require('byline')

    const output = arguable.ultimate.output
               ? new Staccato(fs.createWriteStream(arguable.ultimate.output))
               : new Staccato(arguable.stdout)

    if (arguable.argv.length == 0) {
        await parse(syslog, new Staccato(byline(arguable.stdin)), output)
    } else {
        for (const file of arguable.argv) {
            const input = fs.createReadStream(file)
            await parse(syslog, new Staccato(byline(input)), output)
        }
    }

    return 0
})
