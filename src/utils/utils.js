const TEXT_ELEMENT = "TEXT ELEMENT"
let rootInstance = null
const createElement = (type, config, ...args) => {
  const props = Object.assign({}, config)
  const isChilren = args.length > 0
  props.rawChildren = isChilren ? [...args] : []
  props.children = props.rawChildren.filter((child) => child !== null && child !== false).map((child) => (child instanceof Object ? child : createTextNode(child)))
  return { type, props }
}

const createTextNode = (value) => createElement(TEXT_ELEMENT, { nodeValue: value })

const updateDomProperties = (dom, prevProps, nextProps) => {
  const isListener = (name) => name.startsWith("on")
  const isAttribute = (name) => !isListener(name) && name !== "children"

  Object.keys(prevProps)
    .filter(isListener)
    .forEach((name) => {
      dom.removeEventListener(name.slice(2).toLocaleLowerCase(), prevProps[name])
    })
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = null
    })
  Object.keys(nextProps)
    .filter(isListener)
    .forEach((name) => {
      dom.addEventListener(name.slice(2).toLocaleLowerCase(), nextProps[name])
    })
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = prevProps[name]
    })
}

const instantiate = (element) => {
  const { type, props } = element
  const isTextElement = type === TEXT_ELEMENT
  const dom = isTextElement ? document.createTextNode(props.text) : document.createElement(type)

  updateDomProperties(dom, {}, props)

  const elementChildren = Array.isArray(props.children) ? props.children : []
  const childInstances = elementChildren.map(instantiate)
  const childDoms = childInstances.map((childInstance) => childInstance.dom)
  childDoms.forEach((childDom) => dom.appendChild(childDom))

  return { dom, element, childInstances }
}

const reconcile = (parentDom, instance, element) => {
  const newInstance = instantiate(element)
  if (instance === null) {
    parentDom.appendChild(newInstance.dom)
  } else if (instance.element.type !== newInstance.element.type) {
    updateDomProperties(newInstance.dom, instance.element.props, element.props)
    instance.element = element
    return instance
  } else {
    parentDom.replaceChild(newInstance.dom, instance.dom)
  }
  return newInstance
}

const render = (element, parentDom) => {
  const preInstance = rootInstance
  rootInstance = reconcile(parentDom, preInstance, element)
}

class Stack {
  constructor() {
    this.items = []
  }

  push(item) {
    this.items.push(item)
  }
  pop() {
    return this.items.pop()
  }
  peek() {
    return this.items[this.items.length - 1]
  }
  isEmpty() {
    return this.items.length === 0
  }
  size() {
    return this.items.length
  }
  toString() {
    let result = ''
    this.items.forEach(item => {
      result += item + ' '
    })
    return result
  }
}

const dec2bin = (dec) => {
  const stack = new Stack()

  while (dec > 0) {
    stack.push(dec % 2)
    dec = Math.floor(dec / 2)
  }
  let result = ''
  while (!stack.isEmpty()) {
    result += stack.pop()
  }
  return result
}


class Queue {
  constructor() {
    this.items = []
  }
  enqueue(item) {
    this.items.push(item)
  }
  dequeue() {
    return this.items.shift()
  }
  front() {
    return this.items[0]
  }
  isEmpty() {
    return this.items.length === 0
  }
  size() {
    return this.items.length
  }
  toString() {
    let result = ''
    this.items.forEach(item => {
      result += item + ' '
    })
    return result
  }

}

const jiguchuanhua = (list, num) => {
  const queue = new Queue()
  list.forEach(item => queue.enqueue(item))
  while (queue.size > 1) {
    for (let i = 0; i < num - 1; i++) {
      queue.enqueue(queue.dequeue)
    }
    queue.dequeue()
  }
  const endName = queue.front()
  return list.indexOf(endName)
}


class QueueElement {
  constructor(element, priority) {
    this.element = element
    this.priority = priority
  }
}

class PriorityQueue extends Queue {
  constructor() {
    super()
  }
  enqueue(element, priority) {
    let added = false
    const queueElement = new QueueElement(element, priority)
    this.items.forEach((item, index) => {
      if (item.priority > queueElement.priority) {
        this.items.splice(index, 1, queueElement)
        added = true
        return
      }
    })
    if (!added) {
      this.items.push(queueElement)
    }
  }
}

