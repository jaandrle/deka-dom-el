//deka-dom-el library is available via global namespace `dde`
(()=> {
// src/signals-common.js
var m = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, n, r) {
		return n;
	}
};
function G(t, e = !0) {
	return e ? Object.assign(m, t) : (Object.setPrototypeOf(t, m), t);
}
function L(t) {
	return m.isPrototypeOf(t) && t !== m ? t : m;
}

// src/helpers.js
var q = (...t) => Object.prototype.hasOwnProperty.call(...t);
function x(t) {
	return typeof t > "u";
}
function N(t, e) {
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
		return r[V(o)] = e(t, o), r;
	}, {});
}
function V(t) {
	return t.replace(/-./g, (e) => e[1].toUpperCase());
}

// src/dom-common.js
var a = {
	setDeleteAttr: J,
	ssr: "",
	D: globalThis.document,
	F: globalThis.DocumentFragment,
	H: globalThis.HTMLElement,
	S: globalThis.SVGElement,
	M: globalThis.MutationObserver
};
function J(t, e, n) {
	if (Reflect.set(t, e, n), !!x(n)) {
		if (Reflect.deleteProperty(t, e), t instanceof a.H && t.getAttribute(e) === "undefined")
			return t.removeAttribute(e);
		if (Reflect.get(t, e) === "undefined")
			return Reflect.set(t, e, "");
	}
}
var w = "__dde_lifecyclesToEvents", g = "dde:connected", y = "dde:disconnected", D = "dde:attributeChanged";

// src/dom.js
var v = [{
	get scope() {
		return a.D.body;
	},
	host: (t) => t ? t(a.D.body) : a.D.body,
	prevent: !0
}], S = {
	get current() {
		return v[v.length - 1];
	},
	get host() {
		return this.current.host;
	},
	preventDefault() {
		let { current: t } = this;
		return t.prevent = !0, t;
	},
	get state() {
		return [...v];
	},
	push(t = {}) {
		return v.push(Object.assign({}, this.current, { prevent: !1 }, t));
	},
	pushRoot() {
		return v.push(v[0]);
	},
	pop() {
		if (v.length !== 1)
			return v.pop();
	}
};
function $(...t) {
	return this.appendOriginal(...t), this;
}
function K(t) {
	return t.append === $ || (t.appendOriginal = t.append, t.append = $), t;
}
var T;
function j(t, e, ...n) {
	let r = L(this), o = 0, c, f;
	switch ((Object(e) !== e || r.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			o = 1;
			let d = (...l) => l.length ? (o === 1 ? n.unshift(...l) : l.forEach((E) => E(f)), void 0) : f;
			S.push({ scope: t, host: d }), c = t(e || void 0);
			let p = c instanceof a.F;
			if (c.nodeName === "#comment") break;
			let b = j.mark({
				type: "component",
				name: t.name,
				host: p ? "this" : "parentElement"
			});
			c.prepend(b), p && (f = b);
			break;
		}
		case t === "#text":
			c = O.call(this, a.D.createTextNode(""), e);
			break;
		case (t === "<>" || !t):
			c = O.call(this, a.D.createDocumentFragment(), e);
			break;
		case !!T:
			c = O.call(this, a.D.createElementNS(T, t), e);
			break;
		case !c:
			c = O.call(this, a.D.createElement(t), e);
	}
	return K(c), f || (f = c), n.forEach((d) => d(f)), o && S.pop(), o = 2, c;
}
j.mark = function(t, e = !1) {
	t = Object.entries(t).map(([o, c]) => o + `="${c}"`).join(" ");
	let n = e ? "" : "/", r = a.D.createComment(`<dde:mark ${t}${a.ssr}${n}>`);
	return e && (r.end = a.D.createComment("</dde:mark>")), r;
};
function bt(t, e, n) {
	typeof e != "object" && (n = e, e = t);
	let r = Symbol.for("default"), o = Array.from(e.querySelectorAll("slot")).reduce((f, d) => Reflect.set(f, d.name || r, d) && f, {}), c = q(o, r);
	if (t.append = new Proxy(t.append, {
		apply(f, d, p) {
			if (p[0] === e) return f.apply(t, p);
			if (!p.length) return t;
			let b = a.D.createDocumentFragment();
			for (let l of p) {
				if (!l || !l.slot) {
					c && b.append(l);
					continue;
				}
				let E = l.slot, _ = o[E];
				tt(l, "remove", "slot"), _ && (X(_, l, n), Reflect.deleteProperty(o, E));
			}
			return c && (o[r].replaceWith(b), Reflect.deleteProperty(o, r)), t.append = f, t;
		}
	}), t !== e) {
		let f = Array.from(t.childNodes);
		f.forEach((d) => d.remove()), t.append(...f);
	}
	return e;
}
function Q(...t) {
	return t.filter(Boolean).join(" ");
}
function X(t, e, n) {
	n && n(t, e);
	try {
		t.replaceWith(O(e, {
			className: Q(e.className, t.className),
			dataset: { ...t.dataset }
		}));
	} catch {
		t.replaceWith(e);
	}
}
function gt(t) {
	let e = this;
	return function(...r) {
		T = t;
		let o = j.call(e, ...r);
		return T = void 0, o;
	};
}
var P = /* @__PURE__ */ new WeakMap(), { setDeleteAttr: U } = a;
function O(t, ...e) {
	if (!e.length) return t;
	P.set(t, B(t, this));
	for (let [n, r] of Object.entries(Object.assign({}, ...e)))
		z.call(this, t, n, r);
	return P.delete(t), t;
}
function z(t, e, n) {
	let { setRemoveAttr: r, s: o } = B(t, this), c = this;
	n = o.processReactiveAttribute(
		t,
		e,
		n,
		(d, p) => z.call(c, t, d, p)
	);
	let [f] = e;
	if (f === "=") return r(e.slice(1), n);
	if (f === ".") return H(t, e.slice(1), n);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), r(e, n);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return r(e, n, "http://www.w3.org/1999/xlink");
		case "textContent":
			return U(t, e, n);
		case "style":
			if (typeof n != "object") break;
		/* falls through */
		case "dataset":
			return M(o, n, H.bind(null, t[e]));
		case "ariaset":
			return M(o, n, (d, p) => r("aria-" + d, p));
		case "classList":
			return Y.call(c, t, n);
	}
	return et(t, e) ? U(t, e, n) : r(e, n);
}
function B(t, e) {
	if (P.has(t)) return P.get(t);
	let r = (t instanceof a.S ? rt : nt).bind(null, t, "Attribute"), o = L(e);
	return { setRemoveAttr: r, s: o };
}
function Y(t, e) {
	let n = L(this);
	return M(
		n,
		e,
		(r, o) => t.classList.toggle(r, o === -1 ? void 0 : !!o)
	), t;
}
function tt(t, e, n, r) {
	return t instanceof a.H ? t[e + "Attribute"](n, r) : t[e + "AttributeNS"](null, n, r);
}
function et(t, e) {
	if (!(e in t)) return !1;
	let n = I(t, e);
	return !x(n.set);
}
function I(t, e) {
	if (t = Object.getPrototypeOf(t), !t) return {};
	let n = Object.getOwnPropertyDescriptor(t, e);
	return n || I(t, e);
}
function M(t, e, n) {
	if (!(typeof e != "object" || e === null))
		return Object.entries(e).forEach(function([o, c]) {
			o && (c = t.processReactiveAttribute(e, o, c, n), n(o, c));
		});
}
function nt(t, e, n, r) {
	return t[(x(r) ? "remove" : "set") + e](n, r);
}
function rt(t, e, n, r, o = null) {
	return t[(x(r) ? "remove" : "set") + e + "NS"](o, n, r);
}
function H(t, e, n) {
	if (Reflect.set(t, e, n), !!x(n))
		return Reflect.deleteProperty(t, e);
}

