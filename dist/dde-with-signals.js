//deka-dom-el library is available via global namespace `dde`
(()=> {
// src/signals-common.js
var k = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, n, r) {
		return n;
	}
};
function B(t, e = !0) {
	return e ? Object.assign(k, t) : (Object.setPrototypeOf(t, k), t);
}
function W(t) {
	return k.isPrototypeOf(t) && t !== k ? t : k;
}

// src/helpers.js
var T = (...t) => Object.prototype.hasOwnProperty.call(...t);
function S(t) {
	return typeof t > "u";
}
function X(t) {
	let e = typeof t;
	return e !== "object" ? e : t === null ? "null" : Object.prototype.toString.call(t);
}
function q(t, e) {
	if (!t || !(t instanceof AbortSignal))
		return !0;
	if (!t.aborted)
		return t.addEventListener("abort", e), function() {
			t.removeEventListener("abort", e);
		};
}
function F(t, e) {
	let { observedAttributes: n = [] } = t.constructor;
	return n.reduce(function(r, o) {
		return r[pt(o)] = e(t, o), r;
	}, {});
}
function pt(t) {
	return t.replace(/-./g, (e) => e[1].toUpperCase());
}

// src/dom-common.js
var d = {
	setDeleteAttr: lt,
	ssr: "",
	D: globalThis.document,
	F: globalThis.DocumentFragment,
	H: globalThis.HTMLElement,
	S: globalThis.SVGElement,
	M: globalThis.MutationObserver
};
function lt(t, e, n) {
	if (Reflect.set(t, e, n), !!S(n)) {
		if (Reflect.deleteProperty(t, e), t instanceof d.H && t.getAttribute(e) === "undefined")
			return t.removeAttribute(e);
		if (Reflect.get(t, e) === "undefined")
			return Reflect.set(t, e, "");
	}
}
var C = "__dde_lifecyclesToEvents", _ = "dde:connected", O = "dde:disconnected", M = "dde:attributeChanged";

