import { renderDom } from "../vdom/patch";

export function lifecycleMixin(Vue){
    Vue.prototype._update = function(vnode){//把虚拟节点转成真实dom渲染到el上
        let vm = this;
        renderDom(vnode,document.querySelector(vm.$options.el),vm)//把虚拟节点转成真实节点并挂载
    }
}


