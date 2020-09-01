// 注:此编译未实现的部分:自闭合标签<input>,v-model这种带-的属性,@,:属性
//需要验证正则是否正确可以去百度正则可视化工具

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //标签名
// ?表示匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //<my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); //标签开头的正则，捕获内容是标签名 <my
const startTagClose = /^\s*(\/?)>/; //匹配结束标签的   >    />
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); //匹配标签结尾的正则 </my>
//匹配属性的 aaa="zhangsan" a='aaa' a=aaa
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{xxxx}}


export function parseHtml(html) {

    let root,//根节点
    currentParent,//当前父节点
    stack = [] //为了添加节点的父子关系，用数组模拟栈结构来实现，具体实现看end()

    function createASTElement(tagName,type,attrs=[],text=null,children=[],parent=null){//创建AST element
        return {
            tagName,
            type,
            attrs,
            text,
            children,
            parent
        }
    }

    function start(tagName, attrs) {//开始标签编译后做处理
        let element = createASTElement(tagName,1,attrs)
        if(!root){
            root = element
        }
        currentParent = element
        stack.push(element)
    }

    function end(tagName) {//结束标签编译后做处理,这里用作实现父子关系的确定
        //结束标签和开始标签不匹配要报错  Todo
        if(stack.length > 1){
            let child = stack.pop()
            currentParent = stack[stack.length-1]
            child.parent = currentParent
            currentParent.children.push(child)
        }
    }

    function chars(text) {//文本节点的处理
        text = text.replace(/\s/g,'')//这里的空格没处理完全,待处理  Todo
        if(text){
            let element = createASTElement('text',3,null,text,null,currentParent)
            currentParent.children.push(element)
        }
    }

    while (html) {
        //只要html不为空
        let textEnd = html.indexOf("<");
        if (textEnd === 0) {//肯定是标签<tag...
            //console.log("检测到<-----", html);

            //startTagMatch为开始标签解析的结果{tagName:"tag",//标签名称attrs:[{name:attr,value:value}]//标签属性}
            //如果解析不成功则startTagMatch为undefined
            const startTagMatch = parseStartTag();
            if(startTagMatch){//肯定是开始标签  <tag...
                start(startTagMatch.tagName,startTagMatch.attrs)
                //console.log('html---',html)
                continue;
            }
            
            const endTagMatch = html.match(endTag)
            if(endTagMatch){//肯定是结束标签 </tag> 
                intercept(endTagMatch[0].length)
                end(endTagMatch[1])
                //console.log('end----',html.length === 0 ? '解析结束':'解析继续',html)
                //console.log('root----',root)//最终生成虚拟节点树存储在root中
                continue
            }
        }

        let text;
        if(textEnd > 0){//肯定是文本  "    hello       <div..."
            text = html.substring(0,textEnd)
            chars(text)
            intercept(textEnd)
        }

    }

    function parseStartTag() {//转换标签前半部分 <tag attr="value">
        //match结果类数组:正则表达式中一个括号匹配的内容表示一个内容，按次序在类数组中排列，以及index，input,groups属性
        let start = html.match(startTagOpen);//不理解这段正则的匹配!!!!!???? Todo
        //console.log('start---',start)
        if(start){
            const match = {
                tagName:start[1],//标签名称
                attrs:[]//标签属性
            }
            intercept(start[0].length)//去除开始标签:<tag
            //console.log(html)

            let end,
                attr;
            //!html.match(startTagClose)没有有闭合标签且有属性html.match(attribute)就往下执行
            while(!(end = html.match(startTagClose)) && (attr=html.match(attribute))){
                match.attrs.push({name:attr[1],value:attr[3]||attr[4]||attr[5]})
                intercept(attr[0].length)//去除当前属性标签:attr="value"
            }

            if(end){
                intercept(end[0].length)//去除属性结束标签:>
                return match
            }
        }
    }

    function intercept(index){//截取剩余内容并赋值给html
        html = html.substring(index)
    }

    return root //返回处理好的节树
}