// src/dom.js
var A = [{
	get scope() {
		return d.D.body;
	},
	host: (t) => t ? t(d.D.body) : d.D.body,
	prevent: !0
}], m = {
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
function ht(t) {
	return t.append === Y || (t.appendOriginal = t.append, t.append = Y), t;
}
var $;
function j(t, e, ...n) {
	let r = W(this), o = 0, c, i;
	switch ((Object(e) !== e || r.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			o = 1, m.push({ scope: t, host: (...v) => v.length ? (o === 1 ? n.unshift(...v) : v.forEach((l) => l(i)), void 0) : i }), c = t(e || void 0);
			let a = c instanceof d.F;
			if (c.nodeName === "#comment")
				break;
			let h = j.mark({
				type: "component",
				name: t.name,
				host: a ? "this" : "parentElement"
			});
			c.prepend(h), a && (i = h);
			break;
		}
		case t === "#text":
			c = P.call(this, d.D.createTextNode(""), e);
			break;
		case (t === "<>" || !t):
			c = P.call(this, d.D.createDocumentFragment(), e);
			break;
		case !!$:
			c = P.call(this, d.D.createElementNS($, t), e);
			break;
		case !c:
			c = P.call(this, d.D.createElement(t), e);
	}
	return ht(c), i || (i = c), n.forEach((a) => a(i)), o && m.pop(), o = 2, c;
}
function Wt(t, e = t, n = void 0) {
	let r = Symbol.for("default"), o = Array.from(e.querySelectorAll("slot")).reduce((i, a) => Reflect.set(i, a.name || r, a) && i, {}), c = T(o, r);
	if (t.append = new Proxy(t.append, {
		apply(i, a, h) {
			if (!h.length)
				return t;
			let v = d.D.createDocumentFragment();
			for (let l of h) {
				if (!l || !l.slot) {
					c && v.appendChild(l);
					continue;
				}
				let x = l.slot, y = o[x];
				vt(l, "remove", "slot"), y && (bt(y, l, n), Reflect.deleteProperty(o, x));
			}
			return c && (o[r].replaceWith(v), Reflect.deleteProperty(o, r)), t.append = i, t;
		}
	}), t !== e) {
		let i = Array.from(t.childNodes);
		i.forEach((a) => a.remove()), t.append(...i);
	}
	return e;
}
function bt(t, e, n) {
	n && n(t, e);
	try {
		t.replaceWith(P(e, { className: [e.className, t.className], dataset: { ...t.dataset } }));
	} catch {
		t.replaceWith(e);
	}
}
j.mark = function(t, e = !1) {
	t = Object.entries(t).map(([o, c]) => o + `="${c}"`).join(" ");
	let n = e ? "" : "/", r = d.D.createComment(`<dde:mark ${t}${d.ssr}${n}>`);
	return e && (r.end = d.D.createComment("</dde:mark>")), r;
};
function qt(t) {
	let e = this;
	return function(...r) {
		$ = t;
		let o = j.call(e, ...r);
		return $ = void 0, o;
	};
}
var U = /* @__PURE__ */ new WeakMap(), { setDeleteAttr: tt } = d;
function P(t, ...e) {
	if (!e.length)
		return t;
	U.set(t, rt(t, this));
	for (let [n, r] of Object.entries(Object.assign({}, ...e)))
		nt.call(this, t, n, r);
	return U.delete(t), t;
}
function nt(t, e, n) {
	let { setRemoveAttr: r, s: o } = rt(t, this), c = this;
	n = o.processReactiveAttribute(
		t,
		e,
		n,
		(a, h) => nt.call(c, t, a, h)
	);
	let [i] = e;
	if (i === "=")
		return r(e.slice(1), n);
	if (i === ".")
		return et(t, e.slice(1), n);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), r(e, n);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return r(e, n, "http://www.w3.org/1999/xlink");
		case "textContent":
			return tt(t, e, n);
		case "style":
			if (typeof n != "object")
				break;
		case "dataset":
			return I(o, n, et.bind(null, t[e]));
		case "ariaset":
			return I(o, n, (a, h) => r("aria-" + a, h));
		case "classList":
			return gt.call(c, t, n);
	}
	return Et(t, e) ? tt(t, e, n) : r(e, n);
}
function rt(t, e) {
	if (U.has(t))
		return U.get(t);
	let r = (t instanceof d.S ? xt : mt).bind(null, t, "Attribute"), o = W(e);
	return { setRemoveAttr: r, s: o };
}
function gt(t, e) {
	let n = W(this);
	return I(
		n,
		e,
		(r, o) => t.classList.toggle(r, o === -1 ? void 0 : !!o)
	), t;
}
function Ft(t) {
	return Array.from(t.children).forEach((e) => e.remove()), t;
}
function vt(t, e, n, r) {
	return t instanceof d.H ? t[e + "Attribute"](n, r) : t[e + "AttributeNS"](null, n, r);
}
function Et(t, e) {
	if (!(e in t))
		return !1;
	let n = ot(t, e);
	return !S(n.set);
}
function ot(t, e) {
	if (t = Object.getPrototypeOf(t), !t)
		return {};
	let n = Object.getOwnPropertyDescriptor(t, e);
	return n || ot(t, e);
}
function I(t, e, n) {
	if (!(typeof e != "object" || e === null))
		return Object.entries(e).forEach(function([o, c]) {
			o && (c = t.processReactiveAttribute(e, o, c, n), n(o, c));
		});
}
function ct(t) {
	return Array.isArray(t) ? t.filter(Boolean).join(" ") : t;
}
function mt(t, e, n, r) {
	return t[(S(r) ? "remove" : "set") + e](n, ct(r));
}
function xt(t, e, n, r, o = null) {
	return t[(S(r) ? "remove" : "set") + e + "NS"](o, n, ct(r));
}
function et(t, e, n) {
	if (Reflect.set(t, e, n), !!S(n))
		return Reflect.deleteProperty(t, e);
}

