// src/signals-common.js
var E = {
	isSignal(e) {
		return !1;
	},
	processReactiveAttribute(e, t, n, r) {
		return n;
	}
};
function C(e, t = !0) {
	return t ? Object.assign(E, e) : (Object.setPrototypeOf(e, E), e);
}
function S(e) {
	return E.isPrototypeOf(e) && e !== E ? e : E;
}

// src/helpers.js
function m(e) {
	return typeof e > "u";
}
function P(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}
function L(e, t) {
	if (!e || !(e instanceof AbortSignal))
		return !0;
	if (!e.aborted)
		return e.addEventListener("abort", t), function() {
			e.removeEventListener("abort", t);
		};
}

// src/dom-common.js
var j = { setDeleteAttr: H };
function H(e, t, n) {
	if (Reflect.set(e, t, n), !!m(n)) {
		if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
			return e.removeAttribute(t);
		if (Reflect.get(e, t) === "undefined")
			return Reflect.set(e, t, "");
	}
}

// src/dom.js
var w = [{ scope: document.body, namespace: "html", host: (e) => e ? e(document.body) : document.body }], W = (e) => e === "svg" ? "http://www.w3.org/2000/svg" : e, O = {
	get current() {
		return w[w.length - 1];
	},
	get state() {
		return [...w];
	},
	get host() {
		return this.current.host;
	},
	get namespace() {
		return this.current.namespace;
	},
	set namespace(e) {
		return this.current.namespace = W(e);
	},
	elNamespace(e) {
		let t = this.namespace;
		return this.namespace = e, {
			append(...n) {
				return O.namespace = t, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
			}
		};
	},
	push(e = {}) {
		return e.namespace && (e.namespace = W(e.namespace)), w.push(Object.assign({}, this.current, e));
	},
	pop() {
		return w.pop();
	}
};
function se(e, t, ...n) {
	let r = this, o = S(this), { namespace: u } = O, a;
	switch ((Object(t) !== t || o.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			O.push({ scope: e, host: (s) => s ? (n.unshift(s), void 0) : a }), a = e(t || void 0), O.pop();
			break;
		}
		case e === "#text":
			a = y.call(r, document.createTextNode(""), t);
			break;
		case e === "<>":
			a = y.call(r, document.createDocumentFragment(), t);
			break;
		case u !== "html":
			a = y.call(r, document.createElementNS(u, e), t);
			break;
		case !a:
			a = y.call(r, document.createElement(e), t);
	}
	return n.forEach((s) => s(a)), a;
}
var { setDeleteAttr: F } = j;
function y(e, ...t) {
	let n = this, r = S(this);
	if (!t.length)
		return e;
	let u = (e instanceof SVGElement ? J : I).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function a([s, d]) {
		d = r.processReactiveAttribute(e, s, d, a);
		let [b] = s;
		if (b === "=")
			return u(s.slice(1), d);
		if (b === ".")
			return M(e, s.slice(1), d);
		if (/(aria|data)([A-Z])/.test(s))
			return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), u(s, d);
		switch (s === "className" && (s = "class"), s) {
			case "xlink:href":
				return u(s, d, "http://www.w3.org/1999/xlink");
			case "textContent":
				return F(e, s, d);
			case "style":
				if (typeof d != "object")
					break;
			case "dataset":
				return N(r, d, M.bind(null, e[s]));
			case "ariaset":
				return N(r, d, (x, c) => u("aria-" + x, c));
			case "classList":
				return B.call(n, e, d);
		}
		return G(e, s) ? F(e, s, d) : u(s, d);
	}), e;
}
function B(e, t) {
	let n = S(this);
	return N(
		n,
		t,
		(r, o) => e.classList.toggle(r, o === -1 ? void 0 : !!o)
	), e;
}
function fe(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function G(e, t) {
	if (!Reflect.has(e, t))
		return !1;
	let n = z(e, t);
	return !m(n.set);
}
function z(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || z(e, t);
}
function N(e, t, n) {
	if (!(typeof t != "object" || t === null))
		return Object.entries(t).forEach(function([o, u]) {
			o && (u = e.processReactiveAttribute(t, o, u, (a) => n(...a)), n(o, u));
		});
}
function T(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function I(e, t, n, r) {
	return e[(m(r) ? "remove" : "set") + t](n, T(r));
}
function J(e, t, n, r, o = null) {
	return e[(m(r) ? "remove" : "set") + t + "NS"](o, n, T(r));
}
function M(e, t, n) {
	if (Reflect.set(e, t, n), !!m(n))
		return Reflect.deleteProperty(e, t);
}

// src/events.js
function de(e, t, ...n) {
	let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(r);
}
function U(e, t, n) {
	return function(o) {
		return o.addEventListener(e, t, n), o;
	};
}
var _ = V();
U.connected = function(e, t) {
	return typeof t != "object" && (t = {}), t.once = !0, function(r) {
		return r.addEventListener("dde:connected", e, t), typeof r.connectedCallback == "function" ? r : r.isConnected ? (r.dispatchEvent(new Event("dde:connected")), r) : (L(t.signal, () => _.offConnected(r, e)) && _.onConnected(r, e), r);
	};
};
U.disconnected = function(e, t) {
	return typeof t != "object" && (t = {}), t.once = !0, function(r) {
		return r.addEventListener("dde:disconnected", e, t), typeof r.disconnectedCallback == "function" || L(t.signal, () => _.offDisconnected(r, e)) && _.onDisconnected(r, e), r;
	};
};
function V() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
		for (let i of c)
			if (i.type === "childList") {
				if (b(i.addedNodes, !0)) {
					a();
					continue;
				}
				x(i.removedNodes, !0) && a();
			}
	});
	return {
		onConnected(c, i) {
			u();
			let f = o(c);
			f.connected.has(i) || (f.connected.add(i), f.length_c += 1);
		},
		offConnected(c, i) {
			if (!e.has(c))
				return;
			let f = e.get(c);
			f.connected.has(i) && (f.connected.delete(i), f.length_c -= 1, r(c, f));
		},
		onDisconnected(c, i) {
			u();
			let f = o(c);
			f.disconnected.has(i) || (f.disconnected.add(i), f.length_d += 1);
		},
		offDisconnected(c, i) {
			if (!e.has(c))
				return;
			let f = e.get(c);
			f.disconnected.has(i) && (f.disconnected.delete(i), f.length_d -= 1, r(c, f));
		}
	};
	function r(c, i) {
		i.length_c || i.length_d || (e.delete(c), a());
	}
	function o(c) {
		if (e.has(c))
			return e.get(c);
		let i = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return e.set(c, i), i;
	}
	function u() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function a() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function s() {
		return new Promise(function(c) {
			(requestIdleCallback || requestAnimationFrame)(c);
		});
	}
	async function d(c) {
		e.size > 30 && await s();
		let i = [];
		if (!(c instanceof Node))
			return i;
		for (let f of e.keys())
			f === c || !(f instanceof Node) || c.contains(f) && i.push(f);
		return i;
	}
	function b(c, i) {
		let f = !1;
		for (let l of c) {
			if (i && d(l).then(b), !e.has(l))
				continue;
			let v = e.get(l);
			v.length_c && (l.dispatchEvent(new Event("dde:connected")), v.connected = /* @__PURE__ */ new WeakSet(), v.length_c = 0, v.length_d || e.delete(l), f = !0);
		}
		return f;
	}
	function x(c, i) {
		let f = !1;
		for (let l of c)
			i && d(l).then(x), !(!e.has(l) || !e.get(l).length_d) && (l.dispatchEvent(new Event("dde:disconnected")), e.delete(l), f = !0);
		return f;
	}
}

