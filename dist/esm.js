// src/signals-common.js
var C = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, r, n) {
		return r;
	}
};
function Z(t, e = !0) {
	return e ? Object.assign(C, t) : (Object.setPrototypeOf(t, C), t);
}
function S(t) {
	return C.isPrototypeOf(t) && t !== C ? t : C;
}

// src/helpers.js
function m(t) {
	return typeof t > "u";
}
function L(t, e) {
	if (!t || !(t instanceof AbortSignal))
		return !0;
	if (!t.aborted)
		return t.addEventListener("abort", e), function() {
			t.removeEventListener("abort", e);
		};
}
function q(t, e) {
	let { observedAttributes: r = [] } = t.constructor;
	return r.reduce(function(n, o) {
		return n[G(o)] = e(t, o), n;
	}, {});
}
function G(t) {
	return t.replace(/-./g, (e) => e[1].toUpperCase());
}

// src/dom-common.js
var a = {
	setDeleteAttr: V,
	ssr: "",
	D: globalThis.document,
	F: globalThis.DocumentFragment,
	H: globalThis.HTMLElement,
	S: globalThis.SVGElement,
	M: globalThis.MutationObserver,
	q: (t) => t || Promise.resolve()
};
function V(t, e, r) {
	if (Reflect.set(t, e, r), !!m(r)) {
		if (Reflect.deleteProperty(t, e), t instanceof a.H && t.getAttribute(e) === "undefined")
			return t.removeAttribute(e);
		if (Reflect.get(t, e) === "undefined")
			return Reflect.set(t, e, "");
	}
}
var x = "__dde_lifecyclesToEvents", v = "dde:connected", w = "dde:disconnected", y = "dde:attributeChanged";

// src/dom.js
function dt(t) {
	return a.q(t);
}
var g = [{
	get scope() {
		return a.D.body;
	},
	host: (t) => t ? t(a.D.body) : a.D.body,
	prevent: !0
}], O = {
	get current() {
		return g[g.length - 1];
	},
	get host() {
		return this.current.host;
	},
	preventDefault() {
		let { current: t } = this;
		return t.prevent = !0, t;
	},
	get state() {
		return [...g];
	},
	push(t = {}) {
		return g.push(Object.assign({}, this.current, { prevent: !1 }, t));
	},
	pushRoot() {
		return g.push(g[0]);
	},
	pop() {
		if (g.length !== 1)
			return g.pop();
	}
};
function k(...t) {
	return this.appendOriginal(...t), this;
}
function J(t) {
	return t.append === k || (t.appendOriginal = t.append, t.append = k), t;
}
var T;
function P(t, e, ...r) {
	let n = S(this), o = 0, c, d;
	switch ((Object(e) !== e || n.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			o = 1;
			let f = (...l) => l.length ? (o === 1 ? r.unshift(...l) : l.forEach((E) => E(d)), void 0) : d;
			O.push({ scope: t, host: f }), c = t(e || void 0);
			let p = c instanceof a.F;
			if (c.nodeName === "#comment") break;
			let b = P.mark({
				type: "component",
				name: t.name,
				host: p ? "this" : "parentElement"
			});
			c.prepend(b), p && (d = b);
			break;
		}
		case t === "#text":
			c = R.call(this, a.D.createTextNode(""), e);
			break;
		case (t === "<>" || !t):
			c = R.call(this, a.D.createDocumentFragment(), e);
			break;
		case !!T:
			c = R.call(this, a.D.createElementNS(T, t), e);
			break;
		case !c:
			c = R.call(this, a.D.createElement(t), e);
	}
	return J(c), d || (d = c), r.forEach((f) => f(d)), o && O.pop(), o = 2, c;
}
P.mark = function(t, e = !1) {
	t = Object.entries(t).map(([o, c]) => o + `="${c}"`).join(" ");
	let r = e ? "" : "/", n = a.D.createComment(`<dde:mark ${t}${a.ssr}${r}>`);
	return e && (n.end = a.D.createComment("</dde:mark>")), n;
};
function pt(t) {
	let e = this;
	return function(...n) {
		T = t;
		let o = P.call(e, ...n);
		return T = void 0, o;
	};
}
function lt(t, e = t) {
	let r = "\xB9\u2070", n = "\u2713", o = Object.fromEntries(
		Array.from(e.querySelectorAll("slot")).filter((c) => !c.name.endsWith(r)).map((c) => [c.name += r, c])
	);
	if (t.append = new Proxy(t.append, {
		apply(c, d, f) {
			if (f[0] === e) return c.apply(t, f);
			for (let p of f) {
				let b = (p.slot || "") + r;
				try {
					Q(p, "remove", "slot");
				} catch {
				}
				let l = o[b];
				if (!l) return;
				l.name.startsWith(n) || (l.childNodes.forEach((E) => E.remove()), l.name = n + b), l.append(p);
			}
			return t.append = c, t;
		}
	}), t !== e) {
		let c = Array.from(t.childNodes);
		t.append(...c);
	}
	return e;
}
var N = /* @__PURE__ */ new WeakMap(), { setDeleteAttr: $ } = a;
function R(t, ...e) {
	if (!e.length) return t;
	N.set(t, H(t, this));
	for (let [r, n] of Object.entries(Object.assign({}, ...e)))
		U.call(this, t, r, n);
	return N.delete(t), t;
}
function U(t, e, r) {
	let { setRemoveAttr: n, s: o } = H(t, this), c = this;
	r = o.processReactiveAttribute(
		t,
		e,
		r,
		(f, p) => U.call(c, t, f, p)
	);
	let [d] = e;
	if (d === "=") return n(e.slice(1), r);
	if (d === ".") return F(t, e.slice(1), r);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), n(e, r);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return n(e, r, "http://www.w3.org/1999/xlink");
		case "textContent":
			return $(t, e, r);
		case "style":
			if (typeof r != "object") break;
		/* falls through */
		case "dataset":
			return M(o, e, t, r, F.bind(null, t[e]));
		case "ariaset":
			return M(o, e, t, r, (f, p) => n("aria-" + f, p));
		case "classList":
			return K.call(c, t, r);
	}
	return X(t, e) ? $(t, e, r) : n(e, r);
}
function H(t, e) {
	if (N.has(t)) return N.get(t);
	let n = (t instanceof a.S ? tt : Y).bind(null, t, "Attribute"), o = S(e);
	return { setRemoveAttr: n, s: o };
}
function K(t, e) {
	let r = S(this);
	return M(
		r,
		"classList",
		t,
		e,
		(n, o) => t.classList.toggle(n, o === -1 ? void 0 : !!o)
	), t;
}
function Q(t, e, r, n) {
	return t instanceof a.H ? t[e + "Attribute"](r, n) : t[e + "AttributeNS"](null, r, n);
}
function X(t, e) {
	if (!(e in t)) return !1;
	let r = z(t, e);
	return !m(r.set);
}
function z(t, e) {
	if (t = Object.getPrototypeOf(t), !t) return {};
	let r = Object.getOwnPropertyDescriptor(t, e);
	return r || z(t, e);
}
function M(t, e, r, n, o) {
	let c = String;
	if (!(typeof n != "object" || n === null))
		return Object.entries(n).forEach(function([f, p]) {
			f && (f = new c(f), f.target = e, p = t.processReactiveAttribute(r, f, p, o), o(f, p));
		});
}
function Y(t, e, r, n) {
	return t[(m(n) ? "remove" : "set") + e](r, n);
}
function tt(t, e, r, n, o = null) {
	return t[(m(n) ? "remove" : "set") + e + "NS"](o, r, n);
}
function F(t, e, r) {
	if (Reflect.set(t, e, r), !!m(r))
		return Reflect.deleteProperty(t, e);
}

