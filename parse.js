module.exports = async function (syslog, input, output) {
    for await (const line of input.readable) {
        if (! output.writable.write(JSON.stringify(syslog(line.toString())) + '\n')) {
            await output.writable.drain()
        }
        if (output.writable.finished) {
            break
        }
    }
    output.writable.end()
    output.depart()
    input.depart()
}
