//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/helpers.js
	function N(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	
	// src/signals-common.js
	var p = {
		isReactiveAtrribute(e, t) {
			return !1;
		},
		isTextContent(e) {
			return N(e) !== "[object Object]";
		},
		processReactiveAttribute(e, t, r, n) {
			return !1;
		},
		reactiveElement(e, ...t) {
			return null;
		}
	};
	function A(e, t = !0) {
		return t ? Object.assign(p, e) : (Object.setPrototypeOf(e, p), e);
	}
	function O(e) {
		return p.isPrototypeOf(e) && e !== p ? e : p;
	}
	
	// src/dom.js
	var x = "html";
	function z(e) {
		return x = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(t) {
				return x = "html", t;
			}
		};
	}
	function F(e, t, ...r) {
		let n = O(this), f;
		if (e === "<>") {
			if (n.isReactiveAtrribute(t))
				return n.reactiveElement(t, ...r);
			f = document.createDocumentFragment();
		}
		switch (n.isTextContent(t) && (t = { textContent: t }), !0) {
			case typeof e == "function":
				f = e(t || void 0);
				break;
			case e === "#text":
				f = w(document.createTextNode(""), t);
				break;
			case x !== "html":
				f = w(document.createElementNS(x, e), t);
				break;
			case !f:
				f = w(document.createElement(e), t);
		}
		return r.forEach((d) => d(f)), f;
	}
	var h = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
	function w(e, ...t) {
		let r = O(this);
		if (!t.length)
			return e;
		let n = e instanceof SVGElement, f = (n ? M : j).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function d([i, u]) {
			r.isReactiveAtrribute(u, i) && (u = r.processReactiveAttribute(e, i, u, d));
			let [l] = i;
			if (l === "=")
				return f(i.slice(1), u);
			if (l === ".")
				return C(e, i.slice(1), u);
			if (typeof u == "object")
				switch (i) {
					case "style":
						return m(u, j.bind(null, e.style, "Property"));
					case "dataset":
						return m(u, C.bind(null, e.dataset));
					case "ariaset":
						return m(u, (g, b) => f("aria-" + g, b));
					case "classList":
						return T(e, u);
					default:
						return Reflect.set(e, i, u);
				}
			if (/(aria|data)([A-Z])/.test(i))
				return i = i.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), f(i, u);
			switch (i) {
				case "href":
					return f(i, u);
				case "xlink:href":
					return f(i, u, "http://www.w3.org/1999/xlink");
				case "textContent":
					if (!n)
						break;
					return e.appendChild(document.createTextNode(u));
			}
			return D(e, i) ? C(e, i, u) : f(i, u);
		}), e;
	}
	function T(e, t) {
		return typeof t != "object" || m(
			t,
			(r, n) => e.classList.toggle(r, n === -1 ? void 0 : !!n)
		), e;
	}
	function I(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function D(e, t) {
		let r = "HTMLElement," + t;
		if (e instanceof HTMLElement && h.has(r))
			return h.get(r);
		let n = e.nodeName + "," + t;
		if (h.has(n))
			return h.get(n);
		let [f, d, i] = R(e, t), u = !L(f.set);
		return (!u || d) && h.set(i === HTMLElement.prototype ? r : n, u), u;
	}
	function R(e, t, r = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return [{}, r, e];
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n ? [n, r, e] : R(e, t, r + 1);
	}
	function m(e, t) {
		return Object.entries(e).forEach(([r, n]) => t(r, n));
	}
	function L(e) {
		return typeof e > "u";
	}
	function j(e, t, r, n) {
		return e[(L(n) ? "remove" : "set") + t](r, n);
	}
	function M(e, t, r, n, f = null) {
		return e[(L(n) ? "remove" : "set") + t + "NS"](f, r, n);
	}
	function C(e, t, r) {
		return Reflect.set(e, t, r);
	}
	
	// src/events.js
	function y(e, t, r) {
		return (n) => (n.addEventListener(e, t, r), n);
	}
	var E = _();
	y.connected = function(e, t) {
		return function(n) {
			E.onConnected(n, e), t && t.signal && t.signal.addEventListener("abort", () => E.offConnected(n, e));
		};
	};
	y.disconnected = function(e, t) {
		return function(n) {
			E.onDisconnected(n, e), t && t.signal && t.signal.addEventListener("abort", () => E.offDisconnected(n, e));
		};
	};
	function _() {
		let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(o) {
			for (let c of o)
				if (c.type === "childList") {
					if (g(c.addedNodes, !0)) {
						i();
						continue;
					}
					b(c.removedNodes, !0) && i();
				}
		});
		return {
			onConnected(o, c) {
				d(), f(o).connected.push(c);
			},
			offConnected(o, c) {
				if (!e.has(o))
					return;
				let s = e.get(o), a = s.connected;
				a.splice(a.indexOf(c), 1), n(o, s);
			},
			onDisconnected(o, c) {
				d(), f(o).disconnected.push(c);
			},
			offDisconnected(o, c) {
				if (!e.has(o))
					return;
				let s = e.get(o), a = s.disconnected;
				a.splice(a.indexOf(c), 1), n(o, s);
			}
		};
		function n(o, c) {
			c.connected.length || c.disconnect.length || (e.delete(o), i());
		}
		function f(o) {
			if (e.has(o))
				return e.get(o);
			let c = { connected: [], disconnected: [] };
			return e.set(o, c), c;
		}
		function d() {
			t || (t = !0, r.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function i() {
			!t || e.size || (t = !1, r.disconnect());
		}
		function u() {
			return new Promise(function(o) {
				(requestIdleCallback || requestAnimationFrame)(o);
			});
		}
		async function l(o) {
			e.size > 30 && await u();
			let c = [];
			if (!(o instanceof Node))
				return c;
			for (let s of e.keys())
				s === o || !(s instanceof Node) || o.contains(s) && c.push(s);
			return c;
		}
		function g(o, c) {
			for (let s of o) {
				if (c && l(s).then(g), !e.has(s))
					return !1;
				let a = e.get(s);
				return a.connected.forEach((v) => v(s)), a.connected.length = 0, a.disconnected.length || e.delete(s), !0;
			}
		}
		function b(o, c) {
			for (let s of o) {
				if (c && l(s).then(b), !e.has(s))
					return !1;
				let a = e.get(s);
				return a.disconnected.forEach((v) => v(s)), a.connected.length = 0, a.disconnected.length = 0, e.delete(s), !0;
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
	
	globalThis.dde= {
		assign: w,
		classListDeclarative: T,
		createElement: F,
		el: F,
		empty: I,
		namespace: z,
		on: y,
		registerReactivity: A
	};
	
})();