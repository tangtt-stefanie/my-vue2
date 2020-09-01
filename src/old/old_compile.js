import { isElementNode , isTextNode , isDirective , getVal , setVal } from './old_utils'
import { Watcher } from '../Vue/watcher';

export class Compile{

    constructor(el,vm){

        //判断el是元素还是选择器
        this.el = isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        let nodeFragment = this.nodeToFragment(this.el)
        this.compile(nodeFragment)
        this.el.append(nodeFragment)
    }

    //将dom转为fragment
    nodeToFragment(node){

        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = node.firstChild){
            fragment.append(firstChild)
        }

        return fragment
    }

    //编译fragment
    compile(fragment){
        [...fragment.childNodes].forEach((child)=>{
            if(isElementNode(child)){
                this.compileElementNode(child)
                if(child.childNodes.length !== 0 ){
                    this.compile(child)
                }
            }
            if(isTextNode(child)){
                this.compileTextNode(child)
            }
        })
        return fragment;
    }

    //编译元素节点
    compileElementNode(node){
        [...node.attributes].forEach((attr)=>{
            let { name , value } = attr;
            if(isDirective(name)){
                let directive = name.split('-')[1]
                CompileUtil[directive](node,value,this.vm)
            }
        })
    }

    //编译文本节点
    compileTextNode(node){
        let content = node.textContent;
        if(/\{\{(.+?)\}\}/.test(content)){
            CompileUtil['text'](node,content,this.vm)
        }
    }
}

const CompileUtil = {
    model(node,expr,vm){
        new Watcher(vm,expr,()=>{
            Update.model(node,expr,vm)
        })
        node.addEventListener('input',(e)=>{
            let value = e.target.value;
            setVal(vm,expr,value);
        })
        Update.model(node,expr,vm)
    },
    html(){
    },
    text(node,content,vm){
        Update.text(node,content,vm);
    },
    bind(){

    },
    on(){

    }
}

const Update = {
    model(node,expr,vm){
        let nodeValue = getVal(vm,expr)
        node.value = nodeValue;
    },
    text(node,content,vm){
        let textContent = content.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            let expr = args[1];
            new Watcher(vm,expr,()=>{
                let textContent = content.replace(/\{\{(.+?)\}\}/g,(...args)=>{
                    return getVal(vm,args[1])
                })
                node.textContent = textContent
            });
            return getVal(vm,expr)
        })
        node.textContent = textContent
    }
}
