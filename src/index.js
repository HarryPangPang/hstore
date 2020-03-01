var _HStore = Object.create(null)
var _process_list = []
var processing = false
var has_init = false //是否已经初始化
function init_hstate(init_modules) {
    if (has_init) {
        throw new Error('Has init already')
    }
    if (!init_modules) {
        throw new Error('Has no init modules')
    }
    if (Object.prototype.toString.call(init_modules) !== "[object Object]") {
        throw new Error('Has wrong type')
    }
    has_init = true
    return init_modules
}

function get_hstate(data) {
    if (!has_init) {
        throw new Error('Please init before')
    }
    if (!data || typeof (data) !== 'string') {
        throw new Error('Please set the data path like "a.b.c')
    }
    let data_path = data.split('.')
    var get_result = null
    for (let i = 0; i < data_path.length; i++) {
        get_result = STORE_CENTER[data_path[i]]
        console.log(get_result)
    }
    console.log(STORE_CENTER[data_path[i]])

}

var STORE_CENTER = new Proxy(_HStore, {
    get: function (obj, prop) {
        // console.log(obj)
        // console.log(prop)
        let root = obj['root']
        if (!has_init) {
            throw new Error('Please init before')
        }
        if (!prop || prop.indexOf(',') > -1 || prop.indexOf('Object') > -1) {
            throw new Error('Please set the data path like "a.b.c')
        }
        var get_result = obj['root']
        var data_path = prop.split('.')
        for (let i = 0; i < data_path.length; i++) {
            get_result = get_result[data_path[i]]
        }
        return get_result
    },
    set: function (obj, prop, value) {

        if (!has_init) {
            obj[prop] = init_hstate(value)
            window.hstate = _HStore['root']
        }
        if (prop && prop === 'modify') {
            let _path,
                _value,
                type = value.type || '',
                data = value.data || '',
                cacheRoot = obj['root']

            if (!type || !data) {
                throw new Error('Wrong args given')
            }
            _path = value.data.path
            _value = value.data.value || null
            if (!_path) {
                throw new Error('Wrong path given')
            }
            _path = _path.split('.')
            switch (type) {
                case 'add':
                    for (let i = 0; i < _path.length; i++) {
                        if (!cacheRoot[_path[i]]) {
                            cacheRoot[_path[i]] = _value
                        } else {
                            cacheRoot = cacheRoot[_path[i]]
                        }
                    }
                    break;
                case 'update':
                    for (let i = 0; i < _path.length; i++) {
                        if (!cacheRoot[_path[i]]) {
                           throw new Error('has no attr')
                        } else {
                            if (i === _path.length - 1) {
                                cacheRoot[_path[i]] = _value
                            }else{
                                cacheRoot = cacheRoot[_path[i]]
                            }
                        }
                    }
                    break;
                case 'delete':
                    for (let i = 0; i < _path.length; i++) {
                        if (i === _path.length - 1) {
                            delete cacheRoot[_path[i]]
                        } else {
                            cacheRoot = cacheRoot[_path[i]]
                        }
                    }
                default:
                    break;
            }
        }

        return true
    }
})


function HStore({ type, data }) {
    if (type === 'init') {
        return STORE_CENTER['root'] = data
    }

    if (type === 'query') {
        return STORE_CENTER[data]
    }
    if (['update', 'add', 'delete'].indexOf(type) > -1) {
        return STORE_CENTER['modify'] = {
            type,
            data
        }
    }

}
export default HStore
// export {
//     init_hstate,
//     get_hstate,
//     modify_hstate
// }
