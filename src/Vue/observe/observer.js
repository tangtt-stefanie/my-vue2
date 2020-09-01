import { Dep } from './dep'
import { arrayMethods } from './array'

export class Observer{
    constructor(data){

        //data.__ob__ = this  不行吗？Observer上没有可枚举属性
        Object.defineProperty(data,'__ob__',{
            enumerable:false,//不可枚举
            configurable:false,//不可操作(比如删除)
            value:this
        })

        //对数组的索引也进行监听的话太耗费性能，比如数组的长度非常非常长，所以数组要劫持方法，不对索引进行监听
        if(Array.isArray(data)){
            data._proto__ = arrayMethods
            this.observeArray(data)
        }else{
            this.walk(data)
        }
    }

    observeArray(arr){
        arr.forEach((item)=>{
            observe(item)
        })
    }

    walk(data){
        let keys = Object.keys(data)
        keys.forEach((key)=>{
            defienReactive(data,key,data[key])
        })
    }
}

function defienReactive(obj,key,value){
    //深度监听
    observe(value)
    //每个key都存一个Dep
    let dep = new Dep();

    Object.defineProperty(obj,key,{
        get:()=>{
            //new Wacther()时会把watcher放在Dep.target上，并自动调用一次get方法，此时就可以进行订阅
            dep.depend();
            return value
        },
        set:(newVal)=>{
            if(newVal !== value){
                //新值进行监听
                observe(newVal)
                value = newVal;
                //发布
                dep.notify();
            }
        }
    })
}

export function observe(data){
    //不是对象或者数组就返回
    if(typeof data !== 'object' || data === null){
        return
    }

    if(data.__ob__){//避免重复监听，比如vm._data.info2 = vm._data.info1
        return
    }

    return new Observer(data)
}