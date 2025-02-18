// src/signals-common.js
var T = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, r, n) {
		return r;
	}
};
function H(t, e = !0) {
	return e ? Object.assign(T, t) : (Object.setPrototypeOf(t, T), t);
}
function j(t) {
	return T.isPrototypeOf(t) && t !== T ? t : T;
}

// src/helpers.js
var I = (...t) => Object.prototype.hasOwnProperty.call(...t);
function S(t) {
	return typeof t > "u";
}
function X(t) {
	let e = typeof t;
	return e !== "object" ? e : t === null ? "null" : Object.prototype.toString.call(t);
}
function P(t, e) {
	if (!t || !(t instanceof AbortSignal))
		return !0;
	if (!t.aborted)
		return t.addEventListener("abort", e), function() {
			t.removeEventListener("abort", e);
		};
}
function W(t, e) {
	let { observedAttributes: r = [] } = t.constructor;
	return r.reduce(function(n, o) {
		return n[dt(o)] = e(t, o), n;
	}, {});
}
function dt(t) {
	return t.replace(/-./g, (e) => e[1].toUpperCase());
}

// src/dom-common.js
var d = {
	setDeleteAttr: pt,
	ssr: "",
	D: globalThis.document,
	F: globalThis.DocumentFragment,
	H: globalThis.HTMLElement,
	S: globalThis.SVGElement,
	M: globalThis.MutationObserver,
	q: (t) => t || Promise.resolve()
};
function pt(t, e, r) {
	if (Reflect.set(t, e, r), !!S(r)) {
		if (Reflect.deleteProperty(t, e), t instanceof d.H && t.getAttribute(e) === "undefined")
			return t.removeAttribute(e);
		if (Reflect.get(t, e) === "undefined")
			return Reflect.set(t, e, "");
	}
}
var O = "__dde_lifecyclesToEvents", w = "dde:connected", y = "dde:disconnected", k = "dde:attributeChanged";

