export function renderDom(vnode,container,vm){
    let dom = createDomFromVnode(vnode,vm)
    // console.log('dom--------',dom,'vnode-----',vnode)
    // let parent = container.parentNode
    // parent.appendChild(dom)
    
    container.appendChild(dom)
}

//把vnode转换成真实dom
function createDomFromVnode(vnode,vm){
    let {type,props,key,children,text} = vnode;
    if(type){//有type说明是元素
        let domElement = document.createElement(type)
        updateProps(domElement,{},vnode.props,vm)
        vnode.domElement = domElement
        if(children.length !== 0 ){
            children.forEach((childNode)=>{
                renderDom(childNode,domElement,vm)//递归渲染子节点
            })
        }
    }else{//文本
        let domElement = document.createTextNode(text)
        vnode.domElement = domElement
    }

    return vnode.domElement
}

function updateProps(domElement,oldProps={},newProps,vm){//给真实dom添加虚拟节点中的属性
    //新旧比对,如果老vnode属性有,新vnode里没有这个属性，则在domElement中移除该属性
    for(let oldPropName in oldProps){
        if(!newProps[oldPropName]){
            delete domElement[oldPropName]
        }
    }

    //此处提前处理下style属性内部情况，后面就直接处理style属性了
    //如果新的style里面，老的有一个样式，新的没有，则删除该样式
    let newStyleObj = newProps.style || {}
    let oldStyleObj = oldProps.style || {}
    for(let propName in oldStyleObj){
        if(!newStyleObj[propName]){
            domElement.style[propName] = "" // 此处置为空了
        }
    }

    //如果老的没有，新的没有，直接覆盖
    for(let newPropName in newProps){
        if(newPropName === 'style'){
            let styleObj = newProps.style
            for(let style in styleObj){
                domElement.style[style] = styleObj[style]
            }
        }else if(newPropName === 'vclick'){//指令属性的处理
            setTimeout(function(){
                domElement.addEventListener('click', vm.$options.method[newProps[newPropName]])
            },0)
        }else{
            domElement[newPropName] = newProps[newPropName]
        }
    }
}


//diff：优化dom常见操作(1.首追加 2.尾追加 3.首元素移到末尾 4.尾元素移到首位),减少新创建dom元素的操作
//优化基本思路:针对四种情况进行移动,尽量变成顺序比对都一致的情况，以此减少新建DOM的操作
function updateChildren(parent,oldChildren,newChildren){
    let map = createKeyMap(oldChildren) // 给oldChildren中带key的子节点做个映射方便后面暴力比对使用
    //标记收尾标志，然后逐个对比
    let oldStartIndex = 0,
        oldStartVnode = oldChildren[0],
        oldEndIndex = oldChildren.length-1,
        oldEndVnode = oldChildren[oldEndIndex];

    let newStartIndex = 0,
        newStartVnode = newChildren[0],
        newEndIndex = newChildren.length-1,
        newEndVnode = newChildren[newEndIndex];

    //依次比对,新旧子元素只要有一方全部比对完毕就结束
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
        if(!oldStartVnode){
            oldStartVnode = oldChildren[++oldStartIndex]
        }else if(!oldEndVnode){
            oldEndVnode = oldChildren[--oldEndIndex]
        }else if(isSameVnode(oldStartVnode,newStartVnode)){//如果开始节点相同则往下继续比对
            //patch(oldStartVnode,newStartVnode)原因:dom diff时虽然判定为同一节点，但其实props有可能不同，
            //所以要在此更新一下,这也是为什么v-for中不加key时，key的值都是undefined,虽然属性可能变化了，但还是会复用元素的原因
            patch(oldStartVnode,newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex] 
        }else if(isSameVnode(oldEndVnode,newEndVnode)){//末尾节点相同
            patch(oldEndVnode,newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex] 
        }else if(isSameVnode(oldStartVnode,newEndVnode)){//old开始和new末尾节点相同
            patch(oldStartVnode,newEndVnode)
            parent.insertBefore(oldStartVnode.domElement,oldEndVnode.domElement.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        }else if(isSameVnode(oldEndVnode,newStartVnode)){//new开始和old末尾节点相同
            patch(oldEndVnode,newStartVnode)
            parent.insertBefore(oldEndVnode.domElement,oldStartVnode.domElement)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        }else{//暴力对比  
            let index = map[newStartVnode['key']]
            if(index === undefined){//oldChildren中没有相同key的元素则直接创建并插入到当前oldStartVnode之前
                parent.insertBefore(createDomFromVnode(newStartVnode),oldStartVnode.domElement)
            }else{
                let toMovedNode = oldChildren[index]
                parent.insertBefore(toMovedNode.domElement,oldStartVnode.domElement)
                patch(toMovedNode,newStartVnode)
                oldChildren[index] = undefined
            }
            newStartVnode = newChildren[++newStartIndex] 
        }
    }
    
    if(newStartIndex <= newEndIndex){//处理剩余的
        for(let i = newStartIndex;i <= newEndIndex;i++){
            let beforeElement = parent.childNodes[i] ? parent.childNodes[i] : null//beforeElement可以为null来模拟有一个节点
            parent.insertBefore(createDomFromVnode(newChildren[i]),beforeElement)
        }
    }
    if(oldStartIndex <= oldEndIndex){
        for(let i = oldStartIndex; i <= oldEndIndex; i++){
            if(oldChildren[i]){
                parent.removeChild(oldChildren[i].domElement)
            }
        }
    }
}

function isSameVnode(oldVnode,newVnode){//是否同一节点只比较  节点类型和key
    return oldVnode.key === newVnode.key && oldVnode.type === newVnode.type
}

export function patch(oldVnode,newVnode,vm){//比较新旧节点,更新属性,若有子节点，则调用updateChildren,以此完成更新oldVnode.domElement

    //类型不同
    if(oldVnode.type !== newVnode.type){
        return oldVnode.domElement.parentNode.replaceChild(createDomFromVnode(newVnode),oldVnode.domElement)
    }

    //类型相同,并且为文本类型
    if(oldVnode.text){
        if(oldVnode.text === newVnode.text) return
        return oldVnode.domElement.textContent = newVnode.text
    }

    //类型相同,并且为元素节点，则需要根据新节点属性更新老节点属性
    let domElement = oldVnode.domElement
    updateProps(domElement,oldVnode.props,newVnode.props)

    //比较子节点
    let oldChildren = oldVnode.children
    let newChildren = newVnode.children

    if(oldChildren.length > 0 && newChildren.length > 0){//1.新旧节点都有子节点
        updateChildren(domElement,oldChildren,newChildren)
    }else if(oldChildren.length > 0){//2.只有旧节点有子节点，新节点没有
        domElement.innerHTML = ''
    }else if(newChildren.length > 0){//3.只有新节点有子节点，旧节点没有
        newChildren.forEach((child)=>{
            domElement.appendChild(createDomFromVnode(child))
        })
    }


    //oldVnode的children没更新 TODO
} 

function createKeyMap(oldChildren){
    let map = {}
    for(let i = 0; i< oldChildren.length; i++){
        let current = oldChildren[i]
        if(current['key']){
            map[current['key']] = i
        }
    }
    return map
}