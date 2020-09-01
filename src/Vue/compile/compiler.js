import { parseHtml } from './parseHtml'
import { generate } from './generate'

export function compileToFunctions(tamplate) {
    //html => render函数
    //1.将html代码转化成'ast'语法树 可以用ast树来描述语言本身
    let ast = parseHtml(tamplate);//节点树
    console.log('ast--',ast)

    //2.优化静态节点Todo


    //3.通过这棵树重新生成代码
    let code = generate(ast)
    console.log('code----',code)
    

    //4.将字符串变成函数  通过with给限制取值范围 
    //例子: obj={a:1,b:2}  with(obj){console.log(a,b)}  输出1,2
    let render = new Function(`with(this){return ${code}}`)
    
    console.log(render)

    return render
}