// src/dom.js
function Mt(t) {
	return d.q(t);
}
var A = [{
	get scope() {
		return d.D.body;
	},
	host: (t) => t ? t(d.D.body) : d.D.body,
	prevent: !0
}], x = {
	get current() {
		return A[A.length - 1];
	},
	get host() {
		return this.current.host;
	},
	preventDefault() {
		let { current: t } = this;
		return t.prevent = !0, t;
	},
	get state() {
		return [...A];
	},
	push(t = {}) {
		return A.push(Object.assign({}, this.current, { prevent: !1 }, t));
	},
	pushRoot() {
		return A.push(A[0]);
	},
	pop() {
		if (A.length !== 1)
			return A.pop();
	}
};
function Y(...t) {
	return this.appendOriginal(...t), this;
}
function lt(t) {
	return t.append === Y || (t.appendOriginal = t.append, t.append = Y), t;
}
var $;
function M(t, e, ...r) {
	let n = j(this), o = 0, c, u;
	switch ((Object(e) !== e || n.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			o = 1;
			let i = (...h) => h.length ? (o === 1 ? r.unshift(...h) : h.forEach((E) => E(u)), void 0) : u;
			x.push({ scope: t, host: i }), c = t(e || void 0);
			let p = c instanceof d.F;
			if (c.nodeName === "#comment") break;
			let v = M.mark({
				type: "component",
				name: t.name,
				host: p ? "this" : "parentElement"
			});
			c.prepend(v), p && (u = v);
			break;
		}
		case t === "#text":
			c = q.call(this, d.D.createTextNode(""), e);
			break;
		case (t === "<>" || !t):
			c = q.call(this, d.D.createDocumentFragment(), e);
			break;
		case !!$:
			c = q.call(this, d.D.createElementNS($, t), e);
			break;
		case !c:
			c = q.call(this, d.D.createElement(t), e);
	}
	return lt(c), u || (u = c), r.forEach((i) => i(u)), o && x.pop(), o = 2, c;
}
M.mark = function(t, e = !1) {
	t = Object.entries(t).map(([o, c]) => o + `="${c}"`).join(" ");
	let r = e ? "" : "/", n = d.D.createComment(`<dde:mark ${t}${d.ssr}${r}>`);
	return e && (n.end = d.D.createComment("</dde:mark>")), n;
};
function jt(t) {
	let e = this;
	return function(...n) {
		$ = t;
		let o = M.call(e, ...n);
		return $ = void 0, o;
	};
}
function Pt(t, e = t) {
	let r = "\xB9\u2070", n = "\u2713", o = Object.fromEntries(
		Array.from(e.querySelectorAll("slot")).filter((c) => !c.name.endsWith(r)).map((c) => [c.name += r, c])
	);
	if (t.append = new Proxy(t.append, {
		apply(c, u, i) {
			if (i[0] === e) return c.apply(t, i);
			for (let p of i) {
				let v = (p.slot || "") + r;
				try {
					bt(p, "remove", "slot");
				} catch {
				}
				let h = o[v];
				if (!h) return;
				h.name.startsWith(n) || (h.childNodes.forEach((E) => E.remove()), h.name = n + v), h.append(p);
			}
			return t.append = c, t;
		}
	}), t !== e) {
		let c = Array.from(t.childNodes);
		t.append(...c);
	}
	return e;
}
var F = /* @__PURE__ */ new WeakMap(), { setDeleteAttr: tt } = d;
function q(t, ...e) {
	if (!e.length) return t;
	F.set(t, rt(t, this));
	for (let [r, n] of Object.entries(Object.assign({}, ...e)))
		nt.call(this, t, r, n);
	return F.delete(t), t;
}
function nt(t, e, r) {
	let { setRemoveAttr: n, s: o } = rt(t, this), c = this;
	r = o.processReactiveAttribute(
		t,
		e,
		r,
		(i, p) => nt.call(c, t, i, p)
	);
	let [u] = e;
	if (u === "=") return n(e.slice(1), r);
	if (u === ".") return et(t, e.slice(1), r);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), n(e, r);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return n(e, r, "http://www.w3.org/1999/xlink");
		case "textContent":
			return tt(t, e, r);
		case "style":
			if (typeof r != "object") break;
		/* falls through */
		case "dataset":
			return B(o, e, t, r, et.bind(null, t[e]));
		case "ariaset":
			return B(o, e, t, r, (i, p) => n("aria-" + i, p));
		case "classList":
			return ht.call(c, t, r);
	}
	return gt(t, e) ? tt(t, e, r) : n(e, r);
}
function rt(t, e) {
	if (F.has(t)) return F.get(t);
	let n = (t instanceof d.S ? mt : vt).bind(null, t, "Attribute"), o = j(e);
	return { setRemoveAttr: n, s: o };
}
function ht(t, e) {
	let r = j(this);
	return B(
		r,
		"classList",
		t,
		e,
		(n, o) => t.classList.toggle(n, o === -1 ? void 0 : !!o)
	), t;
}
function bt(t, e, r, n) {
	return t instanceof d.H ? t[e + "Attribute"](r, n) : t[e + "AttributeNS"](null, r, n);
}
function gt(t, e) {
	if (!(e in t)) return !1;
	let r = ot(t, e);
	return !S(r.set);
}
function ot(t, e) {
	if (t = Object.getPrototypeOf(t), !t) return {};
	let r = Object.getOwnPropertyDescriptor(t, e);
	return r || ot(t, e);
}
function B(t, e, r, n, o) {
	let c = String;
	if (!(typeof n != "object" || n === null))
		return Object.entries(n).forEach(function([i, p]) {
			i && (i = new c(i), i.target = e, p = t.processReactiveAttribute(r, i, p, o), o(i, p));
		});
}
function vt(t, e, r, n) {
	return t[(S(n) ? "remove" : "set") + e](r, n);
}
function mt(t, e, r, n, o = null) {
	return t[(S(n) ? "remove" : "set") + e + "NS"](o, r, n);
}
function et(t, e, r) {
	if (Reflect.set(t, e, r), !!S(r))
		return Reflect.deleteProperty(t, e);
}

