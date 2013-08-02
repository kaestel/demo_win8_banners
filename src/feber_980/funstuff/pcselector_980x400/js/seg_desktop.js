
if(!u && !Util) {
	var u, Util = u = new function() {}
	u.version = "current";
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
		var node = document.createElement("div");
		if(node.style[this.variant() + "Transition"] !== undefined) {
			return true;
		}
		return false;
	}
	this.variant = function(e) {
		if(this.implementation == undefined) {
			if(document.body.style.webkitTransition != undefined) {
				this.implementation = "webkit";
			}
			else if(document.body.style.MozTransition != undefined) {
				this.implementation = "Moz";
			}
			else if(document.body.style.oTransition != undefined) {
				this.implementation = "o";
			}
			else if(document.body.style.msTransition != undefined) {
				this.implementation = "ms";
			}
			else {
				this.implementation = "";
			}
		}
		return this.implementation;
	}
	this.translate = function(e, x, y) {
		var variant_string = this.variant();
		if(variant_string == "webkit") {
			e.style[variant_string + "Transform"] = "translate3d("+x+"px, "+y+"px, 0)";
		}
		else {
			e.style[variant_string + "Transform"] = "translate("+x+"px, "+y+"px)";
		}
		e.element_x = x;
		e.element_y = y;
		e._x = x;
		e._y = y;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.rotate = function(e, deg) {
		e.style[this.variant() + "Transform"] = "rotate("+deg+"deg)";
		e._rotation = deg;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.scale = function(e, scale) {
		e.style[this.variant() + "Transform"] = "scale("+scale+")";
		e.scale = scale;
		e._scale = scale;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.setOpacity = function(e, opacity) {
		e.style.opacity = opacity;
		e._opacity = opacity;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.setWidth = function(e, width) {
		var width_px = (width == "auto" ? width : (width.toString().match(/\%/) ? width : width+"px"));
		e.style.width = width_px;
		e._width = width;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.setHeight = function(e, height) {
		var height_px = (height == "auto" ? height : (height.toString().match(/\%/) ? height : height+"px"));
		e.style.height = height_px;
		e._height = height;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.setBgPos = function(node, x, y) {
		var x = (x.toString().match(/auto|center|top|left|bottom|right/) ? x : (x.toString().match(/\%/) ? x : x + "px"));
		var y = (y.toString().match(/auto|center|top|left|bottom|right/) ? y : (y.toString().match(/\%/) ? y : y + "px"));
		node.style.backgroundPosition = x + " " + y;
		node._bg_x = x;
		node._bg_y = y;
		node.transition_timestamp = new Date().getTime();
		node.offsetHeight;
	}
	this.rotateTranslate = function(e, deg, x, y) {
		e.style[this.variant() + "Transform"] = "rotate("+deg+"deg) translate("+x+"px, "+y+"px)";
		e.rotation = deg;
		e.element_x = x;
		e.element_y = y;
		e._rotation = deg;
		e._x = x;
		e._y = y;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.translateRotate = function(e, x, y, deg) {
		e.style[this.variant() + "Transform"] = "translate("+x+"px, "+y+"px) rotate("+deg+"deg)";
		e.element_x = x;
		e.element_y = y;
		e.rotation = deg;
		e._x = x;
		e._y = y;
		e._rotation = deg;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.transition = function(e, transition) {
		try {
			e.style[this.variant() + "Transition"] = transition;
			u.e.addEvent(e, this.variant() + "TransitionEnd", this._transitioned);
			u.e.addEvent(e, "transitionend", this._transitioned);
			var duration = transition.match(/[0-9.]+[ms]+/g);
			if(duration) {
				var d = duration[0];
				e.duration = d.match("ms") ? parseFloat(d) : (parseFloat(d) * 1000);
			}
			else {
				e.duration = false;
			}
			e.offsetHeight;
		}
		catch(exception) {
			u.bug("Exception ("+exception+") in u.a.transition, called from: "+arguments.callee.caller);
		}
	}
	this._transitioned = function(event) {
		if(event.target == this && typeof(this.transitioned) == "function") {
			this.transitioned(event);
		}
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
Util.clickElement = u.ce = function(node) {
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
Util.addClass = u.ac = function(node, classname, no_dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$)");
			if(!regexp.test(node.className)) {
				node.className += node.className ? " " + classname : classname;
				no_dom_update ? false : node.offsetTop;
			}
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.addClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.removeClass = u.rc = function(node, classname, no_dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(\\b)" + classname + "(\\s|$)", "g");
			node.className = node.className.replace(regexp, " ").trim().replace(/[\s]{2}/g, " ");
			no_dom_update ? false : node.offsetTop;
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.removeClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.toggleClass = u.tc = function(node, classname, _classname, no_dom_update) {
	try {
		var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
		if(regexp.test(node.className)) {
			u.rc(node, classname, no_dom_update);
			if(_classname) {
				u.ac(node, _classname, no_dom_update);
			}
			return _classname;
		}
		else {
			u.ac(node, classname, no_dom_update);
			if(_classname) {
				u.rc(node, _classname, no_dom_update);
			}
			return classname;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.toggleClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.applyStyle = u.as = function(e, style, value) {
	try {
		e.style[style] = value;
		e.offsetHeight;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.applyStyle("+u.nodeId(e)+", "+style+", "+value+") called from: "+arguments.callee.caller);
	}
}
Util.getComputedStyle = u.gcs = function(e, attribute) {
	e.offsetHeight;
	if(document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(e, null).getPropertyValue(attribute);
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
		this.input_timestamp = new Date().getTime();
		this.start_event_x = u.eventX(event);
		this.start_event_y = u.eventY(event);
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
	var node_start_x = Number(node.element_x);
	var node_start_y = Number(node.element_y);
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
	node.drag_projection = false;
	node.drag_elastica = 0;
	node.drag_dropout = true;
	node.show_bounds = false;
	if(typeof(settings) == "object") {
		for(argument in settings) {
			switch(argument) {
				case "strict"		: node.drag_strict		= settings[argument]; break;
				case "projection"	: node.drag_projection	= settings[argument]; break;
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
	node.locked = ((node.end_drag_x - node.start_drag_x == node.offsetWidth) && (node.end_drag_y - node.start_drag_y == node.offsetHeight));
	node.only_vertical = (!node.locked && node.end_drag_x - node.start_drag_x == node.offsetWidth);
	node.only_horisontal = (!node.locked && node.end_drag_y - node.start_drag_y == node.offsetHeight);
	u.e.addStartEvent(node, this._inputStart);
}
u.e._pick = function(event) {
	u.e.resetNestedEvents(this);
	var init_speed_x = Math.abs(this.start_event_x - u.eventX(event));
	var init_speed_y = Math.abs(this.start_event_y - u.eventY(event));
	if(init_speed_x > init_speed_y && this.only_horisontal || 
	   init_speed_x < init_speed_y && this.only_vertical ||
	   !this.only_vertical && !this.only_horisontal) {
	    u.e.kill(event);
		this.move_timestamp = event.timeStamp;
		this.move_last_x = this.element_x;
		this.move_last_y = this.element_y;
		this.start_input_x = u.eventX(event) - this.element_x; 
		this.start_input_y = u.eventY(event) - this.element_y;
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
	this.current_x = u.eventX(event) - this.start_input_x;
	this.current_y = u.eventY(event) - this.start_input_y;
	this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.move_timestamp = event.timeStamp;
	this.move_last_x = this.current_x;
	this.move_last_y = this.current_y;
	if(this.only_vertical) {
		this.element_y = this.current_y;
	}
	else if(this.only_horisontal) {
		this.element_x = this.current_x;
	}
	else if(!this.locked) {
		this.element_x = this.current_x;
		this.element_y = this.current_y;
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
			u.a.translate(this, this.element_x, this.element_y);
		}
		else if(this.drag_elastica) {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			var offset = false;
			if(!this.only_vertical && this.element_x < this.start_drag_x) {
				offset = this.element_x < this.start_drag_x - this.drag_elastica ? - this.drag_elastica : this.element_x - this.start_drag_x;
				this.element_x = this.start_drag_x;
				this.current_x = this.element_x + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.only_vertical && this.element_x + this.offsetWidth > this.end_drag_x) {
				offset = this.element_x + this.offsetWidth > this.end_drag_x + this.drag_elastica ? this.drag_elastica : this.element_x + this.offsetWidth - this.end_drag_x;
				this.element_x = this.end_drag_x - this.offsetWidth;
				this.current_x = this.element_x + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_x = this.element_x;
			}
			if(!this.only_horisontal && this.element_y < this.start_drag_y) {
				offset = this.element_y < this.start_drag_y - this.drag_elastica ? - this.drag_elastica : this.element_y - this.start_drag_y;
				this.element_y = this.start_drag_y;
				this.current_y = this.element_y + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.horisontal && this.element_y + this.offsetHeight > this.end_drag_y) {
				offset = (this.element_y + this.offsetHeight > this.end_drag_y + this.drag_elastica) ? this.drag_elastica : (this.element_y + this.offsetHeight - this.end_drag_y);
				this.element_y = this.end_drag_y - this.offsetHeight;
				this.current_y = this.element_y + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_y = this.element_y;
			}
			if(offset) {
				u.a.translate(this, this.current_x, this.current_y);
			}
		}
		else {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			if(this.element_x < this.start_drag_x) {
				this.element_x = this.start_drag_x;
			}
			else if(this.element_x + this.offsetWidth > this.end_drag_x) {
				this.element_x = this.end_drag_x - this.offsetWidth;
			}
			if(this.element_y < this.start_drag_y) {
				this.element_y = this.start_drag_y;
			}
			else if(this.element_y + this.offsetHeight > this.end_drag_y) { 
				this.element_y = this.end_drag_y - this.offsetHeight;
			}
			u.a.translate(this, this.element_x, this.element_y);
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
		this.current_x = this.element_x + (this.current_xps/2);
		this.current_y = this.element_y + (this.current_yps/2);
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
	u.e.addStartEvent(e, this._inputStart);
}
u.e._scrollStart = function(event) {
	u.e.resetNestedEvents(this);
	this.move_timestamp = new Date().getTime();
	this.current_xps = 0;
	this.current_yps = 0;
	this.start_input_x = u.eventX(event) - this.element_x;
	this.start_input_y = u.eventY(event) - this.element_y;
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
	this.current_xps = Math.round(((this.current_x - this.element_x) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this.element_y) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
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
Util.flash = function(e, url, id, w, h, background) {
	w = w ? w : e.offsetWidth;
	h = h ? h : e.offsetHeight;
	background = background ? background : "transparent";
	id = id ? id : "flash_" + new Date().getHours() + "_" + new Date().getMinutes() + "_" + new Date().getMilliseconds();
	html = '<object';
	html += ' id="'+id+'"';
	html += ' width="'+w+'"';
	html += ' height="'+h+'"';
	if(u.explorer()) {
		html += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
	}
	else {
		html += ' type="application/x-shockwave-flash"';
		html += ' data="'+url+'"';
	}
	html += '>';
	html += '<param name="allowScriptAccess" value="always" />';
	html += '<param name="movie" value="'+url+'" />';
	html += '<param name="quality" value="high" />';
	html += '<param name="bgcolor" value="'+background+'" />';
	html += '<param name="play" value="true" />';
	html += '<param name="wmode" value="transparent" />';
	html += '<param name="menu" value="false" />';
	html += '<param name="scale" value="showall" />';
	html += '</object>';
	var temp_node = document.createElement("div");
	temp_node.innerHTML += html;
	e.insertBefore(temp_node.firstChild, e.firstChild);
	var obj = u.qs("#"+id, e);
	return obj;
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
	var matches, i;
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
	this.actions = new Array();
	this.objects = new Array();
	this.timers = new Array();
	this.setTimer = function(object, action, timeout) {
		var id = this.actions.length;
		this.actions[id] = action;
		this.objects[id] = object;
		this.timers[id] = setTimeout("u.t.executeTimer("+id+")", timeout);
		return id;
	}
	this.resetTimer = function(id) {
		clearTimeout(this.timers[id]);
		this.objects[id] = false;
	}
	this.executeTimer = function(id) {
		this.objects[id].exe = this.actions[id];
		this.objects[id].exe();
		this.objects[id].exe = null;
		this.actions[id] = null;
		this.objects[id] = false;
		this.timers[id] = null;
	}
	this.setInterval = function(object, action, timeout) {
		var id = this.actions.length;
		this.actions[id] = action;
		this.objects[id] = object;
		this.timers[id] = setInterval("u.t.executeInterval("+id+")", timeout);
		return id;
	}
	this.resetInterval = function(id) {
		clearInterval(this.timers[id]);
		this.objects[id] = false;
	}
	this.executeInterval = function(id) {
		this.objects[id].exe = this.actions[id];
		this.objects[id].exe();
	}
	this.valid = function(id) {
		return this.objects[id] ? true : false;
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

Util.Objects["hwundpcsel980x400"] = new function() {
	this.init = function(banner) {
		banner._initialized = true;
		banner._version = "tablet,full";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;
		banner.selected_comp = false;
		banner._initcontent = banner.innerHTML;
		banner._images = new Array();
		for(i = 0; i <= 205; i++) {
			banner._images.push("/funstuff/pcselector_980x400/img/sequence/PcSelector_980x400_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		banner._framerate = 1000/16; // 12 frames a second
		banner.updateHeading = function(comp) {
			u.a.transition(this.h2, "none");
			if(comp) {
				this.h2.new_text = comp._h2.innerHTML;
			}
			else {
				this.h2.new_text = this.h2.org_text;
			}
			this.h2.transitioned = function() {
				this.transitioned = null;
				u.a.transition(this, "none");
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
		banner.changeState = function(turn) {
			this.selected_comp._new_state = turn;
			this.selected_comp.specsHidden = function() {
				this.specsHidden = null;
				if(u.hc(this, "turn[1-9]")) {
					var old_state = this.className.match(/turn(\d)/)[1];
					this.banner.compTurned = function() {
						this.compTurned = null;
						u.rc(this.selected_comp, "turn[0-9]");
						if(this.selected_comp._new_state) {
							this.compTurned = function() {
								this.compTurned = null;
								this.selected_comp.showSpecs();
							}
							u.ac(this.selected_comp, "turn" + this.selected_comp._new_state);
							this["c" + this.selected_comp._id + "turn"  + this.selected_comp._new_state + "in"]();
						}
						else {
							this.selected_comp.showSpecs();
						}
					}
					this.banner["c" + this.banner.selected_comp._id + "turn"  + old_state + "out"]();
				}
				else {
					this.banner.compTurned = function() {
						this.compTurned = null;
						this.selected_comp.showSpecs();
					}
					u.ac(this.banner.selected_comp, "turn" + this.banner.selected_comp._new_state);
					this.banner["c" + this.banner.selected_comp._id + "turn"  + this.banner.selected_comp._new_state + "in"]();
				}
			}
			this.selected_comp.hideSpecs();
		}
		banner.selectComp = function(index) {
			if(index < 1) {
				index = 3;
			}
			else if(index > 3) {
				index = 1;
			}
			if(!this.selected_comp) {
				this.selected_index = index;
				this.selected_comp = this["comp"+index];
				this.updateHeading(this.selected_comp);
				this.selected_comp.showSpecs();
			}
			else {
				this.org_comp = this.selected_comp;
				this.org_comp.hideSpecs();
				this.selected_index = index;
				this.selected_comp = this["comp"+index];
				this.compTurned = function() {
					this.compTurned = null;
					u.rc(this.org_comp, "turn[0-9]");
					this.compChanged = function() {
						this.compChanged = null;
						this.selected_comp.showSpecs();
					}
					this["c"+this.org_comp._id+"exit_c"+this.selected_comp._id+"enter"]();
					this.updateHeading(this.selected_comp);
				}
				if(u.hc(this.org_comp, "turn[1-9]")) {
					var turn = this.org_comp.className.match(/turn(\d)/)[1];
					this["c"+this.org_comp._id+"turn"+turn+"out"]();
				}
				else {
					this.compTurned();
				}
			}
		}
		banner.activateSpec = function(spec) {
			spec._id = spec.className.match(/\d/);
			spec.banner = this;
			spec.spot = u.qs(".spot", spec);
			spec.spot.spec = spec;
			spec.fadeUp = function() {
				u.a.transition(this.spot, "none");
				this.spot.transitioned = function() {
					this.spec.fadeDown();
				}
				if(u.gcs(this.spot, "opacity") != .8) {
					u.a.transition(this.spot, "all 1s ease-in-out");
					u.a.setOpacity(this.spot, .8);
				}
				else {
					this.spot.transitioned();
				}
			}
			spec.fadeDown = function() {
				u.a.transition(this.spot, "none");
				this.spot.transitioned = function() {
					this.spec.fadeUp();
				}
				if(u.gcs(this.spot, "opacity") != .3) {
					u.a.transition(this.spot, "all 1s ease-in-out");
					u.a.setOpacity(this.spot, .3);
				}
				else {
					this.spot.transitioned();
				}
			}
			spec.pause = function() {
				u.a.transition(this, "none");
				this.transitioned = null;
			}
			spec.pulse = function() {
				this.fadeUp();
			}
			u.e.click(spec);
			spec.clicked = function() {
				if(u.hc(this.comp, "turn" + this._id)) {
					this.banner.changeState(0);
				}
				else {
					this.banner.changeState(this._id);
				}
			}
		}
		banner.activateComp = function(comp) {
			u.as(comp, "display", "none");
			comp.banner = this;
			comp._id = comp.className.match(/\d/);
			comp._h2 = u.qs("h4", comp);
			comp.spec1 = u.qs(".hotspot1", comp);
			comp.spec1.comp = comp;
			comp.spec2 = u.qs(".hotspot2", comp);
			comp.spec2.comp = comp;
			this.activateSpec(comp.spec1);
			this.activateSpec(comp.spec2);
			comp.showSpecs = function() {
				u.a.transition(this, "none");
				u.as(this, "display", "block");
				this.spec1.pulse();
				this.spec2.pulse();
				u.a.transition(this, "all 0.3s ease-in");
				u.a.setOpacity(this, 1);
			}
			comp.hideSpecs = function() {
				this.spec1.pause();
				this.spec2.pause();
				this.transitioned = function() {
					this.transitioned = null;
					u.a.transition(this, "none");
					u.as(this, "display", "none");
					if(typeof(this.specsHidden) == "function") {
						this.specsHidden();
					}
				}
				if(u.gcs(this, "opacity") != 0) {
					u.a.transition(this, "all 0.2s ease-in");
					u.a.setOpacity(this, 0);
				}
				else {
					this.transitioned();
				}
			}
		}
		banner.cleared = function() {
			this.selected_comp = false;
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
			this.comp1 = u.qs(".comp.comp1", this);
			this.comp2 = u.qs(".comp.comp2", this);
			this.comp3 = u.qs(".comp.comp3", this);
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
			this.preload(0, 124, "sq1", 1500);
		}
		banner.sq1 = function() {
			u.a.transition(this.h2, "all 0.3s ease-in");
			u.a.translate(this.h2, -this.offsetWidth, 0);
			this.setup(0, 124, "sq2");
		}
		banner.sq2 = function() {
			this.activateComp(this.comp1);
			this.activateComp(this.comp2);
			this.activateComp(this.comp3);
			this.preload(125, 205, "sq3");
		}
		banner.sq3 = function() {
			this.selectComp(1);
			this.showPrev = u.ae(this, "div", {"class":"show_prev"});
			this.showPrev.banner = this;
			u.a.setOpacity(this.showPrev, 0);
			u.as(this.showPrev, "display", "block");
			u.a.transition(this.showPrev, "all 0.5s ease-in");
			u.a.setOpacity(this.showPrev, 1);
			this.showNext = u.ae(this, "div", {"class":"show_next"});
			this.showNext.banner = this;
			u.a.setOpacity(this.showNext, 0);
			u.as(this.showNext, "display", "block");
			u.a.transition(this.showNext, "all 0.5s ease-in");
			u.a.setOpacity(this.showNext, 1);
			u.e.click(this.showPrev);
			this.showPrev.clicked = function() {
				this.banner.selectComp(this.banner.selected_index-1);
			}
			u.e.click(this.showNext);
			this.showNext.clicked = function() {
				this.banner.selectComp(this.banner.selected_index+1);
			}
		}
		banner.c1exit_c2enter = function() {
			this.setup(143, 149, "compChanged");
		}
		banner.c2exit_c1enter = function() {
			this.setup(149, 143, "compChanged");
		}
		banner.c1exit_c3enter = function() {
			this.setup(205, 196, "compChanged");
		}
		banner.c3exit_c1enter = function() {
			this.setup(196, 205, "compChanged");
		}
		banner.c2exit_c3enter = function() {
			this.setup(168, 178, "compChanged");
		}
		banner.c3exit_c2enter = function() {
			this.setup(178, 168, "compChanged");
		}
		banner.c1turn1in = function() {
			this.setup(125, 132, "compTurned");
		}
		banner.c1turn1out = function() {
			this.setup(132, 125, "compTurned");
		}
		banner.c1turn2in = function() {
			this.setup(133, 142, "compTurned");
		}
		banner.c1turn2out = function() {
			this.setup(142, 133, "compTurned");
		}
		banner.c2turn1in = function() {
			this.setup(149, 158, "compTurned");
		}
		banner.c2turn1out = function() {
			this.setup(158, 149, "compTurned");
		}
		banner.c2turn2in = function() {
			this.setup(159, 167, "compTurned");
		}
		banner.c2turn2out = function() {
			this.setup(167, 159, "compTurned");
		}
		banner.c3turn1in = function() {
			this.setup(178, 186, "compTurned");
		}
		banner.c3turn1out = function() {
			this.setup(186, 178, "compTurned");
		}
		banner.c3turn2in = function() {
			this.setup(188, 195, "compTurned");
		}
		banner.c3turn2out = function() {
			this.setup(195, 188, "compTurned");
		}
		banner.ready(true);
	}
}
Util.Objects["hwundpcsel980x400_mobile"] = new function() {
	this.init = function(banner) {
		banner._initialized = true;
		banner._version = "mobile";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;
		banner._initcontent = banner.innerHTML;
		banner._images = new Array();
		for(i = 0; i <= 85; i++) {
			banner._images.push("/funstuff/pcselector_980x400/img/sequence_mobile/PcSelector_Mobile_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		banner._framerate = 1000/12; // 12 frames a second
		banner.activateComp = function(comp) {
			comp.banner = this;
			comp._id = comp.className.match(/\d/);
			comp._h3 = u.qs("h3", comp);
			u.as(comp._h3, "display", "block");
			comp.showSpec = function(spec) {
				u.a.transition(spec, "none");
				u.as(spec, "display", "block");
				u.a.transition(spec, "all 0.3s ease-in");
				u.a.setOpacity(spec, 1);
			}
			comp.hideSpec = function(spec) {
				spec.transitioned = function() {
					this.transitioned = null;
					u.a.transition(this, "none");
					u.as(this, "display", "none");
					if(typeof(this.specHidden) == "function") {
						this.specHidden();
					}
				}
				if(u.gcs(spec, "opacity") != 0) {
					u.a.transition(spec, "all 0.5s ease-in");
					u.a.setOpacity(spec, 0);
				}
				else {
					spec.transitioned();
				}
			}
			comp.spec1 = u.qs(".hotspot1", comp);
			comp.spec1.comp = comp;
			comp.spec1.banner = this;
			u.a.transition(comp.spec1, "none");
			u.a.setOpacity(comp.spec1, 0);
			comp.spec2 = u.qs(".hotspot2", comp);
			comp.spec2.comp = comp;
			comp.spec2.banner = this;
			u.a.transition(comp.spec2, "none");
			u.a.setOpacity(comp.spec2, 0);
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
			this.comp1 = u.qs(".comp.comp1", this);
			this.comp2 = u.qs(".comp.comp2", this);
			this.comp3 = u.qs(".comp.comp3", this);
			this.logo = u.qs(".logo", this);
			this.learnmore_irl = u.qs(".learnmore.irl", this);
			this.learnmore_irl.banner = this;
			u.link(this.learnmore_irl);
			this.learnmore_irl.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.learnmore_irl.clicked = function() {
				window.open(this.url, "_blank");
			}
			this.learnmore_web = u.qs(".learnmore.web", this);
			this.learnmore_web.banner = this;
			u.link(this.learnmore_web);
			this.learnmore_web.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.learnmore_web.clicked = function() {
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
			u.a.transition(this.hint1, "none");
			u.a.translate(this.hint1, this.offsetWidth, 0);
			u.as(this.hint1, "display", "block");
			u.a.transition(this.hint1, "all 0.5s ease-in");
			u.a.setOpacity(this.hint1, 1);
			u.a.transition(this.comp1, "none");
			u.a.translate(this.comp1, this.offsetWidth, 0);
			u.as(this.comp1, "display", "block");
			u.a.setOpacity(this.comp1, 1);
			u.a.transition(this.comp2, "none");
			u.a.translate(this.comp2, this.offsetWidth, 0);
			u.as(this.comp2, "display", "block");
			u.a.setOpacity(this.comp2, 1);
			u.a.transition(this.comp3, "none");
			u.a.translate(this.comp3, this.offsetWidth, 0);
			u.as(this.comp3, "display", "block");
			u.a.setOpacity(this.comp3, 1);
			u.a.transition(this.learnmore_irl, "none");
			u.as(this.learnmore_irl, "display", "none");
			u.a.translate(this.learnmore_irl, this.offsetWidth, 0);
			u.a.setOpacity(this.learnmore_irl, 1);
			u.a.transition(this.learnmore_web, "none");
			u.as(this.learnmore_web, "display", "none");
			u.a.translate(this.learnmore_web, this.offsetWidth, 0);
			u.a.setOpacity(this.learnmore_web, 1);
			this.preload(85, 80, "sq1", 1500);
		}
		banner.sq1 = function() {
			u.a.transition(this.h2, "all 0.4s ease-in");
			u.a.translate(this.h2, -(this.offsetWidth), 0);
			this.t_delay = u.t.setTimer(this, this.c1enter, 500);
			this.activateComp(this.comp1);
		}
		banner.c1enter = function() {
			u.a.transition(this.comp1, "all 0.3s ease-in");
			u.a.translate(this.comp1, 0, 0);
			this.setup(80, 85, "sq2");
		}
		banner.sq2 = function() {
			this.preload(0, 26, "sq3", 1000);
		}
		banner.sq3 = function() {
			this.c1turn1in();
		}
		banner.c1turn1in = function() {
			this.setup(0, 7, "c1turn1out");
		}
		banner.c1turn1out = function() {
			this.setup(7, 0, "c1turn2in");
		}
		banner.c1turn2in = function() {
			this.setup(8, 17, "c1turn2out");
		}
		banner.c1turn2out = function() {
			this.setup(17, 8, "c1exit");
		}
		banner.c1exit = function() {
			u.a.transition(this.comp1, "all 0.3s ease-in");
			u.a.translate(this.comp1, -(this.offsetWidth), 0);
			this.setup(18, 22, "c2enter");
			this.activateComp(this.comp2);
		}
		banner.c2enter = function() {
			u.a.transition(this.comp2, "all 0.3s ease-in");
			u.a.translate(this.comp2, 0, 0);
			this.setup(22, 26, "sq6");
		}
		banner.sq6 = function() {
			this.preload(26, 56, "sq7", 1000);
		}
		banner.sq7 = function() {
			this.c2turn1in();
		}
		banner.c2turn1in = function() {
			this.setup(26, 35, "c2turn1out");
		}
		banner.c2turn1out = function() {
			this.setup(35, 26, "c2turn2in");
		}
		banner.c2turn2in = function() {
			this.setup(36, 44, "c2turn2out");
		}
		banner.c2turn2out = function() {
			this.setup(44, 36, "c2exit");
		}
		banner.c2exit = function() {
			u.a.transition(this.comp2, "all 0.3s ease-in");
			u.a.translate(this.comp2, -(this.offsetWidth), 0);
			this.setup(45, 50, "c3enter");
			this.activateComp(this.comp3);
		}
		banner.c3enter = function() {
			u.a.transition(this.comp3, "all 0.3s ease-in");
			u.a.translate(this.comp3, 0, 0);
			this.setup(50, 56, "sq10");
		}
		banner.sq10 = function() {
			this.preload(56, 80, "sq11", 1000);
		}
		banner.sq11 = function() {
			this.c3turn1in();
		}
		banner.c3turn1in = function() {
			this.setup(56, 64, "c3turn1out");
		}
		banner.c3turn1inWait = function() {
			this.t_delay = u.t.setTimer(this, this.c3turn1out, 400);
		}
		banner.c3turn1out = function() {
			this.setup(64, 56, "c3turn2in");
		}
		banner.c3turn2in = function() {
			this.setup(66, 73, "c3turn2out");
		}
		banner.c3turn2out = function() {
			this.setup(73, 66, "c3exit");
		}
		banner.c3exit = function() {
			u.a.transition(this.comp3, "all 0.3s ease-in");
			u.a.translate(this.comp3, -(this.offsetWidth), 0);
			this.setup(74, 80, "sq14");
		}
		banner.sq14 = function() {
			u.a.transition(this.hint1, "all 0.3s ease-in");
			u.a.translate(this.hint1, 0, 0);
			this.t_delay = u.t.setTimer(this, this.sq15, 1600);
		}
		banner.sq15 = function() {
			u.a.transition(this.hint1, "all 0.3s ease-in");
			u.a.translate(this.hint1, -(this.offsetWidth), 0);
			u.a.transition(this.logo, "all 0.4s ease-in");
			u.a.translate(this.logo, -(this.offsetWidth), 0);
			this.t_delay = u.t.setTimer(this, this.sq16, 500);
		}
		banner.sq16 = function() {
			u.a.transition(this.logo, "none");
			u.a.translate(this.logo, this.offsetWidth, 0);
			u.ac(this.logo, "exit");
			u.as(this.logo, "display", "block");
			u.a.transition(this.logo, "all 0.4s ease-in");
			u.as(this.learnmore_irl, "display", "block");
			u.a.transition(this.learnmore_irl, "all 0.4s ease-in");
			u.as(this.learnmore_web, "display", "block");
			u.a.transition(this.learnmore_web, "all 0.4s ease-in");
			u.a.translate(this.logo, 0, 0);
			u.a.translate(this.learnmore_irl, 0, 0);
			u.a.translate(this.learnmore_web, 0, 0);
		}
		banner.ready(true);
	}
}
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