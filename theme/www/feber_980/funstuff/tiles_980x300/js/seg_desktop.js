
/*seg_desktop.js*/
if(!u || !Util) {
	var u, Util = u = new function() {}
	u.version = 0.6;
	u.bug = function() {}
	u.stats = new function() {this.pageView = function(){};this.event = function(){};this.customVar = function(){}}
}
Util.debugURL = function(url) {
	if(u.bug_force) {
		return true;
	}
	return document.domain.match(/.local$/);
}
Util.nodeId = function(node, include_path) {
	try {
		if(!include_path) {
			return node.id ? node.nodeName+"#"+node.id : (node.className ? node.nodeName+"."+node.className : (node.name ? node.nodeName + "["+node.name+"]" : node.nodeName));
		}
		else {
			if(node.parentNode && node.parentNode.nodeName != "HTML") {
				return u.nodeId(node.parentNode, include_path) + "->" + u.nodeId(node);
			}
			else {
				return u.nodeId(node);
			}
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.nodeId("+node+"), called from: "+arguments.callee.caller);
	}
	return "Unindentifiable node!";
}
Util.bug = function(message, corner, color) {
	if(u.debugURL()) {
		var option, options = new Array([0, "auto", "auto", 0], [0, 0, "auto", "auto"], ["auto", 0, 0, "auto"], ["auto", "auto", 0, 0]);
		if(isNaN(corner)) {
			color = corner;
			corner = 0;
		}
		if(typeof(color) != "string") {
			color = "black";
		}
		option = options[corner];
		if(!u.qs("#debug_id_"+corner)) {
			var d_target = u.ae(document.body, "div", {"class":"debug_"+corner, "id":"debug_id_"+corner});
			d_target.style.position = u.bug_position ? u.bug_position : "absolute";
			d_target.style.zIndex = 16000;
			d_target.style.top = option[0];
			d_target.style.right = option[1];
			d_target.style.bottom = option[2];
			d_target.style.left = option[3];
			d_target.style.backgroundColor = u.bug_bg ? u.bug_bg : "#ffffff";
			d_target.style.color = "#000000";
			d_target.style.textAlign = "left";
			if(d_target.style.maxWidth) {
				d_target.style.maxWidth = u.bug_max_width ? u.bug_max_width+"px" : "auto";
			}
			d_target.style.padding = "3px";
		}
		if(typeof(message) != "string") {
			message = message.toString();
		}
		u.ae(u.qs("#debug_id_"+corner), "div", ({"style":"color: " + color})).innerHTML = message ? message.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/&lt;br&gt;/g, "<br>") : "Util.bug with no message?";
		if(typeof(console) == "object") {
			console.log(message);
		}
	}
}
Util.xInObject = function(object) {
	if(u.debugURL()) {
		var x, s = "--- start object ---<br>";
		for(x in object) {
			if(object[x] && typeof(object[x]) == "object" && typeof(object[x].nodeName) == "string") {
				s += x + "=" + object[x]+" -> " + u.nodeId(object[x], 1) + "<br>";
			}
			else if(object[x] && typeof(object[x]) == "function") {
				s += x + "=function<br>";
			}
			else {
				s += x + "=" + object[x]+"<br>";
			}
		}
		s += "--- end object ---"
		u.bug(s);
	}
}
Util.Animation = u.a = new function() {
	this.support = function() {
		if(this._support === undefined) {
			var node = document.createElement("div");
			if(node.style[this.variant() + "Transition"] !== undefined) {
				this._support = true;
			}
			else {
				this._support = false;
			}
		}
		return this._support;
	}
	this.support3d = function() {
		if(this._support3d === undefined) {
			var node = document.createElement("div");
			try {
				var test = "translate3d(10px, 10px, 10px)";
				node.style[this.variant() + "Transform"] = test;
				if(node.style[this.variant() + "Transform"] == test) {
					this._support3d = true;
				}
				else {
					this._support3d = false;
				}
			}
			catch(exception) {
				this._support3d = false;
			}
		}
		return this._support3d;
	}
	this.variant = function() {
		if(this._variant === undefined) {
			if(document.body.style.webkitTransform != undefined) {
				this._variant = "webkit";
			}
			else if(document.body.style.MozTransform != undefined) {
				this._variant = "Moz";
			}
			else if(document.body.style.oTransform != undefined) {
				this._variant = "o";
			}
			else if(document.body.style.msTransform != undefined) {
				this._variant = "ms";
			}
			else {
				this._variant = "";
			}
		}
		return this._variant;
	}
	this.transition = function(node, transition) {
		try {
			node.style[this.variant() + "Transition"] = transition;
			if(this.variant() == "Moz") {
				u.e.addEvent(node, "transitionend", this._transitioned);
			}
			else {
				u.e.addEvent(node, this.variant() + "TransitionEnd", this._transitioned);
			}
			var duration = transition.match(/[0-9.]+[ms]+/g);
			if(duration) {
				node.duration = duration[0].match("ms") ? parseFloat(duration[0]) : (parseFloat(duration[0]) * 1000);
			}
			else {
				node.duration = false;
			}
		}
		catch(exception) {
			u.bug("Exception ("+exception+") in u.a.transition(" + u.nodeId(node) + "), called from: "+arguments.callee.caller);
		}
	}
	this._transitioned = function(event) {
		if(event.target == this && typeof(this.transitioned) == "function") {
			this.transitioned(event);
		}
	}
	this.translate = function(node, x, y) {
		if(this.support3d()) {
			node.style[this.variant() + "Transform"] = "translate3d("+x+"px, "+y+"px, 0)";
		}
		else {
			node.style[this.variant() + "Transform"] = "translate("+x+"px, "+y+"px)";
		}
		node.element_x = x;
		node.element_y = y;
		node._x = x;
		node._y = y;
		node.offsetHeight;
	}
	this.rotate = function(node, deg) {
		node.style[this.variant() + "Transform"] = "rotate("+deg+"deg)";
		node._rotation = deg;
		node.offsetHeight;
	}
	this.scale = function(node, scale) {
		node.style[this.variant() + "Transform"] = "scale("+scale+")";
		node._scale = scale;
		node.offsetHeight;
	}
	this.setOpacity = function(node, opacity) {
		node.style.opacity = opacity;
		node._opacity = opacity;
		node.offsetHeight;
	}
	this.setWidth = function(node, width) {
		width = width.toString().match(/\%|auto|px/) ? width : (width + "px");
		node.style.width = width;
		node._width = width;
		node.offsetHeight;
	}
	this.setHeight = function(node, height) {
		height = height.toString().match(/\%|auto|px/) ? height : (height + "px");
		node.style.height = height;
		node._height = height;
		node.offsetHeight;
	}
	this.setBgPos = function(node, x, y) {
		x = x.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? x : (x + "px");
		y = y.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? y : (y + "px");
		node.style.backgroundPosition = x + " " + y;
		node._bg_x = x;
		node._bg_y = y;
		node.offsetHeight;
	}
	this.setBgColor = function(node, color) {
		node.style.backgroundColor = color;
		node._bg_color = color;
		node.offsetHeight;
	}
}
Util.saveCookie = function(name, value, keep) {
	if(keep) {
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +";expires=Mon, 04-Apr-2020 05:00:00 GMT;"
	}
	else {
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +";"
	}
}
Util.getCookie = function(name) {
	var matches;
	return (matches = document.cookie.match(encodeURIComponent(name) + "=([^;]+)")) ? decodeURIComponent(matches[1]) : false;
}
Util.deleteCookie = function(name) {
	document.cookie = encodeURIComponent(name) + "=;expires=Thu, 01-Jan-70 00:00:01 GMT";
}
Util.date = function(format, timestamp, months) {
	var date = timestamp ? new Date(timestamp) : new Date();
	if(isNaN(date.getTime())) {
		if(!timestamp.match(/[A-Z]{3}\+[0-9]{4}/)) {
			if(timestamp.match(/ \+[0-9]{4}/)) {
				date = new Date(timestamp.replace(/ (\+[0-9]{4})/, " GMT$1"));
			}
		}
		if(isNaN(date.getTime())) {
			date = new Date();
		}
	}
	var tokens = /d|j|m|n|F|Y|G|H|i|s/g;
	var chars = new Object();
	chars.j = date.getDate();
	chars.d = (chars.j > 9 ? "" : "0") + chars.j;
	chars.n = date.getMonth()+1;
	chars.m = (chars.n > 9 ? "" : "0") + chars.n;
	chars.F = months ? months[date.getMonth()] : "";
	chars.Y = date.getFullYear();
	chars.G = date.getHours();
	chars.H = (chars.G > 9 ? "" : "0") + chars.G;
	var i = date.getMinutes();
	chars.i = (i > 9 ? "" : "0") + i;
	var s = date.getSeconds();
	chars.s = (s > 9 ? "" : "0") + s;
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
Util.querySelector = u.qs = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelector(query);
}
Util.querySelectorAll = u.qsa = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelectorAll(query);
}
Util.getElement = u.ge = function(identifier, scope) {
	var node, i, regexp;
	if(document.getElementById(identifier)) {
		return document.getElementById(identifier);
	}
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			return node;
		}
	}
	return scope.getElementsByTagName(identifier).length ? scope.getElementsByTagName(identifier)[0] : false;
}
Util.getElements = u.ges = function(identifier, scope) {
	var node, i, regexp;
	var nodes = new Array();
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			nodes.push(node);
		}
	}
	return nodes.length ? nodes : scope.getElementsByTagName(identifier);
}
Util.parentNode = u.pn = function(node, node_type) {
	if(node_type) {
		if(node.parentNode) {
			var parent = node.parentNode;
		}
		while(parent.nodeName.toLowerCase() != node_type.toLowerCase()) {
			if(parent.parentNode) {
				parent = parent.parentNode;
			}
			else {
				return false;
			}
		}
		return parent;
	}
	else {
		return node.parentNode;
	}
}
Util.previousSibling = u.ps = function(node, exclude) {
	node = node.previousSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || exclude && (u.hc(node, exclude) || node.nodeName.toLowerCase().match(exclude)))) {
		node = node.previousSibling;
	}
	return node;
}
Util.nextSibling = u.ns = function(node, exclude) {
	node = node.nextSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || exclude && (u.hc(node, exclude) || node.nodeName.toLowerCase().match(exclude)))) {
		node = node.nextSibling;
	}
	return node;
}
Util.childNodes = u.cn = function(node, exclude) {
	var i, child;
	var children = new Array();
	for(i = 0; child = node.childNodes[i]; i++) {
		if(child && child.nodeType != 3 && child.nodeType != 8 && (!exclude || (!u.hc(child, exclude) && !child.nodeName.toLowerCase().match(exclude) ))) {
			children.push(child);
		}
	}
	return children;
}
Util.appendElement = u.ae = function(parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = parent.appendChild(node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute]
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ae, called from: "+arguments.callee.caller.name);
		u.bug("node:" + u.nodeId(parent, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.insertElement = u.ie = function(parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = parent.insertBefore(node, parent.firstChild);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ie, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(parent, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.wrapElement = u.we = function(node, node_type, attributes) {
	try {
		var wrapper_node = node.parentNode.insertBefore(document.createElement(node_type), node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		wrapper_node.appendChild(node);
		return wrapper_node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.we, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(node, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.clickableElement = u.ce = function(node) {
	var a = (node.nodeName.toLowerCase() == "a" ? node : u.qs("a", node));
	if(a) {
		u.ac(node, "link");
		if(a.getAttribute("href") !== null) {
			node.url = a.href;
			a.removeAttribute("href");
		}
	}
	if(typeof(u.e.click) == "function") {
		u.e.click(node);
	}
	return node;
}
u.link = u.ce;
Util.classVar = u.cv = function(node, var_name) {
	try {
		var regexp = new RegExp(var_name + ":[?=\\w/\\#~:.?+=?&%@!\\-]*");
		if(node.className.match(regexp)) {
			return node.className.match(regexp)[0].replace(var_name + ":", "");
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.cv, called from: "+arguments.callee.caller);
	}
	return false;
}
u.getIJ = u.cv;
Util.setClass = u.sc = function(node, classname) {
	try {
		var old_class = node.className;
		node.className = classname;
		node.offsetTop;
		return old_class;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.setClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.hasClass = u.hc = function(e, classname) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
			if(regexp.test(e.className)) {
				return true;
			}
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.hasClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.addClass = u.ac = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$)");
			if(!regexp.test(node.className)) {
				node.className += node.className ? " " + classname : classname;
				dom_update === false ? false : node.offsetTop;
			}
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.addClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.removeClass = u.rc = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(\\b)" + classname + "(\\s|$)", "g");
			node.className = node.className.replace(regexp, " ").trim().replace(/[\s]{2}/g, " ");
			dom_update === false ? false : node.offsetTop;
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.removeClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.toggleClass = u.tc = function(node, classname, _classname, dom_update) {
	try {
		var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
		if(regexp.test(node.className)) {
			u.rc(node, classname, false);
			if(_classname) {
				u.ac(node, _classname, false);
			}
		}
		else {
			u.ac(node, classname, false);
			if(_classname) {
				u.rc(node, _classname, false);
			}
		}
		dom_update === false ? false : node.offsetTop;
		return node.className;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.toggleClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.applyStyle = u.as = function(node, property, value, dom_update) {
	try {
		node.style[property] = value;
		dom_update === false ? false : node.offsetTop;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.applyStyle("+u.nodeId(node)+", "+property+", "+value+") called from: "+arguments.callee.caller);
	}
}
Util.getComputedStyle = u.gcs = function(node, property) {
	node.offsetHeight;
	if(document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(node, null).getPropertyValue(property);
	}
	return false;
}
Util.Events = u.e = new function() {
	this.event_pref = typeof(document.ontouchmove) == "undefined" ? "mouse" : "touch";
	this.kill = function(event) {
		if(event) {
			event.preventDefault();
			event.stopPropagation()
		}
	}
	this.addEvent = function(node, type, action) {
		try {
			node.addEventListener(type, action, false);
		}
		catch(exception) {
			alert("exception in addEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.removeEvent = function(node, type, action) {
		try {
			node.removeEventListener(type, action, false);
		}
		catch(exception) {
			u.bug("exception in removeEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.addStartEvent = this.addDownEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.removeStartEvent = this.removeDownEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.addMoveEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.removeMoveEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.addEndEvent = this.addUpEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(node.snapback && u.e.event_pref == "mouse") {
			u.e.addEvent(node, "mouseout", this._snapback);
		}
	}
	this.removeEndEvent = this.removeUpEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(node.snapback && u.e.event_pref == "mouse") {
			u.e.removeEvent(node, "mouseout", this._snapback);
		}
	}
	this.resetClickEvents = function(node) {
		u.t.resetTimer(node.t_held);
		u.t.resetTimer(node.t_clicked);
		this.removeEvent(node, "mouseup", this._dblclicked);
		this.removeEvent(node, "touchend", this._dblclicked);
		this.removeEvent(node, "mousemove", this._clickCancel);
		this.removeEvent(node, "touchmove", this._clickCancel);
		this.removeEvent(node, "mousemove", this._move);
		this.removeEvent(node, "touchmove", this._move);
	}
	this.resetEvents = function(node) {
		this.resetClickEvents(node);
		if(typeof(this.resetDragEvents) == "function") {
			this.resetDragEvents(node);
		}
	}
	this.resetNestedEvents = function(node) {
		while(node && node.nodeName != "HTML") {
			this.resetEvents(node);
			node = node.parentNode;
		}
	}
	this._inputStart = function(event) {
		this.event_var = event;
		this.input_timestamp = event.timeStamp;
		this.start_event_x = u.eventX(event) - u.scrollX();
		this.start_event_y = u.eventY(event) - u.scrollY();
		this.current_xps = 0;
		this.current_yps = 0;
		this.swiped = false;
		if(this.e_click || this.e_dblclick || this.e_hold) {
			var node = this;
			while(node) {
				if(node.e_drag || node.e_swipe) {
					u.e.addMoveEvent(this, u.e._cancelClick);
					break;
				}
				else {
					node = node.parentNode;
				}
			}
			u.e.addMoveEvent(this, u.e._move);
			u.e.addEndEvent(this, u.e._dblclicked);
		}
		if(this.e_hold) {
			this.t_held = u.t.setTimer(this, u.e._held, 750);
		}
		if(this.e_drag || this.e_swipe) {
			u.e.addMoveEvent(this, u.e._pick);
			u.e.addEndEvent(this, u.e._drop);
		}
		if(this.e_scroll) {
			u.e.addMoveEvent(this, u.e._scrollStart);
			u.e.addEndEvent(this, u.e._scrollEnd);
		}
		if(typeof(this.inputStarted) == "function") {
			this.inputStarted(event);
		}
	}
	this._cancelClick = function(event) {
		u.e.resetClickEvents(this);
		if(typeof(this.clickCancelled) == "function") {
			this.clickCancelled(event);
		}
	}
	this._move = function(event) {
		if(typeof(this.moved) == "function") {
			this.moved(event);
		}
	}
	this.hold = function(node) {
		node.e_hold = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._held = function(event) {
		u.stats.event(this, "held");
		u.e.resetNestedEvents(this);
		if(typeof(this.held) == "function") {
			this.held(event);
		}
	}
	this.click = this.tap = function(node) {
		node.e_click = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._clicked = function(event) {
		u.stats.event(this, "clicked");
		u.e.resetNestedEvents(this);
		if(typeof(this.clicked) == "function") {
			this.clicked(event);
		}
	}
	this.dblclick = this.doubletap = function(node) {
		node.e_dblclick = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._dblclicked = function(event) {
		if(u.t.valid(this.t_clicked) && event) {
			u.stats.event(this, "dblclicked");
			u.e.resetNestedEvents(this);
			if(typeof(this.dblclicked) == "function") {
				this.dblclicked(event);
			}
			return;
		}
		else if(!this.e_dblclick) {
			this._clicked = u.e._clicked;
			this._clicked(event);
		}
		else if(!event) {
			this._clicked = u.e._clicked;
			this._clicked(this.event_var);
		}
		else {
			u.e.resetNestedEvents(this);
			this.t_clicked = u.t.setTimer(this, u.e._dblclicked, 400);
		}
	}
}
u.e.resetDragEvents = function(node) {
	this.removeEvent(node, "mousemove", this._pick);
	this.removeEvent(node, "touchmove", this._pick);
	this.removeEvent(node, "mousemove", this._drag);
	this.removeEvent(node, "touchmove", this._drag);
	this.removeEvent(node, "mouseup", this._drop);
	this.removeEvent(node, "touchend", this._drop);
	this.removeEvent(node, "mouseout", this._drop);
	this.removeEvent(node, "mousemove", this._scrollStart);
	this.removeEvent(node, "touchmove", this._scrollStart);
	this.removeEvent(node, "mousemove", this._scrolling);
	this.removeEvent(node, "touchmove", this._scrolling);
	this.removeEvent(node, "mouseup", this._scrollEnd);
	this.removeEvent(node, "touchend", this._scrollEnd);
}
u.e.overlap = function(node, boundaries, strict) {
	if(boundaries.constructor.toString().match("Array")) {
		var boundaries_start_x = Number(boundaries[0]);
		var boundaries_start_y = Number(boundaries[1]);
		var boundaries_end_x = Number(boundaries[2]);
		var boundaries_end_y = Number(boundaries[3]);
	}
	else if(boundaries.constructor.toString().match("HTML")) {
		var boundaries_start_x = u.absX(boundaries) - u.absX(node);
		var boundaries_start_y =  u.absY(boundaries) - u.absY(node);
		var boundaries_end_x = Number(boundaries_start_x + boundaries.offsetWidth);
		var boundaries_end_y = Number(boundaries_start_y + boundaries.offsetHeight);
	}
	var node_start_x = Number(node._x);
	var node_start_y = Number(node._y);
	var node_end_x = Number(node_start_x + node.offsetWidth);
	var node_end_y = Number(node_start_y + node.offsetHeight);
	if(strict) {
		if(node_start_x >= boundaries_start_x && node_start_y >= boundaries_start_y && node_end_x <= boundaries_end_x && node_end_y <= boundaries_end_y) {
			return true;
		}
		else {
			return false;
		}
	} 
	else if(node_end_x < boundaries_start_x || node_start_x > boundaries_end_x || node_end_y < boundaries_start_y || node_start_y > boundaries_end_y) {
		return false;
	}
	return true;
}
u.e.drag = function(node, boundaries, settings) {
	node.e_drag = true;
	if(node.childNodes.length < 2 && node.innerHTML.trim() == "") {
		node.innerHTML = "&nbsp;";
	}
	node.drag_strict = true;
	node.drag_elastica = 0;
	node.drag_dropout = true;
	node.show_bounds = false;
	if(typeof(settings) == "object") {
		for(argument in settings) {
			switch(argument) {
				case "strict"		: node.drag_strict		= settings[argument]; break;
				case "elastica"		: node.drag_elastica	= Number(settings[argument]); break;
				case "dropout"		: node.drag_dropout		= settings[argument]; break;
				case "show_bounds"	: node.show_bounds		= settings[argument]; break; // NEEDS HELP
			}
		}
	}
	if(boundaries.constructor.toString().match("Array")) {
		node.start_drag_x = Number(boundaries[0]);
		node.start_drag_y = Number(boundaries[1]);
		node.end_drag_x = Number(boundaries[2]);
		node.end_drag_y = Number(boundaries[3]);
	}
	else if(boundaries.constructor.toString().match("HTML")) {
		node.start_drag_x = u.absX(boundaries) - u.absX(node);
		node.start_drag_y = u.absY(boundaries) - u.absY(node);
		node.end_drag_x = node.start_drag_x + boundaries.offsetWidth;
		node.end_drag_y = node.start_drag_y + boundaries.offsetHeight;
	}
	if(node.show_bounds) {
		var debug_bounds = u.ae(document.body, "div", {"class":"debug_bounds"})
		debug_bounds.style.position = "absolute";
		debug_bounds.style.background = "red"
		debug_bounds.style.left = (u.absX(node) + node.start_drag_x - 1) + "px";
		debug_bounds.style.top = (u.absY(node) + node.start_drag_y - 1) + "px";
		debug_bounds.style.width = (node.end_drag_x - node.start_drag_x) + "px";
		debug_bounds.style.height = (node.end_drag_y - node.start_drag_y) + "px";
		debug_bounds.style.border = "1px solid white";
		debug_bounds.style.zIndex = 9999;
		debug_bounds.style.opacity = .5;
		if(document.readyState && document.readyState == "interactive") {
			debug_bounds.innerHTML = "WARNING - injected on DOMLoaded"; 
		}
		u.bug("node: "+u.nodeId(node)+" in (" + u.absX(node) + "," + u.absY(node) + "), (" + (u.absX(node)+node.offsetWidth) + "," + (u.absY(node)+node.offsetHeight) +")");
		u.bug("boundaries: (" + node.start_drag_x + "," + node.start_drag_y + "), (" + node.end_drag_x + ", " + node.end_drag_y + ")");
	}
	node.element_x = node.element_x ? node.element_x : 0;
	node.element_y = node.element_y ? node.element_y : 0;
	node._x = node._x ? node._x : 0;
	node._y = node._y ? node._y : 0;
	node.locked = ((node.end_drag_x - node.start_drag_x == node.offsetWidth) && (node.end_drag_y - node.start_drag_y == node.offsetHeight));
	node.only_vertical = (!node.locked && node.end_drag_x - node.start_drag_x == node.offsetWidth);
	node.only_horisontal = (!node.locked && node.end_drag_y - node.start_drag_y == node.offsetHeight);
	u.e.addStartEvent(node, this._inputStart);
}
u.e._pick = function(event) {
	u.e.resetNestedEvents(this);
	var init_speed_x = Math.abs(this.start_event_x - u.eventX(event) - u.scrollX());
	var init_speed_y = Math.abs(this.start_event_y - u.eventY(event) - u.scrollY());
	if(init_speed_x > init_speed_y && this.only_horisontal || 
	   init_speed_x < init_speed_y && this.only_vertical ||
	   !this.only_vertical && !this.only_horisontal) {
	    u.e.kill(event);
		this.move_timestamp = event.timeStamp;
		this.move_last_x = this._x;
		this.move_last_y = this._y;
		this.start_input_x = u.eventX(event) - this._x - u.scrollX(); 
		this.start_input_y = u.eventY(event) - this._y - u.scrollY();
		this.current_xps = 0;
		this.current_yps = 0;
		u.a.transition(this, "none");
		if(typeof(this.picked) == "function") {
			this.picked(event);
		}
		u.e.addMoveEvent(this, u.e._drag);
		u.e.addEndEvent(this, u.e._drop);
	}
	if(this.drag_dropout && u.e.event_pref == "mouse") {
		u.e.addEvent(this, "mouseout", u.e._drop);
	}
}
u.e._drag = function(event) {
	this.current_x = u.eventX(event) - this.start_input_x - u.scrollX();
	this.current_y = u.eventY(event) - this.start_input_y - u.scrollY();
	this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.move_timestamp = event.timeStamp;
	this.move_last_x = this.current_x;
	this.move_last_y = this.current_y;
	if(this.only_vertical) {
		this._y = this.current_y;
	}
	else if(this.only_horisontal) {
		this._x = this.current_x;
	}
	else if(!this.locked) {
		this._x = this.current_x;
		this._y = this.current_y;
	}
	if(this.e_swipe) {
		if(this.current_xps && (Math.abs(this.current_xps) > Math.abs(this.current_yps) || this.only_horisontal)) {
			if(this.current_xps < 0) {
				this.swiped = "left";
			}
			else {
				this.swiped = "right";
			}
		}
		else if(this.current_yps && (Math.abs(this.current_xps) < Math.abs(this.current_yps) || this.only_vertical)) {
			if(this.current_yps < 0) {
				this.swiped = "up";
			}
			else {
				this.swiped = "down";
			}
		}
	}
	if(!this.locked) {
		if(u.e.overlap(this, [this.start_drag_x, this.start_drag_y, this.end_drag_x, this.end_drag_y], true)) {
			u.a.translate(this, this._x, this._y);
		}
		else if(this.drag_elastica) {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			var offset = false;
			if(!this.only_vertical && this._x < this.start_drag_x) {
				offset = this._x < this.start_drag_x - this.drag_elastica ? - this.drag_elastica : this._x - this.start_drag_x;
				this._x = this.start_drag_x;
				this.current_x = this._x + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.only_vertical && this._x + this.offsetWidth > this.end_drag_x) {
				offset = this._x + this.offsetWidth > this.end_drag_x + this.drag_elastica ? this.drag_elastica : this._x + this.offsetWidth - this.end_drag_x;
				this._x = this.end_drag_x - this.offsetWidth;
				this.current_x = this._x + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_x = this._x;
			}
			if(!this.only_horisontal && this._y < this.start_drag_y) {
				offset = this.element_y < this.start_drag_y - this.drag_elastica ? - this.drag_elastica : this._y - this.start_drag_y;
				this._y = this.start_drag_y;
				this.current_y = this._y + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.horisontal && this._y + this.offsetHeight > this.end_drag_y) {
				offset = (this._y + this.offsetHeight > this.end_drag_y + this.drag_elastica) ? this.drag_elastica : (this._y + this.offsetHeight - this.end_drag_y);
				this._y = this.end_drag_y - this.offsetHeight;
				this.current_y = this._y + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_y = this._y;
			}
			if(offset) {
				u.a.translate(this, this.current_x, this.current_y);
			}
		}
		else {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			if(this._x < this.start_drag_x) {
				this._x = this.start_drag_x;
			}
			else if(this._x + this.offsetWidth > this.end_drag_x) {
				this._x = this.end_drag_x - this.offsetWidth;
			}
			if(this._y < this.start_drag_y) {
				this._y = this.start_drag_y;
			}
			else if(this._y + this.offsetHeight > this.end_drag_y) { 
				this._y = this.end_drag_y - this.offsetHeight;
			}
			u.a.translate(this, this._x, this._y);
		}
	}
	if(typeof(this.moved) == "function") {
		this.moved(event);
	}
}
u.e._drop = function(event) {
	u.e.resetEvents(this);
	if(this.e_swipe && this.swiped) {
		if(this.swiped == "left" && typeof(this.swipedLeft) == "function") {
			this.swipedLeft(event);
		}
		else if(this.swiped == "right" && typeof(this.swipedRight) == "function") {
			this.swipedRight(event);
		}
		else if(this.swiped == "down" && typeof(this.swipedDown) == "function") {
			this.swipedDown(event);
		}
		else if(this.swiped == "up" && typeof(this.swipedUp) == "function") {
			this.swipedUp(event);
		}
	}
	else if(!this.drag_strict && !this.locked) {
		this.current_x = this._x + (this.current_xps/2);
		this.current_y = this._y + (this.current_yps/2);
		if(this.only_vertical || this.current_x < this.start_drag_x) {
			this.current_x = this.start_drag_x;
		}
		else if(this.current_x + this.offsetWidth > this.end_drag_x) {
			this.current_x = this.end_drag_x - this.offsetWidth;
		}
		if(this.only_horisontal || this.current_y < this.start_drag_y) {
			this.current_y = this.start_drag_y;
		}
		else if(this.current_y + this.offsetHeight > this.end_drag_y) {
			this.current_y = this.end_drag_y - this.offsetHeight;
		}
		this.transitioned = function() {
			this.transitioned = null;
			u.a.transition(this, "none");
			if(typeof(this.projected) == "function") {
				this.projected(event);
			}
		}
		if(this.current_xps || this.current_yps) {
			u.a.transition(this, "all 1s cubic-bezier(0,0,0.25,1)");
		}
		else {
			u.a.transition(this, "none");
		}
		u.a.translate(this, this.current_x, this.current_y);
	}
	if(typeof(this.dropped) == "function") {
		this.dropped(event);
	}
}
u.e.swipe = function(node, boundaries, settings) {
	node.e_swipe = true;
	u.e.drag(node, boundaries, settings);
}
u.e.scroll = function(e) {
	e.e_scroll = true;
	e.element_x = e.element_x ? e.element_x : 0;
	e.element_y = e.element_y ? e.element_y : 0;
	e._x = e._x ? e._x : 0;
	e._y = e._y ? e._y : 0;
	u.e.addStartEvent(e, this._inputStart);
}
u.e._scrollStart = function(event) {
	u.e.resetNestedEvents(this);
	this.move_timestamp = new Date().getTime();
	this.current_xps = 0;
	this.current_yps = 0;
	this.start_input_x = u.eventX(event) - this._x;
	this.start_input_y = u.eventY(event) - this._y;
	u.a.transition(this, "none");
	if(typeof(this.picked) == "function") {
		this.picked(event);
	}
	u.e.addMoveEvent(this, u.e._scrolling);
	u.e.addEndEvent(this, u.e._scrollEnd);
}
u.e._scrolling = function(event) {
	this.new_move_timestamp = new Date().getTime();
	this.current_x = u.eventX(event) - this.start_input_x;
	this.current_y = u.eventY(event) - this.start_input_y;
	this.current_xps = Math.round(((this.current_x - this._x) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this._y) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
	this.move_timestamp = this.new_move_timestamp;
	if(u.scrollY() > 0 && -(this.current_y) + u.scrollY() > 0) {
		u.e.kill(event);
		window.scrollTo(0, -(this.current_y) + u.scrollY());
	}
	if(typeof(this.moved) == "function") {
		this.moved(event);
	}
}
u.e._scrollEnd = function(event) {
	u.e.resetEvents(this);
	if(typeof(this.dropped) == "function") {
		this.dropped(event);
	}
}
u.e.beforeScroll = function(node) {
	node.e_beforescroll = true;
	u.e.addStartEvent(node, this._inputStartDrag);
}
u.e._inputStartDrag = function() {
	u.e.addMoveEvent(this, u.e._beforeScroll);
}
u.e._beforeScroll = function(event) {
	u.e.removeMoveEvent(this, u.e._beforeScroll);
	if(typeof(this.picked) == "function") {
		this.picked(event);
	}
}
Util.flashDetection = function(version) {
	var flash_version = false;
	var flash = false;
	if(navigator.plugins && navigator.plugins["Shockwave Flash"] && navigator.plugins["Shockwave Flash"].description && navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) {
		flash = true;
		var Pversion = navigator.plugins["Shockwave Flash"].description.match(/\b([\d]+)\b/);
		if(Pversion.length > 1 && !isNaN(Pversion[1])) {
			flash_version = Pversion[1];
		}
	}
	else if(window.ActiveXObject) {
		try {
			var AXflash, AXversion;
			AXflash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			if(AXflash) {
				flash = true;
				AXversion = AXflash.GetVariable("$version").match(/\b([\d]+)\b/);
				if(AXversion.length > 1 && !isNaN(AXversion[1])) {
					flash_version = AXversion[1];
				}
			}
		}
		catch(exception) {}
	}
	if(flash_version || (flash && !version)) {
		if(!version) {
			return true;
		}
		else {
			if(!isNaN(version)) {
				return flash_version == version;
			}
			else {
				return eval(flash_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.flash = function(node, url) {
	var width = "100%";
	var height = "100%";
	var background = "transparent";
	var id = "flash_" + new Date().getHours() + "_" + new Date().getMinutes() + "_" + new Date().getMilliseconds();
	var allowScriptAccess = "always";
	var menu = "false";
	var scale = "default";
	var wmode = "transparent";
	if(arguments.length > 1 && typeof(arguments[2]) == "object") {
		for(argument in arguments[2]) {
			switch(argument) {
				case "id" : id = arguments[2][argument]; break;
				case "width" : width = Number(arguments[2][argument]); break;
				case "height" : height = Number(arguments[2][argument]); break;
				case "background" : background = arguments[2][argument]; break;
				case "allowScriptAccess" : allowScriptAccess = arguments[2][argument]; break;
				case "menu" : menu = arguments[2][argument]; break;
				case "scale" : scale = arguments[2][argument]; break;
				case "wmode" : wmode = arguments[2][argument]; break;
			}
		}
	}
	html = '<object';
	html += ' id="'+id+'"';
	html += ' width="'+width+'"';
	html += ' height="'+height+'"';
	if(u.explorer()) {
		html += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
	}
	else {
		html += ' type="application/x-shockwave-flash"';
		html += ' data="'+url+'"';
	}
	html += '>';
	html += '<param name="allowScriptAccess" value="'+allowScriptAccess+'" />';
	html += '<param name="movie" value="'+url+'" />';
	html += '<param name="quality" value="high" />';
	html += '<param name="bgcolor" value="'+background+'" />';
	html += '<param name="play" value="true" />';
	html += '<param name="wmode" value="'+wmode+'" />';
	html += '<param name="menu" value="'+menu+'" />';
	html += '<param name="scale" value="'+scale+'" />';
	html += '</object>';
	var temp_node = document.createElement("div");
	temp_node.innerHTML = html;
	node.insertBefore(temp_node.firstChild, node.firstChild);
	var flash_object = u.qs("#"+id, node);
	return flash_object;
}
Util.Form = u.f = new function() {
	this.init = function(form) {
		var i, o;
		form.onsubmit = function(event) {
			return false;
		}
		form.setAttribute("novalidate", "novalidate");
		form._submit = this._submit;
		form.fields = new Object();
		form.field_order = new Array();
		form.actions = new Object();
		var fields = u.qsa(".field", form);
		for(i = 0; field = fields[i]; i++) {
			var abbr = u.qs("abbr", field);
			if(abbr) {
				abbr.parentNode.removeChild(abbr);
			}
			field.lN = u.qs("label", field);
			field._form = form;
			if(u.hasClass(field, "string|email|tel")) {
				field.iN = u.qs("input", field);
				field.iN.field = field;
				field.iN.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "keyup", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
				this.submitOnEnter(field.iN);
			}
			if(field.className.match(/numeric|integer/)) {
				field.iN = u.qs("input", field);
				field.iN.field = field;
				field.iN.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "keyup", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
				this.submitOnEnter(field.iN);
			}
			if(field.className.match(/text/)) {
				field.iN = u.qs("textarea", field);
				field.iN.field = field;
				field.iN.val = function(value) {if(value !== undefined) {this.value = value;} else {return this.value;}}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "keyup", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
				if(u.hc(field.iN, "autoexpand")) {
					field.iN.offset = 0;
					if(parseInt(u.gcs(field.iN, "height")) != field.iN.scrollHeight) {
						field.iN.offset = field.iN.scrollHeight - parseInt(u.gcs(field.iN, "height"));
					}
					field.iN.setHeight = function() {
						var textarea_height = parseInt(u.gcs(this, "height"));
						if(this.value) {
							if(u.webkit()) {
								if(this.scrollHeight - this.offset > textarea_height) {
									u.as(this, "height", this.scrollHeight+"px");
								}
							}
							else if(u.opera() || u.explorer()) {
								if(this.scrollHeight > textarea_height) {
									u.as(this, "height", this.scrollHeight+"px");
								}
							}
							else {
								u.as(this, "height", this.scrollHeight+"px");
							}
						}
					}
					u.e.addEvent(field.iN, "keyup", field.iN.setHeight);					
				}
			}
			if(field.className.match(/select/)) {
				field.iN = u.qs("select", field);
				field.iN.field = field;
				field.iN.val = function(value) {
					if(value !== undefined) {
						var i, option;
						for(i = 0; option = this.options[i]; i++) {
							if(option.value == value) {
								this.selectedIndex = i;
								return i;
							}
						}
						return false;
					}
					else {
						return this.options[this.selectedIndex].value;
					}
				}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "change", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
			}
			if(field.className.match(/checkbox|boolean/)) {
				field.iN = u.qs("input[type=checkbox]", field);
				field.iN.field = field;
				field.iN.val = function(value) {
					if(value) {
						this.checked = true
					}
					else {
						if(this.checked) {
							return this.value;
						}
					}
					return false;
				}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				if(u.explorer(8, "<=")) {
					field.iN.pre_state = field.iN.checked;
					field.iN._changed = u.f._changed;
					field.iN._update = u.f._update;
					field.iN._clicked = function(event) {
						if(this.checked != this.pre_state) {
							this._changed(window.event);
							this._update(window.event);
						}
						this.pre_state = this.checked;
					}
					u.e.addEvent(field.iN, "click", field.iN._clicked);
				}
				else {
					u.e.addEvent(field.iN, "change", this._update);
					u.e.addEvent(field.iN, "change", this._changed);
				}
			}
			if(field.className.match(/radio/)) {
				field.iNs = u.qsa("input", field);
				var j, radio;
				for(j = 0; radio = field.iNs[j]; j++) {
					radio.field = field;
					radio.val = function(value) {
						if(value) {
							for(i = 0; option = this.field._form[this.name][i]; i++) {
								if(option.value == value) {
									option.checked = true;
								}
							}
						}
						else {
							var i, option;
							for(i = 0; option = this.field._form[this.name][i]; i++) {
								if(option.checked) {
									return option.value;
								}
							}
						}
						return false;
					}
					form.fields[radio.name] = radio;
					radio.field_order = form.field_order.length;
					form.field_order[form.field_order.length] = radio;
					this.activate(radio);
					this.validate(radio);
					if(u.explorer(8, "<=")) {
						radio.pre_state = radio.checked;
						radio._changed = u.f._changed;
						radio._update = u.f._update;
						radio._clicked = function(event) {
							if(this.checked != this.pre_state) {
								this._changed(window.event);
								this._update(window.event);
							}
							for(i = 0; iN = this.field.iNs[i]; i++) {
								iN.pre_state = iN.checked;
							}
						}
						u.e.addEvent(radio, "click", radio._clicked);
					}
					else {
						u.e.addEvent(radio, "change", this._update);
						u.e.addEvent(radio, "change", this._changed);
					}
				}
			}
			if(field.className.match(/date/)) {
				if(typeof(this.customInit) == "object" && typeof(this.customInit["date"]) == "function") {
					this.customInit["date"](field);
				}
				else {
					field.iNs = u.qsa("select,input", field);
					var date = field.iNs[0];
					this.submitOnEnter(date);
					date.field = field;
					var month = field.iNs[1];
					this.submitOnEnter(month);
					month.field = field;
					var year = field.iNs[2];
					this.submitOnEnter(year);
					year.field = field;
					this.activate(date);
					this.activate(month);
					this.activate(year);
					u.e.addEvent(date, "change", this._validateInput);
					u.e.addEvent(month, "change", this._validateInput);
					u.e.addEvent(year, "change", this._validateInput);
					this.validate(date)
					this.validate(month)
					this.validate(year)
				}
			}
			if(field.className.match(/file/)) {
				if(typeof(this.customInit) == "object" && typeof(this.customInit["file"]) == "function") {
					this.customInit["file"](field);
				}
				else {
					field.iN = u.qs("input", field);
					field.iN.field = field;
					field.iN.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
					form.fields[field.iN.name] = field.iN;
					field.iN.field_order = form.field_order.length;
					form.field_order[form.field_order.length] = field.iN;
					this.activate(field.iN);
					this.validate(field.iN);
					u.e.addEvent(field.iN, "keyup", this._update);
					u.e.addEvent(field.iN, "change", this._changed);
				}
			}
			if(typeof(this.customInit) == "object") {
				for(type in this.customInit) {
					if(field.className.match(type)) {
						this.customInit[type](field);
					}
				}
			}
		}
		var hidden_fields = u.qsa("input[type=hidden]", form);
		for(i = 0; hidden_field = hidden_fields[i]; i++) {
			if(!form.fields[hidden_field.name]) {
				form.fields[hidden_field.name] = hidden_field;
				hidden_field.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
			}
		}
		var actions = u.qsa(".actions li", form);
		for(i = 0; action = actions[i]; i++) {
			action.iN = u.qs("input,a", action);
			if(typeof(action.iN) == "object" && action.iN.type == "submit") {
				action.iN.onclick = function(event) {
					u.e.kill(event ? event : window.event);
				}
				u.e.click(action.iN);
				action.iN.clicked = function(event) {
					u.e.kill(event);
					if(!u.hasClass(this, "disabled")) {
						this.form.submitButton = this;
						this.form.submitInput = false;
						this.form._submit(event);
					}
				}
			}
			if(typeof(action.iN) == "object" && action.iN.name) {
				form.actions[action.iN.name] = action;
			}
			if(typeof(u.e.k) == "object" && u.hc(action.iN, "key:[a-z0-9]+")) {
				u.e.k.addShortcut(u.getIJ(action.iN, "key"), action.iN);
			}
		}
	}
	this._changed = function(event) {
		if(typeof(this.changed) == "function") {
			this.changed(this);
		}
		if(typeof(this.field._form.changed) == "function") {
			this.field._form.changed(this);
		}
	}
	this._update = function(event) {
		if(event.keyCode != 9 && event.keyCode != 13 && event.keyCode != 16 && event.keyCode != 17 && event.keyCode != 18) {
			if(typeof(this.updated) == "function") {
				this.updated(this);
			}
			if(typeof(this.field._form.updated) == "function") {
				this.field._form.updated(this);
			}
		}
	}
	this._submit = function(event, iN) {
		for(name in this.fields) {
			if(this.fields[name].field) {
				this.fields[name].used = true;
				u.f.validate(this.fields[name]);
			}
		}
		if(u.qs(".field.error", this)) {
			if(typeof(this.validationFailed) == "function") {
				this.validationFailed();
			}
		}
		else {
			if(typeof(this.submitted) == "function") {
				this.submitted(iN);
			}
			else {
				this.submit();
			}
		}
	}
	this._validate = function() {
		u.f.validate(this);
	}
	this.submitOnEnter = function(iN) {
		iN._onkeydown = function(event) {
			event = event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.field._form.submitInput = this;
				this.field._form.submitButton = false;
				this.field._form._submit(event);
			}
		}
		u.e.addEvent(iN, "keydown", iN._onkeydown);
	}
	this.activate = function(iN) {
		this._focus = function(event) {
			this.field.focused = true;
			u.ac(this.field, "focus");
			u.ac(this, "focus");
			this.used = true;
		}
		this._blur = function(event) {
			this.field.focused = false;
			u.rc(this.field, "focus");
			u.rc(this, "focus");
		}
		u.e.addEvent(iN, "focus", this._focus);
		u.e.addEvent(iN, "blur", this._blur);
		u.e.addEvent(iN, "blur", this._validate);
	}
	this.isDefault = function(iN) {
		if(iN.field.default_value && iN.val() == iN.field.default_value) {
			return true;
		}
		return false;
	}
	this.fieldError = function(iN) {
		u.rc(iN, "correct");
		u.rc(iN.field, "correct");
		if(iN.used || !this.isDefault(iN) && iN.val()) {
			u.ac(iN, "error");
			u.ac(iN.field, "error");
			if(typeof(iN.validationFailed) == "function") {
				iN.validationFailed();
			}
		}
	}
	this.fieldCorrect = function(iN) {
		if(!this.isDefault(iN) && iN.val()) {
			u.ac(iN, "correct");
			u.ac(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
		else {
			u.rc(iN, "correct");
			u.rc(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
	}
	this.validate = function(iN) {
		if(u.hc(iN.field, "string")) {
			if((iN.value.length > 0 && !this.isDefault(iN)) || !u.hc(iN.field, "required")) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "numeric")) {
			if((iN.value && !isNaN(iN.value) && !this.isDefault(iN)) || (!u.hc(iN.field, "required") && !iN.value)) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "integer")) {
			if((iN.value && !isNaN(iN.value) && Math.round(iN.value) == iN.value && !this.isDefault(iN)) || (!u.hc(iN.field, "required") && !iN.value)) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "tel")) {
			if((iN.value.match(/^([\+0-9\-\.\s\(\)]){5,14}$/) && !this.isDefault(iN)) || (!u.hc(iN.field, "required") && !iN.value)) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "email")) {
			if((iN.value.match(/^([^<>\\\/%$])+\@([^<>\\\/%$])+\.([^<>\\\/%$]{2,20})$/) && !this.isDefault(iN)) || (!u.hc(iN.field, "required") && !iN.value)) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "text")) {
			if((iN.value.length > 2 && !this.isDefault(iN)) || !u.hc(iN.field, "required")) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "select")) {
			if(iN.options[iN.selectedIndex].value != "" || !u.hc(iN.field, "required")) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "checkbox|radio|boolean")) {
			if(iN.val() != "" || !u.hc(iN.field, "required")) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(typeof(u.f.customValidate) == "object") {
			var custom_validation;
			for(custom_validation in u.f.customValidate) {
				if(u.hc(iN.field, custom_validation)) {
					u.f.customValidate[custom_validation](iN);
				}
			}
		}
		if(u.hc(iN.field, "date")) {
			if(typeof(u.f.customValidate) == "object" && typeof(u.f.customValidate["date"]) == "function") {
				u.f.customValidate["date"](iN);
			}
			else {
			}
		}
		if(u.hc(iN.field, "error")) {
			return false;
		}
		else {
			return true;
		}
	}
	this.getParams = function(form) {
		var type = "parameters";
		var ignore = false;
		if(arguments.length > 1 && typeof(arguments[1]) == "object") {
			for(argument in arguments[1]) {
				switch(argument) {
					case "type": type = arguments[1][argument]; break;
					case "ignore" : ignore = new RegExp("(^|\\s)" + arguments[1][argument] + "(\\s|$)"); break;
				}
			}
		}
		var i, input, select, textarea, param;
		params = new Object();
		if(form.submitButton && form.submitButton.name) {
			params[form.submitButton.name] = form.submitButton.value;
		}
		var inputs = u.qsa("input", form);
		var selects = u.qsa("select", form)
		var textareas = u.qsa("textarea", form)
		for(i = 0; input = inputs[i]; i++) {
			if(!input.className.match(/ignoreinput/i) && (!ignore || !input.className.match(ignore))) {
				if((input.type == "checkbox" || input.type == "radio") && input.checked) {
					params[input.name] = input.value;
				}
				else if(!input.type.match(/button|submit|checkbox|radio/i)) {
					params[input.name] = input.value;
				}
			}
		}
		for(i = 0; select = selects[i]; i++) {
			if(!select.className.match(/ignoreinput/i) && (!ignore || !select.className.match(ignore))) {
				params[select.name] = select.options[select.selectedIndex].value;
			}
		}
		for(i = 0; textarea = textareas[i]; i++) {
			if(!textarea.className.match(/ignoreinput/i) && (!ignore || !textarea.className.match(ignore))) {
				params[textarea.name] = textarea.value;
			}
		}
		if(typeof(this.customSend) == "object" && typeof(this.customSend[type]) == "function") {
			return this.customSend[type](params, form);
		}
		else if(type == "parameters") {
			var string = "";
			for(param in params) {
				string += param + "=" + encodeURIComponent(params[param]) + "&";
			}
			return string;
		}
		else if(type == "json") {
			object = u.f.convertNamesToJsonObject(params);
			return JSON.stringify(object);
		}
		else if(type == "object") {
			return params;
		}
	}
}
u.f.convertNamesToJsonObject = function(params) {
 	var indexes, root, indexes_exsists;
	var object = new Object();
	for(param in params) {
	 	indexes_exsists = param.match(/\[/);
		if(indexes_exsists) {
			root = param.split("[")[0];
			indexes = param.replace(root, "");
			if(typeof(object[root]) == "undefined") {
				object[root] = new Object();
			}
			object[root] = this.recurseName(object[root], indexes, params[param]);
		}
		else {
			object[param] = params[param];
		}
	}
	return object;
}
u.f.recurseName = function(object, indexes, value) {
	var index = indexes.match(/\[([a-zA-Z0-9\-\_]+)\]/);
	var current_index = index[1];
	indexes = indexes.replace(index[0], "");
 	if(indexes.match(/\[/)) {
		if(object.length !== undefined) {
			var i;
			var added = false;
			for(i = 0; i < object.length; i++) {
				for(exsiting_index in object[i]) {
					if(exsiting_index == current_index) {
						object[i][exsiting_index] = this.recurseName(object[i][exsiting_index], indexes, value);
						added = true;
					}
				}
			}
			if(!added) {
				temp = new Object();
				temp[current_index] = new Object();
				temp[current_index] = this.recurseName(temp[current_index], indexes, value);
				object.push(temp);
			}
		}
		else if(typeof(object[current_index]) != "undefined") {
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
		else {
			object[current_index] = new Object();
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
	}
	else {
		object[current_index] = value;
	}
	return object;
}
Util.absoluteX = u.absX = function(e) {
	if(e.offsetParent) {
		return e.offsetLeft + u.absX(e.offsetParent);
	}
	return e.offsetLeft;
}
Util.absoluteY = u.absY = function(e) {
	if(e.offsetParent) {
		return e.offsetTop + u.absY(e.offsetParent);
	}
	return e.offsetTop;
}
Util.relativeX = u.relX = function(e) {
	if(u.gcs(e, "position").match(/absolute/) == null && e.offsetParent && u.gcs(e.offsetParent, "position").match(/relative|absolute/) == null) {
		return e.offsetLeft + u.relX(e.offsetParent);
	}
	return e.offsetLeft;
}
Util.relativeY = u.relY = function(e) {
	if(u.gcs(e, "position").match(/relative|absolute/) == null && e.offsetParent && u.gcs(e.offsetParent, "position").match(/relative|absolute/) == null) {
		return e.offsetTop + u.relY(e.offsetParent);
	}
	return e.offsetTop;
}
Util.relativeOffsetX = u.relOffsetX = function(e) {
	alert("relativeOffsetX is ??")
	if(e.offsetParent && u.gcs(e.offsetParent, "position").match(/relative|absoute/) != null) {
		return u.absX(e.offsetParent); // - e.offsetLeft u.relOffsetX(e.offsetParent);
	}
	return 0; //u.absX(e) - e.offsetLeft;
}
Util.relativeOffsetY = u.relOffsetY = function(e) {
	alert("relativeOffsetY is ??")
	if(e.offsetParent && u.gcs(e.offsetParent, "position").match(/relative|absoute/) != null) {
		return u.absY(e.offsetParent);
	}
	return 0; // u.absY(e) - e.offsetTop;
}
Util.actualWidth = function(e) {
	return parseInt(u.gcs(e, "width"));
}
Util.actualHeight = function(e) {
	return parseInt(u.gcs(e, "height"));
}
Util.eventX = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageX : event.pageX);
}
Util.eventY = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageY : event.pageY);
}
Util.browserWidth = u.browserW = function() {
	return document.documentElement.clientWidth;
}
Util.browserHeight = u.browserH = function() {
	return document.documentElement.clientHeight;
}
Util.htmlWidth = u.htmlW = function() {
	return document.documentElement.offsetWidth;
}
Util.htmlHeight = u.htmlH = function() {
	return document.documentElement.offsetHeight;
}
Util.pageScrollX = u.scrollX = function() {
	return window.pageXOffset;
}
Util.pageScrollY = u.scrollY = function() {
	return window.pageYOffset;
}
Util.Hash = u.h = new function() {
	this.catchEvent = function(callback, node) {
		this.node = node;
		this.node.callback = callback;
		hashChanged = function(event) {
			u.h.node.callback();
		}
		if("onhashchange" in window && !u.explorer(7, "<=")) {
			window.onhashchange = hashChanged;
		}
		else {
			u.current_hash = window.location.hash;
			window.onhashchange = hashChanged;
			setInterval(
				function() {
					if(window.location.hash !== u.current_hash) {
						u.current_hash = window.location.hash;
						window.onhashchange();
					}
				}, 200
			);
		}
	}
	this.cleanHash = function(string, levels) {
		if(!levels) {
			return string.replace(location.protocol+"//"+document.domain, "");
		}
		else {
			var i, return_string = "";
			var hash = string.replace(location.protocol+"//"+document.domain, "").split("/");
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
	this.getCleanUrl = function(string, levels) {
		string = string.split("#")[0].replace(location.protocol+"//"+document.domain, "");
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
	this.getCleanHash = function(string, levels) {
		string = string.replace("#", "");
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
}
Util.Image = u.i = new function() {
	this.load = function(node, src) {
		var image = new Image();
		image.node = node;
		u.ac(node, "loading");
	    u.e.addEvent(image, 'load', u.i._loaded);
		u.e.addEvent(image, 'error', u.i._error);
		image.src = src;
	}
	this._loaded = function(event) {
		u.rc(this.node, "loading");
		if(typeof(this.node.loaded) == "function") {
			this.node.loaded(event);
		}
	}
	this._error = function(event) {
		u.rc(this.node, "loading");
		u.ac(this.node, "error");
		if(typeof(this.node.loaded) == "function" && typeof(this.node.failed) != "function") {
			this.node.loaded(event);
		}
		else if(typeof(this.node.failed) == "function") {
			this.node.failed(event);
		}
	}
	this._progress = function(event) {
		u.bug("progress")
		if(typeof(this.node.progress) == "function") {
			this.node.progress(event);
		}
	}
	this._debug = function(event) {
		u.bug("event:" + event.type);
		u.xInObject(event);
	}
}
Util.period = function(format) {
	var seconds = 0;
	if(arguments.length > 1 && typeof(arguments[1]) == "object") {
		for(argument in arguments[1]) {
			switch(argument) {
				case "seconds" : seconds = arguments[1][argument]; break;
				case "milliseconds" : seconds = Number(arguments[1][argument])/1000; break;
				case "minutes" : seconds = Number(arguments[1][argument])*60; break;
				case "hours" : seconds = Number(arguments[1][argument])*60*60 ; break;
				case "days" : seconds = Number(arguments[1][argument])*60*60*24; break;
				case "months" : seconds = Number(arguments[1][argument])*60*60*24*(365/12); break;
				case "years" : seconds = Number(arguments[1][argument])*60*60*24*365; break;
			}
		}
	}
	var tokens = /y|n|o|O|w|W|c|d|e|D|g|h|H|l|m|M|r|s|S|t|T|u|U/g;
	var chars = new Object();
	chars.y = 0; // TODO
	chars.n = 0; // TODO 
	chars.o = (chars.n > 9 ? "" : "0") + chars.n; // TODO
	chars.O = 0; // TODO
	chars.w = 0; // TODO
	chars.W = 0; // TODO
	chars.c = 0; // TODO
	chars.d = 0; // TODO
	chars.e = 0; // TODO
	chars.D = Math.floor(((seconds/60)/60)/24);
	chars.g = Math.floor((seconds/60)/60)%24;
	chars.h = (chars.g > 9 ? "" : "0") + chars.g;
	chars.H = Math.floor((seconds/60)/60);
	chars.l = Math.floor(seconds/60)%60;
	chars.m = (chars.l > 9 ? "" : "0") + chars.l;
	chars.M = Math.floor(seconds/60);
	chars.r = Math.floor(seconds)%60;
	chars.s = (chars.r > 9 ? "" : "0") + chars.r;
	chars.S = Math.floor(seconds);
	chars.t = Math.round((seconds%1)*10);
	chars.T = Math.round((seconds%1)*100);
	chars.T = (chars.T > 9 ? "": "0") + Math.round(chars.T);
	chars.u = Math.round((seconds%1)*1000);
	chars.u = (chars.u > 9 ? chars.u > 99 ? "" : "0" : "00") + Math.round(chars.u);
	chars.U = Math.round(seconds*1000);
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
Util.popUp = function(url, name, w, h, extra) {
	var p;
	name = name ? name : "POPUP_" + new Date().getHours() + "_" + new Date().getMinutes() + "_" + new Date().getMilliseconds();
	w = w ? w : 330;
	h = h ? h : 150;
	p = "width=" + w + ",height=" + h;
	p += ",left=" + (screen.width-w)/2;
	p += ",top=" + ((screen.height-h)-20)/2;
	p += extra ? "," + extra : ",scrollbars";
	document[name] = window.open(url, name, p);
}
Util.createRequestObject = function(type) {
	var request_object = false;
		try {
			request_object = new XMLHttpRequest();
		}
		catch(e){
			request_object = new ActiveXObject("Microsoft.XMLHTTP");
		}
	if(request_object) {
		return request_object;
	}
	u.bug("Could not create HTTP Object");
	return false;
}
Util.Request = function(node, url, parameters, method, async) {
	if(typeof(node) != "object") {
		var node = new Object();
	}
	node.url = url;
	node.parameters = parameters ? parameters : "";
	node.method = method ? method : "GET";
	node.async = async ? async : false;
	if(node.method.match(/GET|POST|PUT|PATCH/i)) {
		node.HTTPRequest = this.createRequestObject();
		node.HTTPRequest.node = node;
		if(node.async) {
			node.HTTPRequest.onreadystatechange = function() {
				if(node.HTTPRequest.readyState == 4) {
					u.validateResponse(this);
				}
			}
		}
		try {
			if(node.method.match(/GET/i)) {
				node.url += node.parameters ? ((!node.url.match(/\?/g) ? "?" : "&") + node.parameters) : "";
				node.HTTPRequest.open(node.method, node.url, node.async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				node.HTTPRequest.send();
			}
			else if(node.method.match(/POST|PUT|PATCH/i)) {
				node.HTTPRequest.open(node.method, node.url, node.async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				node.HTTPRequest.send(node.parameters);
			}
		}
		catch(e) {
			u.bug("request exception:" + e);
			u.validateResponse(node.HTTPRequest);
			return;
		}
		if(!async) {
			u.validateResponse(node.HTTPRequest);
		}
	}
	else if(node.method.match(/SCRIPT/i)) {
		node.url = url;
		var key = u.randomString();
		document[key] = new Object();
		document[key].node = node;
		document[key].responder = function(response) {
			var response_object = new Object();
			response_object.node = this.node;
			response_object.responseText = response;
			u.validateResponse(response_object);
		}
		u.ae(u.qs("head"), "script", ({"type":"text/javascript", "src":node.url + "?" + parameters + "&callback=document."+key+".responder"}));
	}
}
Util.requestParameters = function() {
	u.bug("params:" + arguments.length)
}
Util.testResponseForJSON = function(responseText) {
	if(responseText.trim().substr(0, 1).match(/[\{\[]/i) && responseText.trim().substr(-1, 1).match(/[\}\]]/i)) {
		try {
			var test = eval("("+responseText+")");
			if(typeof(test) == "object") {
				test.isJSON = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.testResponseForHTML = function(responseText) {
	if(responseText.trim().substr(0, 1).match(/[\<]/i) && responseText.trim().substr(-1, 1).match(/[\>]/i)) {
		try {
			var test = document.createElement("div");
			test.innerHTML = responseText;
			if(test.childNodes.length) {
				var body_class = responseText.match(/<body class="([a-z0-9A-Z_ ]+)"/);
				test.body_class = body_class ? body_class[1] : "";
				var head_title = responseText.match(/<title>([^$]+)<\/title>/);
				test.head_title = head_title ? head_title[1] : "";
				test.isHTML = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.evaluateResponse = function(responseText) {
	var object;
	if(typeof(responseText) == "object") {
		responseText.isJSON = true;
		return responseText;
	}
	else {
		if(responseText.trim().substr(0, 1).match(/[\"\']/i) && responseText.trim().substr(-1, 1).match(/[\"\']/i)) {
				response_string = responseText.trim();
				var json = u.testResponseForJSON(response_string.substr(1, response_string.length-2));
				if(json) {
					return json;
				}
				var html = u.testResponseForHTML(response_string.substr(1, response_string.length-2));
				if(html) {
					return html;
				}
				return responseText;
		}
		var json = u.testResponseForJSON(responseText);
		if(json) {
			return json;
		}
		var html = u.testResponseForHTML(responseText);
		if(html) {
			return html;
		}
		return responseText;
	}
}
Util.validateResponse = function(response){
	var object;
	if(response) {
		try {
			if(response.status) {
				if(!response.status.toString().match(/403|404|500/)) {
					object = u.evaluateResponse(response.responseText);
				}
			}
			else {
				if(response.responseText) {
					object = u.evaluateResponse(response.responseText);
				}
			}
		}
		catch(exception) {
			u.bug("HTTPRequest exection:" + e);
		}
	}
	if(typeof(response.node.Response) == "function") {
		response.node.Response(object);
	}
}
Util.cutString = function(string, length) {
	var matches, match, i;
	if(string.length <= length) {
		return string;
	}
	else {
		length = length-3;
	}
	matches = string.match(/\&[\w\d]+\;/g);
	if(matches) {
		for(i = 0; match = matches[i]; i++){
			if(string.indexOf(match) < length){
				length += match.length-1;
			}
		}
	}
	return string.substring(0, length) + (string.length > length ? "..." : "");
}
Util.random = function(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}
Util.randomKey = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "1234567890abcdefghijklmnopqrstuvwxyz".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.randomString = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.uuid = function() {
	var chars = '0123456789abcdef'.split('');
	var uuid = [], rnd = Math.random, r, i;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4';
	for(i = 0; i < 36; i++) {
		if(!uuid[i]) {
			r = 0 | rnd()*16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
 	}
	return uuid.join('');
}
Util.stringOr = function(value, replacement) {
	if(value !== undefined && value !== null) {
		return value;
	}
	else {
		return replacement ? replacement : "";
	}	
}
Util.explorer = function(version, scope) {
	if(document.all) {
		var undefined;
		var current_version = navigator.userAgent.match(/(MSIE )(\d+.\d)/i)[2];
		if(scope && !eval(current_version + scope + version)){
			return false;
		}
		else if(!scope && version && current_version != version) {
			return false;
		}
		else {
			return current_version;
		}
	}
	else {
		return false;
	}
}
Util.safari = function(version, scope) {
	if(navigator.userAgent.indexOf("Safari") >= 0) {
		var undefined;
		var current_version = navigator.userAgent.match(/(Safari\/)(\d+)(.\d)/i)[2];
		if(scope && !eval(current_version + scope + version)){
			return false;
		}
		else if(!scope && version && current_version != version) {
			return false;
		}
		else {
			return current_version;
		}
	}
	else {
		return false;
	}
}
Util.webkit = function(version, scope) {
	if(navigator.userAgent.indexOf("AppleWebKit") >= 0) {
		var undefined;
		var current_version = navigator.userAgent.match(/(AppleWebKit\/)(\d+.\d)/i)[2];
		if(scope && !eval(current_version + scope + version)){
			return false;
		}
		else if(!scope && version && current_version != version) {
			return false;
		}
		else {
			return current_version;
		}
	}
	else {
		return false;
	}
}
Util.firefox = function(version, scope) {
	var browser = navigator.userAgent.match(/(Firefox\/)(\d+\.\d+)/i);
	if(browser) {
		var current_version = browser[2];
		if(scope && !eval(current_version + scope + version)){
			return false;
		}
		else if(!scope && version && current_version != version) {
			return false;
		}
		else {
			return current_version;
		}
	}
	else {
		return false;
	}
}
Util.opera = function() {
	return (navigator.userAgent.indexOf("Opera") >= 0) ? true : false;
}
Util.windows = function() {
	return (navigator.userAgent.indexOf("Windows") >= 0) ? true : false;
}
Util.osx = function() {
	return (navigator.userAgent.indexOf("OS X") >= 0) ? true : false;
}
Util.Timer = u.t = new function() {
	this._timers = new Array();
	this.setTimer = function(node, action, timeout) {
		var id = this._timers.length;
		this._timers[id] = {"_a":action, "_n":node, "_t":setTimeout("u.t._executeTimer("+id+")", timeout)};
		return id;
	}
	this.resetTimer = function(id) {
		if(this._timers[id]) {
			clearTimeout(this._timers[id]._t);
			this._timers[id] = false;
		}
	}
	this._executeTimer = function(id) {
		var node = this._timers[id]._n;
		node._timer_action = this._timers[id]._a;
		node._timer_action();
		node._timer_action = null;
		this._timers[id] = false;
	}
	this.setInterval = function(node, action, interval) {
		var id = this._timers.length;
		this._timers[id] = {"_a":action, "_n":node, "_i":setInterval("u.t._executeInterval("+id+")", interval)};
		return id;
	}
	this.resetInterval = function(id) {
		if(this._timers[id]) {
			clearInterval(this._timers[id]._i);
			this._timers[id] = false;
		}
	}
	this._executeInterval = function(id) {
		var node = this._timers[id]._n;
		node._interval_action = this._timers[id]._a;
		node._interval_action();
		node._timer_action = null;
	}
	this.valid = function(id) {
		return this._timers[id] ? true : false;
	}
	this.resetAllTimers = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._t) {
				this.resetTimer(i);
			}
		}
	}
	this.resetAllIntervals = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._i) {
				this.resetInterval(i);
			}
		}
	}
}
Util.getVar = function(s, url) {
	var p = url ? url : location.search;
	var start_index = (p.indexOf("&" + s + "=") > -1) ? p.indexOf("&" + s + "=") + s.length + 2 : ((p.indexOf("?" + s + "=") > -1) ? p.indexOf("?" + s + "=") + s.length + 2 : false);
	var end_index = (p.substring(start_index).indexOf("&") > -1) ? p.substring(start_index).indexOf("&") + start_index : false;
	var return_string = start_index ? p.substring(start_index,(end_index ? end_index : p.length)): "";
	return return_string;
}
Util.getHashVar = function(s) {
	var h = location.hash;
	var values, index, list;
	values = h.substring(1).split("&");
	for(index in values) {
		list = values[index].split("=");
		if(list[0] == s) {
			return list[1];
		}
	}
	return false;
}
Util.getUniqueId = function() {
	return ("id" + Math.random() * Math.pow(10, 17) + Math.random());
}
Util.getHashPath = function(n) {
	var h = location.hash;
	var values;
	if(h.length) {
		values = h.substring(2).split("/");
		if(n && values[n]) {
			return values[n];
		}
	}
	return values ? values : false;
}
Util.setHashPath = function(path) {
	location.hash = path;
	return Util.getHashPath();
}

/*u-init-domready.js*/
if(!u.o) {
	Util.Objects = u.o = new Object();
}
Util.init = function(scope) {
	var i, e, elements, ij_value;
	scope = scope && scope.nodeName ? scope : document;
	elements = u.ges("i\:([_a-zA-Z0-9])+", scope);
	for(i = 0; e = elements[i]; i++) {
		while((ij_value = u.getIJ(e, "i"))) {
			u.removeClass(e, "i:"+ij_value);
			if(ij_value && typeof(u.o[ij_value]) == "object") {
				u.o[ij_value].init(e);
			}
		}
	}
}
if(document.addEventListener) {
	document.addEventListener("DOMContentLoaded", 
		function() {
			document.removeEventListener("DOMContentLoaded", arguments.callee, false);
			u.init();
    	}
	, false);
}
else if (document.attachEvent) {
	document.attachEvent("onreadystatechange", 
		function() {
			if(document.readyState === "complete") {
				document.detachEvent("onreadystatechange", arguments.callee);
				u.init();
			}
		}
	);
}
else {
	u.e.addEvent(window, "load", u.init);
}

/*beta-u-audio.js*/
Util.audioPlayer = function(node) {
	var player;
	if(node) {
		player = u.ae(node, "div", {"class":"audioplayer"});
	}
	else {
		player = document.createElement("div");
		u.ac(player, "audioplayer");
	}
	player.audio = u.ae(player, "audio");
	player.audio.controls = false;
	if(typeof(player.audio.play) == "function") {
		player.load = function(src) {
			if(this.playing) {
				this.stop();
			}
			if(src) {
				this.audio.src = this.correctSource(src);
				this.audio.load();
			}
		}
		player.play = function(position) {
			this.playing = true;
			position = position ? position : 0;
			if(this.audio.src) {
				this.audio.play();
			}
		}
		player.loadAndPlay = function(src, position) {
			this.load(src);
			this.play(position);
		}
		player.pause = function() {
			this.playing = false;
			this.audio.pause();
		}
		player.stop = function() {
			this.pause();
		}
		player._loadstart = function(event) {
			u.removeClass(this.parentNode, "ready")
			u.addClass(this.parentNode, "loading");
		}
		u.e.addEvent(player.audio, "loadstart", player._loadstart);
		player._canplaythrough = function(event) {
			u.removeClass(this.parentNode, "loading")
			u.addClass(this.parentNode, "ready");
		}
		u.e.addEvent(player.audio, "canplaythrough", player._canplaythrough);
		player._loadeddata = function(event) {
			this.parentNode.videoLoaded = true;
			if(typeof(this.parentNode.loadeddata) == "function") {
				this.parentNode.loadeddata(event);
			}
		}
		u.e.addEvent(player.audio, "loadeddata", player._loadeddata);
		player._ended = function(event) {
			u.rc(this, "playing|paused");
			if(typeof(this.parentNode.ended) == "function") {
				this.parentNode.ended(event);
			}
		}
		u.e.addEvent(player.audio, "ended", player._ended);
		player._loadedmetadata = function(event) {
			u.bug("1", "loadedmetadata:duration:" + this.duration);
			u.bug("1", "loadedmetadata:currentTime:" + this.currentTime);
		}
	}
	else if(typeof(u.audioPlayerFallback) == "function") {
		player.removeChild(player.video);
		player = u.audioPlayerFallback(player);
	}
	else {
		player.load = function() {}
		player.play = function() {}
		player.loadAndPlay = function() {}
		player.pause = function() {}
		player.stop = function() {}
	}
	player.correctSource = function(src) {
		src = src.replace(/.mp3|.ogg|.wav/, "");
		if(this.audio.canPlayType("audio/mpeg")) {
			return src+".mp3";
		}
		else if(this.audio.canPlayType("audio/ogg")) {
			return src+".ogg";
		}
		else {
			return src+".wav";
		}
	}
	return player;
}
/*i-hwundtiles980x300.js*/
Util.Objects["hwundtiles980x300"] = new function() {
	this.init = function(banner) {
		banner._initialized = true;
		banner._version = "tablet,full";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;
		banner._interaction = false;
		banner.t_interaction = false;
		banner.t_out = false;
		banner._shown = false;
		banner._initcontent = banner.innerHTML;
		banner._images = new Array();
		for(i = 0; i <= 58; i++) {
			banner._images.push("/feber_980/funstuff/tiles_980x300/img/sequence/LiveTile_V005_intro_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		for(i = 0; i <= 18; i++) {
			banner._images.push("/feber_980/funstuff/tiles_980x300/img/sequence/Tile_Mail_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		for(i = 0; i <= 18; i++) {
			banner._images.push("/feber_980/funstuff/tiles_980x300/img/sequence/Tile_PeopleHub_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		for(i = 0; i <= 18; i++) {
			banner._images.push("/feber_980/funstuff/tiles_980x300/img/sequence/LiveTile_Weather_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		for(i = 0; i <= 18; i++) {
			banner._images.push("/feber_980/funstuff/tiles_980x300/img/sequence/Tile_Foto_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		for(i = 0; i <= 18; i++) {
			banner._images.push("/feber_980/funstuff/tiles_980x300/img/sequence/Tile_Nyheter_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		banner._framerate = 1000/12; // 12 frames a second
		banner.hoverHint = function() {
			this.hint1.transitioned = function() {
				this.transitioned = null;
				u.a.transition(this, "none");
				this.transitioned = function() {
					this.transitioned = null;
					u.a.transition(this, "none");
					this.banner.hoverHint();
				}
				u.a.transition(this, "all 1s ease-in-out");
				u.a.setBgPos(this, 0, "50%");
			}
			u.a.transition(this.hint1, "all 1s ease-in-out");
			u.a.setBgPos(this.hint1, 5, "50%");
		}
		banner.updateHeading = function(tile) {
			u.a.transition(this.h2, "none");
			if(tile) {
				this.h2.new_text = tile._h3.innerHTML;
			}
			else {
				this.h2.new_text = this.h2.org_text;
			}
			this.h2.transitioned = function() {
				u.a.transition(this, "none");
				this.transitioned = null;
				this.innerHTML = this.new_text;
				u.a.transition(this, "all 0.3s ease-in");
				u.a.translate(this, 0, 0);
			}
			if(this.h2.element_x != -this.offsetWidth) {
				u.a.transition(this.h2, "all 0.3s ease-in");
				u.a.translate(this.h2, -this.offsetWidth, 0);
			}
			else {
				this.h2.transitioned();
			}
		}
		banner.audioController = function(src, priority) {
			if(this._interaction) {
				if(!this.audioPlayer.playing || priority) {
					if(typeof(this.audioPlayer.ended) != "function") {
						this.audioPlayer.ended = function() {
							this.ended = null;
							this.banner.mute.soundStopped();
						}
					}
					this.audioPlayer.loadAndPlay(src);
					this.mute.soundPlaying();
				}
			}
		}
		banner.ejectAudio = function() {
			if(this.audioPlayer && this.audioPlayer.parentNode) {
				this.audioPlayer.stop();
				this.audioPlayer.parentNode.removeChild(this.audioPlayer);
			} 
		}
		banner.activateTile = function(tile) {
			tile.banner = this;
			tile._h3 = u.qs("h3", tile);
			tile._id = tile.className.match(/\d/);
			u.a.transition(tile, "none");
			u.a.setOpacity(tile, 0);
			u.as(tile, "display", "block");
			tile.hide = function() {
				this.transitioned = null;
				u.a.transition(this, "none");
				u.rc(this, "show");
				u.a.setOpacity(this, 0);
			}
			tile.fade = function() {
				u.a.transition(this, "none");
				this.transitioned = function() {
					u.a.transition(this, "none");
					this.transitioned = null
					u.rc(this, "show");
				}
				if(u.gcs(this, "opacity") != 0) {
					u.a.transition(this, "all 0.3s ease-in");
					u.a.setOpacity(this, 0);
				}
				else {
					this.transitioned();
				}
				this.t_blink = u.t.setTimer(this, this.blink, 4000);
			}
			tile.blink = function() {
				this.transitioned = null;
				u.a.transition(this, "none");
				u.a.setOpacity(this, 0);
				u.ac(this, "show");
				u.a.transition(this, "all 0.3s ease-in");
				u.a.setOpacity(this, 1);
				this.t_blink = u.t.setTimer(this, this.fade, 500);
			}
			u.e.click(tile);
			tile.clicked = function(event) {
				u.e.kill(event);
				this.banner._interaction = true;
				this.banner.hint1.transitioned = null;
				u.a.transition(this.banner.hint1, "all 0.3s ease-in");
				u.a.translate(this.banner.hint1, this.banner.offsetWidth, 0);
				if(this.banner._shown) {
					u.t.resetTimer(this.banner.t_delay);
					this.banner.tileRepeat = null;
					this.banner.tileWaiting = null;
					this.banner.audioPlayer.stop();
					this.banner.tileDone = function() {
						this.tileDone = null;
						this.startTiles();
						this.updateHeading();
					}
					this.banner["sqTile" + this.banner._shown + "out"]();
					this.banner._shown = false;
				}
				else {
					this.banner._shown = this._id;
					this.banner.pauseTiles();
					this.banner.updateHeading(this);
					this.banner.tileRepeat = function() {
						this["sqTile" + this._shown + "repeat"]();
					}
					this.banner.tileWaiting = function() {
						this.t_delay = u.t.setTimer(this, this.tileRepeat, 2000);
					}
					this.banner.audioPlayer.ended = function() {
						this.ended = null;
						u.t.resetTimer(this.banner.t_delay);
						this.banner.tileRepeat = null;
						this.banner.tileWaiting = null;
						this.banner.mute.soundStopped();
						this.banner.tileDone = function() {
							this.tileDone = null;
							this.updateHeading();
							this.startTiles();
							this._shown = false;
						}
						this.banner["sqTile" + this.banner._shown + "out"]();
					}
					this.banner.audioController("/feber_980/funstuff/tiles_980x300/audio/tiles_" + this.banner._shown + ".mp3", 1);
					this.banner["sqTile" + this.banner._shown + "in"]();
				}
			}
		}
		banner.pauseTiles = function() {
			this.tile_mail.transitioned = null;
			this.tile_people.transitioned = null;
			this.tile_weather.transitioned = null;
			this.tile_photos.transitioned = null;
			this.tile_news.transitioned = null;
			u.t.resetTimer(this.tile_mail.t_blink);
			u.t.resetTimer(this.tile_people.t_blink);
			u.t.resetTimer(this.tile_weather.t_blink);
			u.t.resetTimer(this.tile_photos.t_blink);
			u.t.resetTimer(this.tile_news.t_blink);
			if(typeof(this.tile_mail.hide) == "function") {
				this.tile_mail.hide();
			}
			if(typeof(this.tile_people.hide) == "function") {
				this.tile_people.hide();
			}
			if(typeof(this.tile_weather.hide) == "function") {
				this.tile_weather.hide();
			}
			if(typeof(this.tile_photos.hide) == "function") {
				this.tile_photos.hide();
			}
			if(typeof(this.tile_news.hide) == "function") {
				this.tile_news.hide();
			}
		}
		banner.startTiles = function() {
			this.tile_mail.t_blink = u.t.setTimer(this.tile_mail, this.tile_mail.blink, 200);
			this.tile_people.t_blink = u.t.setTimer(this.tile_people, this.tile_people.blink, 700);
			this.tile_weather.t_blink = u.t.setTimer(this.tile_weather, this.tile_weather.blink, 1200);
			this.tile_photos.t_blink = u.t.setTimer(this.tile_photos, this.tile_photos.blink, 1700);
			this.tile_news.t_blink = u.t.setTimer(this.tile_news, this.tile_news.blink, 2200);
		}
		banner.cleared = function() {
			this.innerHTML = this._initcontent;
		}
		banner.ready = function(play) {
			this._autoplay = play;
			this._isreset = false;
			this._iscleared = false;
			u.o.banner.init(this);
			this.h2 = u.qs("h2", this);
			this.h2.banner = this;
			this.h2.org_text = this.h2.innerHTML;
			this.hint1 = u.qs(".hint1", this);
			this.hint1.banner = this;
			this.tile_mail = u.qs(".tile.mail", this);
			this.tile_mail.banner = this;
			this.tile_people = u.qs(".tile.people", this);
			this.tile_people.banner = this;
			this.tile_weather = u.qs(".tile.weather", this);
			this.tile_weather.banner = this;
			this.tile_photos = u.qs(".tile.photos", this);
			this.tile_photos.banner = this;
			this.tile_news = u.qs(".tile.news", this);
			this.tile_news.banner = this;
			this.logo = u.qs(".logo", this);
			this.learnmore = u.qs(".learnmore", this);
			this.learnmore.banner = this;
			u.link(this.learnmore);
			this.learnmore.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.learnmore.clicked = function() {
				window.open(this.url, "_blank");
			}
			u.a.transition(this.hint1, "none");
			u.a.translate(this.hint1, this.offsetWidth, 0);
			u.as(this.hint1, "display", "block");
			u.a.setOpacity(this.hint1, 1);
			if(!this._interaction && u.e.event_pref == "mouse") {
				this.onmouseover = function() {
					if(!this._interaction && !this._hover_time) {
						this._hover_time = new Date().getTime();
						u.t.resetTimer(this.t_interaction);
						this.t_interaction = u.t.setTimer(this, this.interacted, 1000);
					}
					else if(this._interaction && this.audioPlayer && !this.audioPlayer.playing) {
						this.audioController("/feber_980/funstuff/tiles_980x300/audio/tiles_intro.mp3")
					}
					u.t.resetTimer(this.t_out);
				}
				this.onmouseout = function() {
					this.t_out = u.t.setTimer(this, this.actualOut, 100);
				}
				this.actualOut = function() {
					if(this._interaction) {
						this.mute.soundStopped();
						this.audioPlayer.stop();
						if(this._shown) {
							u.t.resetTimer(this.t_delay);
							this.tileRepeat = null;
							this.tileWaiting = null;
							this.tileDone = function() {
								this.tileDone = null;
								this.updateHeading();
								this.startTiles();
								this._shown = false;
							}
							this["sqTile" + this._shown + "out"]();
						}
					}
					else {
						u.t.resetTimer(this.t_interaction);
						this._hover_time = false;
					}
				}
				this.interacted = function() {
					if(this._hover_time && (new Date().getTime() - this._hover_time) > 1000) {
						this._interaction = true;
						this.audioController("/feber_980/funstuff/tiles_980x300/audio/tiles_intro.mp3");
						u.t.resetTimer(this.t_interaction);
						u.t.resetTimer(this.t_out);
					}
				}
			}
			this.audioPlayer = u.audioPlayer(this);
			this.audioPlayer.banner = this;
			this.easter_1 = u.ae(this, "div", {"class":"easter easter_1"});
			this.easter_1.banner = this;
			this.easter_2 = u.ae(this, "div", {"class":"easter easter_2"});
			this.easter_2.banner = this;
			this.touchscreen = u.ae(this, "div", {"class":"easter touchscreen"});
			this.touchscreen.banner = this;
			u.e.click(this.touchscreen);
			this.touchscreen.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.touchscreen.clicked = function(event) {
				var tiles = u.qsa(".tile", this.banner);
				var random_tile = Math.floor(Math.random()*5);
				tiles[random_tile].clicked(event);
			}
			u.e.click(this.easter_1);
			this.easter_1.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.easter_1.clicked = function(event) {
				if(this.banner._shown) {
					this.banner.tile_mail.clicked(event);
				}
				else {
					this.banner.audioController("/feber_980/funstuff/tiles_980x300/audio/tiles_easter_"+ (Math.random() > 0.5 ? "1" : "2") +".mp3", 1);
				}
			}
			u.e.click(this.easter_2);
			this.easter_2.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.easter_2.clicked = function(event) {
				if(this.banner._shown) {
					this.banner.tile_mail.clicked(event);
				}
				else {
					this.banner.audioController("/feber_980/funstuff/tiles_980x300/audio/tiles_easter_3.mp3", 1);
				}
			}
			this.mute = u.ae(this, "div", {"class":"mute"});
			this.mute.banner = this;
			this.mute.fadeDown = function() {
				u.a.transition(this, "none");
				u.a.transition(this, "all 1s ease-in-out");
				u.a.setOpacity(this, 0.5);
				if(this.playback) {
					this.t_sound = u.t.setTimer(this, this.fadeUp, 1000);
				}
			}
			this.mute.fadeUp = function() {
				u.a.transition(this, "none");
				u.a.transition(this, "all 1s ease-in-out");
				u.a.setOpacity(this, 0.8);
				if(this.playback) {
					this.t_sound = u.t.setTimer(this, this.fadeDown, 1000);
				}
			}
			this.mute.soundPlaying = function() {
				if(!this.playback && !this.muted) {
					this.playback = true;
					this.fadeDown();
				}
			}
			this.mute.soundStopped = function() {
				this.playback = false;
				u.t.resetTimer(this.t_sound);
				u.a.transition(this, "all 0.2s ease-in-out");
				u.a.setOpacity(this, 1);
			}
			u.e.click(this.mute);
			this.mute.clicked = function() {
				u.a.transition(this, "none");
				if(!this.muted) {
					this.banner.audioPlayer.audio.volume = 0;
					u.ac(this, "muted");
					this.muted = true;
					this.soundStopped();
				}
				else {
					this.banner.audioPlayer.audio.volume = 1;
					this.muted = false;
					u.rc(this, "muted");
					if(this.banner.audioPlayer.playing) {
						this.soundPlaying();
					}
				}
			}
			this.preload(0, 58, "sq1", 1500);
		}
		banner.sq1 = function() {
			u.a.transition(this.animation, "none");
			u.a.setOpacity(this.animation, 1);
			this.setup(0, 58, "sq2");
		}
		banner.sq2 = function() {
			u.a.transition(this.hint1, "all 0.4s ease-in");
			u.a.translate(this.hint1, 0, 0);
			this.hoverHint();
			this.activateTile(this.tile_mail);
			this.t_delay = u.t.setTimer(this, this.sq3, 300);
		}
		banner.sq3 = function() {
			this.activateTile(this.tile_people);
			this.t_delay = u.t.setTimer(this, this.sq4, 300);
		}
		banner.sq4 = function() {
			this.activateTile(this.tile_weather);
			this.t_delay = u.t.setTimer(this, this.sq5, 300);
		}
		banner.sq5 = function() {
			this.activateTile(this.tile_photos);
			this.t_delay = u.t.setTimer(this, this.sq6, 300);
		}
		banner.sq6 = function() {
			this.activateTile(this.tile_news);
			this.startTiles();
			u.ac(this, "noloader");
			this.preload(58, 153);
		}
		banner.sqTile1in = function() {
			this.setup(59, 77, "tileWaiting");
		}
		banner.sqTile1repeat = function() {
			if(this._current_frame == 77) {
				this.setup(77, 72, "tileWaiting");
			}
			else {
				this.setup(72, 77, "tileWaiting");
			}
		}
		banner.sqTile1out = function() {
			this.setup(67, 59, "tileDone");
		}
		banner.sqTile2in = function() {
			this.setup(78, 96, "tileWaiting");
		}
		banner.sqTile2repeat = function() {
			if(this._current_frame == 96) {
				this.setup(96, 91, "tileWaiting");
			}
			else {
				this.setup(91, 96, "tileWaiting");
			}
		}
		banner.sqTile2out = function() {
			this.setup(86, 78, "tileDone");
		}
		banner.sqTile3in = function() {
			this.setup(97, 115, "tileWaiting");
		}
		banner.sqTile3repeat = function() {
			if(this._current_frame == 115) {
				this.setup(115, 110, "tileWaiting");
			}
			else {
				this.setup(110, 115, "tileWaiting");
			}
		}
		banner.sqTile3out = function() {
			this.setup(105, 97, "tileDone");
		}
		banner.sqTile4in = function() {
			this.setup(116, 134, "tileWaiting");
		}
		banner.sqTile4repeat = function() {
			if(this._current_frame == 134) {
				this.setup(134, 129, "tileWaiting");
			}
			else {
				this.setup(129, 134, "tileWaiting");
			}
		}
		banner.sqTile4out = function() {
			this.setup(124, 116, "tileDone");
		}
		banner.sqTile5in = function() {
			this.setup(135, 153, "tileWaiting");
		}
		banner.sqTile5repeat = function() {
			if(this._current_frame == 153) {
				this.setup(153, 148, "tileWaiting");
			}
			else {
				this.setup(148, 153, "tileWaiting");
			}
		}
		banner.sqTile5out = function() {
			this.setup(143, 135, "tileDone");
		}
		banner.ready(true);
	}
}
/*i-hwundtiles980x300-mobile.js*/
Util.Objects["hwundtiles980x300_mobile"] = new function() {
	this.init = function(banner) {
		banner._initialized = true;
		banner._version = "mobile";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;
		banner._initcontent = banner.innerHTML;
		banner._images = new Array();
		for(i = 0; i <= 113; i++) {
			banner._images.push("/feber_980/funstuff/tiles_980x300/img/sequence_mobile/LiveTiles_Mobile_V002_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		banner._framerate = 1000/12; // 12 frames a second
		banner.cleared = function() {
			this.innerHTML = this._initcontent;
		}
		banner.ready = function(play) {
			this._autoplay = play;
			this._isreset = false;
			this._iscleared = false;
			u.o.banner.init(this);
			this.h2 = u.qs("h2", this);
			this.h2.banner = this;
			this.h3 = u.qs("h3", this);
			this.h3.banner = this;
			this.logo = u.qs(".logo", this);
			this.learnmore = u.qs(".learnmore", this);
			this.learnmore.banner = this;
			u.link(this.learnmore);
			this.learnmore.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.learnmore.clicked = function() {
				window.open(this.url, "_blank");
			}
			this.fullclick = u.ae(this, "div", {"class":"fullclick"});
			this.fullclick.banner = this;
			u.e.click(this.fullclick);
			this.fullclick.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.fullclick.clicked = function() {
				window.open(this.banner.learnmore.url, "_blank");
			}
			u.a.transition(this.h3, "none");
			u.a.translate(this.h3, this.offsetWidth, 0);
			u.as(this.h3, "display", "block");
			u.a.setOpacity(this.h3, 1);
			u.a.transition(this.logo, "none");
			u.as(this.logo, "display", "none");
			u.a.setOpacity(this.logo, 0);
			u.a.transition(this.logo, "none");
			u.a.translate(this.logo, this.offsetWidth, 0);
			u.as(this.logo, "display", "block");
			u.a.setOpacity(this.logo, 1);
			this.preload(0, this.nodes.length-1, "sq1", 1500);
		}
		banner.sq1 = function() {
			u.a.transition(this.h2, "all 0.4s ease-in");
			u.a.translate(this.h2, -this.offsetWidth, 0);
			this.t_delay = u.t.setTimer(this, this.sq1_logo_in, 600);
		}
		banner.sq1_logo_in = function() {
			u.a.transition(this.logo, "all 0.4s ease-in");
			u.a.translate(this.logo, 0, 0);
			this.t_delay = u.t.setTimer(this, this.sq1_logo_out, 1600);
		}
		banner.sq1_logo_out = function() {
			u.a.transition(this.logo, "all 0.4s ease-in");
			u.a.translate(this.logo, -(this.offsetWidth), 0);
			this.t_delay = u.t.setTimer(this, this.sq2, 600);
		}
		banner.sq2 = function() {
			u.a.transition(this.animation, "none");
			u.a.setOpacity(this.animation, 1);
			this.setup(0, this.nodes.length-1, "sq3");
		}
		banner.sq3 = function() {
			this.t_delay = u.t.setTimer(this, this.sq4, 100);
		}
		banner.sq4 = function() {
			this.resetAnimation();
			u.a.transition(this.h3, "all 0.4s ease-in");
			u.a.translate(this.h3, 0, 0);
			this.t_delay = u.t.setTimer(this, this.sq5, 1600);
		}
		banner.sq5 = function() {
			u.a.transition(this.h3, "all 0.4s ease-in");
			u.a.translate(this.h3, -this.offsetWidth, 0);
			this.t_delay = u.t.setTimer(this, this.sq6, 400);
		}
		banner.sq6 = function() {
			u.a.transition(this.logo, "none");
			u.a.translate(this.logo, this.offsetWidth, 0);
			u.as(this.logo, "display", "block");
			u.a.transition(this.logo, "all 0.6s ease-in");
			u.a.translate(this.logo, 0, 0);
			this.t_delay = u.t.setTimer(this, this.sq7, 1600);
		}
		banner.sq7 = function() {
			u.a.transition(this.logo, "none");
			u.a.transition(this.logo, "all 0.6s ease-in");
			u.a.translate(this.logo, -29, 13);
			u.a.setHeight(this.logo, 20);
			u.a.setWidth(this.logo, 106);
			this.sq8();
		}
		banner.sq8 = function() {
			u.a.transition(this.learnmore, "none");
			u.as(this.learnmore, "display", "block");
			u.a.translate(this.learnmore, this.offsetWidth, 0);
			u.a.setOpacity(this.learnmore, 1);
			u.a.transition(this.learnmore, "all 0.6s ease-in");
			u.a.translate(this.learnmore, 0, 0);
		}
		banner.ready(true);
	}
}
/*i-banner.js*/
Util.Objects["banner"] = new function() {
	this.init = function(banner) {
		banner.animation = u.ae(banner, "ul", {"class":"animation"});
		banner.animation.banner = banner;
		banner.nodes = new Array();
		var i, node;
		for(i = 0; i < banner._images.length; i++) {
			node = u.ae(banner.animation, "li");
			node.banner = banner;
			node.i = i;
			banner.nodes[i] = node;
			node._initialized = false;
		}
		banner.t_playback = false;
		banner.t_loader = false;
		banner.t_loadeddelay = false;
		banner._loadingprocess = function() {
			if(!this._isloading) {
				var preloader = u.ae(this, "div", {"class":"preloader", "html":"3D elements rendering"});
				u.a.transition(preloader, "all 0.2s ease-in");
				u.a.setOpacity(preloader, 1);
				this._isloading = true;
			}
		}
		banner._loading = function() {
			u.t.resetTimer(this.t_loader);
			this.t_loader = u.t.setTimer(this, this._loadingprocess, 300);
		}
		banner._loaded = function() {
			u.t.resetTimer(this.t_loader);
				var preloader = u.qs(".preloader", this);
				if(preloader) {
					preloader.transitioned = function() {
						this.transitioned = null;
						if(this.parentNode) {
							this.parentNode.removeChild(this);
						}
					}
					if(u.gcs(preloader, "opacity") != 0) {
						u.a.transition(preloader, "all 0.2s ease-in");
						u.a.setOpacity(preloader, 0);
					}
					else {
						preloader.transitioned();
					}
				}
				this._isloading = false;
		}
		banner.preload = function(start_frame, end_frame, callback, callback_min_delay) {
			this._preload_start_time = new Date().getTime();
			if(callback) {
				this.preloader_callback = callback;
			}
			else {
				this.preloader_callback = false;
			}
			if(callback_min_delay) {
				this.t_loader = u.t.setTimer(this, this._loading, callback_min_delay);
				this.preloader_callback_min_delay = callback_min_delay;
			}
			else {
				this._loading();
				this.preloader_callback_min_delay = 0;
			}
			if(end_frame <= start_frame) {
				var _frame = start_frame;
				start_frame = end_frame;
				end_frame = _frame
			}
			for(i = start_frame; i <= end_frame; i++) {
				this.preload_queue.push(i);
			}
			this.queueLoader();
		}
		banner.queueLoader = function() {
			if(this.preload_queue.length) {
				while(this.preload_processes < 5 && this.preload_queue.length) {
					this.preload_processes++;
					var next = this.preload_queue.shift();
					if(!this.nodes[next]) {
					}
					if(!this.nodes[next]._initialized) {
						this.nodes[next]._initialized = true;
						this.nodes[next].loaded = function(event) {
							u.as(this, "backgroundImage", "url("+event.target.src+")", 1);
							u.ac(this, "ready");
							this.banner.preload_processes--;
							if(!this.banner._isreset) {
								this.banner.queueLoader();
							}
						}
						u.i.load(this.nodes[next], banner._images[next]);
					}
					else {
						this.preload_processes--;
						if(!this._isreset) {
							this.queueLoader();
						}
					}
				}
			}
			else if(this.preload_processes == 0) {
				this._loaded();
				var end_time = new Date().getTime();
				if((end_time - this._preload_start_time) > this.preloader_callback_min_delay && !this._isreset) {
					if(typeof(this[this.preloader_callback]) == "function") {
						this[this.preloader_callback]();
					}
				}
				else if(!this._isreset){
					this.t_loadeddelay = u.t.setTimer(this, this.queueLoader, this.preloader_callback_min_delay - (end_time - this._preload_start_time));
				}
			}
		}
		banner.preload_queue = new Array();
		banner.preload_processes = 0;
		banner._cleared = function() {
			u.a.transition(this.animation, "none");
			this.resetAnimation();
			u.a.setOpacity(this.animation, 1);
			if(typeof(this.cleared) == "function") {
				this.cleared();
			}
			this._iscleared = true;
			if(this.state && !u.hc(this, this.state)) {
				u.rc(this, "full|tablet|mobile", 1);
				u.ac(this, this.state);
			}
			else if(this._autoplay) {
				this.ready(this._autoplay);
			}
		}
		banner._reset = function(state) {
			this._autoplay = false;
			if(state) {
				this.state = state;
			}
			if(!this._isreset) {
				this._isreset = true;
				document.body.transitioned = function() {
					u.a.transition(this, "none");
					this.transitioned = null;
				}
				this.stopAnimation();
				u.t.resetTimer(this.t_delay);
				u.t.resetTimer(this.t_loadeddelay);
				this._loaded();
				var i, node;
				for(i = 0; node = this.childNodes[i]; i++) {
					if(node && node.nodeType != 3 && node.nodeType != 8) {
						u.a.transition(node, "all 0.3s ease-in");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this._cleared, 300);
			}
			else if(this._iscleared){
				if(state && !u.hc(this, state)) {
					u.rc(this, "full|tablet|mobile", 1);
					u.ac(this, state);
				}
			}
		}
		banner.resetAnimation = function(keep_node) {
			var node;
			this.stopAnimation();
			for(i = 0; node = this.nodes[i]; i++) {
				if(!keep_node || node != keep_node) {
					u.as(node, "display", "none", 1);
				}
			}
			this.offsetHeight;
		}
		banner.stopAnimation = function() {
			u.t.resetTimer(this.t_playback);
		}
		banner.setup = function(start, end, callback) {
			this.animation._start = Math.floor(start);
			this.animation._end = Math.floor(end);
			if(callback) {
				this.animation._callback = callback;
			}
			else {
				this.animation._callback = false;
			}
			this._setup = function() {
				this.resetAnimation(this.nodes[this.animation._start]);
				if(start <= end) {
					this.animation._direction = 1;
				}
				else {
					this.animation._direction = -1;
				}
				for(i = this.animation._start, j = 2000; (this.animation._direction < 0 ? i >= this.animation._end : i <= this.animation._end); i += this.animation._direction, j--) {
					u.as(this.nodes[i], "zIndex", j);
					if(j < 1999) {
						u.as(this.nodes[i], "display", "none", 1);
					}
					else {
						u.as(this.nodes[i], "display", "block", 1);
					}
				}
				this.offsetHeight;
				this._current_frame = this.animation._start;
				this.play(true);
			}
			this.preload(this.animation._start, this.animation._end, "_setup");
		}
		banner.play = function(start) {
			if(!start) {
				this.nextFrame(this._current_frame);
				this._current_frame = this._current_frame + this.animation._direction;
			}
			if(this.animation._end == this._current_frame) {
				if(typeof(this[this.animation._callback]) == "function") {
					this[this.animation._callback]();
				}
			}
			else {
				this.t_playback = u.t.setTimer(this, this.play, this._framerate);
			}
		}
		banner.nextFrame = function(frame) {
			var afterNext = (this._current_frame + (this.animation._direction*2))
			if(this.nodes[afterNext] && (this.animation._direction > 0 ? afterNext <= this.animation._end : afterNext >= this.animation._end)) {
				u.as(this.nodes[afterNext], "display", "block");
			}
			if(this.nodes[frame]) {
				u.as(this.nodes[frame], "display", "none");
			}
		}
	}
}
/*i-banners.js*/
Util.Objects["hwundcontroller"] = new function() {
	this.init = function(banner) {
		u.bug_position = "fixed";
		u.bug_force = true;
		var ctl = u.qs(".hwundcontroller");
		if(!ctl || !ctl.banners) {
			u.ac(banner, "hwundcontroller");
			ctl = banner;
			ctl.banners = new Array();
			ctl._bg_color = u.gcs(document.body, "background-color");
			ctl.t_scroll = false;
			ctl.current_state = false;
			ctl.globalReset = function() {
				var i, banner;
				for(i = 0; banner = this.banners[i]; i++) {
					if(banner.in_focus) {
						banner._reset(this.current_state);
					}
					else {
						if(!u.hc(banner, this.current_state)) {
							u.rc(banner, "full|tablet|mobile", 1);
							u.ac(banner, this.current_state);
						}
					}
				}
				this.t_scroll = u.t.setTimer(this, this.scrollHandler, 500);
			}
			window.scrollHandler = function() {
				u.qs(".hwundcontroller").scrollHandler();
			}
			ctl.scrollHandler = function() {
				var scrolled_y = u.scrollY();
				var browser_height = u.browserH();
				var margin = (browser_height - browser_height*0.8)/2;
				var focus_top = scrolled_y + margin;
				var focus_bottom = scrolled_y + browser_height - margin;
				var i, banner;
				for(i = 0; banner = this.banners[i]; i++) {
					banner.top_y = u.absY(banner);
					banner.center_y = banner.top_y + (banner.offsetHeight/2);
					banner.bottom_y = banner.top_y + banner.offsetHeight;
					if(banner.center_y > focus_top && banner.center_y < focus_bottom) {
						if(!banner.in_focus || banner._iscleared) {
							if(!banner._initialized || !banner._version.match(this.current_state)) {
								if(this.current_state == "mobile") {
									u.o[banner.id+"_"+this.current_state].init(banner);
								}
								else {
									u.o[banner.id].init(banner);
								}
							}
							else if(banner._iscleared) {
								banner.ready(true);
							}
						}
						else {
							banner._autoplay = true;
						}
						banner.in_focus = true;
					}
					else {
						if(banner.in_focus && !banner._isreset) {
							banner._reset(this.current_state);
							banner.in_focus = false;
						}
					}
				}
			}
			u.e.addEvent(window, "scroll", window.scrollHandler);
			window.resizeHandler = function() {
				u.qs(".hwundcontroller").resizeHandler();
			}
			ctl.resizeHandler = function() {
				u.t.resetTimer(this.t_scroll);
				if(u.browserW() < 768) {
					if(this.current_state != "mobile") {
						this.current_state = "mobile";
					}
				}
				else if(u.browserW() < 980) {
					if(this.current_state != "tablet") {
						this.current_state = "tablet";
					}
				}
				else {
					if(this.current_state != "full") {
						this.current_state = "full";
					}
				}
				this.globalReset();
			}
			u.e.addEvent(window, "resize", window.resizeHandler);
		}
		ctl.banners.push(banner);
		ctl.resizeHandler();
	}
}