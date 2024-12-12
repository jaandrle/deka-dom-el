//deka-dom-el library is available via global namespace `dde`
(()=> {
// src/signals-common.js
var C = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, n, r) {
		return n;
	}
};
function Z(t, e = !0) {
	return e ? Object.assign(C, t) : (Object.setPrototypeOf(t, C), t);
}
function S(t) {
	return C.isPrototypeOf(t) && t !== C ? t : C;
}

// src/helpers.js
function x(t) {
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
function W(t, e) {
	let { observedAttributes: n = [] } = t.constructor;
	return n.reduce(function(r, o) {
		return r[G(o)] = e(t, o), r;
	}, {});
}
function G(t) {
	return t.replace(/-./g, (e) => e[1].toUpperCase());
}

// src/dom-common.js
var f = {
	setDeleteAttr: Q,
	ssr: "",
	D: globalThis.document,
	F: globalThis.DocumentFragment,
	H: globalThis.HTMLElement,
	S: globalThis.SVGElement,
	M: globalThis.MutationObserver,
	qa: (t) => t,
	qw: () => Promise.resolve()
};
function Q(t, e, n) {
	if (Reflect.set(t, e, n), !!x(n)) {
		if (Reflect.deleteProperty(t, e), t instanceof f.H && t.getAttribute(e) === "undefined")
			return t.removeAttribute(e);
		if (Reflect.get(t, e) === "undefined")
			return Reflect.set(t, e, "");
	}
}
var w = "__dde_lifecyclesToEvents", v = "dde:connected", m = "dde:disconnected", O = "dde:attributeChanged";

// src/dom.js
function dt(t) {
	return f.qa(t);
}
var g = [{
	get scope() {
		return f.D.body;
	},
	host: (t) => t ? t(f.D.body) : f.D.body,
	prevent: !0
}], D = {
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
function q(...t) {
	return this.appendOriginal(...t), this;
}
function V(t) {
	return t.append === q || (t.appendOriginal = t.append, t.append = q), t;
}
var T;
function P(t, e, ...n) {
	let r = S(this), o = 0, c, a;
	switch ((Object(e) !== e || r.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			o = 1;
			let d = (...h) => h.length ? (o === 1 ? n.unshift(...h) : h.forEach((E) => E(a)), void 0) : a;
			D.push({ scope: t, host: d }), c = t(e || void 0);
			let p = c instanceof f.F;
			if (c.nodeName === "#comment") break;
			let b = P.mark({
				type: "component",
				name: t.name,
				host: p ? "this" : "parentElement"
			});
			c.prepend(b), p && (a = b);
			break;
		}
		case t === "#text":
			c = R.call(this, f.D.createTextNode(""), e);
			break;
		case (t === "<>" || !t):
			c = R.call(this, f.D.createDocumentFragment(), e);
			break;
		case !!T:
			c = R.call(this, f.D.createElementNS(T, t), e);
			break;
		case !c:
			c = R.call(this, f.D.createElement(t), e);
	}
	return V(c), a || (a = c), n.forEach((d) => d(a)), o && D.pop(), o = 2, c;
}
P.mark = function(t, e = !1) {
	t = Object.entries(t).map(([o, c]) => o + `="${c}"`).join(" ");
	let n = e ? "" : "/", r = f.D.createComment(`<dde:mark ${t}${f.ssr}${n}>`);
	return e && (r.end = f.D.createComment("</dde:mark>")), r;
};
function pt(t) {
	let e = this;
	return function(...r) {
		T = t;
		let o = P.call(e, ...r);
		return T = void 0, o;
	};
}
function ht(t, e = t) {
	let n = "\xB9\u2070", r = "\u2713", o = Object.fromEntries(
		Array.from(e.querySelectorAll("slot")).filter((c) => !c.name.endsWith(n)).map((c) => [c.name += n, c])
	);
	if (t.append = new Proxy(t.append, {
		apply(c, a, d) {
			if (d[0] === e) return c.apply(t, d);
			for (let p of d) {
				let b = (p.slot || "") + n;
				try {
					K(p, "remove", "slot");
				} catch {
				}
				let h = o[b];
				if (!h) return;
				h.name.startsWith(r) || (h.childNodes.forEach((E) => E.remove()), h.name = r + b), h.append(p);
			}
			return t.append = c, t;
		}
	}), t !== e) {
		let c = Array.from(t.childNodes);
		t.append(...c);
	}
	return e;
}
var N = /* @__PURE__ */ new WeakMap(), { setDeleteAttr: $ } = f;
function R(t, ...e) {
	if (!e.length) return t;
	N.set(t, H(t, this));
	for (let [n, r] of Object.entries(Object.assign({}, ...e)))
		U.call(this, t, n, r);
	return N.delete(t), t;
}
function U(t, e, n) {
	let { setRemoveAttr: r, s: o } = H(t, this), c = this;
	n = o.processReactiveAttribute(
		t,
		e,
		n,
		(d, p) => U.call(c, t, d, p)
	);
	let [a] = e;
	if (a === "=") return r(e.slice(1), n);
	if (a === ".") return F(t, e.slice(1), n);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), r(e, n);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return r(e, n, "http://www.w3.org/1999/xlink");
		case "textContent":
			return $(t, e, n);
		case "style":
			if (typeof n != "object") break;
		/* falls through */
		case "dataset":
			return M(o, n, F.bind(null, t[e]));
		case "ariaset":
			return M(o, n, (d, p) => r("aria-" + d, p));
		case "classList":
			return J.call(c, t, n);
	}
	return X(t, e) ? $(t, e, n) : r(e, n);
}
function H(t, e) {
	if (N.has(t)) return N.get(t);
	let r = (t instanceof f.S ? tt : Y).bind(null, t, "Attribute"), o = S(e);
	return { setRemoveAttr: r, s: o };
}
function J(t, e) {
	let n = S(this);
	return M(
		n,
		e,
		(r, o) => t.classList.toggle(r, o === -1 ? void 0 : !!o)
	), t;
}
function K(t, e, n, r) {
	return t instanceof f.H ? t[e + "Attribute"](n, r) : t[e + "AttributeNS"](null, n, r);
}
function X(t, e) {
	if (!(e in t)) return !1;
	let n = z(t, e);
	return !x(n.set);
}
function z(t, e) {
	if (t = Object.getPrototypeOf(t), !t) return {};
	let n = Object.getOwnPropertyDescriptor(t, e);
	return n || z(t, e);
}
function M(t, e, n) {
	if (!(typeof e != "object" || e === null))
		return Object.entries(e).forEach(function([o, c]) {
			o && (c = t.processReactiveAttribute(e, o, c, n), n(o, c));
		});
}
function Y(t, e, n, r) {
	return t[(x(r) ? "remove" : "set") + e](n, r);
}
function tt(t, e, n, r, o = null) {
	return t[(x(r) ? "remove" : "set") + e + "NS"](o, n, r);
}
function F(t, e, n) {
	if (Reflect.set(t, e, n), !!x(n))
		return Reflect.deleteProperty(t, e);
}

