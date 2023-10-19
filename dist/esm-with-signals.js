// src/signals-common.js
var w = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, n, o) {
		return n;
	}
};
function j(t, e = !0) {
	return e ? Object.assign(w, t) : (Object.setPrototypeOf(t, w), t);
}
function A(t) {
	return w.isPrototypeOf(t) && t !== w ? t : w;
}

// src/helpers.js
function E(t) {
	return typeof t > "u";
}
function k(t) {
	let e = typeof t;
	return e !== "object" ? e : t === null ? "null" : Object.prototype.toString.call(t);
}
function O(t, e) {
	if (!t || !(t instanceof AbortSignal))
		return !0;
	if (!t.aborted)
		return t.addEventListener("abort", e), function() {
			t.removeEventListener("abort", e);
		};
}

// src/dom-common.js
var F = { setDeleteAttr: Q };
function Q(t, e, n) {
	if (Reflect.set(t, e, n), !!E(n)) {
		if (Reflect.deleteProperty(t, e), t instanceof HTMLElement && t.getAttribute(e) === "undefined")
			return t.removeAttribute(e);
		if (Reflect.get(t, e) === "undefined")
			return Reflect.set(t, e, "");
	}
}

// src/dom.js
var y = [{
	scope: document.body,
	namespace: "html",
	host: (t) => t ? t(document.body) : document.body,
	prevent: !0
}], z = (t) => t === "svg" ? "http://www.w3.org/2000/svg" : t, h = {
	get current() {
		return y[y.length - 1];
	},
	get host() {
		return this.current.host;
	},
	get namespace() {
		return this.current.namespace;
	},
	set namespace(t) {
		return this.current.namespace = z(t);
	},
	preventDefault() {
		let { current: t } = this;
		return t.prevent = !0, t;
	},
	elNamespace(t) {
		let e = this.namespace;
		return this.namespace = t, {
			append(...n) {
				return h.namespace = e, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
			}
		};
	},
	get state() {
		return [...y];
	},
	push(t = {}) {
		return t.namespace && (t.namespace = z(t.namespace)), y.push(Object.assign({}, this.current, { prevent: !1 }, t));
	},
	pop() {
		return y.pop();
	}
};
function pt(t, e, ...n) {
	let o = A(this), { namespace: r } = h, c = 0, s;
	switch ((Object(e) !== e || o.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			c = 1, h.push({ scope: t, host: (a) => a ? (c === 1 ? n.unshift(a) : a(s), void 0) : s }), s = t(e || void 0), (s instanceof HTMLElement ? I : J)(s, "Attribute", "dde-fun", t.name);
			break;
		}
		case t === "#text":
			s = R.call(this, document.createTextNode(""), e);
			break;
		case t === "<>":
			s = R.call(this, document.createDocumentFragment(), e);
			break;
		case r !== "html":
			s = R.call(this, document.createElementNS(r, t), e);
			break;
		case !s:
			s = R.call(this, document.createElement(t), e);
	}
	return n.forEach((a) => a(s)), c && h.pop(), c = 2, s;
}
var { setDeleteAttr: H } = F, C = /* @__PURE__ */ new WeakMap();
function R(t, ...e) {
	if (!e.length)
		return t;
	C.set(t, q(t, this));
	for (let [n, o] of Object.entries(Object.assign({}, ...e)))
		$.call(this, t, n, o);
	return C.delete(t), t;
}
function $(t, e, n) {
	let { setRemoveAttr: o, s: r } = q(t, this), c = this;
	n = r.processReactiveAttribute(
		t,
		e,
		n,
		(a, p) => $.call(c, t, a, p)
	);
	let [s] = e;
	if (s === "=")
		return o(e.slice(1), n);
	if (s === ".")
		return U(t, e.slice(1), n);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(e, n);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return o(e, n, "http://www.w3.org/1999/xlink");
		case "textContent":
			return H(t, e, n);
		case "style":
			if (typeof n != "object")
				break;
		case "dataset":
			return T(r, n, U.bind(null, t[e]));
		case "ariaset":
			return T(r, n, (a, p) => o("aria-" + a, p));
		case "classList":
			return X.call(c, t, n);
	}
	return Y(t, e) ? H(t, e, n) : o(e, n);
}
function q(t, e) {
	if (C.has(t))
		return C.get(t);
	let o = (t instanceof SVGElement ? J : I).bind(null, t, "Attribute"), r = A(e);
	return { setRemoveAttr: o, s: r };
}
function X(t, e) {
	let n = A(this);
	return T(
		n,
		e,
		(o, r) => t.classList.toggle(o, r === -1 ? void 0 : !!r)
	), t;
}
function ht(t) {
	return Array.from(t.children).forEach((e) => e.remove()), t;
}
function Y(t, e) {
	if (!Reflect.has(t, e))
		return !1;
	let n = B(t, e);
	return !E(n.set);
}
function B(t, e) {
	if (t = Object.getPrototypeOf(t), !t)
		return {};
	let n = Object.getOwnPropertyDescriptor(t, e);
	return n || B(t, e);
}
function T(t, e, n) {
	if (!(typeof e != "object" || e === null))
		return Object.entries(e).forEach(function([r, c]) {
			r && (c = t.processReactiveAttribute(e, r, c, n), n(r, c));
		});
}
function G(t) {
	return Array.isArray(t) ? t.filter(Boolean).join(" ") : t;
}
function I(t, e, n, o) {
	return t[(E(o) ? "remove" : "set") + e](n, G(o));
}
function J(t, e, n, o, r = null) {
	return t[(E(o) ? "remove" : "set") + e + "NS"](r, n, G(o));
}
function U(t, e, n) {
	if (Reflect.set(t, e, n), !!E(n))
		return Reflect.deleteProperty(t, e);
}