// index.js
[HTMLElement, SVGElement, DocumentFragment].forEach((e) => {
	let { append: t } = e.prototype;
	e.prototype.append = function(...n) {
		return t.apply(this, n), this;
	};
});

// src/signals-lib.js
var p = Symbol.for("Signal");
function R(e) {
	try {
		return Reflect.has(e, p);
	} catch {
		return !1;
	}
}
var h = /* @__PURE__ */ new WeakMap();
function g(e, t) {
	if (typeof e != "function")
		return $(e, t);
	if (R(e))
		return e;
	let n = $(""), r = () => n(e());
	return h.set(r, /* @__PURE__ */ new Set([n])), Q(r), n;
}
g.action = function(e, t, ...n) {
	let r = e[p], { actions: o } = r;
	if (!o || !Reflect.has(o, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (o[t].apply(r, n), r.skip)
		return Reflect.deleteProperty(r, "skip");
	r.listeners.forEach((u) => u(r.value));
};
g.on = function e(t, n, r = {}) {
	let { signal: o } = r;
	if (!(o && o.aborted)) {
		if (Array.isArray(t))
			return t.forEach((u) => e(u, n, r));
		D(t, n), o && o.addEventListener("abort", () => q(t, n));
	}
};
g.symbols = {
	signal: p,
	onclear: Symbol.for("Signal.onclear")
};
g.clear = function(...e) {
	for (let n of e) {
		Reflect.deleteProperty(n, "toJSON");
		let r = n[p], { onclear: o } = g.symbols;
		r.actions && r.actions[o] && r.actions[o].call(r), t(n, r), Reflect.deleteProperty(n, p);
	}
	function t(n, r) {
		r.listeners.forEach((o) => {
			if (r.listeners.delete(o), !h.has(o))
				return;
			let u = h.get(o);
			u.delete(n), !(u.size > 1) && (g.clear(...u), h.delete(o));
		});
	}
};
g.el = function(e, t) {
	let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
	o.append(n, r);
	let u = (a) => {
		if (!n.parentNode || !r.parentNode)
			return q(e, u);
		let s = t(a);
		Array.isArray(s) || (s = [s]);
		let d = n;
		for (; (d = n.nextSibling) !== r; )
			d.remove();
		n.after(...s);
	};
	return D(e, u), u(e()), o;
};
var k = {
	isSignal: R,
	processReactiveAttribute(e, t, n, r) {
		return R(n) ? (D(n, (o) => r([t, o])), n()) : n;
	}
};
function $(e, t) {
	let n = (...r) => r.length ? ee(n, r[0]) : Y(n);
	return K(n, e, t);
}
var Z = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function K(e, t, n) {
	return P(n) !== "[object Object]" && (n = {}), e[p] = {
		value: t,
		actions: n,
		listeners: /* @__PURE__ */ new Set()
	}, e.toJSON = () => e(), Object.setPrototypeOf(e[p], Z), e;
}
var A = [];
function Q(e) {
	let t = function() {
		A.push(t), e(), A.pop();
	};
	h.has(e) && (h.set(t, h.get(e)), h.delete(e)), t();
}
function X() {
	return A[A.length - 1];
}
function Y(e) {
	if (!e[p])
		return;
	let { value: t, listeners: n } = e[p], r = X();
	return r && n.add(r), h.has(r) && h.get(r).add(e), t;
}
function ee(e, t) {
	if (!e[p])
		return;
	let n = e[p];
	if (n.value !== t)
		return n.value = t, n.listeners.forEach((r) => r(t)), t;
}
function D(e, t) {
	if (e[p])
		return e[p].listeners.add(t);
}
function q(e, t) {
	if (e[p])
		return e[p].listeners.delete(t);
}

// signals.js
C(k);
export {
	g as S,
	y as assign,
	B as classListDeclarative,
	se as createElement,
	de as dispatchEvent,
	se as el,
	fe as empty,
	R as isSignal,
	U as on,
	C as registerReactivity,
	O as scope
};
