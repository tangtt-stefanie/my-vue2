import { initRenderUtils } from './util'

export function renderMixin(Vue){
    initRenderUtils(Vue);

    Vue.prototype._render = function(){//将render函数执行生成虚拟dom
        const vm = this
        const render = vm.$options.render
        let vnode = render.call(vm)

        console.log('vnode-----',vnode)

        return vnode;
    }
}




