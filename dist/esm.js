// src/helpers.js
function N(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}

// src/signals-common.js
var p = {
	isTextContent(e) {
		return N(e) !== "[object Object]";
	},
	processReactiveAttribute(e, t, r, n) {
		return r;
	}
};
function D(e, t = !0) {
	return t ? Object.assign(p, e) : (Object.setPrototypeOf(e, p), e);
}
function w(e) {
	return p.isPrototypeOf(e) && e !== p ? e : p;
}

// src/dom.js
var E = "html";
function z(e) {
	return E = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(t) {
			return E = "html", t;
		}
	};
}
function F(e, t, ...r) {
	let n = w(this), i;
	switch (n.isTextContent(t) && (t = { textContent: t }), !0) {
		case typeof e == "function":
			i = e(t || void 0);
			break;
		case e === "#text":
			i = x(document.createTextNode(""), t);
			break;
		case e === "<>":
			i = x(document.createDocumentFragment(), t);
			break;
		case E !== "html":
			i = x(document.createElementNS(E, e), t);
			break;
		case !i:
			i = x(document.createElement(e), t);
	}
	return r.forEach((d) => d(i)), i;
}
var h = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
function x(e, ...t) {
	let r = w(this);
	if (!t.length)
		return e;
	let n = e instanceof SVGElement, i = (n ? M : j).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function d([u, f]) {
		f = r.processReactiveAttribute(e, u, f, d);
		let [l] = u;
		if (l === "=")
			return i(u.slice(1), f);
		if (l === ".")
			return C(e, u.slice(1), f);
		if (typeof f == "object")
			switch (u) {
				case "style":
					return m(f, j.bind(null, e.style, "Property"));
				case "dataset":
					return m(f, C.bind(null, e.dataset));
				case "ariaset":
					return m(f, (g, b) => i("aria-" + g, b));
				case "classList":
					return R(e, f);
				default:
					return Reflect.set(e, u, f);
			}
		if (/(aria|data)([A-Z])/.test(u))
			return u = u.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), i(u, f);
		switch (u) {
			case "href":
				return i(u, f);
			case "xlink:href":
				return i(u, f, "http://www.w3.org/1999/xlink");
			case "textContent":
				if (!n)
					break;
				return e.appendChild(document.createTextNode(f));
		}
		return A(e, u) ? C(e, u, f) : i(u, f);
	}), e;
}
function R(e, t) {
	return typeof t != "object" || m(
		t,
		(r, n) => e.classList.toggle(r, n === -1 ? void 0 : !!n)
	), e;
}
function I(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function A(e, t) {
	let r = "HTMLElement," + t;
	if (e instanceof HTMLElement && h.has(r))
		return h.get(r);
	let n = e.nodeName + "," + t;
	if (h.has(n))
		return h.get(n);
	let [i, d, u] = y(e, t), f = !L(i.set);
	return (!f || d) && h.set(u === HTMLElement.prototype ? r : n, f), f;
}
function y(e, t, r = 0) {
	if (e = Object.getPrototypeOf(e), !e)
		return [{}, r, e];
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n ? [n, r, e] : y(e, t, r + 1);
}
function m(e, t) {
	return Object.entries(e).forEach(([r, n]) => t(r, n));
}
function L(e) {
	return typeof e > "u";
}
function j(e, t, r, n) {
	return e[(L(n) ? "remove" : "set") + t](r, n);
}
function M(e, t, r, n, i = null) {
	return e[(L(n) ? "remove" : "set") + t + "NS"](i, r, n);
}
function C(e, t, r) {
	return Reflect.set(e, t, r);
}

// src/events.js
function T(e, t, r) {
	return (n) => (n.addEventListener(e, t, r), n);
}
var O = _();
T.connected = function(e, t) {
	return function(n) {
		O.onConnected(n, e), t && t.signal && t.signal.addEventListener("abort", () => O.offConnected(n, e));
	};
};
T.disconnected = function(e, t) {
	return function(n) {
		O.onDisconnected(n, e), t && t.signal && t.signal.addEventListener("abort", () => O.offDisconnected(n, e));
	};
};
function _() {
	let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(o) {
		for (let c of o)
			if (c.type === "childList") {
				if (g(c.addedNodes, !0)) {
					u();
					continue;
				}
				b(c.removedNodes, !0) && u();
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
			a.splice(a.indexOf(c), 1), n(o, s);
		},
		onDisconnected(o, c) {
			d(), i(o).disconnected.push(c);
		},
		offDisconnected(o, c) {
			if (!e.has(o))
				return;
			let s = e.get(o), a = s.disconnected;
			a.splice(a.indexOf(c), 1), n(o, s);
		}
	};
	function n(o, c) {
		c.connected.length || c.disconnect.length || (e.delete(o), u());
	}
	function i(o) {
		if (e.has(o))
			return e.get(o);
		let c = { connected: [], disconnected: [] };
		return e.set(o, c), c;
	}
	function d() {
		t || (t = !0, r.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function u() {
		!t || e.size || (t = !1, r.disconnect());
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
	function g(o, c) {
		for (let s of o) {
			if (c && l(s).then(g), !e.has(s))
				return !1;
			let a = e.get(s);
			return a.connected.forEach((v) => v(s)), a.connected.length = 0, a.disconnected.length || e.delete(s), !0;
		}
	}
	function b(o, c) {
		for (let s of o) {
			if (c && l(s).then(b), !e.has(s))
				return !1;
			let a = e.get(s);
			return a.disconnected.forEach((v) => v(s)), a.connected.length = 0, a.disconnected.length = 0, e.delete(s), !0;
		}
	}
}

// index.js
[HTMLElement, DocumentFragment].forEach((e) => {
	let { append: t } = e.prototype;
	e.prototype.append = function(...r) {
		return t.apply(this, r), this;
	};
});
export {
	x as assign,
	R as classListDeclarative,
	F as createElement,
	F as el,
	I as empty,
	z as namespace,
	T as on,
	D as registerReactivity
};
