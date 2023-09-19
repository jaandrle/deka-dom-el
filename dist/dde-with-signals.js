//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var b = {
		isTextContent(e) {
			return typeof e == "string";
		},
		processReactiveAttribute(e, t, n, r) {
			return n;
		}
	};
	function _(e, t = !0) {
		return t ? Object.assign(b, e) : (Object.setPrototypeOf(e, b), e);
	}
	function N(e) {
		return b.isPrototypeOf(e) && e !== b ? e : b;
	}
	
	// src/helpers.js
	function m(e) {
		return typeof e > "u";
	}
	function w(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	function D(e, t) {
		if (!e || !(e instanceof AbortSignal))
			return !0;
		if (!e.aborted)
			return e.addEventListener("abort", t), function() {
				e.removeEventListener("abort", t);
			};
	}
	
	// src/dom-common.js
	var x = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]')), j = { setDeleteAttr: k };
	function k(e, t, n) {
		Reflect.set(e, t, n), m(n) && e.getAttribute(t) === "undefined" && e.removeAttribute(t);
	}
	
	// src/dom.js
	var S = "html";
	function ce(e) {
		return S = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(...t) {
				return S = "html", t.length === 1 ? t[0] : document.createDocumentFragment().append(...t);
			}
		};
	}
	function ie(e, t, ...n) {
		let r = N(this), o;
		switch (r.isTextContent(t) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				o = e(t || void 0, (s) => s ? (n.unshift(s), void 0) : o);
				break;
			}
			case e === "#text":
				o = y(document.createTextNode(""), t);
				break;
			case e === "<>":
				o = y(document.createDocumentFragment(), t);
				break;
			case S !== "html":
				o = y(document.createElementNS(S, e), t);
				break;
			case !o:
				o = y(document.createElement(e), t);
		}
		return n.forEach((a) => a(o)), o;
	}
	var { setDeleteAttr: q } = j;
	function y(e, ...t) {
		let n = N(this);
		if (!t.length)
			return e;
		let r = e instanceof SVGElement, o = (r ? I : T).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([s, i]) {
			i = n.processReactiveAttribute(e, s, i, a);
			let [h] = s;
			if (h === "=")
				return o(s.slice(1), i);
			if (h === ".")
				return M(e, s.slice(1), i);
			if (typeof i == "object" && i !== null)
				switch (s) {
					case "style":
						return O(i, T.bind(null, e.style, "Property"));
					case "dataset":
						return O(i, M.bind(null, e.dataset));
					case "ariaset":
						return O(i, (E, v) => o("aria-" + E, v));
					case "classList":
						return J(e, i);
					default:
						return Reflect.set(e, s, i);
				}
			if (/(aria|data)([A-Z])/.test(s))
				return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(s, i);
			switch (s) {
				case "href":
					return o(s, i);
				case "xlink:href":
					return o(s, i, "http://www.w3.org/1999/xlink");
				case "textContent":
					if (!r)
						break;
					return e.appendChild(document.createTextNode(i));
			}
			return W(e, s) ? q(e, s, i) : o(s, i);
		}), e;
	}
	function J(e, t) {
		return typeof t != "object" || O(
			t,
			(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
		), e;
	}
	function fe(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function W(e, t) {
		let n = "HTMLElement," + t;
		if (e instanceof HTMLElement && x.has(n))
			return x.get(n);
		let r = e.nodeName + "," + t;
		if (x.has(r))
			return x.get(r);
		let [o, a, s] = H(e, t), i = !m(o.set);
		return (!i || a) && x.set(s === HTMLElement.prototype ? n : r, i), i;
	}
	function H(e, t, n = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return [{}, n, e];
		let r = Object.getOwnPropertyDescriptor(e, t);
		return r ? [r, n, e] : H(e, t, n + 1);
	}
	function O(e, t) {
		return Object.entries(e).forEach(([n, r]) => n && t(n, r));
	}
	function T(e, t, n, r) {
		return e[(m(r) ? "remove" : "set") + t](n, r);
	}
	function I(e, t, n, r, o = null) {
		return e[(m(r) ? "remove" : "set") + t + "NS"](o, n, r);
	}
	function M(e, t, n) {
		if (Reflect.set(e, t, n), !!m(n))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function de(e, t, ...n) {
		let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
		return e.dispatchEvent(r);
	}
	function F(e, t, n) {
		return function(o) {
			return o.addEventListener(e, t, n), o;
		};
	}
	var C = Z();
	F.connected = function(e, t) {
		return function(r) {
			return typeof r.connectedCallback == "function" ? (r.addEventListener("dde:connected", e, t), r) : (D(t && t.signal, () => C.offConnected(r, e)) && (r.isConnected ? e(new Event("dde:connected")) : C.onConnected(r, e)), r);
		};
	};
	F.disconnected = function(e, t) {
		return function(r) {
			return typeof r.disconnectedCallback == "function" ? (r.addEventListener("dde:disconnected", e, t), r) : (D(t && t.signal, () => C.offDisconnected(r, e)) && C.onDisconnected(r, e), r);
		};
	};
	function Z() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
			for (let f of c)
				if (f.type === "childList") {
					if (E(f.addedNodes, !0)) {
						s();
						continue;
					}
					v(f.removedNodes, !0) && s();
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
				p.splice(p.indexOf(f), 1), r(c, u);
			},
			onDisconnected(c, f) {
				a(), o(c).disconnected.push(f);
			},
			offDisconnected(c, f) {
				if (!e.has(c))
					return;
				let u = e.get(c), p = u.disconnected;
				p.splice(p.indexOf(f), 1), r(c, u);
			}
		};
		function r(c, f) {
			f.connected.length || f.disconnected.length || (e.delete(c), s());
		}
		function o(c) {
			if (e.has(c))
				return e.get(c);
			let f = { connected: [], disconnected: [] };
			return e.set(c, f), f;
		}
		function a() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function s() {
			!t || e.size || (t = !1, n.disconnect());
		}
		function i() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function h(c) {
			e.size > 30 && await i();
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
				return p.connected.forEach((L) => L(u)), p.connected.length = 0, p.disconnected.length || e.delete(u), !0;
			}
			return !1;
		}
		function v(c, f) {
			for (let u of c) {
				if (f && h(u).then(v), !e.has(u))
					continue;
				let p = e.get(u);
				return p.disconnected.forEach((L) => L(u)), p.connected.length = 0, p.disconnected.length = 0, e.delete(u), !0;
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
	function R(e) {
		try {
			return Reflect.has(e, d);
		} catch {
			return !1;
		}
	}
	var l = /* @__PURE__ */ new WeakMap();
	function g(e, t) {
		if (typeof e != "function")
			return z(e, t);
		if (R(e))
			return e;
		let n = z(""), r = () => n(e());
		return l.set(r, /* @__PURE__ */ new Set([n])), V(r), n;
	}
	g.action = function(e, t, ...n) {
		let r = e[d], { actions: o } = r;
		if (!o || !Reflect.has(o, t))
			throw new Error(`'${e}' has no action with name '${t}'!`);
		if (o[t].apply(r, n), r.skip)
			return Reflect.deleteProperty(r, "skip");
		r.listeners.forEach((a) => a(r.value));
	};
	g.on = function e(t, n, r = {}) {
		let { signal: o } = r;
		if (!(o && o.aborted)) {
			if (Array.isArray(t))
				return t.forEach((a) => e(a, n, r));
			P(t, n), o && o.addEventListener("abort", () => $(t, n));
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
				if (r.listeners.delete(o), !l.has(o))
					return;
				let a = l.get(o);
				a.delete(n), !(a.size > 1) && (g.clear(...a), l.delete(o));
			});
		}
	};
	g.el = function(e, t) {
		let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
		o.append(n, r);
		let a = (s) => {
			if (!n.parentNode || !r.parentNode)
				return $(e, a);
			let i = t(s);
			Array.isArray(i) || (i = [i]);
			let h = n;
			for (; (h = n.nextSibling) !== r; )
				h.remove();
			n.after(...i);
		};
		return P(e, a), a(e()), o;
	};
	var U = {
		isTextContent(e) {
			return w(e) === "string" || R(e) && w(Y(e)) === "string";
		},
		processReactiveAttribute(e, t, n, r) {
			return R(n) ? (P(n, (o) => r([t, o])), n()) : n;
		}
	};
	function z(e, t) {
		let n = (...r) => r.length ? X(n, r[0]) : Q(n);
		return G(n, e, t);
	}
	var B = Object.assign(/* @__PURE__ */ Object.create(null), {
		stopPropagation() {
			this.skip = !0;
		}
	});
	function G(e, t, n) {
		return w(n) !== "[object Object]" && (n = {}), e[d] = {
			value: t,
			actions: n,
			listeners: /* @__PURE__ */ new Set()
		}, e.toJSON = () => e(), Object.setPrototypeOf(e[d], B), e;
	}
	var A = [];
	function V(e) {
		let t = function() {
			A.push(t), e(), A.pop();
		};
		l.has(e) && (l.set(t, l.get(e)), l.delete(e)), t();
	}
	function K() {
		return A[A.length - 1];
	}
	function Q(e) {
		if (!e[d])
			return;
		let { value: t, listeners: n } = e[d], r = K();
		return r && n.add(r), l.has(r) && l.get(r).add(e), t;
	}
	function X(e, t) {
		if (!e[d])
			return;
		let n = e[d];
		if (n.value !== t)
			return n.value = t, n.listeners.forEach((r) => r(t)), t;
	}
	function Y(e) {
		return e[d].value;
	}
	function P(e, t) {
		if (e[d])
			return e[d].listeners.add(t);
	}
	function $(e, t) {
		if (e[d])
			return e[d].listeners.delete(t);
	}
	
	// signals.js
	_(U);
	
	globalThis.dde= {
		S: g,
		assign: y,
		classListDeclarative: J,
		createElement: ie,
		dispatchEvent: de,
		el: ie,
		empty: fe,
		isSignal: R,
		namespace: ce,
		on: F,
		registerReactivity: _
	};
	
})();