// src/events-observer.js
var D = d.M ? wt() : new Proxy({}, {
	get() {
		return () => {
		};
	}
});
function wt() {
	let t = /* @__PURE__ */ new Map(), e = !1, n = (s) => function(u) {
		for (let f of u)
			if (f.type === "childList") {
				if (l(f.addedNodes, !0)) {
					s();
					continue;
				}
				x(f.removedNodes, !0) && s();
			}
	}, r = new d.M(n(a));
	return {
		observe(s) {
			let u = new d.M(n(() => {
			}));
			return u.observe(s, { childList: !0, subtree: !0 }), () => u.disconnect();
		},
		onConnected(s, u) {
			i();
			let f = c(s);
			f.connected.has(u) || (f.connected.add(u), f.length_c += 1);
		},
		offConnected(s, u) {
			if (!t.has(s))
				return;
			let f = t.get(s);
			f.connected.has(u) && (f.connected.delete(u), f.length_c -= 1, o(s, f));
		},
		onDisconnected(s, u) {
			i();
			let f = c(s);
			f.disconnected.has(u) || (f.disconnected.add(u), f.length_d += 1);
		},
		offDisconnected(s, u) {
			if (!t.has(s))
				return;
			let f = t.get(s);
			f.disconnected.has(u) && (f.disconnected.delete(u), f.length_d -= 1, o(s, f));
		}
	};
	function o(s, u) {
		u.length_c || u.length_d || (t.delete(s), a());
	}
	function c(s) {
		if (t.has(s))
			return t.get(s);
		let u = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return t.set(s, u), u;
	}
	function i() {
		e || (e = !0, r.observe(d.D.body, { childList: !0, subtree: !0 }));
	}
	function a() {
		!e || t.size || (e = !1, r.disconnect());
	}
	function h() {
		return new Promise(function(s) {
			(requestIdleCallback || requestAnimationFrame)(s);
		});
	}
	async function v(s) {
		t.size > 30 && await h();
		let u = [];
		if (!(s instanceof Node))
			return u;
		for (let f of t.keys())
			f === s || !(f instanceof Node) || s.contains(f) && u.push(f);
		return u;
	}
	function l(s, u) {
		let f = !1;
		for (let b of s) {
			if (u && v(b).then(l), !t.has(b))
				continue;
			let N = t.get(b);
			N.length_c && (b.dispatchEvent(new Event(_)), N.connected = /* @__PURE__ */ new WeakSet(), N.length_c = 0, N.length_d || t.delete(b), f = !0);
		}
		return f;
	}
	function x(s, u) {
		let f = !1;
		for (let b of s)
			u && v(b).then(x), !(!t.has(b) || !t.get(b).length_d) && ((globalThis.queueMicrotask || setTimeout)(y(b)), f = !0);
		return f;
	}
	function y(s) {
		return () => {
			s.isConnected || (s.dispatchEvent(new Event(O)), t.delete(s));
		};
	}
}

// src/customElement.js
function Zt(t, e, n, r = _t) {
	m.push({
		scope: t,
		host: (...i) => i.length ? i.forEach((a) => a(t)) : t
	}), typeof r == "function" && (r = r.call(t, t));
	let o = t[C];
	o || yt(t);
	let c = n.call(t, r);
	return o || t.dispatchEvent(new Event(_)), e.nodeType === 11 && typeof e.mode == "string" && t.addEventListener(O, D.observe(e), { once: !0 }), m.pop(), e.append(c);
}
function yt(t) {
	return J(t.prototype, "connectedCallback", function(e, n, r) {
		e.apply(n, r), n.dispatchEvent(new Event(_));
	}), J(t.prototype, "disconnectedCallback", function(e, n, r) {
		e.apply(n, r), (globalThis.queueMicrotask || setTimeout)(
			() => !n.isConnected && n.dispatchEvent(new Event(O))
		);
	}), J(t.prototype, "attributeChangedCallback", function(e, n, r) {
		let [o, , c] = r;
		n.dispatchEvent(new CustomEvent(M, {
			detail: [o, c]
		})), e.apply(n, r);
	}), t.prototype[C] = !0, t;
}
function J(t, e, n) {
	t[e] = new Proxy(t[e] || (() => {
	}), { apply: n });
}
function _t(t) {
	return F(t, (e, n) => e.getAttribute(n));
}

