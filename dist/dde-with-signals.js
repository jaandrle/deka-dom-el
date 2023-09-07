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
			return null;
		}
	};
	function S(e, t = !0) {
		return t ? Object.assign(m, e) : (Object.setPrototypeOf(e, m), e);
	}
	function j(e) {
		return m.isPrototypeOf(e) && e !== m ? e : m;
	}
	
	// src/dom.js
	var O = "html";
	function Y(e) {
		return O = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(t) {
				return O = "html", t;
			}
		};
	}
	function ee(e, t, ...n) {
		let r = j(this), o;
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
				o = A(document.createTextNode(""), t);
				break;
			case O !== "html":
				o = A(document.createElementNS(O, e), t);
				break;
			case !o:
				o = A(document.createElement(e), t);
		}
		return n.forEach((a) => a(o)), o;
	}
	var x = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
	function A(e, ...t) {
		let n = j(this);
		if (!t.length)
			return e;
		let r = e instanceof SVGElement, o = (r ? z : P).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([u, i]) {
			n.isReactiveAtrribute(i, u) && (i = n.processReactiveAttribute(e, u, i, a));
			let [p] = u;
			if (p === "=")
				return o(u.slice(1), i);
			if (p === ".")
				return L(e, u.slice(1), i);
			if (typeof i == "object")
				switch (u) {
					case "style":
						return w(i, P.bind(null, e.style, "Property"));
					case "dataset":
						return w(i, L.bind(null, e.dataset));
					case "ariaset":
						return w(i, (E, v) => o("aria-" + E, v));
					case "classList":
						return k(e, i);
					default:
						return Reflect.set(e, u, i);
				}
			if (/(aria|data)([A-Z])/.test(u))
				return u = u.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(u, i);
			switch (u) {
				case "xlink:href":
					return o(u, i, "http://www.w3.org/1999/xlink");
				case "textContent":
					if (!r)
						break;
					return e.appendChild(document.createTextNode(i));
			}
			return q(e, u) ? L(e, u, i) : o(u, i);
		}), e;
	}
	function k(e, t) {
		return typeof t != "object" || w(
			t,
			(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
		), e;
	}
	function te(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function q(e, t) {
		let n = "HTMLElement," + t;
		if (e instanceof HTMLElement && x.has(n))
			return x.get(n);
		let r = e.nodeName + "," + t;
		if (x.has(r))
			return x.get(r);
		let [o, a, u] = T(e, t), i = !N(o.set);
		return (!i || a) && x.set(u === HTMLElement.prototype ? n : r, i), i;
	}
	function T(e, t, n = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return [{}, n, e];
		let r = Object.getOwnPropertyDescriptor(e, t);
		return r ? [r, n, e] : T(e, t, n + 1);
	}
	function w(e, t) {
		return Object.entries(e).forEach(([n, r]) => t(n, r));
	}
	function N(e) {
		return typeof e > "u";
	}
	function P(e, t, n, r) {
		return e[(N(r) ? "remove" : "set") + t](n, r);
	}
	function z(e, t, n, r, o = null) {
		return e[(N(r) ? "remove" : "set") + t + "NS"](o, n, r);
	}
	function L(e, t, n) {
		return Reflect.set(e, t, n);
	}
	
	// src/events.js
	function D(e, t, n) {
		return (r) => (r.addEventListener(e, t, n), r);
	}
	var y = I();
	D.connected = function(e, t) {
		return function(r) {
			y.onConnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => y.offConnected(r, e));
		};
	};
	D.disconnected = function(e, t) {
		return function(r) {
			y.onDisconnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => y.offDisconnected(r, e));
		};
	};
	function I() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
			for (let s of c)
				if (s.type === "childList") {
					if (E(s.addedNodes, !0)) {
						u();
						continue;
					}
					v(s.removedNodes, !0) && u();
				}
		});
		return {
			onConnected(c, s) {
				a(), o(c).connected.push(s);
			},
			offConnected(c, s) {
				if (!e.has(c))
					return;
				let f = e.get(c), d = f.connected;
				d.splice(d.indexOf(s), 1), r(c, f);
			},
			onDisconnected(c, s) {
				a(), o(c).disconnected.push(s);
			},
			offDisconnected(c, s) {
				if (!e.has(c))
					return;
				let f = e.get(c), d = f.disconnected;
				d.splice(d.indexOf(s), 1), r(c, f);
			}
		};
		function r(c, s) {
			s.connected.length || s.disconnect.length || (e.delete(c), u());
		}
		function o(c) {
			if (e.has(c))
				return e.get(c);
			let s = { connected: [], disconnected: [] };
			return e.set(c, s), s;
		}
		function a() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function u() {
			!t || e.size || (t = !1, n.disconnect());
		}
		function i() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function p(c) {
			e.size > 30 && await i();
			let s = [];
			if (!(c instanceof Node))
				return s;
			for (let f of e.keys())
				f === c || !(f instanceof Node) || c.contains(f) && s.push(f);
			return s;
		}
		function E(c, s) {
			for (let f of c) {
				if (s && p(f).then(E), !e.has(f))
					return !1;
				let d = e.get(f);
				return d.connected.forEach((C) => C(f)), d.connected.length = 0, d.disconnected.length || e.delete(f), !0;
			}
		}
		function v(c, s) {
			for (let f of c) {
				if (s && p(f).then(v), !e.has(f))
					return !1;
				let d = e.get(f);
				return d.disconnected.forEach((C) => C(f)), d.connected.length = 0, d.disconnected.length = 0, e.delete(f), !0;
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
	var l = Symbol.for("signal");
	function b(e) {
		try {
			return Reflect.has(e, l);
		} catch {
			return !1;
		}
	}
	function R(e, t) {
		if (typeof e != "function")
			return M(e, t);
		if (b(e))
			return e;
		let n = M();
		return $(() => n(e())), n;
	}
	R.action = function(e, t, ...n) {
		if (!b(e))
			throw new Error(`'${e}' is not a signal!`);
		let r = e[l], { actions: o } = r;
		if (!o || !Reflect.has(o, t))
			throw new Error(`'${e}' has no action with name '${t}'!`);
		if (o[t].apply(r, n), r.skip)
			return Reflect.deleteProperty(r, "skip");
		r.listeners.forEach((a) => a(r.value));
	};
	R.on = function e(t, n, r) {
		if (Array.isArray(t))
			return t.forEach((o) => e(o, n, r));
		_(t, n), r && r.signal && r.signal.addEventListener("abort", () => F(t, n));
	};
	R.clear = function(...e) {
		for (let t of e)
			t[l].listeners.clear(), Reflect.deleteProperty(t, l);
	};
	var H = {
		isReactiveAtrribute(e, t) {
			return b(e);
		},
		isTextContent(e) {
			return h(e) === "string" || b(e) && h(U(e)) === "string";
		},
		processReactiveAttribute(e, t, n, r) {
			return _(n, (o) => r([t, o])), n();
		},
		reactiveElement(e, t) {
			let n = document.createComment("<> #reactive"), r = document.createComment("</> #reactive"), o = document.createDocumentFragment();
			o.append(n, r);
			let a = (u) => {
				if (!n.parentNode || !r.parentNode)
					return F(e, a);
				let i = t(u);
				Array.isArray(i) || (i = [i]);
				let p = n;
				for (; (p = n.nextSibling) !== r; )
					p.remove();
				n.after(...i);
			};
			return _(e, a), a(e()), o;
		}
	};
	function M(e, t) {
		let n = (...r) => r.length ? J(n, r[0]) : G(n);
		return Z(n, e, t);
	}
	var W = Object.assign(/* @__PURE__ */ Object.create(null), {
		stopPropagation() {
			this.skip = !0;
		}
	});
	function Z(e, t, n) {
		return h(n) !== "[object Object]" && (n = {}), e[l] = {
			value: t,
			actions: n,
			listeners: /* @__PURE__ */ new Set()
		}, Object.setPrototypeOf(e[l], W), e;
	}
	var g = [];
	function $(e) {
		let t = function() {
			g.push(t), e(), g.pop();
		};
		g.push(t), e(), g.pop();
	}
	function B() {
		return g[g.length - 1];
	}
	function G(e) {
		if (!e[l])
			return;
		let { value: t, listeners: n } = e[l], r = B();
		return r && n.add(r), t;
	}
	function J(e, t) {
		if (!e[l])
			return;
		let n = e[l];
		if (n.value !== t)
			return n.value = t, n.listeners.forEach((r) => r(t)), t;
	}
	function U(e) {
		return e[l].value;
	}
	function _(e, t) {
		return e[l].listeners.add(t);
	}
	function F(e, t) {
		return e[l].listeners.delete(t);
	}
	
	// src/signals.js
	S(H);
	
	globalThis.dde= {
		S: R,
		assign: A,
		classListDeclartive: k,
		createElement: ee,
		el: ee,
		empty: te,
		isSignal: b,
		namespace: Y,
		on: D,
		registerReactivity: S,
		watch: $
	};
	
})();