// src/events-observer.js
var A = a.M ? ot() : new Proxy({}, {
	get() {
		return () => {
		};
	}
});
function ot() {
	let t = /* @__PURE__ */ new Map(), e = !1, n = (i) => function(u) {
		for (let s of u)
			if (s.type === "childList") {
				if (l(s.addedNodes, !0)) {
					i();
					continue;
				}
				E(s.removedNodes, !0) && i();
			}
	}, r = new a.M(n(d));
	return {
		observe(i) {
			let u = new a.M(n(() => {
			}));
			return u.observe(i, { childList: !0, subtree: !0 }), () => u.disconnect();
		},
		onConnected(i, u) {
			f();
			let s = c(i);
			s.connected.has(u) || (s.connected.add(u), s.length_c += 1);
		},
		offConnected(i, u) {
			if (!t.has(i)) return;
			let s = t.get(i);
			s.connected.has(u) && (s.connected.delete(u), s.length_c -= 1, o(i, s));
		},
		onDisconnected(i, u) {
			f();
			let s = c(i);
			s.disconnected.has(u) || (s.disconnected.add(u), s.length_d += 1);
		},
		offDisconnected(i, u) {
			if (!t.has(i)) return;
			let s = t.get(i);
			s.disconnected.has(u) && (s.disconnected.delete(u), s.length_d -= 1, o(i, s));
		}
	};
	function o(i, u) {
		u.length_c || u.length_d || (t.delete(i), d());
	}
	function c(i) {
		if (t.has(i)) return t.get(i);
		let u = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return t.set(i, u), u;
	}
	function f() {
		e || (e = !0, r.observe(a.D.body, { childList: !0, subtree: !0 }));
	}
	function d() {
		!e || t.size || (e = !1, r.disconnect());
	}
	function p() {
		return new Promise(function(i) {
			(requestIdleCallback || requestAnimationFrame)(i);
		});
	}
	async function b(i) {
		t.size > 30 && await p();
		let u = [];
		if (!(i instanceof Node)) return u;
		for (let s of t.keys())
			s === i || !(s instanceof Node) || i.contains(s) && u.push(s);
		return u;
	}
	function l(i, u) {
		let s = !1;
		for (let h of i) {
			if (u && b(h).then(l), !t.has(h)) continue;
			let C = t.get(h);
			C.length_c && (h.dispatchEvent(new Event(g)), C.connected = /* @__PURE__ */ new WeakSet(), C.length_c = 0, C.length_d || t.delete(h), s = !0);
		}
		return s;
	}
	function E(i, u) {
		let s = !1;
		for (let h of i)
			u && b(h).then(E), !(!t.has(h) || !t.get(h).length_d) && ((globalThis.queueMicrotask || setTimeout)(_(h)), s = !0);
		return s;
	}
	function _(i) {
		return () => {
			i.isConnected || (i.dispatchEvent(new Event(y)), t.delete(i));
		};
	}
}

