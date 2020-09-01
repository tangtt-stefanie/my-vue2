export function patch(oldVnode,vnode){
    //oldVnode是真实的之前已经渲染完成的dom或者第一次加载时为渲染的dom
    //vnode是新的要渲染的虚拟dom
    //将虚拟节点转成真实节点
    let el = createElm(vnode);//产生真实dom
    let parentElm = oldVnode.parentNode//获取之前渲染的dom的父元素
    parentElm.insertBefore(el,oldVnode.nextSibling)//将当前要渲染的dom插入到之前渲染的前面
    parentElm.removeChild(oldVnode)//删除老的dom
}

// let num = 0;
//将虚拟dom转换成真实dom
function createElm(vnode){
    let {type,data,key,children,text} = vnode;
    if(typeof type === 'string'){//元素节点
        vnode.el = document.createElement(type)
        // if(num === 0){
        //     vnode.el.id="app"
        //     num++
        // }
        
        children.forEach(child=>{
            vnode.el.appendChild(createElm(child))
        })
    }else{//文本节点
        vnode.el = document.createTextNode(text)
    }

    return vnode.el
}