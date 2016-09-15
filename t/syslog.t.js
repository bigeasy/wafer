require('proof/redux')(2, prove)

function prove (assert) {
    var syslog = require('../syslog')(true)
    var line = '<132>1 1970-01-01T00:00:00.000Z h a 0 - - n sequence=0; name=greeting; j $vargs=[];\n'
    assert(syslog(line), {
        sequence: 0,
        name: 'greeting',
        $vargs: [],
        level: 'error',
        facility: 'local0',
        when: 0,
        host: 'h',
        application: 'a',
        pid: 0
    }, 'syslog')
    var syslog = require('../syslog')(false)
    var line = 'n sequence=0; name=greeting; j $vargs=[];\n'
    assert(syslog(line), { sequence: 0, name: 'greeting', $vargs: [] }, 'no syslog')
}
