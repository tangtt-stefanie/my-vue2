
//返回目标类型
const typeToString = (target) => {
    return Object.prototype.toString.call(target).slice(8, -1);
}

const isElementNode = (node)=>{
    return node.nodeType === 1;
}

const isTextNode = (node)=>{
    return node.nodeType === 3;
}

const isDirective = (name)=>{
    return name.startsWith('v-');
}

const isObject = (obj)=>{
    return typeToString(obj) === 'Object'
}

 //根据表达式获取数据
const getVal = (data,expr)=>{
    return expr.split('.').reduce((data,current)=>{
        return data[current]
    },data)
}

const setVal = (data,expr,value)=>{
    expr.split('.').reduce((data,current,index,arr)=>{
        if(index === arr.length-1){
            data[current] = value;
        }
        return data[current]
    },data)
}


export {
    isElementNode,
    isTextNode,
    isDirective,
    isObject,
    getVal,
    setVal
}