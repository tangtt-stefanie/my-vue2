import Vue from './Vue/index'
import { Watcher } from './Vue/observe/watcher'
import { patch, renderDom } from './Vue/vdom/patch'

let vm = new Vue({
    el:'#app',
    template:document.querySelector('template').content.children[0].outerHTML,
    data:{
        address:"张家界",
        name:'wanger',
        user:{
            name:'zhangsan',
            age:22,
            info:{
                sex:2
            }
        }
    },
    method:{
        show(){
            console.log('show')
        }
    },
    computed:{
        getNewName(){
            // console.log('getNewName')
            return this.user.name+"--logo";
        }
    },
    // template:'<div>1</div>',
    // render(h){
    //     return h()
    // }

    //渲染操作顺序
    //1.先找render方法(无论是否传template)
    //2.没有render查找template
    //3.以上都没有，就找el对应的模板进行渲染
    //4.没有el看是否调用了$mount
    //ast解析template => render函数
})


// vm.$mount('#app')

// new Watcher(vm,'getNewName',(value)=>{
//     console.log('lll----',value)
// })

// setTimeout(()=>{
//     vm.$options.data.address = 'zhangsanfeng'
//     console.log('address----',vm.$options.data)
// },2000)

// setTimeout(()=>{
//     vm.user.name = 'lisi'
// },5000)

// setTimeout(()=>{
//     console.log('test2----',vm.getNewName)
// },8000)

let _c = Vue.prototype._c
let _s = Vue.prototype._s
let _v = Vue.prototype._v

// let newVnode = function(){
//         return _c('div',{},
//             _c('li',{style:{background:'red'},key:'A'},_v('A')),
//             _c('li',{style:{background:'yellow'},key:'B'},_v('B')),
//             _c('li',{style:{background:'blue'},key:'H'},_v('H')),
//             _c('li',{style:{background:'green'}},_v('key111')),
//             _c('li',{style:{background:'red'},key:'I'},_v('I')),
//             _c('li',{style:{background:'yellow'},key:'J'},_v('J')),
//             _c('li',{style:{background:'blue'},key:'C'},_v('C')),
//             _c('li',{style:{background:'green'},key:'D'},_v('D')),
//             _c('li',{style:{background:'red'}},_v('key222'))
//         )
// }()



// let oldVnode = function(){
//     return _c('div',{},
//         _c('li',{style:{background:'green'},key:'D'},_v('D')),
//         _c('li',{style:{background:'red'},id:'A',key:'A'},_v('A')),
//         _c('li',{style:{background:'yellow'},key:'B'},_v('B')),
//         _c('li',{style:{background:'blue'},key:'C'},_v('C')),
//         _c('li',{style:{background:'orange'},key:'F'},_v('F')),
//         _c('li',{style:{background:'purple'},key:'E'},_v('E')),
//     )
// }()


// let oldVnode = function(){
//     return _c('div',{},
//         _c('li',{style:{background:'green'}},_c('input',{type:'checkbox'}),_v('A')),
//         _c('li',{style:{background:'red'}},_c('input',{type:'checkbox'}),_v('B')),
//         _c('li',{style:{background:'yellow'}},_c('input',{type:'checkbox'}),_v('C'))
//     )
// }()

// let newVnode = function(){
//     return _c('div',{},
//         _c('li',{style:{background:'red'}},_c('input',{type:'checkbox'}),_v('B')),
//         _c('li',{style:{background:'yellow'}},_c('input',{type:'checkbox'}),_v('C'))
//     )
// }()


let oldVnode = function(){
    return _c('div',{},
        _c('input',{style:{background:'green'},type:'checkbox'},_v('A')),
        _c('input',{style:{background:'red'},type:'checkbox'},_v('B')),
        _c('input',{style:{background:'yellow'},type:'checkbox'},_v('C'))
    )
}()

let newVnode = function(){
    return _c('div',{},
        _c('input',{style:{background:'red'},type:'checkbox'},_v('B')),
        _c('input',{style:{background:'yellow'},type:'checkbox'},_v('C'))
    )
}()

renderDom(oldVnode,document.getElementById('app'))


setTimeout(() => {
    patch(oldVnode,newVnode)
}, 2000);