// src/events-observer.js
var _ = a.M ? et() : new Proxy({}, {
	get() {
		return () => {
		};
	}
});
function et() {
	let t = /* @__PURE__ */ new Map(), e = !1, r = (s) => function(u) {
		for (let i of u)
			if (i.type === "childList") {
				if (l(i.addedNodes, !0)) {
					s();
					continue;
				}
				E(i.removedNodes, !0) && s();
			}
	}, n = new a.M(r(f));
	return {
		observe(s) {
			let u = new a.M(r(() => {
			}));
			return u.observe(s, { childList: !0, subtree: !0 }), () => u.disconnect();
		},
		onConnected(s, u) {
			d();
			let i = c(s);
			i.connected.has(u) || (i.connected.add(u), i.length_c += 1);
		},
		offConnected(s, u) {
			if (!t.has(s)) return;
			let i = t.get(s);
			i.connected.has(u) && (i.connected.delete(u), i.length_c -= 1, o(s, i));
		},
		onDisconnected(s, u) {
			d();
			let i = c(s);
			i.disconnected.has(u) || (i.disconnected.add(u), i.length_d += 1);
		},
		offDisconnected(s, u) {
			if (!t.has(s)) return;
			let i = t.get(s);
			i.disconnected.has(u) && (i.disconnected.delete(u), i.length_d -= 1, o(s, i));
		}
	};
	function o(s, u) {
		u.length_c || u.length_d || (t.delete(s), f());
	}
	function c(s) {
		if (t.has(s)) return t.get(s);
		let u = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return t.set(s, u), u;
	}
	function d() {
		e || (e = !0, n.observe(a.D.body, { childList: !0, subtree: !0 }));
	}
	function f() {
		!e || t.size || (e = !1, n.disconnect());
	}
	function p() {
		return new Promise(function(s) {
			(requestIdleCallback || requestAnimationFrame)(s);
		});
	}
	async function b(s) {
		t.size > 30 && await p();
		let u = [];
		if (!(s instanceof Node)) return u;
		for (let i of t.keys())
			i === s || !(i instanceof Node) || s.contains(i) && u.push(i);
		return u;
	}
	function l(s, u) {
		let i = !1;
		for (let h of s) {
			if (u && b(h).then(l), !t.has(h)) continue;
			let A = t.get(h);
			A.length_c && (h.dispatchEvent(new Event(v)), A.connected = /* @__PURE__ */ new WeakSet(), A.length_c = 0, A.length_d || t.delete(h), i = !0);
		}
		return i;
	}
	function E(s, u) {
		let i = !1;
		for (let h of s)
			u && b(h).then(E), !(!t.has(h) || !t.get(h).length_d) && ((globalThis.queueMicrotask || setTimeout)(I(h)), i = !0);
		return i;
	}
	function I(s) {
		return () => {
			s.isConnected || (s.dispatchEvent(new Event(w)), t.delete(s));
		};
	}
}