// src/events.js
function Qt(t, e, n) {
	return e || (e = {}), function(o, ...c) {
		n && (c.unshift(o), o = typeof n == "function" ? n() : n);
		let i = c.length ? new CustomEvent(t, Object.assign({ detail: c[0] }, e)) : new Event(t, e);
		return o.dispatchEvent(i);
	};
}
function w(t, e, n) {
	return function(o) {
		return o.addEventListener(t, e, n), o;
	};
}
var it = (t) => Object.assign({}, typeof t == "object" ? t : null, { once: !0 });
w.connected = function(t, e) {
	return e = it(e), function(r) {
		return r.addEventListener(_, t, e), r[C] ? r : r.isConnected ? (r.dispatchEvent(new Event(_)), r) : (q(e.signal, () => D.offConnected(r, t)) && D.onConnected(r, t), r);
	};
};
w.disconnected = function(t, e) {
	return e = it(e), function(r) {
		return r.addEventListener(O, t, e), r[C] || q(e.signal, () => D.offDisconnected(r, t)) && D.onDisconnected(r, t), r;
	};
};
var Z = /* @__PURE__ */ new WeakMap();
w.disconnectedAsAbort = function(t) {
	if (Z.has(t))
		return Z.get(t);
	let e = new AbortController();
	return Z.set(t, e), t(w.disconnected(() => e.abort())), e;
};
var At = /* @__PURE__ */ new WeakSet();
w.attributeChanged = function(t, e) {
	return typeof e != "object" && (e = {}), function(r) {
		if (r.addEventListener(M, t, e), r[C] || At.has(r) || !d.M)
			return r;
		let o = new d.M(function(i) {
			for (let { attributeName: a, target: h } of i)
				h.dispatchEvent(
					new CustomEvent(M, { detail: [a, h.getAttribute(a)] })
				);
		});
		return q(e.signal, () => o.disconnect()) && o.observe(r, { attributes: !0 }), r;
	};
};

