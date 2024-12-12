// src/signals-common.js
var N = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, n, r) {
		return n;
	}
};
function H(t, e = !0) {
	return e ? Object.assign(N, t) : (Object.setPrototypeOf(t, N), t);
}
function j(t) {
	return N.isPrototypeOf(t) && t !== N ? t : N;
}

// src/helpers.js
var I = (...t) => Object.prototype.hasOwnProperty.call(...t);
function A(t) {
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
	let { observedAttributes: n = [] } = t.constructor;
	return n.reduce(function(r, o) {
		return r[dt(o)] = e(t, o), r;
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
	M: globalThis.MutationObserver
};
function pt(t, e, n) {
	if (Reflect.set(t, e, n), !!A(n)) {
		if (Reflect.deleteProperty(t, e), t instanceof d.H && t.getAttribute(e) === "undefined")
			return t.removeAttribute(e);
		if (Reflect.get(t, e) === "undefined")
			return Reflect.set(t, e, "");
	}
}
var O = "__dde_lifecyclesToEvents", _ = "dde:connected", S = "dde:disconnected", T = "dde:attributeChanged";

// src/dom.js
var y = [{
	get scope() {
		return d.D.body;
	},
	host: (t) => t ? t(d.D.body) : d.D.body,
	prevent: !0
}], x = {
	get current() {
		return y[y.length - 1];
	},
	get host() {
		return this.current.host;
	},
	preventDefault() {
		let { current: t } = this;
		return t.prevent = !0, t;
	},
	get state() {
		return [...y];
	},
	push(t = {}) {
		return y.push(Object.assign({}, this.current, { prevent: !1 }, t));
	},
	pushRoot() {
		return y.push(y[0]);
	},
	pop() {
		if (y.length !== 1)
			return y.pop();
	}
};
function Y(...t) {
	return this.appendOriginal(...t), this;
}
function lt(t) {
	return t.append === Y || (t.appendOriginal = t.append, t.append = Y), t;
}
var $;
function M(t, e, ...n) {
	let r = j(this), o = 0, c, u;
	switch ((Object(e) !== e || r.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			o = 1;
			let a = (...h) => h.length ? (o === 1 ? n.unshift(...h) : h.forEach((m) => m(u)), void 0) : u;
			x.push({ scope: t, host: a }), c = t(e || void 0);
			let l = c instanceof d.F;
			if (c.nodeName === "#comment") break;
			let v = M.mark({
				type: "component",
				name: t.name,
				host: l ? "this" : "parentElement"
			});
			c.prepend(v), l && (u = v);
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
	return lt(c), u || (u = c), n.forEach((a) => a(u)), o && x.pop(), o = 2, c;
}
M.mark = function(t, e = !1) {
	t = Object.entries(t).map(([o, c]) => o + `="${c}"`).join(" ");
	let n = e ? "" : "/", r = d.D.createComment(`<dde:mark ${t}${d.ssr}${n}>`);
	return e && (r.end = d.D.createComment("</dde:mark>")), r;
};
function Mt(t) {
	let e = this;
	return function(...r) {
		$ = t;
		let o = M.call(e, ...r);
		return $ = void 0, o;
	};
}
function jt(t, e = t) {
	let n = "\xB9\u2070", r = "\u2713", o = Object.fromEntries(
		Array.from(e.querySelectorAll("slot")).filter((c) => !c.name.endsWith(n)).map((c) => [c.name += n, c])
	);
	if (t.append = new Proxy(t.append, {
		apply(c, u, a) {
			if (a[0] === e) return c.apply(t, a);
			for (let l of a) {
				let v = (l.slot || "") + n;
				try {
					bt(l, "remove", "slot");
				} catch {
				}
				let h = o[v];
				if (!h) return;
				v.startsWith(r) || h.childNodes.forEach((m) => m.remove()), h.append(l), h.name = r + v;
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
	for (let [n, r] of Object.entries(Object.assign({}, ...e)))
		nt.call(this, t, n, r);
	return F.delete(t), t;
}
function nt(t, e, n) {
	let { setRemoveAttr: r, s: o } = rt(t, this), c = this;
	n = o.processReactiveAttribute(
		t,
		e,
		n,
		(a, l) => nt.call(c, t, a, l)
	);
	let [u] = e;
	if (u === "=") return r(e.slice(1), n);
	if (u === ".") return et(t, e.slice(1), n);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), r(e, n);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return r(e, n, "http://www.w3.org/1999/xlink");
		case "textContent":
			return tt(t, e, n);
		case "style":
			if (typeof n != "object") break;
		/* falls through */
		case "dataset":
			return B(o, n, et.bind(null, t[e]));
		case "ariaset":
			return B(o, n, (a, l) => r("aria-" + a, l));
		case "classList":
			return ht.call(c, t, n);
	}
	return gt(t, e) ? tt(t, e, n) : r(e, n);
}
function rt(t, e) {
	if (F.has(t)) return F.get(t);
	let r = (t instanceof d.S ? Et : vt).bind(null, t, "Attribute"), o = j(e);
	return { setRemoveAttr: r, s: o };
}
function ht(t, e) {
	let n = j(this);
	return B(
		n,
		e,
		(r, o) => t.classList.toggle(r, o === -1 ? void 0 : !!o)
	), t;
}
function bt(t, e, n, r) {
	return t instanceof d.H ? t[e + "Attribute"](n, r) : t[e + "AttributeNS"](null, n, r);
}
function gt(t, e) {
	if (!(e in t)) return !1;
	let n = ot(t, e);
	return !A(n.set);
}
function ot(t, e) {
	if (t = Object.getPrototypeOf(t), !t) return {};
	let n = Object.getOwnPropertyDescriptor(t, e);
	return n || ot(t, e);
}
function B(t, e, n) {
	if (!(typeof e != "object" || e === null))
		return Object.entries(e).forEach(function([o, c]) {
			o && (c = t.processReactiveAttribute(e, o, c, n), n(o, c));
		});
}
function vt(t, e, n, r) {
	return t[(A(r) ? "remove" : "set") + e](n, r);
}
function Et(t, e, n, r, o = null) {
	return t[(A(r) ? "remove" : "set") + e + "NS"](o, n, r);
}
function et(t, e, n) {
	if (Reflect.set(t, e, n), !!A(n))
		return Reflect.deleteProperty(t, e);
}

// src/events-observer.js
var C = d.M ? mt() : new Proxy({}, {
	get() {
		return () => {
		};
	}
});
function mt() {
	let t = /* @__PURE__ */ new Map(), e = !1, n = (i) => function(s) {
		for (let f of s)
			if (f.type === "childList") {
				if (h(f.addedNodes, !0)) {
					i();
					continue;
				}
				m(f.removedNodes, !0) && i();
			}
	}, r = new d.M(n(a));
	return {
		observe(i) {
			let s = new d.M(n(() => {
			}));
			return s.observe(i, { childList: !0, subtree: !0 }), () => s.disconnect();
		},
		onConnected(i, s) {
			u();
			let f = c(i);
			f.connected.has(s) || (f.connected.add(s), f.length_c += 1);
		},
		offConnected(i, s) {
			if (!t.has(i)) return;
			let f = t.get(i);
			f.connected.has(s) && (f.connected.delete(s), f.length_c -= 1, o(i, f));
		},
		onDisconnected(i, s) {
			u();
			let f = c(i);
			f.disconnected.has(s) || (f.disconnected.add(s), f.length_d += 1);
		},
		offDisconnected(i, s) {
			if (!t.has(i)) return;
			let f = t.get(i);
			f.disconnected.has(s) && (f.disconnected.delete(s), f.length_d -= 1, o(i, f));
		}
	};
	function o(i, s) {
		s.length_c || s.length_d || (t.delete(i), a());
	}
	function c(i) {
		if (t.has(i)) return t.get(i);
		let s = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return t.set(i, s), s;
	}
	function u() {
		e || (e = !0, r.observe(d.D.body, { childList: !0, subtree: !0 }));
	}
	function a() {
		!e || t.size || (e = !1, r.disconnect());
	}
	function l() {
		return new Promise(function(i) {
			(requestIdleCallback || requestAnimationFrame)(i);
		});
	}
	async function v(i) {
		t.size > 30 && await l();
		let s = [];
		if (!(i instanceof Node)) return s;
		for (let f of t.keys())
			f === i || !(f instanceof Node) || i.contains(f) && s.push(f);
		return s;
	}
	function h(i, s) {
		let f = !1;
		for (let b of i) {
			if (s && v(b).then(h), !t.has(b)) continue;
			let L = t.get(b);
			L.length_c && (b.dispatchEvent(new Event(_)), L.connected = /* @__PURE__ */ new WeakSet(), L.length_c = 0, L.length_d || t.delete(b), f = !0);
		}
		return f;
	}
	function m(i, s) {
		let f = !1;
		for (let b of i)
			s && v(b).then(m), !(!t.has(b) || !t.get(b).length_d) && ((globalThis.queueMicrotask || setTimeout)(k(b)), f = !0);
		return f;
	}
	function k(i) {
		return () => {
			i.isConnected || (i.dispatchEvent(new Event(S)), t.delete(i));
		};
	}
}

// src/customElement.js
function Ht(t, e, n, r = wt) {
	x.push({
		scope: t,
		host: (...u) => u.length ? u.forEach((a) => a(t)) : t
	}), typeof r == "function" && (r = r.call(t, t));
	let o = t[O];
	o || xt(t);
	let c = n.call(t, r);
	return o || t.dispatchEvent(new Event(_)), e.nodeType === 11 && typeof e.mode == "string" && t.addEventListener(S, C.observe(e), { once: !0 }), x.pop(), e.append(c);
}
function xt(t) {
	return J(t.prototype, "connectedCallback", function(e, n, r) {
		e.apply(n, r), n.dispatchEvent(new Event(_));
	}), J(t.prototype, "disconnectedCallback", function(e, n, r) {
		e.apply(n, r), (globalThis.queueMicrotask || setTimeout)(
			() => !n.isConnected && n.dispatchEvent(new Event(S))
		);
	}), J(t.prototype, "attributeChangedCallback", function(e, n, r) {
		let [o, , c] = r;
		n.dispatchEvent(new CustomEvent(T, {
			detail: [o, c]
		})), e.apply(n, r);
	}), t.prototype[O] = !0, t;
}
function J(t, e, n) {
	t[e] = new Proxy(t[e] || (() => {
	}), { apply: n });
}
function wt(t) {
	return W(t, (e, n) => e.getAttribute(n));
}

// src/events.js
function Zt(t, e, n) {
	return e || (e = {}), function(o, ...c) {
		n && (c.unshift(o), o = typeof n == "function" ? n() : n);
		let u = c.length ? new CustomEvent(t, Object.assign({ detail: c[0] }, e)) : new Event(t, e);
		return o.dispatchEvent(u);
	};
}
function w(t, e, n) {
	return function(o) {
		return o.addEventListener(t, e, n), o;
	};
}
var ct = (t) => Object.assign({}, typeof t == "object" ? t : null, { once: !0 });
w.connected = function(t, e) {
	return e = ct(e), function(r) {
		return r.addEventListener(_, t, e), r[O] ? r : r.isConnected ? (r.dispatchEvent(new Event(_)), r) : (P(e.signal, () => C.offConnected(r, t)) && C.onConnected(r, t), r);
	};
};
w.disconnected = function(t, e) {
	return e = ct(e), function(r) {
		return r.addEventListener(S, t, e), r[O] || P(e.signal, () => C.offDisconnected(r, t)) && C.onDisconnected(r, t), r;
	};
};
var Z = /* @__PURE__ */ new WeakMap();
w.disconnectedAsAbort = function(t) {
	if (Z.has(t)) return Z.get(t);
	let e = new AbortController();
	return Z.set(t, e), t(w.disconnected(() => e.abort())), e;
};
var _t = /* @__PURE__ */ new WeakSet();
w.attributeChanged = function(t, e) {
	return typeof e != "object" && (e = {}), function(r) {
		if (r.addEventListener(T, t, e), r[O] || _t.has(r) || !d.M) return r;
		let o = new d.M(function(u) {
			for (let { attributeName: a, target: l } of u)
				l.dispatchEvent(
					new CustomEvent(T, { detail: [a, l.getAttribute(a)] })
				);
		});
		return P(e.signal, () => o.disconnect()) && o.observe(r, { attributes: !0 }), r;
	};
};

// src/signals-lib.js
var p = "__dde_signal";
function U(t) {
	try {
		return I(t, p);
	} catch {
		return !1;
	}
}
var z = [], g = /* @__PURE__ */ new WeakMap();
function E(t, e) {
	if (typeof t != "function")
		return it(!1, t, e);
	if (U(t)) return t;
	let n = it(!0), r = function() {
		let [o, ...c] = g.get(r);
		if (g.set(r, /* @__PURE__ */ new Set([o])), z.push(r), at(n, t()), z.pop(), !c.length) return;
		let u = g.get(r);
		for (let a of c)
			u.has(a) || R(a, r);
	};
	return g.set(n[p], r), g.set(r, /* @__PURE__ */ new Set([n])), r(), n;
}
E.action = function(t, e, ...n) {
	let r = t[p], { actions: o } = r;
	if (!o || !(e in o))
		throw new Error(`'${t}' has no action with name '${e}'!`);
	if (o[e].apply(r, n), r.skip) return delete r.skip;
	r.listeners.forEach((c) => c(r.value));
};
E.on = function t(e, n, r = {}) {
	let { signal: o } = r;
	if (!(o && o.aborted)) {
		if (Array.isArray(e)) return e.forEach((c) => t(c, n, r));
		Q(e, n), o && o.addEventListener("abort", () => R(e, n));
	}
};
E.symbols = {
	//signal: mark,
	onclear: Symbol.for("Signal.onclear")
};
E.clear = function(...t) {
	for (let n of t) {
		let r = n[p];
		r && (delete n.toJSON, r.onclear.forEach((o) => o.call(r)), e(n, r), delete n[p]);
	}
	function e(n, r) {
		r.listeners.forEach((o) => {
			if (r.listeners.delete(o), !g.has(o)) return;
			let c = g.get(o);
			c.delete(n), !(c.size > 1) && (n.clear(...c), g.delete(o));
		});
	}
};
var D = "__dde_reactive";
E.el = function(t, e) {
	let n = M.mark({ type: "reactive" }, !0), r = n.end, o = d.D.createDocumentFragment();
	o.append(n, r);
	let { current: c } = x, u = {}, a = (l) => {
		if (!n.parentNode || !r.parentNode)
			return R(t, a);
		let v = u;
		u = {}, x.push(c);
		let h = e(l, function(s, f) {
			let b;
			return I(v, s) ? (b = v[s], delete v[s]) : b = f(), u[s] = b, b;
		});
		x.pop(), Array.isArray(h) || (h = [h]);
		let m = document.createComment("");
		h.push(m), n.after(...h);
		let k;
		for (; (k = m.nextSibling) && k !== r; )
			k.remove();
		m.remove(), n.isConnected && yt(c.host());
	};
	return Q(t, a), ut(t, a, n, e), a(t()), o;
};
function yt(t) {
	!t || !t[D] || (requestIdleCallback || setTimeout)(function() {
		t[D] = t[D].filter(([e, n]) => n.isConnected ? !0 : (R(...e), !1));
	});
}
var At = {
	_set(t) {
		this.value = t;
	}
};
function Ot(t) {
	return function(e, n) {
		let r = (...c) => c.length ? e.setAttribute(n, ...c) : K(r), o = ft(r, e.getAttribute(n), At);
		return t[n] = o, o;
	};
}
var G = "__dde_attributes";
E.observedAttributes = function(t) {
	let e = t[G] = {}, n = W(t, Ot(e));
	return w.attributeChanged(function({ detail: o }) {
		/*! This maps attributes to signals (`S.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		let [c, u] = o, a = this[G][c];
		if (a) return E.action(a, "_set", u);
	})(t), w.disconnected(function() {
		/*! This removes all signals mapped to attributes (`S.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		E.clear(...Object.values(this[G]));
	})(t), n;
};
var st = {
	isSignal: U,
	processReactiveAttribute(t, e, n, r) {
		if (!U(n)) return n;
		let o = (c) => {
			if (!t.isConnected)
				return R(n, o);
			r(e, c);
		};
		return Q(n, o), ut(n, o, t, e), n();
	}
};
function ut(t, e, ...n) {
	let { current: r } = x;
	r.prevent || r.host(function(o) {
		o[D] || (o[D] = [], w.disconnected(
			() => (
				/*!
				* Clears all Signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				* You can investigate the `__dde_reactive` key of the element.
				* */
				o[D].forEach(([[c, u]]) => R(c, u, c[p] && c[p].host && c[p].host() === o))
			)
		)(o)), o[D].push([[t, e], ...n]);
	});
}
function it(t, e, n) {
	let r = t ? () => K(r) : (...o) => o.length ? at(r, ...o) : K(r);
	return ft(r, e, n, t);
}
var St = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
}), V = class extends Error {
	constructor() {
		super();
		let [e, ...n] = this.stack.split(`
`), r = e.slice(e.indexOf("@"), e.indexOf(".js:") + 4);
		this.stack = n.find((o) => !o.includes(r));
	}
};
function ft(t, e, n, r = !1) {
	let o = [];
	X(n) !== "[object Object]" && (n = {});
	let { onclear: c } = E.symbols;
	n[c] && (o.push(n[c]), delete n[c]);
	let { host: u } = x;
	return Reflect.defineProperty(t, p, {
		value: {
			value: e,
			actions: n,
			onclear: o,
			host: u,
			listeners: /* @__PURE__ */ new Set(),
			defined: new V().stack,
			readonly: r
		},
		enumerable: !1,
		writable: !1,
		configurable: !0
	}), t.toJSON = () => t(), t.valueOf = () => t[p] && t[p].value, Object.setPrototypeOf(t[p], St), t;
}
function Ct() {
	return z[z.length - 1];
}
function K(t) {
	if (!t[p]) return;
	let { value: e, listeners: n } = t[p], r = Ct();
	return r && n.add(r), g.has(r) && g.get(r).add(t), e;
}
function at(t, e, n) {
	if (!t[p]) return;
	let r = t[p];
	if (!(!n && r.value === e))
		return r.value = e, r.listeners.forEach((o) => o(e)), e;
}
function Q(t, e) {
	if (t[p])
		return t[p].listeners.add(e);
}
function R(t, e, n) {
	let r = t[p];
	if (!r) return;
	let o = r.listeners.delete(e);
	if (n && !r.listeners.size) {
		if (E.clear(t), !g.has(r)) return o;
		let c = g.get(r);
		if (!g.has(c)) return o;
		g.get(c).forEach((u) => R(u, c, !0));
	}
	return o;
}

// signals.js
H(st);
export {
	E as S,
	q as assign,
	nt as assignAttribute,
	lt as chainableAppend,
	ht as classListDeclarative,
	M as createElement,
	Mt as createElementNS,
	Ht as customElementRender,
	xt as customElementWithDDE,
	Zt as dispatchEvent,
	M as el,
	Mt as elNS,
	bt as elementAttribute,
	U as isSignal,
	xt as lifecyclesToEvents,
	wt as observedAttributes,
	w as on,
	H as registerReactivity,
	x as scope,
	E as signal,
	jt as simulateSlots
};
