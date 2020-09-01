import { Compile } from './old_compile'
import { Observer } from './observer'
import { Watcher } from './watcher';

import { initMixin } from './init' 

export class Vue {
    constructor(options){
        //绑定数据
        this._init()
        this.$el = options.el;
        this.$data = options.data;
        this.$methods = options.methods;
        this.$computed = options.computed;

        //根据是否传了el来判断是否编译
        if(this.$el){
            //监听数据
            new Observer(this.$data);
            //把vm.$data代理到vm上
            this.proxyVm(this.$data)

            let computed = this.$computed;
            let dirty = true;
            let value;
            for(let key in computed){
                let watcher = new Watcher(this,key,computed[key],{computed:true,dirty:true});
                Object.defineProperty(this,key,{
                    get:()=>{
                        if (watcher.dirty) {
                            watcher.evaluate()
                        }
                        return watcher.oldValue
                    }
                })
            }

            //编译
            new Compile(this.$el,this)
        }
    }
}

initMixin(Vue)

