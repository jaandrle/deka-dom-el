//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var x = {
		isSignal(e) {
			return !1;
		},
		processReactiveAttribute(e, t, n, r) {
			return n;
		}
	};
	function C(e, t = !0) {
		return t ? Object.assign(x, e) : (Object.setPrototypeOf(e, x), e);
	}
	function v(e) {
		return x.isPrototypeOf(e) && e !== x ? e : x;
	}
	
	// src/helpers.js
	function m(e) {
		return typeof e > "u";
	}
	function _(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	function L(e, t) {
		if (!e || !(e instanceof AbortSignal))
			return !0;
		if (!e.aborted)
			return e.addEventListener("abort", t), function() {
				e.removeEventListener("abort", t);
			};
	}
	
	// src/dom-common.js
	var P = { setDeleteAttr: W };
	function W(e, t, n) {
		if (Reflect.set(e, t, n), !!m(n)) {
			if (e instanceof HTMLElement && e.getAttribute(t) === "undefined")
				return e.removeAttribute(t);
			if (Reflect.get(e, t) === "undefined")
				return Reflect.set(e, t, "");
		}
	}
	
	// src/dom.js
	var S = "html";
	function oe(e) {
		return S = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(...t) {
				return S = "html", t.length === 1 ? t[0] : document.createDocumentFragment().append(...t);
			}
		};
	}
	function ce(e, t, ...n) {
		let r = v(this), o;
		switch ((Object(t) !== t || r.isSignal(t)) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				o = e(t || void 0, (p) => p ? (n.unshift(p), void 0) : o);
				break;
			}
			case e === "#text":
				o = w(document.createTextNode(""), t);
				break;
			case e === "<>":
				o = w(document.createDocumentFragment(), t);
				break;
			case S !== "html":
				o = w(document.createElementNS(S, e), t);
				break;
			case !o:
				o = w(document.createElement(e), t);
		}
		return n.forEach((i) => i(o)), o;
	}
	var { setDeleteAttr: j } = P;
	function w(e, ...t) {
		let n = this, r = v(this);
		if (!t.length)
			return e;
		let o = e instanceof SVGElement, i = (o ? J : I).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function p([f, a]) {
			a = r.processReactiveAttribute(e, f, a, p);
			let [b] = f;
			if (b === "=")
				return i(f.slice(1), a);
			if (b === ".")
				return T(e, f.slice(1), a);
			if (/(aria|data)([A-Z])/.test(f))
				return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), i(f, a);
			switch (f === "className" && (f = "class"), f) {
				case "href":
				case "src":
				case "class":
				case "xlink:href":
					return i(
						f,
						a,
						/* this applies only to SVG elements, see setRemove/setRemoveNS */
						"http://www.w3.org/1999/xlink"
					);
				case "textContent":
				case "innerText":
					return o ? e.appendChild(document.createTextNode(a)) : j(e, f, a);
				case "style":
				case "dataset":
					return N(r, a, T.bind(null, e[f]));
				case "ariaset":
					return N(r, a, (E, c) => i("aria-" + E, c));
				case "classList":
					return B.call(n, e, a);
			}
			return H(e, f) ? j(e, f, a) : i(f, a);
		}), e;
	}
	function B(e, t) {
		let n = v(this);
		return N(
			n,
			t,
			(r, o) => e.classList.toggle(r, o === -1 ? void 0 : !!o)
		), e;
	}
	function se(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function H(e, t) {
		if (!Reflect.has(e, t))
			return !1;
		let n = F(e, t);
		return !m(n.set);
	}
	function F(e, t, n = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return {};
		let r = Object.getOwnPropertyDescriptor(e, t);
		return r || F(e, t, n + 1);
	}
	function N(e, t, n) {
		if (typeof t == "object")
			return Object.entries(t).forEach(function([o, i]) {
				o && (i = e.processReactiveAttribute(t, o, i, (p) => n(...p)), n(o, i));
			});
	}
	function M(e) {
		return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
	}
	function I(e, t, n, r) {
		return e[(m(r) ? "remove" : "set") + t](n, M(r));
	}
	function J(e, t, n, r, o = null) {
		return e[(m(r) ? "remove" : "set") + t + "NS"](o, n, M(r));
	}
	function T(e, t, n) {
		if (Reflect.set(e, t, n), !!m(n))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function ae(e, t, ...n) {
		let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
		return e.dispatchEvent(r);
	}
	function z(e, t, n) {
		return function(o) {
			return o.addEventListener(e, t, n), o;
		};
	}
	var O = Z();
	z.connected = function(e, t) {
		return function(r) {
			return typeof r.connectedCallback == "function" ? (r.addEventListener("dde:connected", e, t), r) : (L(t && t.signal, () => O.offConnected(r, e)) && (r.isConnected ? e(new Event("dde:connected")) : O.onConnected(r, e)), r);
		};
	};
	z.disconnected = function(e, t) {
		return function(r) {
			return typeof r.disconnectedCallback == "function" ? (r.addEventListener("dde:disconnected", e, t), r) : (L(t && t.signal, () => O.offDisconnected(r, e)) && O.onDisconnected(r, e), r);
		};
	};
	function Z() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
			for (let s of c)
				if (s.type === "childList") {
					if (b(s.addedNodes, !0)) {
						p();
						continue;
					}
					E(s.removedNodes, !0) && p();
				}
		});
		return {
			onConnected(c, s) {
				i(), o(c).connected.push(s);
			},
			offConnected(c, s) {
				if (!e.has(c))
					return;
				let u = e.get(c), l = u.connected;
				l.splice(l.indexOf(s), 1), r(c, u);
			},
			onDisconnected(c, s) {
				i(), o(c).disconnected.push(s);
			},
			offDisconnected(c, s) {
				if (!e.has(c))
					return;
				let u = e.get(c), l = u.disconnected;
				l.splice(l.indexOf(s), 1), r(c, u);
			}
		};
		function r(c, s) {
			s.connected.length || s.disconnected.length || (e.delete(c), p());
		}
		function o(c) {
			if (e.has(c))
				return e.get(c);
			let s = { connected: [], disconnected: [] };
			return e.set(c, s), s;
		}
		function i() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function p() {
			!t || e.size || (t = !1, n.disconnect());
		}
		function f() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function a(c) {
			e.size > 30 && await f();
			let s = [];
			if (!(c instanceof Node))
				return s;
			for (let u of e.keys())
				u === c || !(u instanceof Node) || c.contains(u) && s.push(u);
			return s;
		}
		function b(c, s) {
			for (let u of c) {
				if (s && a(u).then(b), !e.has(u))
					continue;
				let l = e.get(u);
				return l.connected.forEach((y) => y(u)), l.connected.length = 0, l.disconnected.length || e.delete(u), !0;
			}
			return !1;
		}
		function E(c, s) {
			for (let u of c) {
				if (s && a(u).then(E), !e.has(u))
					continue;
				let l = e.get(u);
				return l.disconnected.forEach((y) => y(u)), l.connected.length = 0, l.disconnected.length = 0, e.delete(u), !0;
			}
			return !1;
		}
	}
	
	// index.js
	[HTMLElement, DocumentFragment].forEach((e) => {
		let { append: t } = e.prototype;
		e.prototype.append = function(...n) {
			return t.apply(this, n), this;
		};
	});
	
	// src/signals-lib.js
	var d = Symbol.for("Signal");
	function A(e) {
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
		if (A(e))
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
		r.listeners.forEach((i) => i(r.value));
	};
	g.on = function e(t, n, r = {}) {
		let { signal: o } = r;
		if (!(o && o.aborted)) {
			if (Array.isArray(t))
				return t.forEach((i) => e(i, n, r));
			D(t, n), o && o.addEventListener("abort", () => q(t, n));
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
				let i = h.get(o);
				i.delete(n), !(i.size > 1) && (g.clear(...i), h.delete(o));
			});
		}
	};
	g.el = function(e, t) {
		let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
		o.append(n, r);
		let i = (p) => {
			if (!n.parentNode || !r.parentNode)
				return q(e, i);
			let f = t(p);
			Array.isArray(f) || (f = [f]);
			let a = n;
			for (; (a = n.nextSibling) !== r; )
				a.remove();
			n.after(...f);
		};
		return D(e, i), i(e()), o;
	};
	var $ = {
		isSignal: A,
		processReactiveAttribute(e, t, n, r) {
			return A(n) ? (D(n, (o) => r([t, o])), n()) : n;
		}
	};
	function U(e, t) {
		let n = (...r) => r.length ? Y(n, r[0]) : X(n);
		return V(n, e, t);
	}
	var G = Object.assign(/* @__PURE__ */ Object.create(null), {
		stopPropagation() {
			this.skip = !0;
		}
	});
	function V(e, t, n) {
		return _(n) !== "[object Object]" && (n = {}), e[d] = {
			value: t,
			actions: n,
			listeners: /* @__PURE__ */ new Set()
		}, e.toJSON = () => e(), Object.setPrototypeOf(e[d], G), e;
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
	function D(e, t) {
		if (e[d])
			return e[d].listeners.add(t);
	}
	function q(e, t) {
		if (e[d])
			return e[d].listeners.delete(t);
	}
	
	// signals.js
	C($);
	
	globalThis.dde= {
		S: g,
		assign: w,
		classListDeclarative: B,
		createElement: ce,
		dispatchEvent: ae,
		el: ce,
		empty: se,
		isSignal: A,
		namespace: oe,
		on: z,
		registerReactivity: C
	};
	
})();