// src/signals-lib.js
var p = "__dde_signal";
function z(t) {
	try {
		return T(t, p);
	} catch {
		return !1;
	}
}
var H = [], g = /* @__PURE__ */ new WeakMap();
function E(t, e) {
	if (typeof t != "function")
		return st(!1, t, e);
	if (z(t))
		return t;
	let n = st(!0), r = function() {
		let [o, ...c] = g.get(r);
		if (g.set(r, /* @__PURE__ */ new Set([o])), H.push(r), dt(n, t()), H.pop(), !c.length)
			return;
		let i = g.get(r);
		for (let a of c)
			i.has(a) || L(a, r);
	};
	return g.set(n[p], r), g.set(r, /* @__PURE__ */ new Set([n])), r(), n;
}
E.action = function(t, e, ...n) {
	let r = t[p], { actions: o } = r;
	if (!o || !(e in o))
		throw new Error(`'${t}' has no action with name '${e}'!`);
	if (o[e].apply(r, n), r.skip)
		return delete r.skip;
	r.listeners.forEach((c) => c(r.value));
};
E.on = function t(e, n, r = {}) {
	let { signal: o } = r;
	if (!(o && o.aborted)) {
		if (Array.isArray(e))
			return e.forEach((c) => t(c, n, r));
		Q(e, n), o && o.addEventListener("abort", () => L(e, n));
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
			if (r.listeners.delete(o), !g.has(o))
				return;
			let c = g.get(o);
			c.delete(n), !(c.size > 1) && (n.clear(...c), g.delete(o));
		});
	}
};
var R = "__dde_reactive";
E.el = function(t, e) {
	let n = j.mark({ type: "reactive" }, !0), r = n.end, o = d.D.createDocumentFragment();
	o.append(n, r);
	let { current: c } = m, i = {}, a = (h) => {
		if (!n.parentNode || !r.parentNode)
			return L(t, a);
		let v = i;
		i = {}, m.push(c);
		let l = e(h, function(u, f) {
			let b;
			return T(v, u) ? (b = v[u], delete v[u]) : b = f(), i[u] = b, b;
		});
		m.pop(), Array.isArray(l) || (l = [l]);
		let x = document.createComment("");
		l.push(x), n.after(...l);
		let y;
		for (; (y = x.nextSibling) && y !== r; )
			y.remove();
		x.remove(), n.isConnected && St(c.host());
	};
	return Q(t, a), ft(t, a, n, e), a(t()), o;
};
function St(t) {
	!t || !t[R] || (requestIdleCallback || setTimeout)(function() {
		t[R] = t[R].filter(([e, n]) => n.isConnected ? !0 : (L(...e), !1));
	});
}
var Ct = {
	_set(t) {
		this.value = t;
	}
};
function Ot(t) {
	return function(e, n) {
		let r = (...c) => c.length ? e.setAttribute(n, ...c) : K(r), o = at(r, e.getAttribute(n), Ct);
		return t[n] = o, o;
	};
}
var G = "__dde_attributes";
E.observedAttributes = function(t) {
	let e = t[G] = {}, n = F(t, Ot(e));
	return w.attributeChanged(function({ detail: o }) {
		/*! This maps attributes to signals (`S.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		let [c, i] = o, a = this[G][c];
		if (a)
			return E.action(a, "_set", i);
	})(t), w.disconnected(function() {
		/*! This removes all signals mapped to attributes (`S.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		E.clear(...Object.values(this[G]));
	})(t), n;
};
var ut = {
	isSignal: z,
	processReactiveAttribute(t, e, n, r) {
		if (!z(n))
			return n;
		let o = (c) => {
			if (!t.isConnected)
				return L(n, o);
			r(e, c);
		};
		return Q(n, o), ft(n, o, t, e), n();
	}
};
function ft(t, e, ...n) {
	let { current: r } = m;
	r.prevent || r.host(function(o) {
		o[R] || (o[R] = [], w.disconnected(
			() => (
				/*!
				* Clears all Signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				* You can investigate the `__dde_reactive` key of the element.
				* */
				o[R].forEach(([[c, i]]) => L(c, i, c[p] && c[p].host && c[p].host() === o))
			)
		)(o)), o[R].push([[t, e], ...n]);
	});
}
function st(t, e, n) {
	let r = t ? () => K(r) : (...o) => o.length ? dt(r, ...o) : K(r);
	return at(r, e, n, t);
}
var Dt = Object.assign(/* @__PURE__ */ Object.create(null), {
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
function at(t, e, n, r = !1) {
	let o = [];
	X(n) !== "[object Object]" && (n = {});
	let { onclear: c } = E.symbols;
	n[c] && (o.push(n[c]), delete n[c]);
	let { host: i } = m;
	return Reflect.defineProperty(t, p, {
		value: {
			value: e,
			actions: n,
			onclear: o,
			host: i,
			listeners: /* @__PURE__ */ new Set(),
			defined: new V().stack,
			readonly: r
		},
		enumerable: !1,
		writable: !1,
		configurable: !0
	}), t.toJSON = () => t(), t.valueOf = () => t[p] && t[p].value, Object.setPrototypeOf(t[p], Dt), t;
}
function Rt() {
	return H[H.length - 1];
}
function K(t) {
	if (!t[p])
		return;
	let { value: e, listeners: n } = t[p], r = Rt();
	return r && n.add(r), g.has(r) && g.get(r).add(t), e;
}
function dt(t, e, n) {
	if (!t[p])
		return;
	let r = t[p];
	if (!(!n && r.value === e))
		return r.value = e, r.listeners.forEach((o) => o(e)), e;
}
function Q(t, e) {
	if (t[p])
		return t[p].listeners.add(e);
}
function L(t, e, n) {
	let r = t[p];
	if (!r)
		return;
	let o = r.listeners.delete(e);
	if (n && !r.listeners.size) {
		if (E.clear(t), !g.has(r))
			return o;
		let c = g.get(r);
		if (!g.has(c))
			return o;
		g.get(c).forEach((i) => L(i, c, !0));
	}
	return o;
}

// signals.js
B(ut);

globalThis.dde= {
	S: E,
	assign: P,
	assignAttribute: nt,
	chainableAppend: ht,
	classListDeclarative: gt,
	createElement: j,
	createElementNS: qt,
	customElementRender: Zt,
	customElementWithDDE: yt,
	dispatchEvent: Qt,
	el: j,
	elNS: qt,
	elementAttribute: vt,
	empty: Ft,
	isSignal: z,
	lifecyclesToEvents: yt,
	observedAttributes: _t,
	on: w,
	registerReactivity: B,
	scope: m,
	signal: E,
	simulateSlots: Wt
};

})();