// src/events-observer.js
var C = d.M ? Et() : new Proxy({}, {
	get() {
		return () => {
		};
	}
});
function Et() {
	let t = /* @__PURE__ */ new Map(), e = !1, r = (s) => function(f) {
		for (let a of f)
			if (a.type === "childList") {
				if (h(a.addedNodes, !0)) {
					s();
					continue;
				}
				E(a.removedNodes, !0) && s();
			}
	}, n = new d.M(r(i));
	return {
		observe(s) {
			let f = new d.M(r(() => {
			}));
			return f.observe(s, { childList: !0, subtree: !0 }), () => f.disconnect();
		},
		onConnected(s, f) {
			u();
			let a = c(s);
			a.connected.has(f) || (a.connected.add(f), a.length_c += 1);
		},
		offConnected(s, f) {
			if (!t.has(s)) return;
			let a = t.get(s);
			a.connected.has(f) && (a.connected.delete(f), a.length_c -= 1, o(s, a));
		},
		onDisconnected(s, f) {
			u();
			let a = c(s);
			a.disconnected.has(f) || (a.disconnected.add(f), a.length_d += 1);
		},
		offDisconnected(s, f) {
			if (!t.has(s)) return;
			let a = t.get(s);
			a.disconnected.has(f) && (a.disconnected.delete(f), a.length_d -= 1, o(s, a));
		}
	};
	function o(s, f) {
		f.length_c || f.length_d || (t.delete(s), i());
	}
	function c(s) {
		if (t.has(s)) return t.get(s);
		let f = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return t.set(s, f), f;
	}
	function u() {
		e || (e = !0, n.observe(d.D.body, { childList: !0, subtree: !0 }));
	}
	function i() {
		!e || t.size || (e = !1, n.disconnect());
	}
	function p() {
		return new Promise(function(s) {
			(requestIdleCallback || requestAnimationFrame)(s);
		});
	}
	async function v(s) {
		t.size > 30 && await p();
		let f = [];
		if (!(s instanceof Node)) return f;
		for (let a of t.keys())
			a === s || !(a instanceof Node) || s.contains(a) && f.push(a);
		return f;
	}
	function h(s, f) {
		let a = !1;
		for (let b of s) {
			if (f && v(b).then(h), !t.has(b)) continue;
			let N = t.get(b);
			N.length_c && (b.dispatchEvent(new Event(w)), N.connected = /* @__PURE__ */ new WeakSet(), N.length_c = 0, N.length_d || t.delete(b), a = !0);
		}
		return a;
	}
	function E(s, f) {
		let a = !1;
		for (let b of s)
			f && v(b).then(E), !(!t.has(b) || !t.get(b).length_d) && ((globalThis.queueMicrotask || setTimeout)(L(b)), a = !0);
		return a;
	}
	function L(s) {
		return () => {
			s.isConnected || (s.dispatchEvent(new Event(y)), t.delete(s));
		};
	}
}

// src/customElement.js
function It(t, e, r = _t) {
	let n = t.host || t;
	x.push({
		scope: n,
		host: (...u) => u.length ? u.forEach((i) => i(n)) : n
	}), typeof r == "function" && (r = r.call(n, n));
	let o = n[O];
	o || xt(n);
	let c = e.call(n, r);
	return o || n.dispatchEvent(new Event(w)), t.nodeType === 11 && typeof t.mode == "string" && n.addEventListener(y, C.observe(t), { once: !0 }), x.pop(), t.append(c);
}
function xt(t) {
	return J(t.prototype, "connectedCallback", function(e, r, n) {
		e.apply(r, n), r.dispatchEvent(new Event(w));
	}), J(t.prototype, "disconnectedCallback", function(e, r, n) {
		e.apply(r, n), (globalThis.queueMicrotask || setTimeout)(
			() => !r.isConnected && r.dispatchEvent(new Event(y))
		);
	}), J(t.prototype, "attributeChangedCallback", function(e, r, n) {
		let [o, , c] = n;
		r.dispatchEvent(new CustomEvent(k, {
			detail: [o, c]
		})), e.apply(r, n);
	}), t.prototype[O] = !0, t;
}
function J(t, e, r) {
	t[e] = new Proxy(t[e] || (() => {
	}), { apply: r });
}
function _t(t) {
	return W(t, (e, r) => e.getAttribute(r));
}

