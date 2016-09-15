#!/usr/bin/env node

/*
    ___ usage ___ en_US ___
    usage: wafer [command]

    commands:

        parse                           parse a wafer stream
        serialize                       serialize a wafer stream

    options:

            --help                      display this message

    ___ $ ___ en_US ___

    ___ . ___
*/

require('arguable')(module, require('cadence')(function (async, program) {
    program.helpIf(program.ultimate.help)

    program.delegate('./' + program.argv.shift() + '.bin', program.argv, async())
}))