// src/customElement.js
function mt(t, e, n, r = it) {
	S.push({
		scope: t,
		host: (...f) => f.length ? f.forEach((d) => d(t)) : t
	}), typeof r == "function" && (r = r.call(t, t));
	let o = t[w];
	o || ct(t);
	let c = n.call(t, r);
	return o || t.dispatchEvent(new Event(g)), e.nodeType === 11 && typeof e.mode == "string" && t.addEventListener(y, A.observe(e), { once: !0 }), S.pop(), e.append(c);
}
function ct(t) {
	return k(t.prototype, "connectedCallback", function(e, n, r) {
		e.apply(n, r), n.dispatchEvent(new Event(g));
	}), k(t.prototype, "disconnectedCallback", function(e, n, r) {
		e.apply(n, r), (globalThis.queueMicrotask || setTimeout)(
			() => !n.isConnected && n.dispatchEvent(new Event(y))
		);
	}), k(t.prototype, "attributeChangedCallback", function(e, n, r) {
		let [o, , c] = r;
		n.dispatchEvent(new CustomEvent(D, {
			detail: [o, c]
		})), e.apply(n, r);
	}), t.prototype[w] = !0, t;
}
function k(t, e, n) {
	t[e] = new Proxy(t[e] || (() => {
	}), { apply: n });
}
function it(t) {
	return F(t, (e, n) => e.getAttribute(n));
}

// src/events.js
function Rt(t, e, n) {
	return e || (e = {}), function(o, ...c) {
		n && (c.unshift(o), o = typeof n == "function" ? n() : n);
		let f = c.length ? new CustomEvent(t, Object.assign({ detail: c[0] }, e)) : new Event(t, e);
		return o.dispatchEvent(f);
	};
}
function R(t, e, n) {
	return function(o) {
		return o.addEventListener(t, e, n), o;
	};
}
var Z = (t) => Object.assign({}, typeof t == "object" ? t : null, { once: !0 });
R.connected = function(t, e) {
	return e = Z(e), function(r) {
		return r.addEventListener(g, t, e), r[w] ? r : r.isConnected ? (r.dispatchEvent(new Event(g)), r) : (N(e.signal, () => A.offConnected(r, t)) && A.onConnected(r, t), r);
	};
};
R.disconnected = function(t, e) {
	return e = Z(e), function(r) {
		return r.addEventListener(y, t, e), r[w] || N(e.signal, () => A.offDisconnected(r, t)) && A.onDisconnected(r, t), r;
	};
};
var W = /* @__PURE__ */ new WeakMap();
R.disconnectedAsAbort = function(t) {
	if (W.has(t)) return W.get(t);
	let e = new AbortController();
	return W.set(t, e), t(R.disconnected(() => e.abort())), e;
};
var st = /* @__PURE__ */ new WeakSet();
R.attributeChanged = function(t, e) {
	return typeof e != "object" && (e = {}), function(r) {
		if (r.addEventListener(D, t, e), r[w] || st.has(r) || !a.M) return r;
		let o = new a.M(function(f) {
			for (let { attributeName: d, target: p } of f)
				p.dispatchEvent(
					new CustomEvent(D, { detail: [d, p.getAttribute(d)] })
				);
		});
		return N(e.signal, () => o.disconnect()) && o.observe(r, { attributes: !0 }), r;
	};
};

globalThis.dde= {
	assign: O,
	assignAttribute: z,
	chainableAppend: K,
	classListDeclarative: Y,
	cn: Q,
	createElement: j,
	createElementNS: gt,
	customElementRender: mt,
	customElementWithDDE: ct,
	dispatchEvent: Rt,
	el: j,
	elNS: gt,
	elementAttribute: tt,
	lifecyclesToEvents: ct,
	observedAttributes: it,
	on: R,
	registerReactivity: G,
	scope: S,
	simulateSlots: bt
};

})();