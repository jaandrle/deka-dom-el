// src/helpers.js
function y(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}

// src/signals-common.js
var p = {
	isReactiveAtrribute(e, t) {
		return !1;
	},
	isTextContent(e) {
		return y(e) !== "[object Object]";
	},
	processReactiveAttribute(e, t, n, r) {
		return !1;
	},
	reactiveElement(e, ...t) {
		return document.createDocumentFragment();
	}
};
function D(e, t = !0) {
	return t ? Object.assign(p, e) : (Object.setPrototypeOf(e, p), e);
}
function O(e) {
	return p.isPrototypeOf(e) && e !== p ? e : p;
}

// src/dom.js
var m = "html";
function z(e) {
	return m = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(t) {
			return m = "html", t;
		}
	};
}
function I(e, t, ...n) {
	let r = O(this), i;
	if (e === "<>") {
		if (r.isReactiveAtrribute(t))
			return r.reactiveElement(t, ...n);
		i = document.createDocumentFragment();
	}
	switch (r.isTextContent(t) && (t = { textContent: t }), !0) {
		case typeof e == "function":
			i = e(t || void 0);
			break;
		case e === "#text":
			i = C(document.createTextNode(""), t);
			break;
		case m !== "html":
			i = C(document.createElementNS(m, e), t);
			break;
		case !i:
			i = C(document.createElement(e), t);
	}
	return n.forEach((d) => d(i)), i;
}
var w = /* @__PURE__ */ new Map();
function C(e, ...t) {
	let n = O(this);
	if (!t.length)
		return e;
	let r = e instanceof SVGElement, i = (r ? S : R).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function d([u, f]) {
		n.isReactiveAtrribute(f, u) && (f = n.processReactiveAttribute(el, u, f, d));
		let [l] = u;
		if (l === "=")
			return i(u.slice(1), f);
		if (l === ".")
			return j(e, u.slice(1), f);
		if (typeof f == "object")
			switch (u) {
				case "style":
					return b(f, R.bind(null, e.style, "Property"));
				case "dataset":
					return b(f, j.bind(null, e.dataset));
				case "ariaset":
					return b(f, (h, g) => i("aria-" + h, g));
				case "classList":
					return L(e, f);
				default:
					return Reflect.set(e, u, f);
			}
		if (/(aria|data)([A-Z])/.test(u))
			return u = u.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), i(u, f);
		switch (u) {
			case "xlink:href":
				return i(u, f, "http://www.w3.org/1999/xlink");
			case "textContent":
				if (!r)
					break;
				return e.appendChild(document.createTextNode(f));
		}
		return P(e, u) ? j(e, u, f) : i(u, f);
	}), e;
}
function L(e, t) {
	return typeof t != "object" || b(
		t,
		(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
	), e;
}
function Z(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function P(e, t) {
	let n = e.nodeName + "," + t;
	if (w.has(n))
		return w.get(n);
	let r = A(e, t), i = !x(r.set);
	return w.set(n, i), i;
}
function A(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || A(e, t);
}
function b(e, t) {
	return Object.entries(e).forEach(([n, r]) => t(n, r));
}
function x(e) {
	return typeof e > "u";
}
function R(e, t, n, r) {
	return e[(x(r) ? "remove" : "set") + t](n, r);
}
function S(e, t, n, r, i = null) {
	return e[(x(r) ? "remove" : "set") + t + "NS"](i, n, r);
}
function j(e, t, n) {
	return Reflect[x(n) ? "deleteProperty" : "set"](e, t, n);
}

// src/events.js
function N(e, t, n) {
	return (r) => (r.addEventListener(e, t, n), r);
}
var v = T();
N.connected = function(e, t) {
	return function(r) {
		v.onConnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => v.offConnected(r, e));
	};
};
N.disconnected = function(e, t) {
	return function(r) {
		v.onDisconnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => v.offDisconnected(r, e));
	};
};
function T() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(o) {
		for (let c of o)
			if (c.type === "childList") {
				if (h(c.addedNodes, !0)) {
					u();
					continue;
				}
				g(c.removedNodes, !0) && u();
			}
	});
	return {
		onConnected(o, c) {
			d(), i(o).connected.push(c);
		},
		offConnected(o, c) {
			if (!e.has(o))
				return;
			let s = e.get(o), a = s.connected;
			a.splice(a.indexOf(c), 1), r(o, s);
		},
		onDisconnected(o, c) {
			d(), i(o).disconnected.push(c);
		},
		offDisconnected(o, c) {
			if (!e.has(o))
				return;
			let s = e.get(o), a = s.disconnected;
			a.splice(a.indexOf(c), 1), r(o, s);
		}
	};
	function r(o, c) {
		c.connected.length || c.disconnect.length || (e.delete(o), u());
	}
	function i(o) {
		if (e.has(o))
			return e.get(o);
		let c = { connected: [], disconnected: [] };
		return e.set(o, c), c;
	}
	function d() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function u() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function f() {
		return new Promise(function(o) {
			(requestIdleCallback || requestAnimationFrame)(o);
		});
	}
	async function l(o) {
		e.size > 30 && await f();
		let c = [];
		if (!(o instanceof Node))
			return c;
		for (let s of e.keys())
			s === o || !(s instanceof Node) || o.contains(s) && c.push(s);
		return c;
	}
	function h(o, c) {
		for (let s of o) {
			if (c && l(s).then(h), !e.has(s))
				return !1;
			let a = e.get(s);
			return a.connected.forEach((E) => E(s)), a.connected.length = 0, a.disconnected.length || e.delete(s), !0;
		}
	}
	function g(o, c) {
		for (let s of o) {
			if (c && l(s).then(g), !e.has(s))
				return !1;
			let a = e.get(s);
			return a.disconnected.forEach((E) => E(s)), a.connected.length = 0, a.disconnected.length = 0, e.delete(s), !0;
		}
	}
}

// index.js
[HTMLElement, DocumentFragment].forEach((e) => {
	let { append: t } = e.prototype;
	e.prototype.append = function(...n) {
		return t.apply(this, n), this;
	};
});
export {
	C as assign,
	L as classListDeclartive,
	I as createElement,
	I as el,
	Z as empty,
	z as namespace,
	N as on,
	D as registerReactivity
};
