// src/signals-common.js
var x = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, n, o) {
		return n;
	}
};
function P(t, e = !0) {
	return e ? Object.assign(x, t) : (Object.setPrototypeOf(t, x), t);
}
function S(t) {
	return x.isPrototypeOf(t) && t !== x ? t : x;
}

// src/helpers.js
function E(t) {
	return typeof t > "u";
}
function M(t) {
	let e = typeof t;
	return e !== "object" ? e : t === null ? "null" : Object.prototype.toString.call(t);
}
function A(t, e) {
	if (!t || !(t instanceof AbortSignal))
		return !0;
	if (!t.aborted)
		return t.addEventListener("abort", e), function() {
			t.removeEventListener("abort", e);
		};
}

// src/dom-common.js
var W = { setDeleteAttr: Z };
function Z(t, e, n) {
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
}], F = (t) => t === "svg" ? "http://www.w3.org/2000/svg" : t, m = {
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
		return this.current.namespace = F(t);
	},
	preventDefault() {
		let { current: t } = this;
		return t.prevent = !0, t;
	},
	elNamespace(t) {
		let e = this.namespace;
		return this.namespace = t, {
			append(...n) {
				return m.namespace = e, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
			}
		};
	},
	get state() {
		return [...y];
	},
	push(t = {}) {
		return t.namespace && (t.namespace = F(t.namespace)), y.push(Object.assign({}, this.current, { prevent: !1 }, t));
	},
	pop() {
		return y.pop();
	}
};
function at(t, e, ...n) {
	let o = S(this), { namespace: r } = m, c = 0, s;
	switch ((Object(e) !== e || o.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			c = 1, m.push({ scope: t, host: (a) => a ? (c === 1 ? n.unshift(a) : a(s), void 0) : s }), s = t(e || void 0), (s instanceof HTMLElement ? B : G)(s, "Attribute", "dde-fun", t.name);
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
	return n.forEach((a) => a(s)), c && m.pop(), c = 2, s;
}
var { setDeleteAttr: z } = W, O = /* @__PURE__ */ new WeakMap();
function R(t, ...e) {
	if (!e.length)
		return t;
	O.set(t, U(t, this));
	for (let [n, o] of Object.entries(Object.assign({}, ...e)))
		H.call(this, t, n, o);
	return O.delete(t), t;
}
function H(t, e, n) {
	let { setRemoveAttr: o, s: r } = U(t, this), c = this;
	n = r.processReactiveAttribute(
		t,
		e,
		n,
		(a, p) => H.call(c, t, a, p)
	);
	let [s] = e;
	if (s === "=")
		return o(e.slice(1), n);
	if (s === ".")
		return k(t, e.slice(1), n);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(e, n);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return o(e, n, "http://www.w3.org/1999/xlink");
		case "textContent":
			return z(t, e, n);
		case "style":
			if (typeof n != "object")
				break;
		case "dataset":
			return j(r, n, k.bind(null, t[e]));
		case "ariaset":
			return j(r, n, (a, p) => o("aria-" + a, p));
		case "classList":
			return K.call(c, t, n);
	}
	return Q(t, e) ? z(t, e, n) : o(e, n);
}
function U(t, e) {
	if (O.has(t))
		return O.get(t);
	let o = (t instanceof SVGElement ? G : B).bind(null, t, "Attribute"), r = S(e);
	return { setRemoveAttr: o, s: r };
}
function K(t, e) {
	let n = S(this);
	return j(
		n,
		e,
		(o, r) => t.classList.toggle(o, r === -1 ? void 0 : !!r)
	), t;
}
function pt(t) {
	return Array.from(t.children).forEach((e) => e.remove()), t;
}
function Q(t, e) {
	if (!Reflect.has(t, e))
		return !1;
	let n = $(t, e);
	return !E(n.set);
}
function $(t, e) {
	if (t = Object.getPrototypeOf(t), !t)
		return {};
	let n = Object.getOwnPropertyDescriptor(t, e);
	return n || $(t, e);
}
function j(t, e, n) {
	if (!(typeof e != "object" || e === null))
		return Object.entries(e).forEach(function([r, c]) {
			r && (c = t.processReactiveAttribute(e, r, c, n), n(r, c));
		});
}
function q(t) {
	return Array.isArray(t) ? t.filter(Boolean).join(" ") : t;
}
function B(t, e, n, o) {
	return t[(E(o) ? "remove" : "set") + e](n, q(o));
}
function G(t, e, n, o, r = null) {
	return t[(E(o) ? "remove" : "set") + e + "NS"](r, n, q(o));
}
function k(t, e, n) {
	if (Reflect.set(t, e, n), !!E(n))
		return Reflect.deleteProperty(t, e);
}

// src/events.js
function gt(t, e, ...n) {
	let o = n.length ? new CustomEvent(e, { detail: n[0] }) : new Event(e);
	return t.dispatchEvent(o);
}
function v(t, e, n) {
	return function(r) {
		return r.addEventListener(t, e, n), r;
	};
}
var C = Y(), X = /* @__PURE__ */ new WeakSet();
v.connected = function(t, e) {
	let n = "connected";
	return typeof e != "object" && (e = {}), e.once = !0, function(r) {
		let c = "dde:" + n;
		return r.addEventListener(c, t, e), r.__dde_lifecycleToEvents ? r : r.isConnected ? (r.dispatchEvent(new Event(c)), r) : (A(e.signal, () => C.offConnected(r, t)) && C.onConnected(r, t), r);
	};
};
v.disconnected = function(t, e) {
	let n = "disconnected";
	return typeof e != "object" && (e = {}), e.once = !0, function(r) {
		let c = "dde:" + n;
		return r.addEventListener(c, t, e), r.__dde_lifecycleToEvents || A(e.signal, () => C.offDisconnected(r, t)) && C.onDisconnected(r, t), r;
	};
};
v.attributeChanged = function(t, e) {
	let n = "attributeChanged";
	return typeof e != "object" && (e = {}), function(r) {
		let c = "dde:" + n;
		if (r.addEventListener(c, t, e), r.__dde_lifecycleToEvents || X.has(r))
			return r;
		let s = new MutationObserver(function(p) {
			for (let { attributeName: b, target: _ } of p)
				_.dispatchEvent(
					new CustomEvent(c, { detail: [b, _.getAttribute(b)] })
				);
		});
		return A(e.signal, () => s.disconnect()) && s.observe(r, { attributes: !0 }), r;
	};
};
function Y() {
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
		for (let h of i) {
			if (u && p(h).then(b), !t.has(h))
				continue;
			let w = t.get(h);
			w.length_c && (h.dispatchEvent(new Event("dde:connected")), w.connected = /* @__PURE__ */ new WeakSet(), w.length_c = 0, w.length_d || t.delete(h), f = !0);
		}
		return f;
	}
	function _(i, u) {
		let f = !1;
		for (let h of i)
			u && p(h).then(_), !(!t.has(h) || !t.get(h).length_d) && (h.dispatchEvent(new Event("dde:disconnected")), t.delete(h), f = !0);
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
function L(t) {
	try {
		return Reflect.has(t, d);
	} catch {
		return !1;
	}
}
var D = [], g = /* @__PURE__ */ new WeakMap();
function l(t, e) {
	if (typeof t != "function")
		return I(t, e);
	if (L(t))
		return t;
	let n = I(), o = function() {
		D.push(o), n(t()), D.pop();
	};
	return g.set(o, /* @__PURE__ */ new Set([n])), g.set(n[d], o), o(), n;
}
l.action = function(t, e, ...n) {
	let o = t[d], { actions: r } = o;
	if (!r || !Reflect.has(r, e))
		throw new Error(`'${t}' has no action with name '${e}'!`);
	if (r[e].apply(o, n), o.skip)
		return Reflect.deleteProperty(o, "skip");
	o.listeners.forEach((c) => c(o.value));
};
l.on = function t(e, n, o = {}) {
	let { signal: r } = o;
	if (!(r && r.aborted)) {
		if (Array.isArray(e))
			return e.forEach((c) => t(c, n, o));
		T(e, n), r && r.addEventListener("abort", () => N(e, n));
	}
};
l.symbols = {
	signal: d,
	onclear: Symbol.for("Signal.onclear")
};
l.attribute = function(t, e = void 0) {
	let { host: n } = m, o = n() && n().hasAttribute(t) ? n().getAttribute(t) : e, r = new AbortController(), c = l(o, {
		[l.symbols.onclear]() {
			r.abort();
		}
	});
	return m.host(v.attributeChanged(function({ detail: a }) {
		let [p, b] = a;
		p === t && c(b);
	}, { signal: r.signal })), c;
};
l.clear = function(...t) {
	for (let n of t) {
		Reflect.deleteProperty(n, "toJSON");
		let o = n[d];
		o.onclear.forEach((r) => r.call(o)), e(n, o), Reflect.deleteProperty(n, d);
	}
	function e(n, o) {
		o.listeners.forEach((r) => {
			if (o.listeners.delete(r), !g.has(r))
				return;
			let c = g.get(r);
			c.delete(n), !(c.size > 1) && (l.clear(...c), g.delete(r));
		});
	}
};
l.el = function(t, e) {
	let n = document.createComment("<#reactive>"), o = document.createComment("</#reactive>"), r = document.createDocumentFragment();
	r.append(n, o);
	let c = (s) => {
		if (!n.parentNode || !o.parentNode)
			return N(t, c);
		let a = e(s);
		Array.isArray(a) || (a = [a]);
		let p = n;
		for (; (p = n.nextSibling) !== o; )
			p.remove();
		n.after(...a);
	};
	return T(t, c), V(t, c, n, e), c(t()), r;
};
var J = {
	isSignal: L,
	processReactiveAttribute(t, e, n, o) {
		if (!L(n))
			return n;
		let r = (c) => o(e, c);
		return T(n, r), V(n, r, t, e), n();
	}
};
function V(t, e, ...n) {
	let { current: o } = m;
	if (o.prevent)
		return;
	let r = "__dde_reactive";
	o.host(function(c) {
		c[r] || (c[r] = [], v.disconnected(
			() => (
				/*!
				* Clears all signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				* You can investigate the `__dde_reactive` key of the element.
				* */
				c[r].forEach(([s]) => N(...s, t[d]?.host() === c))
			)
		)(c)), c[r].push([[t, e], ...n]);
	});
}
function I(t, e) {
	let n = (...o) => o.length ? ot(n, ...o) : rt(n);
	return et(n, t, e);
}
var tt = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function et(t, e, n) {
	let o = [];
	M(n) !== "[object Object]" && (n = {});
	let { onclear: r } = l.symbols;
	n[r] && (o.push(n[r]), Reflect.deleteProperty(n, r));
	let { host: c } = m;
	return t[d] = {
		value: e,
		actions: n,
		onclear: o,
		host: c,
		listeners: /* @__PURE__ */ new Set()
	}, t.toJSON = () => t(), Object.setPrototypeOf(t[d], tt), t;
}
function nt() {
	return D[D.length - 1];
}
function rt(t) {
	if (!t[d])
		return;
	let { value: e, listeners: n } = t[d], o = nt();
	return o && n.add(o), g.has(o) && g.get(o).add(t), e;
}
function ot(t, e, n) {
	if (!t[d])
		return;
	let o = t[d];
	if (!(!n && o.value === e))
		return o.value = e, o.listeners.forEach((r) => r(e)), e;
}
function T(t, e) {
	if (t[d])
		return t[d].listeners.add(e);
}
function N(t, e, n) {
	let o = t[d];
	if (!o)
		return;
	let r = o.listeners.delete(e);
	if (n && !o.listeners.size) {
		if (l.clear(t), !g.has(o))
			return r;
		let c = g.get(o);
		if (!g.has(c))
			return r;
		g.get(c).forEach((s) => N(s, c, !0));
	}
	return r;
}

// signals.js
P(J);
export {
	l as S,
	R as assign,
	H as assignAttribute,
	K as classListDeclarative,
	at as createElement,
	gt as dispatchEvent,
	at as el,
	pt as empty,
	L as isSignal,
	v as on,
	P as registerReactivity,
	m as scope
};
