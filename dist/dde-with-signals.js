//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/helpers.js
	function m(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	
	// src/signals-common.js
	var b = {
		isReactiveAtrribute(e, t) {
			return !1;
		},
		isTextContent(e) {
			return m(e) !== "[object Object]";
		},
		processReactiveAttribute(e, t, r, n) {
			return !1;
		},
		reactiveElement(e, ...t) {
			return null;
		}
	};
	function L(e, t = !0) {
		return t ? Object.assign(b, e) : (Object.setPrototypeOf(e, b), e);
	}
	function j(e) {
		return b.isPrototypeOf(e) && e !== b ? e : b;
	}
	
	// src/dom.js
	var w = "html";
	function ee(e) {
		return w = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(t) {
				return w = "html", t;
			}
		};
	}
	function te(e, t, ...r) {
		let n = j(this), o;
		if (e === "<>") {
			if (n.isReactiveAtrribute(t))
				return n.reactiveElement(t, ...r);
			o = document.createDocumentFragment();
		}
		switch (n.isTextContent(t) && (t = { textContent: t }), !0) {
			case typeof e == "function":
				o = e(t || void 0);
				break;
			case e === "#text":
				o = A(document.createTextNode(""), t);
				break;
			case w !== "html":
				o = A(document.createElementNS(w, e), t);
				break;
			case !o:
				o = A(document.createElement(e), t);
		}
		return r.forEach((a) => a(o)), o;
	}
	var x = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
	function A(e, ...t) {
		let r = j(this);
		if (!t.length)
			return e;
		let n = e instanceof SVGElement, o = (n ? q : P).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([f, s]) {
			r.isReactiveAtrribute(s, f) && (s = r.processReactiveAttribute(e, f, s, a));
			let [h] = f;
			if (h === "=")
				return o(f.slice(1), s);
			if (h === ".")
				return N(e, f.slice(1), s);
			if (typeof s == "object")
				switch (f) {
					case "style":
						return y(s, P.bind(null, e.style, "Property"));
					case "dataset":
						return y(s, N.bind(null, e.dataset));
					case "ariaset":
						return y(s, (E, v) => o("aria-" + E, v));
					case "classList":
						return F(e, s);
					default:
						return Reflect.set(e, f, s);
				}
			if (/(aria|data)([A-Z])/.test(f))
				return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(f, s);
			switch (f) {
				case "xlink:href":
					return o(f, s, "http://www.w3.org/1999/xlink");
				case "textContent":
					if (!n)
						break;
					return e.appendChild(document.createTextNode(s));
			}
			return $(e, f) ? N(e, f, s) : o(f, s);
		}), e;
	}
	function F(e, t) {
		return typeof t != "object" || y(
			t,
			(r, n) => e.classList.toggle(r, n === -1 ? void 0 : !!n)
		), e;
	}
	function ne(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function $(e, t) {
		let r = "HTMLElement," + t;
		if (e instanceof HTMLElement && x.has(r))
			return x.get(r);
		let n = e.nodeName + "," + t;
		if (x.has(n))
			return x.get(n);
		let [o, a, f] = T(e, t), s = !_(o.set);
		return (!s || a) && x.set(f === HTMLElement.prototype ? r : n, s), s;
	}
	function T(e, t, r = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return [{}, r, e];
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n ? [n, r, e] : T(e, t, r + 1);
	}
	function y(e, t) {
		return Object.entries(e).forEach(([r, n]) => t(r, n));
	}
	function _(e) {
		return typeof e > "u";
	}
	function P(e, t, r, n) {
		return e[(_(n) ? "remove" : "set") + t](r, n);
	}
	function q(e, t, r, n, o = null) {
		return e[(_(n) ? "remove" : "set") + t + "NS"](o, r, n);
	}
	function N(e, t, r) {
		return Reflect.set(e, t, r);
	}
	
	// src/events.js
	function M(e, t, r) {
		return (n) => (n.addEventListener(e, t, r), n);
	}
	var O = W();
	M.connected = function(e, t) {
		return function(n) {
			O.onConnected(n, e), t && t.signal && t.signal.addEventListener("abort", () => O.offConnected(n, e));
		};
	};
	M.disconnected = function(e, t) {
		return function(n) {
			O.onDisconnected(n, e), t && t.signal && t.signal.addEventListener("abort", () => O.offDisconnected(n, e));
		};
	};
	function W() {
		let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(c) {
			for (let i of c)
				if (i.type === "childList") {
					if (E(i.addedNodes, !0)) {
						f();
						continue;
					}
					v(i.removedNodes, !0) && f();
				}
		});
		return {
			onConnected(c, i) {
				a(), o(c).connected.push(i);
			},
			offConnected(c, i) {
				if (!e.has(c))
					return;
				let u = e.get(c), l = u.connected;
				l.splice(l.indexOf(i), 1), n(c, u);
			},
			onDisconnected(c, i) {
				a(), o(c).disconnected.push(i);
			},
			offDisconnected(c, i) {
				if (!e.has(c))
					return;
				let u = e.get(c), l = u.disconnected;
				l.splice(l.indexOf(i), 1), n(c, u);
			}
		};
		function n(c, i) {
			i.connected.length || i.disconnect.length || (e.delete(c), f());
		}
		function o(c) {
			if (e.has(c))
				return e.get(c);
			let i = { connected: [], disconnected: [] };
			return e.set(c, i), i;
		}
		function a() {
			t || (t = !0, r.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function f() {
			!t || e.size || (t = !1, r.disconnect());
		}
		function s() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function h(c) {
			e.size > 30 && await s();
			let i = [];
			if (!(c instanceof Node))
				return i;
			for (let u of e.keys())
				u === c || !(u instanceof Node) || c.contains(u) && i.push(u);
			return i;
		}
		function E(c, i) {
			for (let u of c) {
				if (i && h(u).then(E), !e.has(u))
					return !1;
				let l = e.get(u);
				return l.connected.forEach((C) => C(u)), l.connected.length = 0, l.disconnected.length || e.delete(u), !0;
			}
		}
		function v(c, i) {
			for (let u of c) {
				if (i && h(u).then(v), !e.has(u))
					return !1;
				let l = e.get(u);
				return l.disconnected.forEach((C) => C(u)), l.connected.length = 0, l.disconnected.length = 0, e.delete(u), !0;
			}
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
	function R(e) {
		try {
			return Reflect.has(e, d);
		} catch {
			return !1;
		}
	}
	var p = /* @__PURE__ */ new WeakMap();
	function g(e, t) {
		if (typeof e != "function")
			return H(e, t);
		if (R(e))
			return e;
		let r = H(""), n = () => r(e());
		return p.set(n, /* @__PURE__ */ new Set([r])), B(n), r;
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
			D(t, r), o && o.addEventListener("abort", () => z(t, r));
		}
	};
	g.symbols = {
		signal: d,
		onclear: Symbol.for("Signal.onclear")
	};
	g.clear = function(...e) {
		for (let r of e) {
			let n = r[d], { onclear: o } = g.symbols;
			n.actions && n.actions[o] && n.actions[o].call(n), t(r, n), Reflect.deleteProperty(r, d);
		}
		function t(r, n) {
			n.listeners.forEach((o) => {
				if (n.listeners.delete(o), !p.has(o))
					return;
				let a = p.get(o);
				a.delete(r), !(a.size > 1) && (g.clear(...a), p.delete(o));
			});
		}
	};
	var k = {
		isReactiveAtrribute(e, t) {
			return R(e);
		},
		isTextContent(e) {
			return m(e) === "string" || R(e) && m(V(e)) === "string";
		},
		processReactiveAttribute(e, t, r, n) {
			return D(r, (o) => n([t, o])), r();
		},
		reactiveElement(e, t) {
			let r = document.createComment("<#reactive>"), n = document.createComment("</#reactive>"), o = document.createDocumentFragment();
			o.append(r, n);
			let a = (f) => {
				if (!r.parentNode || !n.parentNode)
					return z(e, a);
				let s = t(f);
				Array.isArray(s) || (s = [s]);
				let h = r;
				for (; (h = r.nextSibling) !== n; )
					h.remove();
				r.after(...s);
			};
			return D(e, a), a(e()), o;
		}
	};
	function H(e, t) {
		let r = (...n) => n.length ? U(r, n[0]) : J(r);
		return Z(r, e, t);
	}
	var I = Object.assign(/* @__PURE__ */ Object.create(null), {
		stopPropagation() {
			this.skip = !0;
		}
	});
	function Z(e, t, r) {
		return m(r) !== "[object Object]" && (r = {}), e[d] = {
			value: t,
			actions: r,
			listeners: /* @__PURE__ */ new Set()
		}, Object.setPrototypeOf(e[d], I), e;
	}
	var S = [];
	function B(e) {
		let t = function() {
			S.push(t), e(), S.pop();
		};
		p.has(e) && (p.set(t, p.get(e)), p.delete(e)), t();
	}
	function G() {
		return S[S.length - 1];
	}
	function J(e) {
		if (!e[d])
			return;
		let { value: t, listeners: r } = e[d], n = G();
		return n && r.add(n), p.has(n) && p.get(n).add(e), t;
	}
	function U(e, t) {
		if (!e[d])
			return;
		let r = e[d];
		if (r.value !== t)
			return r.value = t, r.listeners.forEach((n) => n(t)), t;
	}
	function V(e) {
		return e[d].value;
	}
	function D(e, t) {
		return e[d].listeners.add(t);
	}
	function z(e, t) {
		return e[d].listeners.delete(t);
	}
	
	// src/signals.js
	L(k);
	
	globalThis.dde= {
		S: g,
		assign: A,
		classListDeclartive: F,
		createElement: te,
		el: te,
		empty: ne,
		isSignal: R,
		namespace: ee,
		on: M,
		registerReactivity: L
	};
	
})();