// src/events.js
function Gt(t, e, r) {
	return e || (e = {}), function(o, ...c) {
		r && (c.unshift(o), o = typeof r == "function" ? r() : r);
		let u = c.length ? new CustomEvent(t, Object.assign({ detail: c[0] }, e)) : new Event(t, e);
		return o.dispatchEvent(u);
	};
}
function _(t, e, r) {
	return function(o) {
		return o.addEventListener(t, e, r), o;
	};
}
var ct = (t) => Object.assign({}, typeof t == "object" ? t : null, { once: !0 });
_.connected = function(t, e) {
	return e = ct(e), function(n) {
		return n.addEventListener(w, t, e), n[O] ? n : n.isConnected ? (n.dispatchEvent(new Event(w)), n) : (P(e.signal, () => C.offConnected(n, t)) && C.onConnected(n, t), n);
	};
};
_.disconnected = function(t, e) {
	return e = ct(e), function(n) {
		return n.addEventListener(y, t, e), n[O] || P(e.signal, () => C.offDisconnected(n, t)) && C.onDisconnected(n, t), n;
	};
};
var Z = /* @__PURE__ */ new WeakMap();
_.disconnectedAsAbort = function(t) {
	if (Z.has(t)) return Z.get(t);
	let e = new AbortController();
	return Z.set(t, e), t(_.disconnected(() => e.abort())), e;
};
var wt = /* @__PURE__ */ new WeakSet();
_.attributeChanged = function(t, e) {
	return typeof e != "object" && (e = {}), function(n) {
		if (n.addEventListener(k, t, e), n[O] || wt.has(n) || !d.M) return n;
		let o = new d.M(function(u) {
			for (let { attributeName: i, target: p } of u)
				p.dispatchEvent(
					new CustomEvent(k, { detail: [i, p.getAttribute(i)] })
				);
		});
		return P(e.signal, () => o.disconnect()) && o.observe(n, { attributes: !0 }), n;
	};
};

