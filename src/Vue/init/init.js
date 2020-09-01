import { initState } from "./state"
import { compileToFunctions } from '../compile/compiler'
// import { Watcher } from './watcher'

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this
        vm.$options = options

        //初始化状态，进行数据劫持
        initState(vm)

        //如果有el属性

        if(vm.$options.el){
            this.$mount(vm.$options.el)
            // new Watcher(vm,'address',(value)=>{
            //     this.$mount(vm.$options.el)
            // })
        }
    }

    //vue渲染流程:
    //初始化数据 => 将模板编译(ast) => 生成render函数(with(){return _c(_s(user.name))}) => 
    //生成虚拟节点(function _c(){ return vnode}) => 将vnode虚拟dom转成真实dom  => 挂载

    Vue.prototype.$mount = function(el){
        //挂载
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)

        if(!options.render){
            //没有render则把tamplate转成render方法
            let template = options.template
            if(!template && el){
                template = el.outerHTML
            }
            //把模板编译成render函数
            const render = compileToFunctions(template)//传入的是dom的字符串形式
            options.render = render
        }

        //调用_render方法获取虚拟dom
        let vnode = vm._render()

        //调用_update将虚拟节点转成真实dom并渲染到el上
        vm._update(vnode)
    }
}