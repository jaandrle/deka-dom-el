//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/helpers.js
	function j(e) {
		let t = typeof e;
		return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
	}
	function w(e, t) {
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
			return j(e) !== "[object Object]";
		},
		processReactiveAttribute(e, t, n, r) {
			return n;
		}
	};
	function D(e, t = !0) {
		return t ? Object.assign(l, e) : (Object.setPrototypeOf(e, l), e);
	}
	function C(e) {
		return l.isPrototypeOf(e) && e !== l ? e : l;
	}
	
	// src/dom.js
	var m = "html";
	function F(e) {
		return m = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(t) {
				return m = "html", t;
			}
		};
	}
	function I(e, t, ...n) {
		let r = C(this), c;
		switch (r.isTextContent(t) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				c = e(t || void 0, (s) => s ? (n.unshift(s), void 0) : c);
				break;
			}
			case e === "#text":
				c = x(document.createTextNode(""), t);
				break;
			case e === "<>":
				c = x(document.createDocumentFragment(), t);
				break;
			case m !== "html":
				c = x(document.createElementNS(m, e), t);
				break;
			case !c:
				c = x(document.createElement(e), t);
		}
		return n.forEach((a) => a(c)), c;
	}
	var h = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
	function x(e, ...t) {
		let n = C(this);
		if (!t.length)
			return e;
		let r = e instanceof SVGElement, c = (r ? S : y).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([s, f]) {
			f = n.processReactiveAttribute(e, s, f, a);
			let [p] = s;
			if (p === "=")
				return c(s.slice(1), f);
			if (p === ".")
				return L(e, s.slice(1), f);
			if (typeof f == "object")
				switch (s) {
					case "style":
						return E(f, y.bind(null, e.style, "Property"));
					case "dataset":
						return E(f, L.bind(null, e.dataset));
					case "ariaset":
						return E(f, (g, b) => c("aria-" + g, b));
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
					if (!r)
						break;
					return e.appendChild(document.createTextNode(f));
			}
			return M(e, s) ? L(e, s, f) : c(s, f);
		}), e;
	}
	function R(e, t) {
		return typeof t != "object" || E(
			t,
			(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
		), e;
	}
	function U(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function M(e, t) {
		let n = "HTMLElement," + t;
		if (e instanceof HTMLElement && h.has(n))
			return h.get(n);
		let r = e.nodeName + "," + t;
		if (h.has(r))
			return h.get(r);
		let [c, a, s] = A(e, t), f = !N(c.set);
		return (!f || a) && h.set(s === HTMLElement.prototype ? n : r, f), f;
	}
	function A(e, t, n = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return [{}, n, e];
		let r = Object.getOwnPropertyDescriptor(e, t);
		return r ? [r, n, e] : A(e, t, n + 1);
	}
	function E(e, t) {
		return Object.entries(e).forEach(([n, r]) => t(n, r));
	}
	function N(e) {
		return typeof e > "u";
	}
	function y(e, t, n, r) {
		return e[(N(r) ? "remove" : "set") + t](n, r);
	}
	function S(e, t, n, r, c = null) {
		return e[(N(r) ? "remove" : "set") + t + "NS"](c, n, r);
	}
	function L(e, t, n) {
		return Reflect.set(e, t, n);
	}
	
	// src/events.js
	function $(e, t, ...n) {
		let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
		return e.dispatchEvent(r);
	}
	function T(e, t, n) {
		return function(c) {
			return c.addEventListener(e, t, n), c;
		};
	}
	var v = _();
	T.connected = function(e, t) {
		return function(r) {
			return w(t && t.signal, () => v.offConnected(r, e)) && v.onConnected(r, e), r;
		};
	};
	T.disconnected = function(e, t) {
		return function(r) {
			return w(t && t.signal, () => v.offDisconnected(r, e)) && v.onDisconnected(r, e), r;
		};
	};
	function _() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(o) {
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
				d.splice(d.indexOf(i), 1), r(o, u);
			},
			onDisconnected(o, i) {
				a(), c(o).disconnected.push(i);
			},
			offDisconnected(o, i) {
				if (!e.has(o))
					return;
				let u = e.get(o), d = u.disconnected;
				d.splice(d.indexOf(i), 1), r(o, u);
			}
		};
		function r(o, i) {
			i.connected.length || i.disconnected.length || (e.delete(o), s());
		}
		function c(o) {
			if (e.has(o))
				return e.get(o);
			let i = { connected: [], disconnected: [] };
			return e.set(o, i), i;
		}
		function a() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function s() {
			!t || e.size || (t = !1, n.disconnect());
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
				return d.connected.forEach((O) => O(u)), d.connected.length = 0, d.disconnected.length || e.delete(u), !0;
			}
			return !1;
		}
		function b(o, i) {
			for (let u of o) {
				if (i && p(u).then(b), !e.has(u))
					continue;
				let d = e.get(u);
				return d.disconnected.forEach((O) => O(u)), d.connected.length = 0, d.disconnected.length = 0, e.delete(u), !0;
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
	
	globalThis.dde= {
		assign: x,
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