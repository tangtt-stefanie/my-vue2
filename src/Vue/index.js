import { initMixin } from './init/init' 
import { lifecycleMixin } from './init/lifecycle'
import { renderMixin } from './vdom'

function Vue(option){
    this._init(option)
}

//初始化各种Mixin
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)


export default Vue