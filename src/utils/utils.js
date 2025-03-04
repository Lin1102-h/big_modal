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

export { render, createElement, createTextNode, dec2bin, jiguchuanhua }