// src/signals-lib.js
var l = "__dde_signal";
function U(t) {
	try {
		return I(t, l);
	} catch {
		return !1;
	}
}
var z = [], g = /* @__PURE__ */ new WeakMap();
function m(t, e) {
	if (typeof t != "function")
		return it(!1, t, e);
	if (U(t)) return t;
	let r = it(!0), n = function() {
		let [o, ...c] = g.get(n);
		if (g.set(n, /* @__PURE__ */ new Set([o])), z.push(n), at(r, t()), z.pop(), !c.length) return;
		let u = g.get(n);
		for (let i of c)
			u.has(i) || R(i, n);
	};
	return g.set(r[l], n), g.set(n, /* @__PURE__ */ new Set([r])), n(), r;
}
m.action = function(t, e, ...r) {
	let n = t[l], { actions: o } = n;
	if (!o || !(e in o))
		throw new Error(`'${t}' has no action with name '${e}'!`);
	if (o[e].apply(n, r), n.skip) return delete n.skip;
	n.listeners.forEach((c) => c(n.value));
};
m.on = function t(e, r, n = {}) {
	let { signal: o } = n;
	if (!(o && o.aborted)) {
		if (Array.isArray(e)) return e.forEach((c) => t(c, r, n));
		Q(e, r), o && o.addEventListener("abort", () => R(e, r));
	}
};
m.symbols = {
	//signal: mark,
	onclear: Symbol.for("Signal.onclear")
};
m.clear = function(...t) {
	for (let r of t) {
		let n = r[l];
		n && (delete r.toJSON, n.onclear.forEach((o) => o.call(n)), e(r, n), delete r[l]);
	}
	function e(r, n) {
		n.listeners.forEach((o) => {
			if (n.listeners.delete(o), !g.has(o)) return;
			let c = g.get(o);
			c.delete(r), !(c.size > 1) && (r.clear(...c), g.delete(o));
		});
	}
};
var D = "__dde_reactive";
m.el = function(t, e) {
	let r = M.mark({ type: "reactive" }, !0), n = r.end, o = d.D.createDocumentFragment();
	o.append(r, n);
	let { current: c } = x, u = {}, i = (p) => {
		if (!r.parentNode || !n.parentNode)
			return R(t, i);
		let v = u;
		u = {}, x.push(c);
		let h = e(p, function(f, a) {
			let b;
			return I(v, f) ? (b = v[f], delete v[f]) : b = a(), u[f] = b, b;
		});
		x.pop(), Array.isArray(h) || (h = [h]);
		let E = document.createComment("");
		h.push(E), r.after(...h);
		let L;
		for (; (L = E.nextSibling) && L !== n; )
			L.remove();
		E.remove(), r.isConnected && At(c.host());
	};
	return Q(t, i), ut(t, i, r, e), i(t()), o;
};
function At(t) {
	!t || !t[D] || (requestIdleCallback || setTimeout)(function() {
		t[D] = t[D].filter(([e, r]) => r.isConnected ? !0 : (R(...e), !1));
	});
}
var St = {
	_set(t) {
		this.value = t;
	}
};
function Ot(t) {
	return function(e, r) {
		let n = (...c) => c.length ? e.setAttribute(r, ...c) : K(n), o = ft(n, e.getAttribute(r), St);
		return t[r] = o, o;
	};
}
var G = "__dde_attributes";
m.observedAttributes = function(t) {
	let e = t[G] = {}, r = W(t, Ot(e));
	return _.attributeChanged(function({ detail: o }) {
		/*! This maps attributes to signals (`S.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		let [c, u] = o, i = this[G][c];
		if (i) return m.action(i, "_set", u);
	})(t), _.disconnected(function() {
		/*! This removes all signals mapped to attributes (`S.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		m.clear(...Object.values(this[G]));
	})(t), r;
};
var st = {
	isSignal: U,
	processReactiveAttribute(t, e, r, n) {
		if (!U(r)) return r;
		let o = (c) => {
			if (!t.isConnected)
				return R(r, o);
			n(e, c);
		};
		return Q(r, o), ut(r, o, t, e), r();
	}
};
function ut(t, e, ...r) {
	let { current: n } = x;
	n.prevent || n.host(function(o) {
		o[D] || (o[D] = [], _.disconnected(
			() => (
				/*!
				* Clears all Signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				* You can investigate the `__dde_reactive` key of the element.
				* */
				o[D].forEach(([[c, u]]) => R(c, u, c[l] && c[l].host && c[l].host() === o))
			)
		)(o)), o[D].push([[t, e], ...r]);
	});
}
function it(t, e, r) {
	let n = t ? () => K(n) : (...o) => o.length ? at(n, ...o) : K(n);
	return ft(n, e, r, t);
}
var yt = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
}), V = class extends Error {
	constructor() {
		super();
		let [e, ...r] = this.stack.split(`
`), n = e.slice(e.indexOf("@"), e.indexOf(".js:") + 4);
		this.stack = r.find((o) => !o.includes(n));
	}
};
function ft(t, e, r, n = !1) {
	let o = [];
	X(r) !== "[object Object]" && (r = {});
	let { onclear: c } = m.symbols;
	r[c] && (o.push(r[c]), delete r[c]);
	let { host: u } = x;
	return Reflect.defineProperty(t, l, {
		value: {
			value: e,
			actions: r,
			onclear: o,
			host: u,
			listeners: /* @__PURE__ */ new Set(),
			defined: new V().stack,
			readonly: n
		},
		enumerable: !1,
		writable: !1,
		configurable: !0
	}), t.toJSON = () => t(), t.valueOf = () => t[l] && t[l].value, Object.setPrototypeOf(t[l], yt), t;
}
function Ct() {
	return z[z.length - 1];
}
function K(t) {
	if (!t[l]) return;
	let { value: e, listeners: r } = t[l], n = Ct();
	return n && r.add(n), g.has(n) && g.get(n).add(t), e;
}
function at(t, e, r) {
	if (!t[l]) return;
	let n = t[l];
	if (!(!r && n.value === e))
		return n.value = e, n.listeners.forEach((o) => o(e)), e;
}
function Q(t, e) {
	if (t[l])
		return t[l].listeners.add(e);
}
function R(t, e, r) {
	let n = t[l];
	if (!n) return;
	let o = n.listeners.delete(e);
	if (r && !n.listeners.size) {
		if (m.clear(t), !g.has(n)) return o;
		let c = g.get(n);
		if (!g.has(c)) return o;
		g.get(c).forEach((u) => R(u, c, !0));
	}
	return o;
}

// signals.js
H(st);
export {
	m as S,
	q as assign,
	nt as assignAttribute,
	lt as chainableAppend,
	ht as classListDeclarative,
	M as createElement,
	jt as createElementNS,
	It as customElementRender,
	xt as customElementWithDDE,
	Gt as dispatchEvent,
	M as el,
	jt as elNS,
	bt as elementAttribute,
	U as isSignal,
	xt as lifecyclesToEvents,
	_t as observedAttributes,
	_ as on,
	Mt as queue,
	H as registerReactivity,
	x as scope,
	m as signal,
	Pt as simulateSlots
};
