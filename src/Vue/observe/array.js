let oldArrayPrototype = Array.prototype

export let arrayMethods = Object.create(oldArrayPrototype);

let methods = ['push','pop','shift','unshift','reverse','sort','splice']

methods.forEach((method)=>{
    arrayMethods[method] = function(...args){
        const result = oldArrayPrototype[method].apply(this,arguments)
        let inserted,
            ob = this.__ob__;
        
        switch(method){
            case 'push':// push,unshift可能会给数组添加对象，所以需要被再次劫持 Todo这里不用处理吗
            case 'unshift':
                inserted = agrs;
                break;
            case 'splice'://vue.$set原理
            args.splice(2);//arr.splice(0,1,{c:3})
            break;
        }

        //这里只重新监听数组里的对象，而不监听索引，比起监听所以少了很大一块性能消耗
        if(inserted) ob.observeArray(inserted)

        return result;
    }
})