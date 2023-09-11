//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/helpers.js
	function m(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	function j(e, t) {
		if (!e || !(e instanceof AbortSignal))
			return !0;
		if (!e.aborted)
			return e.addEventListener("abort", t), function() {
				e.removeEventListener("abort", t);
			};
	}
	
	// src/signals-common.js
	var b = {
		isTextContent(e) {
			return m(e) !== "[object Object]";
		},
		processReactiveAttribute(e, t, r, n) {
			return r;
		}
	};
	function N(e, t = !0) {
		return t ? Object.assign(b, e) : (Object.setPrototypeOf(e, b), e);
	}
	function A(e) {
		return b.isPrototypeOf(e) && e !== b ? e : b;
	}
	
	// src/dom.js
	var O = "html";
	function te(e) {
		return O = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(t) {
				return O = "html", t;
			}
		};
	}
	function ne(e, t, ...r) {
		let n = A(this), o;
		switch (n.isTextContent(t) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				o = e(t || void 0, (i) => i ? (r.unshift(i), void 0) : o);
				break;
			}
			case e === "#text":
				o = w(document.createTextNode(""), t);
				break;
			case e === "<>":
				o = w(document.createDocumentFragment(), t);
				break;
			case O !== "html":
				o = w(document.createElementNS(O, e), t);
				break;
			case !o:
				o = w(document.createElement(e), t);
		}
		return r.forEach((a) => a(o)), o;
	}
	var x = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
	function w(e, ...t) {
		let r = A(this);
		if (!t.length)
			return e;
		let n = e instanceof SVGElement, o = (n ? J : T).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([i, s]) {
			s = r.processReactiveAttribute(e, i, s, a);
			let [h] = i;
			if (h === "=")
				return o(i.slice(1), s);
			if (h === ".")
				return _(e, i.slice(1), s);
			if (typeof s == "object")
				switch (i) {
					case "style":
						return y(s, T.bind(null, e.style, "Property"));
					case "dataset":
						return y(s, _.bind(null, e.dataset));
					case "ariaset":
						return y(s, (E, v) => o("aria-" + E, v));
					case "classList":
						return $(e, s);
					default:
						return Reflect.set(e, i, s);
				}
			if (/(aria|data)([A-Z])/.test(i))
				return i = i.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(i, s);
			switch (i) {
				case "href":
					return o(i, s);
				case "xlink:href":
					return o(i, s, "http://www.w3.org/1999/xlink");
				case "textContent":
					if (!n)
						break;
					return e.appendChild(document.createTextNode(s));
			}
			return q(e, i) ? _(e, i, s) : o(i, s);
		}), e;
	}
	function $(e, t) {
		return typeof t != "object" || y(
			t,
			(r, n) => e.classList.toggle(r, n === -1 ? void 0 : !!n)
		), e;
	}
	function re(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function q(e, t) {
		let r = "HTMLElement," + t;
		if (e instanceof HTMLElement && x.has(r))
			return x.get(r);
		let n = e.nodeName + "," + t;
		if (x.has(n))
			return x.get(n);
		let [o, a, i] = M(e, t), s = !P(o.set);
		return (!s || a) && x.set(i === HTMLElement.prototype ? r : n, s), s;
	}
	function M(e, t, r = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return [{}, r, e];
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n ? [n, r, e] : M(e, t, r + 1);
	}
	function y(e, t) {
		return Object.entries(e).forEach(([r, n]) => t(r, n));
	}
	function P(e) {
		return typeof e > "u";
	}
	function T(e, t, r, n) {
		return e[(P(n) ? "remove" : "set") + t](r, n);
	}
	function J(e, t, r, n, o = null) {
		return e[(P(n) ? "remove" : "set") + t + "NS"](o, r, n);
	}
	function _(e, t, r) {
		return Reflect.set(e, t, r);
	}
	
	// src/events.js
	function ce(e, t, ...r) {
		let n = r.length ? new CustomEvent(t, { detail: r[0] }) : new Event(t);
		return e.dispatchEvent(n);
	}
	function H(e, t, r) {
		return function(o) {
			return o.addEventListener(e, t, r), o;
		};
	}
	var S = W();
	H.connected = function(e, t) {
		return function(n) {
			return typeof n.connectedCallback == "function" ? (n.addEventListener("dde:connected", e, t), n) : (j(t && t.signal, () => S.offConnected(n, e)) && (n.isConnected ? e(new Event("dde:connected")) : S.onConnected(n, e)), n);
		};
	};
	H.disconnected = function(e, t) {
		return function(n) {
			return typeof n.disconnectedCallback == "function" ? (n.addEventListener("dde:disconnected", e, t), n) : (j(t && t.signal, () => S.offDisconnected(n, e)) && S.onDisconnected(n, e), n);
		};
	};
	function W() {
		let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(c) {
			for (let f of c)
				if (f.type === "childList") {
					if (E(f.addedNodes, !0)) {
						i();
						continue;
					}
					v(f.removedNodes, !0) && i();
				}
		});
		return {
			onConnected(c, f) {
				a(), o(c).connected.push(f);
			},
			offConnected(c, f) {
				if (!e.has(c))
					return;
				let u = e.get(c), p = u.connected;
				p.splice(p.indexOf(f), 1), n(c, u);
			},
			onDisconnected(c, f) {
				a(), o(c).disconnected.push(f);
			},
			offDisconnected(c, f) {
				if (!e.has(c))
					return;
				let u = e.get(c), p = u.disconnected;
				p.splice(p.indexOf(f), 1), n(c, u);
			}
		};
		function n(c, f) {
			f.connected.length || f.disconnected.length || (e.delete(c), i());
		}
		function o(c) {
			if (e.has(c))
				return e.get(c);
			let f = { connected: [], disconnected: [] };
			return e.set(c, f), f;
		}
		function a() {
			t || (t = !0, r.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function i() {
			!t || e.size || (t = !1, r.disconnect());
		}
		function s() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function h(c) {
			e.size > 30 && await s();
			let f = [];
			if (!(c instanceof Node))
				return f;
			for (let u of e.keys())
				u === c || !(u instanceof Node) || c.contains(u) && f.push(u);
			return f;
		}
		function E(c, f) {
			for (let u of c) {
				if (f && h(u).then(E), !e.has(u))
					continue;
				let p = e.get(u);
				return p.connected.forEach((R) => R(u)), p.connected.length = 0, p.disconnected.length || e.delete(u), !0;
			}
			return !1;
		}
		function v(c, f) {
			for (let u of c) {
				if (f && h(u).then(v), !e.has(u))
					continue;
				let p = e.get(u);
				return p.disconnected.forEach((R) => R(u)), p.connected.length = 0, p.disconnected.length = 0, e.delete(u), !0;
			}
			return !1;
		}
	}
	
	// index.js
	[HTMLElement, DocumentFragment].forEach((e) => {
		let { append: t } = e.prototype;
		e.prototype.append = function(...r) {
			return t.apply(this, r), this;
		};
	});
	
	// src/signals-lib.js
	var d = Symbol.for("Signal");
	function C(e) {
		try {
			return Reflect.has(e, d);
		} catch {
			return !1;
		}
	}
	var l = /* @__PURE__ */ new WeakMap();
	function g(e, t) {
		if (typeof e != "function")
			return k(e, t);
		if (C(e))
			return e;
		let r = k(""), n = () => r(e());
		return l.set(n, /* @__PURE__ */ new Set([r])), Z(n), r;
	}
	g.action = function(e, t, ...r) {
		let n = e[d], { actions: o } = n;
		if (!o || !Reflect.has(o, t))
			throw new Error(`'${e}' has no action with name '${t}'!`);
		if (o[t].apply(n, r), n.skip)
			return Reflect.deleteProperty(n, "skip");
		n.listeners.forEach((a) => a(n.value));
	};
	g.on = function e(t, r, n = {}) {
		let { signal: o } = n;
		if (!(o && o.aborted)) {
			if (Array.isArray(t))
				return t.forEach((a) => e(a, r, n));
			D(t, r), o && o.addEventListener("abort", () => F(t, r));
		}
	};
	g.symbols = {
		signal: d,
		onclear: Symbol.for("Signal.onclear")
	};
	g.clear = function(...e) {
		for (let r of e) {
			Reflect.deleteProperty(r, "toJSON");
			let n = r[d], { onclear: o } = g.symbols;
			n.actions && n.actions[o] && n.actions[o].call(n), t(r, n), Reflect.deleteProperty(r, d);
		}
		function t(r, n) {
			n.listeners.forEach((o) => {
				if (n.listeners.delete(o), !l.has(o))
					return;
				let a = l.get(o);
				a.delete(r), !(a.size > 1) && (g.clear(...a), l.delete(o));
			});
		}
	};
	g.el = function(e, t) {
		let r = document.createComment("<#reactive>"), n = document.createComment("</#reactive>"), o = document.createDocumentFragment();
		o.append(r, n);
		let a = (i) => {
			if (!r.parentNode || !n.parentNode)
				return F(e, a);
			let s = t(i);
			Array.isArray(s) || (s = [s]);
			let h = r;
			for (; (h = r.nextSibling) !== n; )
				h.remove();
			r.after(...s);
		};
		return D(e, a), a(e()), o;
	};
	var z = {
		isTextContent(e) {
			return m(e) === "string" || C(e) && m(K(e)) === "string";
		},
		processReactiveAttribute(e, t, r, n) {
			return C(r) ? (D(r, (o) => n([t, o])), r()) : r;
		}
	};
	function k(e, t) {
		let r = (...n) => n.length ? V(r, n[0]) : G(r);
		return U(r, e, t);
	}
	var I = Object.assign(/* @__PURE__ */ Object.create(null), {
		stopPropagation() {
			this.skip = !0;
		}
	});
	function U(e, t, r) {
		return m(r) !== "[object Object]" && (r = {}), e[d] = {
			value: t,
			actions: r,
			listeners: /* @__PURE__ */ new Set()
		}, e.toJSON = () => e(), Object.setPrototypeOf(e[d], I), e;
	}
	var L = [];
	function Z(e) {
		let t = function() {
			L.push(t), e(), L.pop();
		};
		l.has(e) && (l.set(t, l.get(e)), l.delete(e)), t();
	}
	function B() {
		return L[L.length - 1];
	}
	function G(e) {
		if (!e[d])
			return;
		let { value: t, listeners: r } = e[d], n = B();
		return n && r.add(n), l.has(n) && l.get(n).add(e), t;
	}
	function V(e, t) {
		if (!e[d])
			return;
		let r = e[d];
		if (r.value !== t)
			return r.value = t, r.listeners.forEach((n) => n(t)), t;
	}
	function K(e) {
		return e[d].value;
	}
	function D(e, t) {
		if (e[d])
			return e[d].listeners.add(t);
	}
	function F(e, t) {
		if (e[d])
			return e[d].listeners.delete(t);
	}
	
	// src/signals.js
	N(z);
	
	globalThis.dde= {
		S: g,
		assign: w,
		classListDeclarative: $,
		createElement: ne,
		dispatchEvent: ce,
		el: ne,
		empty: re,
		isSignal: C,
		namespace: te,
		on: H,
		registerReactivity: N
	};
	
})();