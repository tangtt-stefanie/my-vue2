

function geneProps(attrs){//编译属性部分
    // console.log('attrs----',attrs)
    let str = ''
    attrs.forEach(attr => {
        if(attr.name === 'style'){
            let obj = {}
            attr.value.split(';').forEach(item=>{
                let [key,value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    });
    str = `{${str.slice(0,-1)}}`
    return str
}

function genChildren(el){//翻译children
    let children = el.children
    if(children){
        return children.map(child=>genChild(child)).join(',')
    }
}

function genChild(child){//翻译children里的每个节点
    if(child.type === 1){
        return generate(child)//返回元素节点字符串_c('div',style:{"color":"red","height":"100px"},_v("hello"),_c())
    }else{
        let text = child.text
        const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{xxxx}}
        if(!defaultTagRE.test(text)){
            return `_v(${JSON.stringify(text)})`
        }

        //let mtext = 'hello {{user.name}} ------    {{user.age}}    {{address}}  school'
        //defaultTagRE.test(mtext)  defaultTagRE.exec(mtext) 
        //每次test后defaultTagRE.lastindex会变为刚匹配的字符串最后一位的位置加1
        let tokens = [] // 存放text里的每一段内容代码,普通值和{{}}分开来放
        let lastIndex = defaultTagRE.lastIndex = 0
        let index,match;
        while(match = defaultTagRE.exec(text)){
            if(match.index > lastIndex){//说明两个大括号之间还有普通文本内容，空文本内容也push进去
                tokens.push(JSON.stringify(text.slice(lastIndex,match.index)))
            }
            tokens.push(`_s(${match[1].trim()})`)

            // console.log('_s--------',adderss)
            lastIndex = defaultTagRE.lastIndex
        }

        if(text.length>lastIndex){//大括号后面还有文本内容
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        return `_v(${tokens.join(',')})`  //_v('hello',_s(user.name)....)
    }
}

export function generate(el){
    let children = genChildren(el);
    // let code = `_c('${el.tagName}',${el.attrs.length? '{style:{color:red}}' : 'undefined'})`
    let code = `_c('${el.tagName}',${el.attrs.length? geneProps(el.attrs) : 'undefined'},${children?children:JSON.stringify('')})`

    return code;
}