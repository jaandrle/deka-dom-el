// src/signals-common.js
var x = {
	isSignal(e) {
		return !1;
	},
	processReactiveAttribute(e, t, n, o) {
		return n;
	}
};
function N(e, t = !0) {
	return t ? Object.assign(x, e) : (Object.setPrototypeOf(e, x), e);
}
function y(e) {
	return x.isPrototypeOf(e) && e !== x ? e : x;
}

// src/helpers.js
function v(e) {
	return typeof e > "u";
}
function T(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}
function A(e, t) {
	if (!e || !(e instanceof AbortSignal))
		return !0;
	if (!e.aborted)
		return e.addEventListener("abort", t), function() {
			e.removeEventListener("abort", t);
		};
}

// src/dom-common.js
var M = { setDeleteAttr: I };
function I(e, t, n) {
	if (Reflect.set(e, t, n), !!v(n)) {
		if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
			return e.removeAttribute(t);
		if (Reflect.get(e, t) === "undefined")
			return Reflect.set(e, t, "");
	}
}

// src/dom.js
var S = [{
	scope: document.body,
	namespace: "html",
	host: (e) => e ? e(document.body) : document.body,
	prevent: !0
}], W = (e) => e === "svg" ? "http://www.w3.org/2000/svg" : e, m = {
	get current() {
		return S[S.length - 1];
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
	preventDefault() {
		let { current: e } = this;
		return e.prevent = !0, e;
	},
	elNamespace(e) {
		let t = this.namespace;
		return this.namespace = e, {
			append(...n) {
				return m.namespace = t, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
			}
		};
	},
	get state() {
		return [...S];
	},
	push(e = {}) {
		return e.namespace && (e.namespace = W(e.namespace)), S.push(Object.assign({}, this.current, { prevent: !1 }, e));
	},
	pop() {
		return S.pop();
	}
};
function ie(e, t, ...n) {
	let o = y(this), { namespace: r } = m, c = 0, u;
	switch ((Object(t) !== t || o.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			c = 1, m.push({ scope: e, host: (s) => s ? (c === 1 ? n.unshift(s) : s(u), void 0) : u }), u = e(t || void 0), (u instanceof HTMLElement ? $ : q)(u, "Attribute", "dde-fun", e.name);
			break;
		}
		case e === "#text":
			u = O.call(this, document.createTextNode(""), t);
			break;
		case e === "<>":
			u = O.call(this, document.createDocumentFragment(), t);
			break;
		case r !== "html":
			u = O.call(this, document.createElementNS(r, e), t);
			break;
		case !u:
			u = O.call(this, document.createElement(e), t);
	}
	return n.forEach((s) => s(u)), c && m.pop(), c = 2, u;
}
var { setDeleteAttr: F } = M;
function O(e, ...t) {
	let n = this, o = y(this);
	if (!t.length)
		return e;
	let c = (e instanceof SVGElement ? q : $).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function u([s, d]) {
		d = o.processReactiveAttribute(e, s, d, u);
		let [p] = s;
		if (p === "=")
			return c(s.slice(1), d);
		if (p === ".")
			return z(e, s.slice(1), d);
		if (/(aria|data)([A-Z])/.test(s))
			return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), c(s, d);
		switch (s === "className" && (s = "class"), s) {
			case "xlink:href":
				return c(s, d, "http://www.w3.org/1999/xlink");
			case "textContent":
				return F(e, s, d);
			case "style":
				if (typeof d != "object")
					break;
			case "dataset":
				return D(o, d, z.bind(null, e[s]));
			case "ariaset":
				return D(o, d, (b, i) => c("aria-" + b, i));
			case "classList":
				return J.call(n, e, d);
		}
		return V(e, s) ? F(e, s, d) : c(s, d);
	}), e;
}
function J(e, t) {
	let n = y(this);
	return D(
		n,
		t,
		(o, r) => e.classList.toggle(o, r === -1 ? void 0 : !!r)
	), e;
}
function fe(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function V(e, t) {
	if (!Reflect.has(e, t))
		return !1;
	let n = H(e, t);
	return !v(n.set);
}
function H(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || H(e, t);
}
function D(e, t, n) {
	if (!(typeof t != "object" || t === null))
		return Object.entries(t).forEach(function([r, c]) {
			r && (c = e.processReactiveAttribute(t, r, c, (u) => n(...u)), n(r, c));
		});
}
function U(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function $(e, t, n, o) {
	return e[(v(o) ? "remove" : "set") + t](n, U(o));
}
function q(e, t, n, o, r = null) {
	return e[(v(o) ? "remove" : "set") + t + "NS"](r, n, U(o));
}
function z(e, t, n) {
	if (Reflect.set(e, t, n), !!v(n))
		return Reflect.deleteProperty(e, t);
}

// src/events.js
function le(e, t, ...n) {
	let o = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(o);
}
function E(e, t, n) {
	return function(r) {
		return r.addEventListener(e, t, n), r;
	};
}
var R = K(), Z = /* @__PURE__ */ new WeakSet();
E.connected = function(e, t) {
	let n = "connected";
	return typeof t != "object" && (t = {}), t.once = !0, function(r) {
		let c = "dde:" + n;
		return r.addEventListener(c, e, t), r.__dde_lifecycleToEvents ? r : r.isConnected ? (r.dispatchEvent(new Event(c)), r) : (A(t.signal, () => R.offConnected(r, e)) && R.onConnected(r, e), r);
	};
};
E.disconnected = function(e, t) {
	let n = "disconnected";
	return typeof t != "object" && (t = {}), t.once = !0, function(r) {
		let c = "dde:" + n;
		return r.addEventListener(c, e, t), r.__dde_lifecycleToEvents || A(t.signal, () => R.offDisconnected(r, e)) && R.onDisconnected(r, e), r;
	};
};
E.attributeChanged = function(e, t) {
	let n = "attributeChanged";
	return typeof t != "object" && (t = {}), function(r) {
		let c = "dde:" + n;
		if (r.addEventListener(c, e, t), r.__dde_lifecycleToEvents || Z.has(r))
			return r;
		let u = new MutationObserver(function(d) {
			for (let { attributeName: p, target: b } of d)
				b.dispatchEvent(
					new CustomEvent(c, { detail: [p, b.getAttribute(p)] })
				);
		});
		return A(t.signal, () => u.disconnect()) && u.observe(r, { attributes: !0 }), r;
	};
};
function K() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(i) {
		for (let f of i)
			if (f.type === "childList") {
				if (p(f.addedNodes, !0)) {
					u();
					continue;
				}
				b(f.removedNodes, !0) && u();
			}
	});
	return {
		onConnected(i, f) {
			c();
			let a = r(i);
			a.connected.has(f) || (a.connected.add(f), a.length_c += 1);
		},
		offConnected(i, f) {
			if (!e.has(i))
				return;
			let a = e.get(i);
			a.connected.has(f) && (a.connected.delete(f), a.length_c -= 1, o(i, a));
		},
		onDisconnected(i, f) {
			c();
			let a = r(i);
			a.disconnected.has(f) || (a.disconnected.add(f), a.length_d += 1);
		},
		offDisconnected(i, f) {
			if (!e.has(i))
				return;
			let a = e.get(i);
			a.disconnected.has(f) && (a.disconnected.delete(f), a.length_d -= 1, o(i, a));
		}
	};
	function o(i, f) {
		f.length_c || f.length_d || (e.delete(i), u());
	}
	function r(i) {
		if (e.has(i))
			return e.get(i);
		let f = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return e.set(i, f), f;
	}
	function c() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function u() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function s() {
		return new Promise(function(i) {
			(requestIdleCallback || requestAnimationFrame)(i);
		});
	}
	async function d(i) {
		e.size > 30 && await s();
		let f = [];
		if (!(i instanceof Node))
			return f;
		for (let a of e.keys())
			a === i || !(a instanceof Node) || i.contains(a) && f.push(a);
		return f;
	}
	function p(i, f) {
		let a = !1;
		for (let g of i) {
			if (f && d(g).then(p), !e.has(g))
				continue;
			let w = e.get(g);
			w.length_c && (g.dispatchEvent(new Event("dde:connected")), w.connected = /* @__PURE__ */ new WeakSet(), w.length_c = 0, w.length_d || e.delete(g), a = !0);
		}
		return a;
	}
	function b(i, f) {
		let a = !1;
		for (let g of i)
			f && d(g).then(b), !(!e.has(g) || !e.get(g).length_d) && (g.dispatchEvent(new Event("dde:disconnected")), e.delete(g), a = !0);
		return a;
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
var l = Symbol.for("Signal");
function C(e) {
	try {
		return Reflect.has(e, l);
	} catch {
		return !1;
	}
}
var L = [], _ = /* @__PURE__ */ new WeakMap();
function h(e, t) {
	if (typeof e != "function")
		return k(e, t);
	if (C(e))
		return e;
	let n = k(), o = function() {
		L.push(o), n(e()), L.pop();
	};
	return _.set(o, /* @__PURE__ */ new Set([n])), o(), n;
}
h.action = function(e, t, ...n) {
	let o = e[l], { actions: r } = o;
	if (!r || !Reflect.has(r, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (r[t].apply(o, n), o.skip)
		return Reflect.deleteProperty(o, "skip");
	o.listeners.forEach((c) => c(o.value));
};
h.on = function e(t, n, o = {}) {
	let { signal: r } = o;
	if (!(r && r.aborted)) {
		if (Array.isArray(t))
			return t.forEach((c) => e(c, n, o));
		P(t, n), r && r.addEventListener("abort", () => j(t, n));
	}
};
h.symbols = {
	signal: l,
	onclear: Symbol.for("Signal.onclear")
};
h.attribute = function(e, t = void 0) {
	let { host: n } = m, o = n() && n().hasAttribute(e) ? n().getAttribute(e) : t, r = new AbortController(), c = h(o, {
		[h.symbols.onclear]() {
			r.abort();
		}
	});
	return m.host(E.attributeChanged(function({ detail: s }) {
		let [d, p] = s;
		d === e && c(p);
	}, { signal: r.signal })), c;
};
h.clear = function(...e) {
	for (let n of e) {
		Reflect.deleteProperty(n, "toJSON");
		let o = n[l];
		o.onclear.forEach((r) => r.call(o)), t(n, o), Reflect.deleteProperty(n, l);
	}
	function t(n, o) {
		o.listeners.forEach((r) => {
			if (o.listeners.delete(r), !_.has(r))
				return;
			let c = _.get(r);
			c.delete(n), !(c.size > 1) && (h.clear(...c), _.delete(r));
		});
	}
};
h.el = function(e, t) {
	let n = document.createComment("<#reactive>"), o = document.createComment("</#reactive>"), r = document.createDocumentFragment();
	r.append(n, o);
	let c = (u) => {
		if (!n.parentNode || !o.parentNode)
			return j(e, c);
		let s = t(u);
		Array.isArray(s) || (s = [s]);
		let d = n;
		for (; (d = n.nextSibling) !== o; )
			d.remove();
		n.after(...s);
	};
	return P(e, c), G(e, c, n, t), c(e()), r;
};
var B = {
	isSignal: C,
	processReactiveAttribute(e, t, n, o) {
		if (!C(n))
			return n;
		let r = (c) => o([t, c]);
		return P(n, r), G(n, r, e, t), n();
	}
};
function G(e, t, ...n) {
	let { current: o } = m;
	if (o.prevent)
		return;
	let r = "__dde_reactive";
	o.host(function(c) {
		c[r] || (c[r] = [], E.disconnected(
			() => (
				/*!
				* Clears all signals listeners the current element is depending on (`S.el`, `assign`, …?).
				* You can investigate the `__dde_reactive` key of the element.
				* */
				c[r].forEach(([u, s, d, p]) => j(d, p, d[l].host() === c))
			)
		)(c)), c[r].push([...n, e, t]);
	});
}
function k(e, t) {
	let n = (...o) => o.length ? te(n, ...o) : ee(n);
	return X(n, e, t);
}
var Q = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function X(e, t, n) {
	let o = [];
	T(n) !== "[object Object]" && (n = {});
	let { onclear: r } = h.symbols;
	n[r] && (o.push(n[r]), Reflect.deleteProperty(n, r));
	let { host: c } = m;
	return e[l] = {
		value: t,
		actions: n,
		onclear: o,
		host: c,
		listeners: /* @__PURE__ */ new Set()
	}, e.toJSON = () => e(), Object.setPrototypeOf(e[l], Q), e;
}
function Y() {
	return L[L.length - 1];
}
function ee(e) {
	if (!e[l])
		return;
	let { value: t, listeners: n } = e[l], o = Y();
	return o && n.add(o), _.has(o) && _.get(o).add(e), t;
}
function te(e, t, n) {
	if (!e[l])
		return;
	let o = e[l];
	if (!(!n && o.value === t))
		return o.value = t, o.listeners.forEach((r) => r(t)), t;
}
function P(e, t) {
	if (e[l])
		return e[l].listeners.add(t);
}
function j(e, t, n) {
	if (!e[l])
		return;
	let o = e[l].listeners.delete(t);
	return n && e[l].listeners.size === 0 && h.clear(e), o;
}

// signals.js
N(B);
export {
	h as S,
	O as assign,
	J as classListDeclarative,
	ie as createElement,
	le as dispatchEvent,
	ie as el,
	fe as empty,
	C as isSignal,
	E as on,
	N as registerReactivity,
	m as scope
};
