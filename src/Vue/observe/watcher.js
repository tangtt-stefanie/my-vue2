import { getVal } from '../../old/old_utils'
import { Dep } from './dep'


export class Watcher{

    constructor(vm,expr,cb,options={}){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.jcb = cb.toString();
        this.options = options;
        this.computed = options.computed;
        this.dirty = options.dirty;
        this.dep = options.dep;
        if(!this.computed){
            this.oldValue = this.get();
        }
    }

    get(){
        Dep.target.push(this);
        let value = getVal(this.vm,this.expr);
        Dep.target.splice(-1,1);
        return value;
    }

    update(){
        if(this.computed === true){
            this.oldValue = this.cb.call(this.vm);
        }else{
            let newVal = getVal(this.vm,this.expr)
            if(newVal !== this.oldValue){
                //新值与旧值不同调用cb
                this.cb(newVal);
            }
        }
    }

    evaluate() {
        if(this.dirty === true){
            this.dirty = false;
            Dep.target.push(this);
            this.oldValue = this.cb.call(this.vm);
            Dep.target.splice(-1,1);
            return this.oldValue
        }else{
            return this.oldValue
        }
    }
}