// src/events.js
function bt(t, e, ...n) {
	let o = n.length ? new CustomEvent(e, { detail: n[0] }) : new Event(e);
	return t.dispatchEvent(o);
}
function v(t, e, n) {
	return function(r) {
		return r.addEventListener(t, e, n), r;
	};
}
var L = et(), tt = /* @__PURE__ */ new WeakSet();
v.connected = function(t, e) {
	let n = "connected";
	return typeof e != "object" && (e = {}), e.once = !0, function(r) {
		let c = "dde:" + n;
		return r.addEventListener(c, t, e), r.__dde_lifecycleToEvents ? r : r.isConnected ? (r.dispatchEvent(new Event(c)), r) : (O(e.signal, () => L.offConnected(r, t)) && L.onConnected(r, t), r);
	};
};
v.disconnected = function(t, e) {
	let n = "disconnected";
	return typeof e != "object" && (e = {}), e.once = !0, function(r) {
		let c = "dde:" + n;
		return r.addEventListener(c, t, e), r.__dde_lifecycleToEvents || O(e.signal, () => L.offDisconnected(r, t)) && L.onDisconnected(r, t), r;
	};
};
v.attributeChanged = function(t, e) {
	let n = "attributeChanged";
	return typeof e != "object" && (e = {}), function(r) {
		let c = "dde:" + n;
		if (r.addEventListener(c, t, e), r.__dde_lifecycleToEvents || tt.has(r))
			return r;
		let s = new MutationObserver(function(p) {
			for (let { attributeName: b, target: _ } of p)
				_.dispatchEvent(
					new CustomEvent(c, { detail: [b, _.getAttribute(b)] })
				);
		});
		return O(e.signal, () => s.disconnect()) && s.observe(r, { attributes: !0 }), r;
	};
};
function et() {
	let t = /* @__PURE__ */ new Map(), e = !1, n = new MutationObserver(function(i) {
		for (let u of i)
			if (u.type === "childList") {
				if (b(u.addedNodes, !0)) {
					s();
					continue;
				}
				_(u.removedNodes, !0) && s();
			}
	});
	return {
		onConnected(i, u) {
			c();
			let f = r(i);
			f.connected.has(u) || (f.connected.add(u), f.length_c += 1);
		},
		offConnected(i, u) {
			if (!t.has(i))
				return;
			let f = t.get(i);
			f.connected.has(u) && (f.connected.delete(u), f.length_c -= 1, o(i, f));
		},
		onDisconnected(i, u) {
			c();
			let f = r(i);
			f.disconnected.has(u) || (f.disconnected.add(u), f.length_d += 1);
		},
		offDisconnected(i, u) {
			if (!t.has(i))
				return;
			let f = t.get(i);
			f.disconnected.has(u) && (f.disconnected.delete(u), f.length_d -= 1, o(i, f));
		}
	};
	function o(i, u) {
		u.length_c || u.length_d || (t.delete(i), s());
	}
	function r(i) {
		if (t.has(i))
			return t.get(i);
		let u = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return t.set(i, u), u;
	}
	function c() {
		e || (e = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function s() {
		!e || t.size || (e = !1, n.disconnect());
	}
	function a() {
		return new Promise(function(i) {
			(requestIdleCallback || requestAnimationFrame)(i);
		});
	}
	async function p(i) {
		t.size > 30 && await a();
		let u = [];
		if (!(i instanceof Node))
			return u;
		for (let f of t.keys())
			f === i || !(f instanceof Node) || i.contains(f) && u.push(f);
		return u;
	}
	function b(i, u) {
		let f = !1;
		for (let m of i) {
			if (u && p(m).then(b), !t.has(m))
				continue;
			let x = t.get(m);
			x.length_c && (m.dispatchEvent(new Event("dde:connected")), x.connected = /* @__PURE__ */ new WeakSet(), x.length_c = 0, x.length_d || t.delete(m), f = !0);
		}
		return f;
	}
	function _(i, u) {
		let f = !1;
		for (let m of i)
			u && p(m).then(_), !(!t.has(m) || !t.get(m).length_d) && (m.dispatchEvent(new Event("dde:disconnected")), t.delete(m), f = !0);
		return f;
	}
}

// index.js
[HTMLElement, SVGElement, DocumentFragment].forEach((t) => {
	let { append: e } = t.prototype;
	t.prototype.append = function(...n) {
		return e.apply(this, n), this;
	};
});

// src/signals-lib.js
var d = Symbol.for("Signal");
function N(t) {
	try {
		return Reflect.has(t, d);
	} catch {
		return !1;
	}
}
var P = [], l = /* @__PURE__ */ new WeakMap();
function g(t, e) {
	if (typeof t != "function")
		return V(t, e);
	if (N(t))
		return t;
	let n = V(), o = function() {
		let [r, ...c] = l.get(o);
		if (l.set(o, /* @__PURE__ */ new Set([r])), P.push(o), n(t()), P.pop(), !c.length)
			return;
		let s = l.get(o);
		for (let a of c)
			s.has(a) || S(a, o);
	};
	return l.set(n[d], o), l.set(o, /* @__PURE__ */ new Set([n])), o(), n;
}
g.action = function(t, e, ...n) {
	let o = t[d], { actions: r } = o;
	if (!r || !Reflect.has(r, e))
		throw new Error(`'${t}' has no action with name '${e}'!`);
	if (r[e].apply(o, n), o.skip)
		return Reflect.deleteProperty(o, "skip");
	o.listeners.forEach((c) => c(o.value));
};
g.on = function t(e, n, o = {}) {
	let { signal: r } = o;
	if (!(r && r.aborted)) {
		if (Array.isArray(e))
			return e.forEach((c) => t(c, n, o));
		W(e, n), r && r.addEventListener("abort", () => S(e, n));
	}
};
g.symbols = {
	signal: d,
	onclear: Symbol.for("Signal.onclear")
};
g.attribute = function(t, e = void 0) {
	let { host: n } = h, o = n() && n().hasAttribute(t) ? n().getAttribute(t) : e, r = new AbortController(), c = g(o, {
		[g.symbols.onclear]() {
			r.abort();
		}
	});
	return h.host(v.attributeChanged(function({ detail: a }) {
		let [p, b] = a;
		p === t && c(b);
	}, { signal: r.signal })), c;
};
g.clear = function(...t) {
	for (let n of t) {
		Reflect.deleteProperty(n, "toJSON");
		let o = n[d];
		o.onclear.forEach((r) => r.call(o)), e(n, o), Reflect.deleteProperty(n, d);
	}
	function e(n, o) {
		o.listeners.forEach((r) => {
			if (o.listeners.delete(r), !l.has(r))
				return;
			let c = l.get(r);
			c.delete(n), !(c.size > 1) && (g.clear(...c), l.delete(r));
		});
	}
};
var D = "__dde_reactive";
g.el = function(t, e) {
	let n = document.createComment("<dde:reactive>"), o = document.createComment("</dde:reactive>"), r = document.createDocumentFragment();
	r.append(n, o);
	let { current: c } = h, s = (a) => {
		if (!n.parentNode || !o.parentNode)
			return S(t, s);
		h.push(c);
		let p = e(a);
		h.pop(), Array.isArray(p) || (p = [p]);
		let b = n;
		for (; (b = n.nextSibling) !== o; )
			b.remove();
		n.after(...p);
	};
	return W(t, s), K(t, s, n, e), s(t()), r;
};
var Z = {
	isSignal: N,
	processReactiveAttribute(t, e, n, o) {
		if (!N(n))
			return n;
		let r = (c) => o(e, c);
		return W(n, r), K(n, r, t, e), n();
	}
};
function K(t, e, ...n) {
	let { current: o } = h;
	o.prevent || o.host(function(r) {
		r[D] || (r[D] = [], v.disconnected(
			() => (
				/*!
				* Clears all signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				* You can investigate the `__dde_reactive` key of the element.
				* */
				r[D].forEach(([[c, s]]) => S(c, s, c[d]?.host() === r))
			)
		)(r)), r[D].push([[t, e], ...n]);
	});
}
function V(t, e) {
	let n = (...o) => o.length ? st(n, ...o) : ct(n);
	return rt(n, t, e);
}
var nt = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
}), M = class extends Error {
	constructor() {
		super();
		let [e, ...n] = this.stack.split(`
`), o = e.slice(e.indexOf("@"), e.indexOf(".js:") + 4);
		this.stack = n.find((r) => !r.includes(o));
	}
};
function rt(t, e, n) {
	let o = [];
	k(n) !== "[object Object]" && (n = {});
	let { onclear: r } = g.symbols;
	n[r] && (o.push(n[r]), Reflect.deleteProperty(n, r));
	let { host: c } = h;
	return t[d] = {
		value: e,
		actions: n,
		onclear: o,
		host: c,
		listeners: /* @__PURE__ */ new Set(),
		defined: new M()
	}, t.toJSON = () => t(), Object.setPrototypeOf(t[d], nt), t;
}
function ot() {
	return P[P.length - 1];
}
function ct(t) {
	if (!t[d])
		return;
	let { value: e, listeners: n } = t[d], o = ot();
	return o && n.add(o), l.has(o) && l.get(o).add(t), e;
}
function st(t, e, n) {
	if (!t[d])
		return;
	let o = t[d];
	if (!(!n && o.value === e))
		return o.value = e, o.listeners.forEach((r) => r(e)), e;
}
function W(t, e) {
	if (t[d])
		return t[d].listeners.add(e);
}
function S(t, e, n) {
	let o = t[d];
	if (!o)
		return;
	let r = o.listeners.delete(e);
	if (n && !o.listeners.size) {
		if (g.clear(t), !l.has(o))
			return r;
		let c = l.get(o);
		if (!l.has(c))
			return r;
		l.get(c).forEach((s) => S(s, c, !0));
	}
	return r;
}

// signals.js
j(Z);
export {
	g as S,
	R as assign,
	$ as assignAttribute,
	X as classListDeclarative,
	pt as createElement,
	bt as dispatchEvent,
	pt as el,
	ht as empty,
	N as isSignal,
	v as on,
	j as registerReactivity,
	h as scope
};
