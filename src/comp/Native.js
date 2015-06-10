var isCito = location.hash.indexOf('cito') > -1;
class Component {
    constructor(props) {
        this.props = props;
        //console.log("constructor", this.constructor.name);
    }

    setState(obj) {
        Object.keys(obj).forEach(key => this.state[key] = obj[key]);
        console.time('update');
        var node = this.render();
        if (isCito) {
            cito.vdom.update(this.node, node);
        }
        else {
            this.node.parentNode.replaceChild(node, this.node);
        }
        this.node = node;
        console.timeEnd('update');
        console.log("set state");
    }
}


function flatArray(array) {
    var nodes = [];
    for (var i = 0; i < array.length; i++) {
        var child = array[i];
        if (child instanceof Array) {
            nodes = nodes.concat(flatArray(child));
        }
        else {
            if (child != null) {
                nodes.push(child);
            }
        }
    }
    return nodes;
}


class VNode {
    constructor() {
        this.tag = null;
        this.children = null;
        this.events = null;
        this.key = null;
        this.attrs = null;
    }
}
function createElement(tag, props, ...children) {
    var node;
    if (typeof tag === 'string') {
        if (isCito) {
            node = new VNode();
            node.tag = tag;
        }
        else {
            node = document.createElement(tag);
        }
        if (props) {
            if (isCito) {
                if (props.className) {
                    node.attrs = node.attrs || {};
                    node.attrs.class = props.className;
                }
                if (props.onTouchTap) {
                    node.events = node.events || {};
                    node.events.mousedown = props.onTouchTap;
                }
            }
            else {
                if (props.className) {
                    node.className = props.className;
                }
                if (props.onTouchTap) {
                    node.onmousedown = props.onTouchTap;
                }
            }

        }
        if (children) {
            children = flatArray(children);
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (typeof child === 'string') {
                    if (isCito) {
                    }
                    else {
                        child = document.createTextNode(child);
                    }
                }
                if (isCito) {
                    node.children = node.children || [];
                    node.children.push(child);
                }
                else {
                    node.appendChild(child);
                }
            }
        }
    }
    else if (typeof tag === 'function') {
        var instance = new tag(props);
        node = instance.render();
        instance.node = node;
    }
    return node;
}

function render(app, node) {
    if (isCito) {
        cito.vdom.append(node, app);
    }
    else {
        node.appendChild(app);
    }
}

module.exports = {
    Component: Component,
    createElement: createElement,
    render: render
};