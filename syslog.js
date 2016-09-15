var Wafer = require('./')

var FACILITY = [
    'kern',
    'user',
    'mail',
    'daemon',
    'auth',
    'syslog',
    'lpr',
    'news',
    'uucp',
    'clock',
    'sec',
    'ftp',
    'ntp',
    'audit',
    'alert',
    null,
    'local0',
    'local1',
    'local2',
    'local3',
    'local4',
    'local5',
    'local6',
    'local7'
]

var LEVEL = [
    'trace',
    'debug',
    'info',
    'warn',
    'error'
]

module.exports = function (syslog) {
    return syslog ? function (line) {
        var $ = /^(?:\d+ )?<(\d+)>1 (\S+) (\S+) (\S+) (\S+) (\S+) (\S+) (.*)/.exec(line)
        var wafer = Wafer.parse($.pop())
        wafer.level = LEVEL[(+$[1] & 0x7)]
        wafer.facility = FACILITY[(+$[1] >> 3)]
        wafer.when = +(new Date($[2]))
        wafer.host = $[3]
        wafer.application = $[4]
        wafer.pid = +$[5]
        return wafer
    } : function (line) {
        return Wafer.parse(line)
    }
}
