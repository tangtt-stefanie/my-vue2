
export class Dep{
    constructor(){
        this.subs = []
    }

    //订阅
    addSub(watcher){
        this.subs.push(watcher)
    }

    //添加watcher
    depend(){
        if (Dep.target.length !== 0) {
            Dep.target.forEach((watcher)=>{
                this.addSub(watcher)
            })
        }
    }

    //发布
    notify(){
        let subs = this.subs.slice()
        subs.reverse()
        subs.forEach((watcher)=>{
            watcher.update()
        })
    }
}

Dep.target = []