// src/customElement.js
function wt(t, e, r = rt) {
	let n = t.host || t;
	O.push({
		scope: n,
		host: (...d) => d.length ? d.forEach((f) => f(n)) : n
	}), typeof r == "function" && (r = r.call(n, n));
	let o = n[x];
	o || nt(n);
	let c = e.call(n, r);
	return o || n.dispatchEvent(new Event(v)), t.nodeType === 11 && typeof t.mode == "string" && n.addEventListener(w, _.observe(t), { once: !0 }), O.pop(), t.append(c);
}
function nt(t) {
	return j(t.prototype, "connectedCallback", function(e, r, n) {
		e.apply(r, n), r.dispatchEvent(new Event(v));
	}), j(t.prototype, "disconnectedCallback", function(e, r, n) {
		e.apply(r, n), (globalThis.queueMicrotask || setTimeout)(
			() => !r.isConnected && r.dispatchEvent(new Event(w))
		);
	}), j(t.prototype, "attributeChangedCallback", function(e, r, n) {
		let [o, , c] = n;
		r.dispatchEvent(new CustomEvent(y, {
			detail: [o, c]
		})), e.apply(r, n);
	}), t.prototype[x] = !0, t;
}
function j(t, e, r) {
	t[e] = new Proxy(t[e] || (() => {
	}), { apply: r });
}
function rt(t) {
	return q(t, (e, r) => e.getAttribute(r));
}

// src/events.js
function yt(t, e, r) {
	return e || (e = {}), function(o, ...c) {
		r && (c.unshift(o), o = typeof r == "function" ? r() : r);
		let d = c.length ? new CustomEvent(t, Object.assign({ detail: c[0] }, e)) : new Event(t, e);
		return o.dispatchEvent(d);
	};
}
function D(t, e, r) {
	return function(o) {
		return o.addEventListener(t, e, r), o;
	};
}
var B = (t) => Object.assign({}, typeof t == "object" ? t : null, { once: !0 });
D.connected = function(t, e) {
	return e = B(e), function(n) {
		return n.addEventListener(v, t, e), n[x] ? n : n.isConnected ? (n.dispatchEvent(new Event(v)), n) : (L(e.signal, () => _.offConnected(n, t)) && _.onConnected(n, t), n);
	};
};
D.disconnected = function(t, e) {
	return e = B(e), function(n) {
		return n.addEventListener(w, t, e), n[x] || L(e.signal, () => _.offDisconnected(n, t)) && _.onDisconnected(n, t), n;
	};
};
var W = /* @__PURE__ */ new WeakMap();
D.disconnectedAsAbort = function(t) {
	if (W.has(t)) return W.get(t);
	let e = new AbortController();
	return W.set(t, e), t(D.disconnected(() => e.abort())), e;
};
var ot = /* @__PURE__ */ new WeakSet();
D.attributeChanged = function(t, e) {
	return typeof e != "object" && (e = {}), function(n) {
		if (n.addEventListener(y, t, e), n[x] || ot.has(n) || !a.M) return n;
		let o = new a.M(function(d) {
			for (let { attributeName: f, target: p } of d)
				p.dispatchEvent(
					new CustomEvent(y, { detail: [f, p.getAttribute(f)] })
				);
		});
		return L(e.signal, () => o.disconnect()) && o.observe(n, { attributes: !0 }), n;
	};
};
export {
	R as assign,
	U as assignAttribute,
	J as chainableAppend,
	K as classListDeclarative,
	P as createElement,
	pt as createElementNS,
	wt as customElementRender,
	nt as customElementWithDDE,
	yt as dispatchEvent,
	P as el,
	pt as elNS,
	Q as elementAttribute,
	nt as lifecyclesToEvents,
	rt as observedAttributes,
	D as on,
	dt as queue,
	Z as registerReactivity,
	O as scope,
	lt as simulateSlots
};
