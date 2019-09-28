function h(type, props, children=[]) {
    return {type: type, props: props || {}, children: children};
}

function isCustomProp(name) {
    return isEventProp(name) || name === 'forceUpdate';
}

function setBooleanProp($target, name, value) {
    if (value) {
        $target.setAttribute(name, value);
        $target[name] = true;
    } else {
        $target[name] = false;
    }
}

function setProp($target, name, value) {
    if (isCustomProp(name)) {
        return;
    } else if (name === 'className') {
        $target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
        setBooleanProp($target, name, value);
    } else {
        $target.setAttribute(name, value);
    }
}

function setProps($target, props) {
    var keys = Object.keys(props);

    for (var i = 0; i < keys.length; i++) {
        setProp($target, keys[i], props[keys[i]]);
    }
}

function isEventProp(name) {
    return /^on/.test(name);
}

function extractEventName(name) {
    return name.slice(2).toLowerCase();
}

function addEventListeners($target, props) {
    var keys = Object.keys(props);

    for (var i = 0; i < keys.length; i++) {
        if (isEventProp(keys[i])) {
            $target.addEventListener(extractEventName(keys[i]), props[keys[i]]);
        }
    }
}

function createElement(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    
    var $root = document.createElement(node.type);

    setProps($root, node.props);
    addEventListeners($root, node.props);

    for (var i = 0; i < node.children.length; i++) {
        var child = createElement(node.children[i]);
        $root.appendChild(child);
    }

    return $root;
}

function removeBooleanProp($target, name) {
    $target.removeAttribute(name);
    $target[name] = false;
}

function removeProp($target, name, value) {
    if (isCustomProp(name)) {
        return;
    } else if (name === 'className') {
        $target.removeAttribute('class');
    } else if (typeof value === 'boolean') {
        removeBooleanProp($target, name);
    } else {
        $target.removeAttribute(name);
    }
}

function updateProp($target, name, newVal, oldVal) {
    if (!newVal) {
        removeProp($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
        setProp($target, name, newVal);
    }
}

function updateProps($target, newProps, oldProps = {}) {
    var props = Object.assign({}, newProps, oldProps);

    var keys = Object.keys(props);

    for (var i = 0; i < keys.length; i++) {
        updateProp($target, keys[i], newProps[keys[i]], oldProps[keys[i]]);
    }
}

function isChanged(node1, node2) {
  return typeof node1 !== typeof node2 ||
         typeof node1 === 'string' && node1 !== node2 ||
         node1.type !== node2.type ||
         node.props.forceUpdate;
}

function updateElement($parent, newNode, oldNode, index=0) {
    if (!oldNode) {
        $parent.appendChild(createElement(newNode));
    } else if (!newNode) {
        $parent.removeChild($parent.childNodes[index]);
    } else if (isChanged(newNode, oldNode)) {
        $parent.replaceChild(createElement(newNode),$parent.childNodes[index]);
    } else if (newNode.type) {
        updateProps($parent.childNodes[index], newNode.props, oldNode.props);

        var newLength = newNode.children.length;
        var oldLength = oldNode.children.length;

        for (var i = 0; i < newLength || i < oldLength; i++) {
            updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
        }
    }
}