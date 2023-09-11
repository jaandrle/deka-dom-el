//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/helpers.js
	function N(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	function O(e, t) {
		if (!e || !(e instanceof AbortSignal))
			return !0;
		if (!e.aborted)
			return e.addEventListener("abort", t), function() {
				e.removeEventListener("abort", t);
			};
	}
	
	// src/signals-common.js
	var l = {
		isTextContent(e) {
			return N(e) !== "[object Object]";
		},
		processReactiveAttribute(e, t, r, n) {
			return r;
		}
	};
	function D(e, t = !0) {
		return t ? Object.assign(l, e) : (Object.setPrototypeOf(e, l), e);
	}
	function C(e) {
		return l.isPrototypeOf(e) && e !== l ? e : l;
	}
	
	// src/dom.js
	var v = "html";
	function F(e) {
		return v = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(t) {
				return v = "html", t;
			}
		};
	}
	function I(e, t, ...r) {
		let n = C(this), c;
		switch (n.isTextContent(t) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				c = e(t || void 0, (s) => s ? (r.unshift(s), void 0) : c);
				break;
			}
			case e === "#text":
				c = E(document.createTextNode(""), t);
				break;
			case e === "<>":
				c = E(document.createDocumentFragment(), t);
				break;
			case v !== "html":
				c = E(document.createElementNS(v, e), t);
				break;
			case !c:
				c = E(document.createElement(e), t);
		}
		return r.forEach((a) => a(c)), c;
	}
	var h = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
	function E(e, ...t) {
		let r = C(this);
		if (!t.length)
			return e;
		let n = e instanceof SVGElement, c = (n ? S : j).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([s, f]) {
			f = r.processReactiveAttribute(e, s, f, a);
			let [p] = s;
			if (p === "=")
				return c(s.slice(1), f);
			if (p === ".")
				return L(e, s.slice(1), f);
			if (typeof f == "object")
				switch (s) {
					case "style":
						return x(f, j.bind(null, e.style, "Property"));
					case "dataset":
						return x(f, L.bind(null, e.dataset));
					case "ariaset":
						return x(f, (g, b) => c("aria-" + g, b));
					case "classList":
						return R(e, f);
					default:
						return Reflect.set(e, s, f);
				}
			if (/(aria|data)([A-Z])/.test(s))
				return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), c(s, f);
			switch (s) {
				case "href":
					return c(s, f);
				case "xlink:href":
					return c(s, f, "http://www.w3.org/1999/xlink");
				case "textContent":
					if (!n)
						break;
					return e.appendChild(document.createTextNode(f));
			}
			return M(e, s) ? L(e, s, f) : c(s, f);
		}), e;
	}
	function R(e, t) {
		return typeof t != "object" || x(
			t,
			(r, n) => e.classList.toggle(r, n === -1 ? void 0 : !!n)
		), e;
	}
	function U(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function M(e, t) {
		let r = "HTMLElement," + t;
		if (e instanceof HTMLElement && h.has(r))
			return h.get(r);
		let n = e.nodeName + "," + t;
		if (h.has(n))
			return h.get(n);
		let [c, a, s] = A(e, t), f = !y(c.set);
		return (!f || a) && h.set(s === HTMLElement.prototype ? r : n, f), f;
	}
	function A(e, t, r = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return [{}, r, e];
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n ? [n, r, e] : A(e, t, r + 1);
	}
	function x(e, t) {
		return Object.entries(e).forEach(([r, n]) => t(r, n));
	}
	function y(e) {
		return typeof e > "u";
	}
	function j(e, t, r, n) {
		return e[(y(n) ? "remove" : "set") + t](r, n);
	}
	function S(e, t, r, n, c = null) {
		return e[(y(n) ? "remove" : "set") + t + "NS"](c, r, n);
	}
	function L(e, t, r) {
		return Reflect.set(e, t, r);
	}
	
	// src/events.js
	function $(e, t, ...r) {
		let n = r.length ? new CustomEvent(t, { detail: r[0] }) : new Event(t);
		return e.dispatchEvent(n);
	}
	function T(e, t, r) {
		return function(c) {
			return c.addEventListener(e, t, r), c;
		};
	}
	var m = _();
	T.connected = function(e, t) {
		return function(n) {
			return typeof n.connectedCallback == "function" ? (n.addEventListener("dde:connected", e, t), n) : (O(t && t.signal, () => m.offConnected(n, e)) && (n.isConnected ? e(new Event("dde:connected")) : m.onConnected(n, e)), n);
		};
	};
	T.disconnected = function(e, t) {
		return function(n) {
			return typeof n.disconnectedCallback == "function" ? (n.addEventListener("dde:disconnected", e, t), n) : (O(t && t.signal, () => m.offDisconnected(n, e)) && m.onDisconnected(n, e), n);
		};
	};
	function _() {
		let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(o) {
			for (let i of o)
				if (i.type === "childList") {
					if (g(i.addedNodes, !0)) {
						s();
						continue;
					}
					b(i.removedNodes, !0) && s();
				}
		});
		return {
			onConnected(o, i) {
				a(), c(o).connected.push(i);
			},
			offConnected(o, i) {
				if (!e.has(o))
					return;
				let u = e.get(o), d = u.connected;
				d.splice(d.indexOf(i), 1), n(o, u);
			},
			onDisconnected(o, i) {
				a(), c(o).disconnected.push(i);
			},
			offDisconnected(o, i) {
				if (!e.has(o))
					return;
				let u = e.get(o), d = u.disconnected;
				d.splice(d.indexOf(i), 1), n(o, u);
			}
		};
		function n(o, i) {
			i.connected.length || i.disconnected.length || (e.delete(o), s());
		}
		function c(o) {
			if (e.has(o))
				return e.get(o);
			let i = { connected: [], disconnected: [] };
			return e.set(o, i), i;
		}
		function a() {
			t || (t = !0, r.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function s() {
			!t || e.size || (t = !1, r.disconnect());
		}
		function f() {
			return new Promise(function(o) {
				(requestIdleCallback || requestAnimationFrame)(o);
			});
		}
		async function p(o) {
			e.size > 30 && await f();
			let i = [];
			if (!(o instanceof Node))
				return i;
			for (let u of e.keys())
				u === o || !(u instanceof Node) || o.contains(u) && i.push(u);
			return i;
		}
		function g(o, i) {
			for (let u of o) {
				if (i && p(u).then(g), !e.has(u))
					continue;
				let d = e.get(u);
				return d.connected.forEach((w) => w(u)), d.connected.length = 0, d.disconnected.length || e.delete(u), !0;
			}
			return !1;
		}
		function b(o, i) {
			for (let u of o) {
				if (i && p(u).then(b), !e.has(u))
					continue;
				let d = e.get(u);
				return d.disconnected.forEach((w) => w(u)), d.connected.length = 0, d.disconnected.length = 0, e.delete(u), !0;
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
	
	globalThis.dde= {
		assign: E,
		classListDeclarative: R,
		createElement: I,
		dispatchEvent: $,
		el: I,
		empty: U,
		namespace: F,
		on: T,
		registerReactivity: D
	};
	
})();