//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/helpers.js
	function h(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	
	// src/signals-common.js
	var m = {
		isReactiveAtrribute(e, t) {
			return !1;
		},
		isTextContent(e) {
			return h(e) !== "[object Object]";
		},
		processReactiveAttribute(e, t, n, r) {
			return !1;
		},
		reactiveElement(e, ...t) {
			return document.createDocumentFragment();
		}
	};
	function R(e, t = !0) {
		return t ? Object.assign(m, e) : (Object.setPrototypeOf(e, m), e);
	}
	function A(e) {
		return m.isPrototypeOf(e) && e !== m ? e : m;
	}
	
	// src/dom.js
	var E = "html";
	function K(e) {
		return E = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(t) {
				return E = "html", t;
			}
		};
	}
	function Q(e, t, ...n) {
		let r = A(this), o;
		if (e === "<>") {
			if (r.isReactiveAtrribute(t))
				return r.reactiveElement(t, ...n);
			o = document.createDocumentFragment();
		}
		switch (r.isTextContent(t) && (t = { textContent: t }), !0) {
			case typeof e == "function":
				o = e(t || void 0);
				break;
			case e === "#text":
				o = C(document.createTextNode(""), t);
				break;
			case E !== "html":
				o = C(document.createElementNS(E, e), t);
				break;
			default:
				o = C(document.createElement(e), t);
		}
		return n.forEach((l) => l(o)), o;
	}
	function C(e, ...t) {
		let n = A(this);
		if (!t.length)
			return e;
		let r = e instanceof SVGElement, o = (r ? z : D).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function l([s, f]) {
			if (n.isReactiveAtrribute(f, s) && (f = n.processReactiveAttribute(el, s, f, l)), s[0] === "=")
				return o(s.slice(1), f);
			if (s[0] === ".")
				return S(e, s.slice(1), f);
			if (typeof f == "object")
				switch (s) {
					case "style":
						return v(f, D.bind(null, e.style, "Property"));
					case "dataset":
						return v(f, S.bind(null, e.dataset));
					case "ariaset":
						return v(f, (p, b) => o("aria-" + p, b));
					case "classList":
						return q(e, f);
					default:
						return Reflect.set(e, s, f);
				}
			if (/(aria|data)([A-Z])/.test(s))
				return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(s, f);
			switch (s) {
				case "href":
					return o(s, f);
				case "xlink:href":
					return o(s, f, "http://www.w3.org/1999/xlink");
				case "textContent":
					if (!r)
						break;
					return e.appendChild(document.createTextNode(f));
			}
			return s in e && !r ? S(e, s, f) : o(s, f);
		}), e;
	}
	function q(e, t) {
		return typeof t != "object" || v(
			t,
			(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
		), e;
	}
	function X(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function v(e, t) {
		return Object.entries(e).forEach(([n, r]) => t(n, r));
	}
	function j(e) {
		return typeof e > "u";
	}
	function D(e, t, n, r) {
		return e[(j(r) ? "remove" : "set") + t](n, r);
	}
	function z(e, t, n, r, o = null) {
		return e[(j(r) ? "remove" : "set") + t + "NS"](o, n, r);
	}
	function S(e, t, n) {
		return Reflect[j(n) ? "deleteProperty" : "set"](e, t, n);
	}
	
	// src/events.js
	function _(e, t, n) {
		return (r) => (r.addEventListener(e, t, n), r);
	}
	var w = M();
	_.connected = function(e, t) {
		return function(r) {
			w.onConnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => w.offConnected(r, e));
		};
	};
	_.disconnected = function(e, t) {
		return function(r) {
			w.onDisconnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => w.offDisconnected(r, e));
		};
	};
	function M() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
			for (let i of c)
				if (i.type === "childList") {
					if (b(i.addedNodes, !0)) {
						s();
						continue;
					}
					N(i.removedNodes, !0) && s();
				}
		});
		return {
			onConnected(c, i) {
				l(), o(c).connected.push(i);
			},
			offConnected(c, i) {
				if (!e.has(c))
					return;
				let u = e.get(c), a = u.connected;
				a.splice(a.indexOf(i), 1), r(c, u);
			},
			onDisconnected(c, i) {
				l(), o(c).disconnected.push(i);
			},
			offDisconnected(c, i) {
				if (!e.has(c))
					return;
				let u = e.get(c), a = u.disconnected;
				a.splice(a.indexOf(i), 1), r(c, u);
			}
		};
		function r(c, i) {
			i.connected.length || i.disconnect.length || (e.delete(c), s());
		}
		function o(c) {
			if (e.has(c))
				return e.get(c);
			let i = { connected: [], disconnected: [] };
			return e.set(c, i), i;
		}
		function l() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function s() {
			!t || e.size || (t = !1, n.disconnect());
		}
		function f() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function p(c) {
			e.size > 30 && await f();
			let i = [];
			if (!(c instanceof Node))
				return i;
			for (let u of e.keys())
				u === c || !(u instanceof Node) || c.contains(u) && i.push(u);
			return i;
		}
		function b(c, i) {
			for (let u of c) {
				if (i && p(u).then(b), !e.has(u))
					return !1;
				let a = e.get(u);
				return a.connected.forEach((O) => O(u)), a.connected.length = 0, a.disconnected.length || e.delete(u), !0;
			}
		}
		function N(c, i) {
			for (let u of c) {
				if (i && p(u).then(N), !e.has(u))
					return !1;
				let a = e.get(u);
				return a.disconnected.forEach((O) => O(u)), a.connected.length = 0, a.disconnected.length = 0, e.delete(u), !0;
			}
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
	var d = Symbol.for("signal");
	function x(e) {
		try {
			return Reflect.has(e, d);
		} catch {
			return !1;
		}
	}
	function y(e, t) {
		if (typeof e != "function")
			return P(e, t);
		if (x(e))
			return e;
		let n = P();
		return F(() => n(e())), n;
	}
	y.action = function(e, t, ...n) {
		if (!x(e))
			throw new Error(`'${e}' is not a signal!`);
		let r = e[d], { actions: o } = r;
		if (!o || !Reflect.has(o, t))
			throw new Error(`'${e}' has no action with name '${t}'!`);
		if (o[t].apply(r, n), r.skip)
			return Reflect.deleteProperty(r, "skip");
		r.listeners.forEach((l) => l(r.value));
	};
	y.on = function e(t, n, r) {
		if (Array.isArray(t))
			return t.forEach((o) => e(o, n, r));
		L(t, n), r && r.signal && r.signal.addEventListener("abort", () => $(t, n));
	};
	y.clear = function(...e) {
		for (let t of e)
			t[d].listeners.clear(), Reflect.deleteProperty(t, d);
	};
	var T = {
		isReactiveAtrribute(e, t) {
			return x(e);
		},
		isTextContent(e) {
			return h(e) === "string" || x(e) && h(G(e)) === "string";
		},
		processReactiveAttribute(e, t, n, r) {
			return L(n, (o) => r([t, o])), n();
		},
		reactiveElement(e, t) {
			let n = document.createComment("<> #reactive"), r = document.createComment("</> #reactive"), o = document.createDocumentFragment();
			o.append(n, r);
			let l = (s) => {
				if (!n.parentNode || !r.parentNode)
					return $(e, l);
				let f = t(s);
				Array.isArray(f) || (f = [f]);
				let p = n;
				for (; (p = n.nextSibling) !== r; )
					p.remove();
				n.after(...f);
			};
			return L(e, l), l(e()), o;
		}
	};
	function P(e, t) {
		let n = (...r) => r.length ? B(n, r[0]) : k(n);
		return W(n, e, t);
	}
	var I = Object.assign(/* @__PURE__ */ Object.create(null), {
		stopPropagation() {
			this.skip = !0;
		}
	});
	function W(e, t, n) {
		return h(n) !== "[object Object]" && (n = {}), e[d] = {
			value: t,
			actions: n,
			listeners: /* @__PURE__ */ new Set()
		}, Object.setPrototypeOf(e[d], I), e;
	}
	var g = [];
	function F(e) {
		let t = function() {
			g.push(t), e(), g.pop();
		};
		g.push(t), e(), g.pop();
	}
	function Z() {
		return g[g.length - 1];
	}
	function k(e) {
		if (!e[d])
			return;
		let { value: t, listeners: n } = e[d], r = Z();
		return r && n.add(r), t;
	}
	function B(e, t) {
		if (!e[d])
			return;
		let n = e[d];
		if (n.value !== t)
			return n.value = t, n.listeners.forEach((r) => r(t)), t;
	}
	function G(e) {
		return e[d].value;
	}
	function L(e, t) {
		return e[d].listeners.add(t);
	}
	function $(e, t) {
		return e[d].listeners.delete(t);
	}
	
	// src/signals.js
	R(T);
	
	globalThis.dde= {
		S: y,
		assign: C,
		classListDeclartive: q,
		createElement: Q,
		el: Q,
		empty: X,
		isSignal: x,
		namespace: K,
		on: _,
		registerReactivity: R,
		watch: F
	};
	
})();