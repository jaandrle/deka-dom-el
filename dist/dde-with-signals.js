//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var x = {
		isSignal(e) {
			return !1;
		},
		processReactiveAttribute(e, t, n, o) {
			return n;
		}
	};
	function D(e, t = !0) {
		return t ? Object.assign(x, e) : (Object.setPrototypeOf(e, x), e);
	}
	function y(e) {
		return x.isPrototypeOf(e) && e !== x ? e : x;
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
	var M = { setDeleteAttr: I };
	function I(e, t, n) {
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
		let o = y(this), { namespace: r } = b, c = 0, i;
		switch ((Object(t) !== t || o.isSignal(t)) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				c = 1, b.push({ scope: e, host: (s) => s ? (c === 1 ? n.unshift(s) : s(i), void 0) : i }), i = e(t || void 0), (i instanceof HTMLElement ? $ : q)(i, "Attribute", "dde-fun", e.name);
				break;
			}
			case e === "#text":
				i = O.call(this, document.createTextNode(""), t);
				break;
			case e === "<>":
				i = O.call(this, document.createDocumentFragment(), t);
				break;
			case r !== "html":
				i = O.call(this, document.createElementNS(r, e), t);
				break;
			case !i:
				i = O.call(this, document.createElement(e), t);
		}
		return n.forEach((s) => s(i)), c && b.pop(), c = 2, i;
	}
	var { setDeleteAttr: F } = M;
	function O(e, ...t) {
		let n = this, o = y(this);
		if (!t.length)
			return e;
		let c = (e instanceof SVGElement ? q : $).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function i([s, d]) {
			d = o.processReactiveAttribute(e, s, d, i);
			let [m] = s;
			if (m === "=")
				return c(s.slice(1), d);
			if (m === ".")
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
					return P(o, d, z.bind(null, e[s]));
				case "ariaset":
					return P(o, d, (v, u) => c("aria-" + v, u));
				case "classList":
					return J.call(n, e, d);
			}
			return V(e, s) ? F(e, s, d) : c(s, d);
		}), e;
	}
	function J(e, t) {
		let n = y(this);
		return P(
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
			return Object.entries(t).forEach(function([r, c]) {
				r && (c = e.processReactiveAttribute(t, r, c, (i) => n(...i)), n(r, c));
			});
	}
	function U(e) {
		return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
	}
	function $(e, t, n, o) {
		return e[(E(o) ? "remove" : "set") + t](n, U(o));
	}
	function q(e, t, n, o, r = null) {
		return e[(E(o) ? "remove" : "set") + t + "NS"](r, n, U(o));
	}
	function z(e, t, n) {
		if (Reflect.set(e, t, n), !!E(n))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function le(e, t, ...n) {
		let o = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
		return e.dispatchEvent(o);
	}
	function _(e, t, n) {
		return function(r) {
			return r.addEventListener(e, t, n), r;
		};
	}
	var R = K(), Z = /* @__PURE__ */ new WeakSet();
	_.connected = function(e, t) {
		let n = "connected";
		return typeof t != "object" && (t = {}), t.once = !0, function(r) {
			let c = "dde:" + n;
			return r.addEventListener(c, e, t), r.__dde_lifecycleToEvents ? r : r.isConnected ? (r.dispatchEvent(new Event(c)), r) : (A(t.signal, () => R.offConnected(r, e)) && R.onConnected(r, e), r);
		};
	};
	_.disconnected = function(e, t) {
		let n = "disconnected";
		return typeof t != "object" && (t = {}), t.once = !0, function(r) {
			let c = "dde:" + n;
			return r.addEventListener(c, e, t), r.__dde_lifecycleToEvents || A(t.signal, () => R.offDisconnected(r, e)) && R.onDisconnected(r, e), r;
		};
	};
	_.attributeChanged = function(e, t) {
		let n = "attributeChanged";
		return typeof t != "object" && (t = {}), function(r) {
			let c = "dde:" + n;
			if (r.addEventListener(c, e, t), r.__dde_lifecycleToEvents || Z.has(r))
				return r;
			let i = new MutationObserver(function(d) {
				for (let { attributeName: m, target: v } of d)
					v.dispatchEvent(
						new CustomEvent(c, { detail: [m, v.getAttribute(m)] })
					);
			});
			return A(t.signal, () => i.disconnect()) && i.observe(r, { attributes: !0 }), r;
		};
	};
	function K() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(u) {
			for (let f of u)
				if (f.type === "childList") {
					if (m(f.addedNodes, !0)) {
						i();
						continue;
					}
					v(f.removedNodes, !0) && i();
				}
		});
		return {
			onConnected(u, f) {
				c();
				let a = r(u);
				a.connected.has(f) || (a.connected.add(f), a.length_c += 1);
			},
			offConnected(u, f) {
				if (!e.has(u))
					return;
				let a = e.get(u);
				a.connected.has(f) && (a.connected.delete(f), a.length_c -= 1, o(u, a));
			},
			onDisconnected(u, f) {
				c();
				let a = r(u);
				a.disconnected.has(f) || (a.disconnected.add(f), a.length_d += 1);
			},
			offDisconnected(u, f) {
				if (!e.has(u))
					return;
				let a = e.get(u);
				a.disconnected.has(f) && (a.disconnected.delete(f), a.length_d -= 1, o(u, a));
			}
		};
		function o(u, f) {
			f.length_c || f.length_d || (e.delete(u), i());
		}
		function r(u) {
			if (e.has(u))
				return e.get(u);
			let f = {
				connected: /* @__PURE__ */ new WeakSet(),
				length_c: 0,
				disconnected: /* @__PURE__ */ new WeakSet(),
				length_d: 0
			};
			return e.set(u, f), f;
		}
		function c() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function i() {
			!t || e.size || (t = !1, n.disconnect());
		}
		function s() {
			return new Promise(function(u) {
				(requestIdleCallback || requestAnimationFrame)(u);
			});
		}
		async function d(u) {
			e.size > 30 && await s();
			let f = [];
			if (!(u instanceof Node))
				return f;
			for (let a of e.keys())
				a === u || !(a instanceof Node) || u.contains(a) && f.push(a);
			return f;
		}
		function m(u, f) {
			let a = !1;
			for (let h of u) {
				if (f && d(h).then(m), !e.has(h))
					continue;
				let w = e.get(h);
				w.length_c && (h.dispatchEvent(new Event("dde:connected")), w.connected = /* @__PURE__ */ new WeakSet(), w.length_c = 0, w.length_d || e.delete(h), a = !0);
			}
			return a;
		}
		function v(u, f) {
			let a = !1;
			for (let h of u)
				f && d(h).then(v), !(!e.has(h) || !e.get(h).length_d) && (h.dispatchEvent(new Event("dde:disconnected")), e.delete(h), a = !0);
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
	var L = [], g = /* @__PURE__ */ new WeakMap();
	function p(e, t) {
		if (typeof e != "function")
			return k(e, t);
		if (C(e))
			return e;
		let n = k(), o = function() {
			L.push(o), n(e()), L.pop();
		};
		return g.set(o, /* @__PURE__ */ new Set([n])), g.set(n[l], o), o(), n;
	}
	p.action = function(e, t, ...n) {
		let o = e[l], { actions: r } = o;
		if (!r || !Reflect.has(r, t))
			throw new Error(`'${e}' has no action with name '${t}'!`);
		if (r[t].apply(o, n), o.skip)
			return Reflect.deleteProperty(o, "skip");
		o.listeners.forEach((c) => c(o.value));
	};
	p.on = function e(t, n, o = {}) {
		let { signal: r } = o;
		if (!(r && r.aborted)) {
			if (Array.isArray(t))
				return t.forEach((c) => e(c, n, o));
			j(t, n), r && r.addEventListener("abort", () => N(t, n));
		}
	};
	p.symbols = {
		signal: l,
		onclear: Symbol.for("Signal.onclear")
	};
	p.attribute = function(e, t = void 0) {
		let { host: n } = b, o = n() && n().hasAttribute(e) ? n().getAttribute(e) : t, r = new AbortController(), c = p(o, {
			[p.symbols.onclear]() {
				r.abort();
			}
		});
		return b.host(_.attributeChanged(function({ detail: s }) {
			let [d, m] = s;
			d === e && c(m);
		}, { signal: r.signal })), c;
	};
	p.clear = function(...e) {
		for (let n of e) {
			Reflect.deleteProperty(n, "toJSON");
			let o = n[l];
			o.onclear.forEach((r) => r.call(o)), t(n, o), Reflect.deleteProperty(n, l);
		}
		function t(n, o) {
			o.listeners.forEach((r) => {
				if (o.listeners.delete(r), !g.has(r))
					return;
				let c = g.get(r);
				c.delete(n), !(c.size > 1) && (p.clear(...c), g.delete(r));
			});
		}
	};
	p.el = function(e, t) {
		let n = document.createComment("<#reactive>"), o = document.createComment("</#reactive>"), r = document.createDocumentFragment();
		r.append(n, o);
		let c = (i) => {
			if (!n.parentNode || !o.parentNode)
				return N(e, c);
			let s = t(i);
			Array.isArray(s) || (s = [s]);
			let d = n;
			for (; (d = n.nextSibling) !== o; )
				d.remove();
			n.after(...s);
		};
		return j(e, c), G(e, c, n, t), c(e()), r;
	};
	var B = {
		isSignal: C,
		processReactiveAttribute(e, t, n, o) {
			if (!C(n))
				return n;
			let r = (c) => o([t, c]);
			return j(n, r), G(n, r, e, t), n();
		}
	};
	function G(e, t, ...n) {
		let { current: o } = b;
		if (o.prevent)
			return;
		let r = "__dde_reactive";
		o.host(function(c) {
			c[r] || (c[r] = [], _.disconnected(
				() => (
					/*!
					* Clears all signals listeners added in the current scope/host (`S.el`, `assign`, …?).
					* You can investigate the `__dde_reactive` key of the element.
					* */
					c[r].forEach(([i]) => N(...i, e[l]?.host() === c))
				)
			)(c)), c[r].push([[e, t], ...n]);
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
		let { onclear: r } = p.symbols;
		n[r] && (o.push(n[r]), Reflect.deleteProperty(n, r));
		let { host: c } = b;
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
		return o && n.add(o), g.has(o) && g.get(o).add(e), t;
	}
	function te(e, t, n) {
		if (!e[l])
			return;
		let o = e[l];
		if (!(!n && o.value === t))
			return o.value = t, o.listeners.forEach((r) => r(t)), t;
	}
	function j(e, t) {
		if (e[l])
			return e[l].listeners.add(t);
	}
	function N(e, t, n) {
		let o = e[l];
		if (!o)
			return;
		let r = o.listeners.delete(t);
		if (n && !o.listeners.size) {
			if (p.clear(e), !g.has(o))
				return r;
			let c = g.get(o);
			if (!g.has(c))
				return r;
			g.get(c).forEach((i) => N(i, c, !0));
		}
		return r;
	}
	
	// signals.js
	D(B);
	
	globalThis.dde= {
		S: p,
		assign: O,
		classListDeclarative: J,
		createElement: ie,
		dispatchEvent: le,
		el: ie,
		empty: fe,
		isSignal: C,
		on: _,
		registerReactivity: D,
		scope: b
	};
	
})();