class LinkedList {
  head = null;
  length = 0;
  Node = class {
    data;
    next = null;
    constructor(data) {
      this.data = data
    }
  }
  append(data) {
    const newNode = new this.Node(data)

    if (this.length === 0) {
      this.head = newNode
    } else {
      let currentNode = this.head
      while (currentNode.next !== null) {
        currentNode = currentNode.next
      }
      currentNode.next = newNode
    }
    this.length++
  }
  toString(){
    let currentNode = this.head
    let result = ''
    while(currentNode){
      result += currentNode.data + ' '
      currentNode = currentNode.next
    }
    return result
  }
  insert(position,data){
    const newNode = new this.Node(data)
    if(position < 0 || position > this.length) return
    if(position === 0){
      newNode.next = this.head
      this.head = newNode
    }else{
      let currentNode = this.head
      while(position>0){
        position--
        currentNode = currentNode.next
      }
    }
  }
}
const linkedList = new LinkedList()

const getToltal = (list,target)=>{
  for(let i = 0;i<list.length;i++){
    for(let j = i+1;j<list.length;j++){
      if(list[i]+list[j]==target){
        return [i,j]
      }
    }
  }
  return []
}

const getToltal2 = (list,list2)=>{
  const one = Number(list.toString().replaceAll(',',''))
  const two = Number(list2.toString().replaceAll(',',''))
  return one+two
}

export { render, createElement, createTextNode, dec2bin, jiguchuanhua, linkedList,getToltal,getToltal2 }



/**
 * 获取事件参数
 * @param {Array} eventParam - 事件参数配置数组
 * @param {Object} comList - 组件列表
 * @param {Object} route - 路由对象
 * @returns {Promise<Object>} 包含所有参数的对象
 * @description 
 * 1. 支持多种参数获取方式：
 *    - router: 从路由参数中获取
 *    - pageWidget: 从页面组件中获取
 *    - fixedValue: 固定值
 *    - js: 通过JavaScript代码动态计算
 *    - staticValue: 静态值
 * 2. 自动处理异步操作
 * 3. 返回参数对象或逗号分隔的字符串
 */
