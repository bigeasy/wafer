function percent (value) {
    var string = value.charCodeAt(0).toString(16)
    if (string.length == 1) {
        string = '0' + string
    }
    return '%' + string
}

function encode (value) {
    return String(value).replace(/[%=;\n]/g, percent)
}

function property (path, key, value, out, suffix) {
    if (key[0] == '$') {
        out.push('j')
        stringify(path.concat(key), JSON.stringify(value), out, suffix)
    } else {
        stringify(path.concat(key), value, out, suffix)
    }
}

function stringify (path, value, out, suffix) {
    var type = typeof value
    switch (type) {
    case 'object':
        if (Array.isArray(value)) {
            out.push(value.length)
            out.push(encode(path.join('.')) + ';')
            for (var i = 0, I = value.length; i < I - 1; i++) {
                stringify(path, value[i], out, ',')
            }
            if (i < I) {
                stringify(path, value[i], out, ',' + suffix)
            }
        } else if (value === null) {
            out.push(path.join('.') + ';' + suffix)
        } else {
            var keys = Object.keys(value)
            for (var i = 0, I = keys.length; i < I - 1; i++) {
                property(path, keys[i], value[keys[i]], out, '')
            }
            if (i < I) {
                property(path, keys[i], value[keys[i]], out, suffix)
            }
        }
        return null
    case 'boolean':
    case 'number':
        out.push(type[0])
    case 'string':
        out.push(encode(path.join('.')) + '=' + encode(value) + ';' + suffix)
        break
    }
}

exports.stringify = function (value) {
    var out = []
    stringify([], value, out, '')
    return out.join(' ')
}

exports.parse = function (value) {
    var object = {}
    var arrays = []
    if (/\S/.test(value)) {
        var count = 0, key
        var pairs = value.split(/;/)
        pairs.pop()
        pairs.forEach(function (pair) {
            pair = pair.split('=')
            key = pair[0].split(' ').reverse()
            var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
            var path = key.shift()
            var part, length
            var top = arrays[arrays.length - 1]
            while (key.length) {
                switch ((part = key.shift())[0] || '') {
                case ',':
                    for (var i = 0, I = part.length; i < I; i++) {
                        arrays[arrays.length - (i + 1)].index++
                    }
                case '':
                    while (
                        arrays.length &&
                        arrays[arrays.length - 1].index == arrays[arrays.length - 1].length
                    ) {
                        arrays.pop()
                    }
                    break
                case 'b':
                    value = value == 'true'
                    break
                case 'n':
                    value = +value
                    break
                case 'j':
                    value = JSON.parse(value)
                    break
                default:
                    length = +part
                    value = []
                    break
                }
            }
            var iterator = object, path = path.split('.'), array = 0
            for (var index = 0, j = 0, J = path.length - 1; j < J; j++) {
                if (iterator[path[j]] == null) {
                    iterator[path[j]] = {}
                }
                iterator = iterator[path[j]]
                while (Array.isArray(iterator)) {
                    if (iterator[arrays[array].index] == null) {
                        iterator[arrays[array].index] = {}
                    }
                    iterator = iterator[arrays[array++].index]
                }
            }
            var property = path.pop()
            if (Array.isArray(iterator[property])) {
                iterator = iterator[property]
                while (array < arrays.length - 1) {
                    iterator = iterator[arrays[array++].index]
                }
                iterator[arrays[array].index] = value
            } else {
                iterator[property] = value
            }
            if (Array.isArray(value)) {
                arrays.push({ index: 0, length: length })
            }
        })
    }
    return object
}
