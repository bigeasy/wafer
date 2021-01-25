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
require('arguable')(module, async arguable => {
    arguable.helpIf(arguable.ultimate.help)
    const delegate = arguable.delegate(require, './%s.bin', arguable.argv.shift())
    const child = delegate(arguable.argv, {
        $stdin: arguable.stdin,
        $stdout: arguable.stdout
    })
    arguable.destroyed.then(child.destroy.bind(child))
    return child.exit
})
