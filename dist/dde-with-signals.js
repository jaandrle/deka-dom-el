//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var w = {
		isSignal(e) {
			return !1;
		},
		processReactiveAttribute(e, t, n, r) {
			return n;
		}
	};
	function A(e, t = !0) {
		return t ? Object.assign(w, e) : (Object.setPrototypeOf(e, w), e);
	}
	function S(e) {
		return w.isPrototypeOf(e) && e !== w ? e : w;
	}
	
	// src/helpers.js
	function m(e) {
		return typeof e > "u";
	}
	function D(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	function C(e, t) {
		if (!e || !(e instanceof AbortSignal))
			return !0;
		if (!e.aborted)
			return e.addEventListener("abort", t), function() {
				e.removeEventListener("abort", t);
			};
	}
	
	// src/dom-common.js
	var P = { setDeleteAttr: q };
	function q(e, t, n) {
		if (Reflect.set(e, t, n), !!m(n)) {
			if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
				return e.removeAttribute(t);
			if (Reflect.get(e, t) === "undefined")
				return Reflect.set(e, t, "");
		}
	}
	
	// src/dom.js
	var b = "html", F = {
		elNamespace(e) {
			return b = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
				append(...t) {
					return b = "html", t.length === 1 ? t[0] : document.createDocumentFragment().append(...t);
				}
			};
		},
		get namespace() {
			return b;
		},
		set namespace(e) {
			return b = e;
		}
	}, ce = Object.assign((e) => e ? e(document.body) : document.body, F);
	function ie(e, t, ...n) {
		let r = this, o = S(this), c;
		switch ((Object(t) !== t || o.isSignal(t)) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				let l = Object.assign((u) => u ? (n.unshift(u), void 0) : c, F);
				c = e(t || void 0, l), b = "html";
				break;
			}
			case e === "#text":
				c = y.call(r, document.createTextNode(""), t);
				break;
			case e === "<>":
				c = y.call(r, document.createDocumentFragment(), t);
				break;
			case b !== "html":
				c = y.call(r, document.createElementNS(b, e), t);
				break;
			case !c:
				c = y.call(r, document.createElement(e), t);
		}
		return n.forEach((l) => l(c)), c;
	}
	var { setDeleteAttr: j } = P;
	function y(e, ...t) {
		let n = this, r = S(this);
		if (!t.length)
			return e;
		let c = (e instanceof SVGElement ? I : H).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function l([u, a]) {
			a = r.processReactiveAttribute(e, u, a, l);
			let [v] = u;
			if (v === "=")
				return c(u.slice(1), a);
			if (v === ".")
				return W(e, u.slice(1), a);
			if (/(aria|data)([A-Z])/.test(u))
				return u = u.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), c(u, a);
			switch (u === "className" && (u = "class"), u) {
				case "xlink:href":
					return c(u, a, "http://www.w3.org/1999/xlink");
				case "textContent":
					return j(e, u, a);
				case "style":
					if (typeof a != "object")
						break;
				case "dataset":
					return L(r, a, W.bind(null, e[u]));
				case "ariaset":
					return L(r, a, (x, i) => c("aria-" + x, i));
				case "classList":
					return B.call(n, e, a);
			}
			return G(e, u) ? j(e, u, a) : c(u, a);
		}), e;
	}
	function B(e, t) {
		let n = S(this);
		return L(
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
		let n = M(e, t);
		return !m(n.set);
	}
	function M(e, t) {
		if (e = Object.getPrototypeOf(e), !e)
			return {};
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n || M(e, t);
	}
	function L(e, t, n) {
		if (!(typeof t != "object" || t === null))
			return Object.entries(t).forEach(function([o, c]) {
				o && (c = e.processReactiveAttribute(t, o, c, (l) => n(...l)), n(o, c));
			});
	}
	function z(e) {
		return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
	}
	function H(e, t, n, r) {
		return e[(m(r) ? "remove" : "set") + t](n, z(r));
	}
	function I(e, t, n, r, o = null) {
		return e[(m(r) ? "remove" : "set") + t + "NS"](o, n, z(r));
	}
	function W(e, t, n) {
		if (Reflect.set(e, t, n), !!m(n))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function de(e, t, ...n) {
		let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
		return e.dispatchEvent(r);
	}
	function T(e, t, n) {
		return function(o) {
			return o.addEventListener(e, t, n), o;
		};
	}
	var O = J();
	T.connected = function(e, t) {
		return typeof t != "object" && (t = {}), t.once = !0, function(r) {
			return r.addEventListener("dde:connected", e, t), typeof r.connectedCallback == "function" ? r : r.isConnected ? (r.dispatchEvent(new Event("dde:connected")), r) : (C(t.signal, () => O.offConnected(r, e)) && O.onConnected(r, e), r);
		};
	};
	T.disconnected = function(e, t) {
		return typeof t != "object" && (t = {}), t.once = !0, function(r) {
			return r.addEventListener("dde:disconnected", e, t), typeof r.disconnectedCallback == "function" || C(t.signal, () => O.offDisconnected(r, e)) && O.onDisconnected(r, e), r;
		};
	};
	function J() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(i) {
			for (let s of i)
				if (s.type === "childList") {
					if (v(s.addedNodes, !0)) {
						l();
						continue;
					}
					x(s.removedNodes, !0) && l();
				}
		});
		return {
			onConnected(i, s) {
				c();
				let f = o(i);
				f.connected.has(s) || (f.connected.add(s), f.length_c += 1);
			},
			offConnected(i, s) {
				if (!e.has(i))
					return;
				let f = e.get(i);
				f.connected.has(s) && (f.connected.delete(s), f.length_c -= 1, r(i, f));
			},
			onDisconnected(i, s) {
				c();
				let f = o(i);
				f.disconnected.has(s) || (f.disconnected.add(s), f.length_d += 1);
			},
			offDisconnected(i, s) {
				if (!e.has(i))
					return;
				let f = e.get(i);
				f.disconnected.has(s) && (f.disconnected.delete(s), f.length_d -= 1, r(i, f));
			}
		};
		function r(i, s) {
			s.length_c || s.length_d || (e.delete(i), l());
		}
		function o(i) {
			if (e.has(i))
				return e.get(i);
			let s = {
				connected: /* @__PURE__ */ new WeakSet(),
				length_c: 0,
				disconnected: /* @__PURE__ */ new WeakSet(),
				length_d: 0
			};
			return e.set(i, s), s;
		}
		function c() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function l() {
			!t || e.size || (t = !1, n.disconnect());
		}
		function u() {
			return new Promise(function(i) {
				(requestIdleCallback || requestAnimationFrame)(i);
			});
		}
		async function a(i) {
			e.size > 30 && await u();
			let s = [];
			if (!(i instanceof Node))
				return s;
			for (let f of e.keys())
				f === i || !(f instanceof Node) || i.contains(f) && s.push(f);
			return s;
		}
		function v(i, s) {
			let f = !1;
			for (let p of i) {
				if (s && a(p).then(v), !e.has(p))
					continue;
				let E = e.get(p);
				E.length_c && (p.dispatchEvent(new Event("dde:connected")), E.connected = /* @__PURE__ */ new WeakSet(), E.length_c = 0, E.length_d || e.delete(p), f = !0);
			}
			return f;
		}
		function x(i, s) {
			let f = !1;
			for (let p of i)
				s && a(p).then(x), !(!e.has(p) || !e.get(p).length_d) && (p.dispatchEvent(new Event("dde:disconnected")), e.delete(p), f = !0);
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
	var d = Symbol.for("Signal");
	function _(e) {
		try {
			return Reflect.has(e, d);
		} catch {
			return !1;
		}
	}
	var h = /* @__PURE__ */ new WeakMap();
	function g(e, t) {
		if (typeof e != "function")
			return U(e, t);
		if (_(e))
			return e;
		let n = U(""), r = () => n(e());
		return h.set(r, /* @__PURE__ */ new Set([n])), K(r), n;
	}
	g.action = function(e, t, ...n) {
		let r = e[d], { actions: o } = r;
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
			N(t, n), o && o.addEventListener("abort", () => k(t, n));
		}
	};
	g.symbols = {
		signal: d,
		onclear: Symbol.for("Signal.onclear")
	};
	g.clear = function(...e) {
		for (let n of e) {
			Reflect.deleteProperty(n, "toJSON");
			let r = n[d], { onclear: o } = g.symbols;
			r.actions && r.actions[o] && r.actions[o].call(r), t(n, r), Reflect.deleteProperty(n, d);
		}
		function t(n, r) {
			r.listeners.forEach((o) => {
				if (r.listeners.delete(o), !h.has(o))
					return;
				let c = h.get(o);
				c.delete(n), !(c.size > 1) && (g.clear(...c), h.delete(o));
			});
		}
	};
	g.el = function(e, t) {
		let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
		o.append(n, r);
		let c = (l) => {
			if (!n.parentNode || !r.parentNode)
				return k(e, c);
			let u = t(l);
			Array.isArray(u) || (u = [u]);
			let a = n;
			for (; (a = n.nextSibling) !== r; )
				a.remove();
			n.after(...u);
		};
		return N(e, c), c(e()), o;
	};
	var $ = {
		isSignal: _,
		processReactiveAttribute(e, t, n, r) {
			return _(n) ? (N(n, (o) => r([t, o])), n()) : n;
		}
	};
	function U(e, t) {
		let n = (...r) => r.length ? Y(n, r[0]) : X(n);
		return Z(n, e, t);
	}
	var V = Object.assign(/* @__PURE__ */ Object.create(null), {
		stopPropagation() {
			this.skip = !0;
		}
	});
	function Z(e, t, n) {
		return D(n) !== "[object Object]" && (n = {}), e[d] = {
			value: t,
			actions: n,
			listeners: /* @__PURE__ */ new Set()
		}, e.toJSON = () => e(), Object.setPrototypeOf(e[d], V), e;
	}
	var R = [];
	function K(e) {
		let t = function() {
			R.push(t), e(), R.pop();
		};
		h.has(e) && (h.set(t, h.get(e)), h.delete(e)), t();
	}
	function Q() {
		return R[R.length - 1];
	}
	function X(e) {
		if (!e[d])
			return;
		let { value: t, listeners: n } = e[d], r = Q();
		return r && n.add(r), h.has(r) && h.get(r).add(e), t;
	}
	function Y(e, t) {
		if (!e[d])
			return;
		let n = e[d];
		if (n.value !== t)
			return n.value = t, n.listeners.forEach((r) => r(t)), t;
	}
	function N(e, t) {
		if (e[d])
			return e[d].listeners.add(t);
	}
	function k(e, t) {
		if (e[d])
			return e[d].listeners.delete(t);
	}
	
	// signals.js
	A($);
	
	globalThis.dde= {
		S: g,
		assign: y,
		classListDeclarative: B,
		createElement: ie,
		dispatchEvent: de,
		el: ie,
		empty: fe,
		isSignal: _,
		on: T,
		registerReactivity: A,
		scope: ce
	};
	
})();