// src/events-observer.js
var y = f.M ? et() : new Proxy({}, {
	get() {
		return () => {
		};
	}
});
function et() {
	let t = /* @__PURE__ */ new Map(), e = !1, n = (s) => function(u) {
		for (let i of u)
			if (i.type === "childList") {
				if (h(i.addedNodes, !0)) {
					s();
					continue;
				}
				E(i.removedNodes, !0) && s();
			}
	}, r = new f.M(n(d));
	return {
		observe(s) {
			let u = new f.M(n(() => {
			}));
			return u.observe(s, { childList: !0, subtree: !0 }), () => u.disconnect();
		},
		onConnected(s, u) {
			a();
			let i = c(s);
			i.connected.has(u) || (i.connected.add(u), i.length_c += 1);
		},
		offConnected(s, u) {
			if (!t.has(s)) return;
			let i = t.get(s);
			i.connected.has(u) && (i.connected.delete(u), i.length_c -= 1, o(s, i));
		},
		onDisconnected(s, u) {
			a();
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
		u.length_c || u.length_d || (t.delete(s), d());
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
	function a() {
		e || (e = !0, r.observe(f.D.body, { childList: !0, subtree: !0 }));
	}
	function d() {
		!e || t.size || (e = !1, r.disconnect());
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
	function h(s, u) {
		let i = !1;
		for (let l of s) {
			if (u && b(l).then(h), !t.has(l)) continue;
			let A = t.get(l);
			A.length_c && (l.dispatchEvent(new Event(v)), A.connected = /* @__PURE__ */ new WeakSet(), A.length_c = 0, A.length_d || t.delete(l), i = !0);
		}
		return i;
	}
	function E(s, u) {
		let i = !1;
		for (let l of s)
			u && b(l).then(E), !(!t.has(l) || !t.get(l).length_d) && ((globalThis.queueMicrotask || setTimeout)(I(l)), i = !0);
		return i;
	}
	function I(s) {
		return () => {
			s.isConnected || (s.dispatchEvent(new Event(m)), t.delete(s));
		};
	}
}

// src/customElement.js
function mt(t, e, n, r = rt) {
	D.push({
		scope: t,
		host: (...a) => a.length ? a.forEach((d) => d(t)) : t
	}), typeof r == "function" && (r = r.call(t, t));
	let o = t[w];
	o || nt(t);
	let c = n.call(t, r);
	return o || t.dispatchEvent(new Event(v)), e.nodeType === 11 && typeof e.mode == "string" && t.addEventListener(m, y.observe(e), { once: !0 }), D.pop(), e.append(c);
}
function nt(t) {
	return k(t.prototype, "connectedCallback", function(e, n, r) {
		e.apply(n, r), n.dispatchEvent(new Event(v));
	}), k(t.prototype, "disconnectedCallback", function(e, n, r) {
		e.apply(n, r), (globalThis.queueMicrotask || setTimeout)(
			() => !n.isConnected && n.dispatchEvent(new Event(m))
		);
	}), k(t.prototype, "attributeChangedCallback", function(e, n, r) {
		let [o, , c] = r;
		n.dispatchEvent(new CustomEvent(O, {
			detail: [o, c]
		})), e.apply(n, r);
	}), t.prototype[w] = !0, t;
}
function k(t, e, n) {
	t[e] = new Proxy(t[e] || (() => {
	}), { apply: n });
}
function rt(t) {
	return W(t, (e, n) => e.getAttribute(n));
}

// src/events.js
function Ot(t, e, n) {
	return e || (e = {}), function(o, ...c) {
		n && (c.unshift(o), o = typeof n == "function" ? n() : n);
		let a = c.length ? new CustomEvent(t, Object.assign({ detail: c[0] }, e)) : new Event(t, e);
		return o.dispatchEvent(a);
	};
}
function _(t, e, n) {
	return function(o) {
		return o.addEventListener(t, e, n), o;
	};
}
var B = (t) => Object.assign({}, typeof t == "object" ? t : null, { once: !0 });
_.connected = function(t, e) {
	return e = B(e), function(r) {
		return r.addEventListener(v, t, e), r[w] ? r : r.isConnected ? (r.dispatchEvent(new Event(v)), r) : (L(e.signal, () => y.offConnected(r, t)) && y.onConnected(r, t), r);
	};
};
_.disconnected = function(t, e) {
	return e = B(e), function(r) {
		return r.addEventListener(m, t, e), r[w] || L(e.signal, () => y.offDisconnected(r, t)) && y.onDisconnected(r, t), r;
	};
};
var j = /* @__PURE__ */ new WeakMap();
_.disconnectedAsAbort = function(t) {
	if (j.has(t)) return j.get(t);
	let e = new AbortController();
	return j.set(t, e), t(_.disconnected(() => e.abort())), e;
};
var ot = /* @__PURE__ */ new WeakSet();
_.attributeChanged = function(t, e) {
	return typeof e != "object" && (e = {}), function(r) {
		if (r.addEventListener(O, t, e), r[w] || ot.has(r) || !f.M) return r;
		let o = new f.M(function(a) {
			for (let { attributeName: d, target: p } of a)
				p.dispatchEvent(
					new CustomEvent(O, { detail: [d, p.getAttribute(d)] })
				);
		});
		return L(e.signal, () => o.disconnect()) && o.observe(r, { attributes: !0 }), r;
	};
};

globalThis.dde= {
	assign: R,
	assignAttribute: U,
	asyncQueueAdd: dt,
	chainableAppend: V,
	classListDeclarative: J,
	createElement: P,
	createElementNS: pt,
	customElementRender: mt,
	customElementWithDDE: nt,
	dispatchEvent: Ot,
	el: P,
	elNS: pt,
	elementAttribute: K,
	lifecyclesToEvents: nt,
	observedAttributes: rt,
	on: _,
	registerReactivity: Z,
	scope: D,
	simulateSlots: ht
};

})();