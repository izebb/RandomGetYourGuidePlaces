/**
 * Simple DOM miniplation Functions
 * @param  String tagName e.g "div", 'span'
 * @param  Function/String nested re function or simple textnode string 
 * @return function  DOMnode
 */
var re = function(tagName) {
    var _dom = _createDom(tagName);
    var args = arguments;
    for (var i = 1; i < arguments.length; i++) {
        if (typeof arguments[i] === 'string') {
            _dom.appendChild(_createTextNode(arguments[i]));
        } else if (typeof arguments[i] === 'function') {
            _dom.appendChild(arguments[i]());
        }
    }


    return function() {
        if (typeof args[args.length - 1] == 'object') {
        	var options = args[args.length - 1];
            options.style && setStyle(_dom, options.style);
            options.className && setClass(_dom, options.className);
            options.id && setID(_dom, options.id)
        }
        return _dom;
    }
}
/**
*  set html attribute class
 * @param Object domNode   
 */
function setClass(dom, className){
	dom.setAttribute('class',className );
}

/**
*  set html attribute id
 * @param Object domNode   
 */
function setID(dom, id){
	dom.setAttribute('id',id );
}


/**
*  set html attribute styles
 * @param Object domNode   
 */
function setStyle(dom, styles) {
    for (var j in styles) {
        dom.style[j] = styles[j];
    }
}


function _createDom(tagName) {
    return document.createElement(tagName);
}


function _createTextNode(text) {
    return document.createTextNode(text);
}
/**
 * render to a domnode item
 * @param  Object parent node 
 * @param  Object dom  
 * @return boolean/DOM  
 */
re.render = function(node, dom) {
    if (node) {
        return node.innerHTML = dom().innerHTML;
    }
    return false;
};


module.exports = re;
