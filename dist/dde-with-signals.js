//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var y = {
		isSignal(e) {
			return !1;
		},
		processReactiveAttribute(e, t, n, r) {
			return n;
		}
	};
	function N(e, t = !0) {
		return t ? Object.assign(y, e) : (Object.setPrototypeOf(e, y), e);
	}
	function _(e) {
		return y.isPrototypeOf(e) && e !== y ? e : y;
	}
	
	// src/helpers.js
	function v(e) {
		return typeof e > "u";
	}
	function j(e) {
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
	var W = { setDeleteAttr: H };
	function H(e, t, n) {
		if (Reflect.set(e, t, n), !!v(n)) {
			if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
				return e.removeAttribute(t);
			if (Reflect.get(e, t) === "undefined")
				return Reflect.set(e, t, "");
		}
	}
	
	// src/dom.js
	var S = [{ scope: document.body, namespace: "html", host: (e) => e ? e(document.body) : document.body }], M = (e) => e === "svg" ? "http://www.w3.org/2000/svg" : e, E = {
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
			return this.current.namespace = M(e);
		},
		elNamespace(e) {
			let t = this.namespace;
			return this.namespace = e, {
				append(...n) {
					return E.namespace = t, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
				}
			};
		},
		push(e = {}) {
			return e.namespace && (e.namespace = M(e.namespace)), S.push(Object.assign({}, this.current, e));
		},
		pop() {
			return S.pop();
		}
	};
	function ie(e, t, ...n) {
		let r = this, o = _(this), { namespace: c } = E, a;
		switch ((Object(t) !== t || o.isSignal(t)) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				E.push({ scope: e, host: (s) => s ? (n.unshift(s), void 0) : a }), a = e(t || void 0), E.pop();
				break;
			}
			case e === "#text":
				a = O.call(r, document.createTextNode(""), t);
				break;
			case e === "<>":
				a = O.call(r, document.createDocumentFragment(), t);
				break;
			case c !== "html":
				a = O.call(r, document.createElementNS(c, e), t);
				break;
			case !a:
				a = O.call(r, document.createElement(e), t);
		}
		return n.forEach((s) => s(a)), a;
	}
	var { setDeleteAttr: k } = W;
	function O(e, ...t) {
		let n = this, r = _(this);
		if (!t.length)
			return e;
		let c = (e instanceof SVGElement ? J : I).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([s, d]) {
			d = r.processReactiveAttribute(e, s, d, a);
			let [m] = s;
			if (m === "=")
				return c(s.slice(1), d);
			if (m === ".")
				return F(e, s.slice(1), d);
			if (/(aria|data)([A-Z])/.test(s))
				return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), c(s, d);
			switch (s === "className" && (s = "class"), s) {
				case "xlink:href":
					return c(s, d, "http://www.w3.org/1999/xlink");
				case "textContent":
					return k(e, s, d);
				case "style":
					if (typeof d != "object")
						break;
				case "dataset":
					return D(r, d, F.bind(null, e[s]));
				case "ariaset":
					return D(r, d, (b, i) => c("aria-" + b, i));
				case "classList":
					return B.call(n, e, d);
			}
			return G(e, s) ? k(e, s, d) : c(s, d);
		}), e;
	}
	function B(e, t) {
		let n = _(this);
		return D(
			n,
			t,
			(r, o) => e.classList.toggle(r, o === -1 ? void 0 : !!o)
		), e;
	}
	function fe(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function G(e, t) {
		if (!Reflect.has(e, t))
			return !1;
		let n = z(e, t);
		return !v(n.set);
	}
	function z(e, t) {
		if (e = Object.getPrototypeOf(e), !e)
			return {};
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n || z(e, t);
	}
	function D(e, t, n) {
		if (!(typeof t != "object" || t === null))
			return Object.entries(t).forEach(function([o, c]) {
				o && (c = e.processReactiveAttribute(t, o, c, (a) => n(...a)), n(o, c));
			});
	}
	function T(e) {
		return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
	}
	function I(e, t, n, r) {
		return e[(v(r) ? "remove" : "set") + t](n, T(r));
	}
	function J(e, t, n, r, o = null) {
		return e[(v(r) ? "remove" : "set") + t + "NS"](o, n, T(r));
	}
	function F(e, t, n) {
		if (Reflect.set(e, t, n), !!v(n))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function le(e, t, ...n) {
		let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
		return e.dispatchEvent(r);
	}
	function x(e, t, n) {
		return function(o) {
			return o.addEventListener(e, t, n), o;
		};
	}
	var R = Z(), V = /* @__PURE__ */ new WeakSet();
	x.connected = function(e, t) {
		let n = "connected";
		return typeof t != "object" && (t = {}), t.once = !0, function(o) {
			let c = "dde:" + n;
			return o.addEventListener(c, e, t), typeof o[n + "Callback"] == "function" ? o : o.isConnected ? (o.dispatchEvent(new Event(c)), o) : (A(t.signal, () => R.offConnected(o, e)) && R.onConnected(o, e), o);
		};
	};
	x.disconnected = function(e, t) {
		let n = "disconnected";
		return typeof t != "object" && (t = {}), t.once = !0, function(o) {
			let c = "dde:" + n;
			return o.addEventListener(c, e, t), typeof o[n + "Callback"] == "function" || A(t.signal, () => R.offDisconnected(o, e)) && R.onDisconnected(o, e), o;
		};
	};
	x.attributeChanged = function(e, t) {
		let n = "attributeChanged";
		return typeof t != "object" && (t = {}), function(o) {
			let c = "dde:" + n;
			if (o.addEventListener(c, e, t), typeof o[n + "Callback"] == "function" || V.has(o))
				return o;
			let a = new MutationObserver(function(d) {
				for (let { attributeName: m, target: b } of d)
					b.dispatchEvent(
						new CustomEvent(c, { detail: [m, b.getAttribute(m)] })
					);
			});
			return A(t.signal, () => a.disconnect()) && a.observe(o, { attributes: !0 }), o;
		};
	};
	function Z() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(i) {
			for (let u of i)
				if (u.type === "childList") {
					if (m(u.addedNodes, !0)) {
						a();
						continue;
					}
					b(u.removedNodes, !0) && a();
				}
		});
		return {
			onConnected(i, u) {
				c();
				let f = o(i);
				f.connected.has(u) || (f.connected.add(u), f.length_c += 1);
			},
			offConnected(i, u) {
				if (!e.has(i))
					return;
				let f = e.get(i);
				f.connected.has(u) && (f.connected.delete(u), f.length_c -= 1, r(i, f));
			},
			onDisconnected(i, u) {
				c();
				let f = o(i);
				f.disconnected.has(u) || (f.disconnected.add(u), f.length_d += 1);
			},
			offDisconnected(i, u) {
				if (!e.has(i))
					return;
				let f = e.get(i);
				f.disconnected.has(u) && (f.disconnected.delete(u), f.length_d -= 1, r(i, f));
			}
		};
		function r(i, u) {
			u.length_c || u.length_d || (e.delete(i), a());
		}
		function o(i) {
			if (e.has(i))
				return e.get(i);
			let u = {
				connected: /* @__PURE__ */ new WeakSet(),
				length_c: 0,
				disconnected: /* @__PURE__ */ new WeakSet(),
				length_d: 0
			};
			return e.set(i, u), u;
		}
		function c() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function a() {
			!t || e.size || (t = !1, n.disconnect());
		}
		function s() {
			return new Promise(function(i) {
				(requestIdleCallback || requestAnimationFrame)(i);
			});
		}
		async function d(i) {
			e.size > 30 && await s();
			let u = [];
			if (!(i instanceof Node))
				return u;
			for (let f of e.keys())
				f === i || !(f instanceof Node) || i.contains(f) && u.push(f);
			return u;
		}
		function m(i, u) {
			let f = !1;
			for (let p of i) {
				if (u && d(p).then(m), !e.has(p))
					continue;
				let w = e.get(p);
				w.length_c && (p.dispatchEvent(new Event("dde:connected")), w.connected = /* @__PURE__ */ new WeakSet(), w.length_c = 0, w.length_d || e.delete(p), f = !0);
			}
			return f;
		}
		function b(i, u) {
			let f = !1;
			for (let p of i)
				u && d(p).then(b), !(!e.has(p) || !e.get(p).length_d) && (p.dispatchEvent(new Event("dde:disconnected")), e.delete(p), f = !0);
			return f;
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
	var g = /* @__PURE__ */ new WeakMap();
	function h(e, t) {
		if (typeof e != "function")
			return U(e, t);
		if (C(e))
			return e;
		let n = U(""), r = () => n(e());
		return g.set(r, /* @__PURE__ */ new Set([n])), X(r), n;
	}
	h.action = function(e, t, ...n) {
		let r = e[l], { actions: o } = r;
		if (!o || !Reflect.has(o, t))
			throw new Error(`'${e}' has no action with name '${t}'!`);
		if (o[t].apply(r, n), r.skip)
			return Reflect.deleteProperty(r, "skip");
		r.listeners.forEach((c) => c(r.value));
	};
	h.on = function e(t, n, r = {}) {
		let { signal: o } = r;
		if (!(o && o.aborted)) {
			if (Array.isArray(t))
				return t.forEach((c) => e(c, n, r));
			P(t, n), o && o.addEventListener("abort", () => q(t, n));
		}
	};
	h.symbols = {
		signal: l,
		onclear: Symbol.for("Signal.onclear")
	};
	h.attribute = function(e, t = void 0) {
		let { host: n } = E, r = n() && n().hasAttribute(e) ? n().getAttribute(e) : t, o = new AbortController(), c = h(r, {
			[h.symbols.onclear]() {
				o.abort();
			}
		});
		return E.host(x.attributeChanged(function({ detail: a }) {
			let [s, d] = a;
			s === e && c(d);
		}, { signal: o.signal })), c;
	};
	h.clear = function(...e) {
		for (let n of e) {
			Reflect.deleteProperty(n, "toJSON");
			let r = n[l], { onclear: o } = h.symbols;
			r.actions && r.actions[o] && r.actions[o].call(r), t(n, r), Reflect.deleteProperty(n, l);
		}
		function t(n, r) {
			r.listeners.forEach((o) => {
				if (r.listeners.delete(o), !g.has(o))
					return;
				let c = g.get(o);
				c.delete(n), !(c.size > 1) && (h.clear(...c), g.delete(o));
			});
		}
	};
	h.el = function(e, t) {
		let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
		o.append(n, r);
		let c = (a) => {
			if (!n.parentNode || !r.parentNode)
				return q(e, c);
			let s = t(a);
			Array.isArray(s) || (s = [s]);
			let d = n;
			for (; (d = n.nextSibling) !== r; )
				d.remove();
			n.after(...s);
		};
		return P(e, c), c(e()), o;
	};
	var $ = {
		isSignal: C,
		processReactiveAttribute(e, t, n, r) {
			return C(n) ? (P(n, (o) => r([t, o])), n()) : n;
		}
	};
	function U(e, t) {
		let n = (...r) => r.length ? te(n, ...r) : ee(n);
		return Q(n, e, t);
	}
	var K = Object.assign(/* @__PURE__ */ Object.create(null), {
		stopPropagation() {
			this.skip = !0;
		}
	});
	function Q(e, t, n) {
		return j(n) !== "[object Object]" && (n = {}), e[l] = {
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
		g.has(e) && (g.set(t, g.get(e)), g.delete(e)), t();
	}
	function Y() {
		return L[L.length - 1];
	}
	function ee(e) {
		if (!e[l])
			return;
		let { value: t, listeners: n } = e[l], r = Y();
		return r && n.add(r), g.has(r) && g.get(r).add(e), t;
	}
	function te(e, t, n) {
		if (!e[l])
			return;
		let r = e[l];
		if (!(!n && r.value === t))
			return r.value = t, r.listeners.forEach((o) => o(t)), t;
	}
	function P(e, t) {
		if (e[l])
			return e[l].listeners.add(t);
	}
	function q(e, t) {
		if (e[l])
			return e[l].listeners.delete(t);
	}
	
	// signals.js
	N($);
	
	globalThis.dde= {
		S: h,
		assign: O,
		classListDeclarative: B,
		createElement: ie,
		dispatchEvent: le,
		el: ie,
		empty: fe,
		isSignal: C,
		on: x,
		registerReactivity: N,
		scope: E
	};
	
})();