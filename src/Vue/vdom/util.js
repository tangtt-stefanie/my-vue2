export function initRenderUtils(Vue){

    Vue.prototype._c = function(){//创建虚拟元素节点
        return createElement(...arguments)
    }

    Vue.prototype._s = function(val){//stringify
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
    }

    Vue.prototype._v = function(...text){//创建虚拟文本节点
        return createTextVnode(text.join(''))
    }

}

function createElement(type,props={},...children){//创建虚拟元素节点
    // console.log('createElement----',arguments)
    let key;
    if(props.key){
        key = props.key
        delete props.key
    }
    return vnode(type,props,key,children)
}

function createTextVnode(text){//创建虚拟文本节点
    // console.log('text---------',text)
    return vnode(undefined,undefined,undefined,undefined,text)
}

//创建虚拟node
function vnode(type,props,key,children,text){
    return {
        type,
        props,
        key,
        children,
        text
    }
}