export const getEventParam = async (eventParam = [], comList = {}, route = {}) => {
  if (!Array.isArray(eventParam) || eventParam.length === 0) {
    return {};
  }

  let param = {};

  // 处理每个参数项
  const promises = eventParam.map(async (element) => {
    if (element.getType !== 'staticValue') {
      try {
        switch (element.getType) {
          case 'router': // 从路由参数中获取
            param[element.paramName] = lodash.isEmpty(route.params[element.param])
              ? ""
              : route.params[element.param];
            break;

          case 'pageWidget': // 从页面组件中获取
            if (comList[element.target]?.[element.event]) {
              param[element.paramName] = await comList[element.target][element.event](
                getEventParam(element.eventParam, comList, route)
              );
            }
            break;

          case 'fixedValue': // 固定值
            param[element.paramName] = route.params[element.param] || "";
            break;

          case 'js': // 通过JavaScript代码动态计算
            if (element.paramName) {
              const customFunc = new Function('comList', element.jsFun);
              param[element.paramName] = customFunc(comList);
            }
            break;

          case 'staticValue': // 静态值
            param = lodash.isEmpty(param) ? [] : param;
            param.push(element.paramName);
            break;

          default:
            console.warn(`未知的getType: ${element.getType}`);
        }
      } catch (error) {
        console.error(`处理事件参数时出错:`, error);
        param[element.paramName] = null;
      }
    }
  });

  await Promise.all(promises);

  // 返回结果，如果是数组则转换为逗号分隔的字符串
  return lodash.isArray(param)
    ? param.join(',')
    : param;
};
// 执行拼接方法
// const result = getEventParam(eventParam, comList, route);
export const evenFun = async (clickArr, comList, route, util, response) => {
  for (let i = 0; i < clickArr.length; i++) {
      const element = clickArr[i];
      try {
        switch (element.type) {
          case 1: // 操作组件
            if (element.target) {
                let eParam = {};
                if (element.eventParam && element.eventParam.length > 0) {
                    eParam = await util.getEventParam(element.eventParam, comList, route);
                }
                const paramStr = lodash.isEmpty(eParam) ? '' : JSON.stringify(eParam);

                const callback = async (response) => {
                    if (element.callBackArr && element.callBackArr.length > 0) {
                        await util.evenFun(element.callBackArr, comList, route, util, response);
                    }
                };

                let customFunc;
                if (!lodash.isEmpty(element.callBackArr)) {
                    const args = paramStr ? `${paramStr}, async (response) => { await (${callback.toString()})(response); }` : `async (response) => { await (${callback.toString()})(response); }`;
                    customFunc = new Function('comList', 'element','route', 'util', `comList["${element.target}"].${element.event}(${args})`);
                } else {
                    customFunc = new Function('comList', 'element','route', 'util', `comList["${element.target}"].${element.event}(${paramStr})`);
                }

                customFunc.call(this, comList, element,route, util);
            }
            break;
          case 2: // 接口操作
            if (element.script) {
                const customFunc = new Function('comList', element.script);
                customFunc.call(this, comList);
            }
            break;
          case 3: // 脚本计算
            let script;
            if (element.event) {
                script = element.event;
            } else if (element.script) {
                script = element.script;
            } else if (element.eventArr) {
                script = element.eventArr;
            }
            if (script) {
              const customFunc = new Function('comList', 'response', script);
              customFunc.call(this, comList, response);
            }
            break;
          }
      } catch (error) {
          console.error(`执行操作时出错:`, error);
      }
  }
};
export const evenFun2 = async (clickArr, that, response,row) => {
  const refList = {...that.refList,...that.iframe}
  const route = that.$route
  const util = that.$util

  for (let i = 0; i < clickArr.length; i++) {
    const {target, functionStr, paramList, type, callbackArr, jsFunStr, url} = clickArr[i];
    try {
      switch(type) {
        case 100: // 组件方法
          if(target) {
            // 处理参数
            let eParam = {};
            if (paramList?.length > 0) {
              eParam = await util.getEventParam(paramList,refList, that,row);
            }
            const paramStr = that.$lodash.isEmpty(eParam) ? '' : JSON.stringify(eParam);

            // 执行组件方法
            let functionBody = `return refList["${target}"].${functionStr}(${paramStr})`;
            const customFunc = new Function('refList', functionBody);
            const result = await customFunc.call(that, refList);
            // 处理回调
            if (!that.$lodash.isEmpty(callbackArr) && result) {
              await evenFun(callbackArr, that, result);
            }
          }
          break;
        case 1: // 重置表单
          await new Function('refList', `return refList["${target}"].resetForm()`).call(that, refList);

          break;
        case 2: // 打开弹窗
          let eParam = {};
          if (paramList?.length > 0) {
            eParam = await util.getEventParam(paramList,refList, that,row);
          }
          const paramStr = that.$lodash.isEmpty(eParam) ? '' : JSON.stringify(eParam);
          await new Function('refList', `return refList["${target}"].openFun(${paramStr})`).call(that, refList);
      
        break;
        case 3: // 关闭弹窗
          await new Function('refList', `return refList["${target}"].closeFun()`).call(that, refList);
      
        break;
        case 4: // 跳转链接
          const jumpParam = paramList?.length > 0 
            ? await util.getEventParam(paramList,refList, that,row)
            : {};
          const jumpParamStr = that.$lodash.isEmpty(jumpParam) ? '' : JSON.stringify(jumpParam);
          const isBlank = target === '_blank';
          const baseUrl = isBlank ? '#/new/page/' : '#/ic/page/';
          if (jumpParamStr.length) {
            let paramStr = that.$objToUrl(jumpParam)
            that.$openNewWindow(`${baseUrl}${url}?${paramStr}`, target);
          } else {
            that.$openNewWindow(`${baseUrl}${url}`, target);
          }
      
        break;
        case 5: // 关闭窗口
          window.close();
          break;
        case 6: // 接口操作
          const operationParam = paramList?.length > 0 
            ? await util.getEventParam(paramList,refList, that,row)
            : {};
          const result = await util.asyncOperationFun(target, operationParam,()=>{}, that,2);

          if (!that.$lodash.isEmpty(callbackArr)) {
            await evenFun(callbackArr, that, result);
          }
          
          break;
        case 7: // 查询操作
          const searchParam = paramList?.length > 0 
            ? await util.getEventParam(paramList,refList, that,row)
            : {};
          const searchParamStr = that.$lodash.isEmpty(searchParam) ? '' : JSON.stringify(searchParam);
          await new Function('refList', `return refList["${target}"].sourceDataFun(${searchParamStr})`).call(that, refList);
          break;
        case 8: // 脚本计算
          if (jsFunStr) {
            const customFunc = new Function('refList', 'response', jsFunStr);
            const result = await customFunc.call(that, refList, response);
            
            if (!that.$lodash.isEmpty(callbackArr)) {
              await evenFun(callbackArr, that, result);
            }
          }
          break;
        case 9: // 表单校验
          const validateResult = await new Function('refList', `return refList["${target}"].validateFun()`).call(that, refList);

          if (!that.$lodash.isEmpty(callbackArr) && validateResult) {
            await evenFun(callbackArr, that, validateResult);
          }
      
        break;
        case 11: //刷新表格
          await new Function('refList', `return refList["${target}"].refreshFun()`).call(that, refList);
        break
        default:
          console.warn(`未处理的操作类型: ${type}`);
          break;
      }
    } catch(error) {
      console.error(`执行操作时出错:`, error, {
        type,
        target,
        functionStr,
        paramList,
        callbackArr,
        jsFunStr
      });
    }
  }
};