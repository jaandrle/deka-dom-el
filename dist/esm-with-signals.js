// src/signals-common.js
var y = {
	isSignal(e) {
		return !1;
	},
	processReactiveAttribute(e, t, n, r) {
		return n;
	}
};
function D(e, t = !0) {
	return t ? Object.assign(y, e) : (Object.setPrototypeOf(e, y), e);
}
function x(e) {
	return y.isPrototypeOf(e) && e !== y ? e : y;
}

// src/helpers.js
function E(e) {
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
var M = { setDeleteAttr: G };
function G(e, t, n) {
	if (Reflect.set(e, t, n), !!E(n)) {
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
}], W = (e) => e === "svg" ? "http://www.w3.org/2000/svg" : e, b = {
	get current() {
		return S[S.length - 1];
	},
	get state() {
		return [...S];
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
				return b.namespace = t, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
			}
		};
	},
	push(e = {}) {
		return e.namespace && (e.namespace = W(e.namespace)), S.push(Object.assign({}, this.current, { prevent: !1 }, e));
	},
	pop() {
		return S.pop();
	}
};
function ie(e, t, ...n) {
	let r = this, o = x(this), { namespace: c } = b, d = !1, s;
	switch ((Object(t) !== t || o.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			d = !0, b.push({ scope: e, host: (u) => u ? (n.unshift(u), void 0) : s }), s = e(t || void 0), (s instanceof HTMLElement ? $ : q)(s, "Attribute", "dde-fun", e.name);
			break;
		}
		case e === "#text":
			s = O.call(r, document.createTextNode(""), t);
			break;
		case e === "<>":
			s = O.call(r, document.createDocumentFragment(), t);
			break;
		case c !== "html":
			s = O.call(r, document.createElementNS(c, e), t);
			break;
		case !s:
			s = O.call(r, document.createElement(e), t);
	}
	return n.forEach((u) => u(s)), d && b.pop(), s;
}
var { setDeleteAttr: F } = M;
function O(e, ...t) {
	let n = this, r = x(this);
	if (!t.length)
		return e;
	let c = (e instanceof SVGElement ? q : $).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function d([s, u]) {
		u = r.processReactiveAttribute(e, s, u, d);
		let [p] = s;
		if (p === "=")
			return c(s.slice(1), u);
		if (p === ".")
			return z(e, s.slice(1), u);
		if (/(aria|data)([A-Z])/.test(s))
			return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), c(s, u);
		switch (s === "className" && (s = "class"), s) {
			case "xlink:href":
				return c(s, u, "http://www.w3.org/1999/xlink");
			case "textContent":
				return F(e, s, u);
			case "style":
				if (typeof u != "object")
					break;
			case "dataset":
				return P(r, u, z.bind(null, e[s]));
			case "ariaset":
				return P(r, u, (v, i) => c("aria-" + v, i));
			case "classList":
				return I.call(n, e, u);
		}
		return J(e, s) ? F(e, s, u) : c(s, u);
	}), e;
}
function I(e, t) {
	let n = x(this);
	return P(
		n,
		t,
		(r, o) => e.classList.toggle(r, o === -1 ? void 0 : !!o)
	), e;
}
function fe(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function J(e, t) {
	if (!Reflect.has(e, t))
		return !1;
	let n = H(e, t);
	return !E(n.set);
}
function H(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || H(e, t);
}
function P(e, t, n) {
	if (!(typeof t != "object" || t === null))
		return Object.entries(t).forEach(function([o, c]) {
			o && (c = e.processReactiveAttribute(t, o, c, (d) => n(...d)), n(o, c));
		});
}
function U(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function $(e, t, n, r) {
	return e[(E(r) ? "remove" : "set") + t](n, U(r));
}
function q(e, t, n, r, o = null) {
	return e[(E(r) ? "remove" : "set") + t + "NS"](o, n, U(r));
}
function z(e, t, n) {
	if (Reflect.set(e, t, n), !!E(n))
		return Reflect.deleteProperty(e, t);
}

// src/events.js
function le(e, t, ...n) {
	let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(r);
}
function _(e, t, n) {
	return function(o) {
		return o.addEventListener(e, t, n), o;
	};
}
var R = Z(), V = /* @__PURE__ */ new WeakSet();
_.connected = function(e, t) {
	let n = "connected";
	return typeof t != "object" && (t = {}), t.once = !0, function(o) {
		let c = "dde:" + n;
		return o.addEventListener(c, e, t), o.__dde_lifecycleToEvents ? o : o.isConnected ? (o.dispatchEvent(new Event(c)), o) : (A(t.signal, () => R.offConnected(o, e)) && R.onConnected(o, e), o);
	};
};
_.disconnected = function(e, t) {
	let n = "disconnected";
	return typeof t != "object" && (t = {}), t.once = !0, function(o) {
		let c = "dde:" + n;
		return o.addEventListener(c, e, t), o.__dde_lifecycleToEvents || A(t.signal, () => R.offDisconnected(o, e)) && R.onDisconnected(o, e), o;
	};
};
_.attributeChanged = function(e, t) {
	let n = "attributeChanged";
	return typeof t != "object" && (t = {}), function(o) {
		let c = "dde:" + n;
		if (o.addEventListener(c, e, t), o.__dde_lifecycleToEvents || V.has(o))
			return o;
		let d = new MutationObserver(function(u) {
			for (let { attributeName: p, target: v } of u)
				v.dispatchEvent(
					new CustomEvent(c, { detail: [p, v.getAttribute(p)] })
				);
		});
		return A(t.signal, () => d.disconnect()) && d.observe(o, { attributes: !0 }), o;
	};
};
function Z() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(i) {
		for (let f of i)
			if (f.type === "childList") {
				if (p(f.addedNodes, !0)) {
					d();
					continue;
				}
				v(f.removedNodes, !0) && d();
			}
	});
	return {
		onConnected(i, f) {
			c();
			let a = o(i);
			a.connected.has(f) || (a.connected.add(f), a.length_c += 1);
		},
		offConnected(i, f) {
			if (!e.has(i))
				return;
			let a = e.get(i);
			a.connected.has(f) && (a.connected.delete(f), a.length_c -= 1, r(i, a));
		},
		onDisconnected(i, f) {
			c();
			let a = o(i);
			a.disconnected.has(f) || (a.disconnected.add(f), a.length_d += 1);
		},
		offDisconnected(i, f) {
			if (!e.has(i))
				return;
			let a = e.get(i);
			a.disconnected.has(f) && (a.disconnected.delete(f), a.length_d -= 1, r(i, a));
		}
	};
	function r(i, f) {
		f.length_c || f.length_d || (e.delete(i), d());
	}
	function o(i) {
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
	function d() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function s() {
		return new Promise(function(i) {
			(requestIdleCallback || requestAnimationFrame)(i);
		});
	}
	async function u(i) {
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
		for (let h of i) {
			if (f && u(h).then(p), !e.has(h))
				continue;
			let w = e.get(h);
			w.length_c && (h.dispatchEvent(new Event("dde:connected")), w.connected = /* @__PURE__ */ new WeakSet(), w.length_c = 0, w.length_d || e.delete(h), a = !0);
		}
		return a;
	}
	function v(i, f) {
		let a = !1;
		for (let h of i)
			f && u(h).then(v), !(!e.has(h) || !e.get(h).length_d) && (h.dispatchEvent(new Event("dde:disconnected")), e.delete(h), a = !0);
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
var m = /* @__PURE__ */ new WeakMap();
function g(e, t) {
	if (typeof e != "function")
		return k(e, t);
	if (C(e))
		return e;
	let n = k(""), r = () => n(e());
	return m.set(r, /* @__PURE__ */ new Set([n])), X(r), n;
}
g.action = function(e, t, ...n) {
	let r = e[l], { actions: o } = r;
	if (!o || !Reflect.has(o, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (o[t].apply(r, n), r.skip)
		return Reflect.deleteProperty(r, "skip");
	r.listeners.forEach((c) => c(r.value));
};
g.on = function e(t, n, r = {}) {
	let { signal: o } = r;
	if (!(o && o.aborted)) {
		if (Array.isArray(t))
			return t.forEach((c) => e(c, n, r));
		j(t, n), o && o.addEventListener("abort", () => N(t, n));
	}
};
g.symbols = {
	signal: l,
	onclear: Symbol.for("Signal.onclear")
};
g.attribute = function(e, t = void 0) {
	let { host: n } = b, r = n() && n().hasAttribute(e) ? n().getAttribute(e) : t, o = new AbortController(), c = g(r, {
		[g.symbols.onclear]() {
			o.abort();
		}
	});
	return b.host(_.attributeChanged(function({ detail: s }) {
		let [u, p] = s;
		u === e && c(p);
	}, { signal: o.signal })), c;
};
g.clear = function(...e) {
	for (let n of e) {
		Reflect.deleteProperty(n, "toJSON");
		let r = n[l], { onclear: o } = g.symbols;
		r.actions && r.actions[o] && r.actions[o].call(r), t(n, r), Reflect.deleteProperty(n, l);
	}
	function t(n, r) {
		r.listeners.forEach((o) => {
			if (r.listeners.delete(o), !m.has(o))
				return;
			let c = m.get(o);
			c.delete(n), !(c.size > 1) && (g.clear(...c), m.delete(o));
		});
	}
};
g.el = function(e, t) {
	let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
	o.append(n, r);
	let c = (s) => {
		if (!n.parentNode || !r.parentNode)
			return N(e, c);
		let u = t(s);
		Array.isArray(u) || (u = [u]);
		let p = n;
		for (; (p = n.nextSibling) !== r; )
			p.remove();
		n.after(...u);
	};
	j(e, c);
	let { current: d } = b;
	return d.prevent || d.host(_.disconnected(() => (
		/*! Clears `S.el` signal listener in current scope when not needed. */
		N(e, c)
	))), c(e()), o;
};
var B = {
	isSignal: C,
	processReactiveAttribute(e, t, n, r) {
		if (!C(n))
			return n;
		let o = (d) => r([t, d]);
		j(n, o);
		let { current: c } = b;
		return c.prevent || c.host(_.disconnected(() => (
			/*! Clears signal listener for attribute in `assign` in current scope when not needed. */
			N(n, o)
		))), n();
	}
};
function k(e, t) {
	let n = (...r) => r.length ? te(n, ...r) : ee(n);
	return Q(n, e, t);
}
var K = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function Q(e, t, n) {
	return T(n) !== "[object Object]" && (n = {}), e[l] = {
		value: t,
		actions: n,
		listeners: /* @__PURE__ */ new Set()
	}, e.toJSON = () => e(), Object.setPrototypeOf(e[l], K), e;
}
var L = [];
function X(e) {
	let t = function() {
		L.push(t), e(), L.pop();
	};
	m.has(e) && (m.set(t, m.get(e)), m.delete(e)), t();
}
function Y() {
	return L[L.length - 1];
}
function ee(e) {
	if (!e[l])
		return;
	let { value: t, listeners: n } = e[l], r = Y();
	return r && n.add(r), m.has(r) && m.get(r).add(e), t;
}
function te(e, t, n) {
	if (!e[l])
		return;
	let r = e[l];
	if (!(!n && r.value === t))
		return r.value = t, r.listeners.forEach((o) => o(t)), t;
}
function j(e, t) {
	if (e[l])
		return e[l].listeners.add(t);
}
function N(e, t) {
	if (e[l])
		return e[l].listeners.delete(t);
}

// signals.js
D(B);
export {
	g as S,
	O as assign,
	I as classListDeclarative,
	ie as createElement,
	le as dispatchEvent,
	ie as el,
	fe as empty,
	C as isSignal,
	_ as on,
	D as registerReactivity,
	b as scope
};
