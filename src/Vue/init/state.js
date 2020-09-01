import { observe } from "../observe/observer"
import { Dep } from "../observe/dep"
import { Watcher } from "../observe/watcher"

export function initState(vm){
    const opts = vm.$options
    if(opts.props){
        initProps(vm)
    }
    if(opts.methods){
        initMethods(vm)
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed(vm)
    }
    if(opts.watch){
        initWatch(vm)
    }
}

function initProps(vm){

}

function initMethods(vm){
    
}

function initData(vm){
    let data = vm.$options.data
    vm._data = data = typeof data === 'function' ? data.call(vm) : data  
    Object.keys(data).forEach((key)=>{
        Object.defineProperty(vm,key,{
            get:()=>{
                return data[key]
            }
        })
    })
    
    observe(data)
}

function initComputed(vm){
    let computed = vm.$options.computed
    Object.keys(computed).forEach((key)=>{
        let dep = new Dep()
        let watcher = new Watcher(vm,undefined,computed[key],{computed:true,dirty:true,dep:dep});
        Object.defineProperty(vm,key,{
            get:()=>{
                return watcher.evaluate()
            }
        })
    })
}

function initWatch(vm){
    
}