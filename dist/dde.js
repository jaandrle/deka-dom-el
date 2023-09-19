//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var g = {
		isTextContent(e) {
			return typeof e == "string";
		},
		processReactiveAttribute(e, t, r, n) {
			return r;
		}
	};
	function _(e, t = !0) {
		return t ? Object.assign(g, e) : (Object.setPrototypeOf(e, g), e);
	}
	function O(e) {
		return g.isPrototypeOf(e) && e !== g ? e : g;
	}
	
	// src/helpers.js
	function p(e) {
		return typeof e > "u";
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
	var l = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]')), A = { setDeleteAttr: T };
	function T(e, t, r) {
		Reflect.set(e, t, r), p(r) && e.getAttribute(t) === "undefined" && e.removeAttribute(t);
	}
	
	// src/dom.js
	var v = "html";
	function Z(e) {
		return v = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(...t) {
				return v = "html", t.length === 1 ? t[0] : document.createDocumentFragment().append(...t);
			}
		};
	}
	function $(e, t, ...r) {
		let n = O(this), c;
		switch (n.isTextContent(t) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				c = e(t || void 0, (s) => s ? (r.unshift(s), void 0) : c);
				break;
			}
			case e === "#text":
				c = b(document.createTextNode(""), t);
				break;
			case e === "<>":
				c = b(document.createDocumentFragment(), t);
				break;
			case v !== "html":
				c = b(document.createElementNS(v, e), t);
				break;
			case !c:
				c = b(document.createElement(e), t);
		}
		return r.forEach((a) => a(c)), c;
	}
	var { setDeleteAttr: M } = A;
	function b(e, ...t) {
		let r = O(this);
		if (!t.length)
			return e;
		let n = e instanceof SVGElement, c = (n ? j : N).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([s, f]) {
			f = r.processReactiveAttribute(e, s, f, a);
			let [h] = s;
			if (h === "=")
				return c(s.slice(1), f);
			if (h === ".")
				return y(e, s.slice(1), f);
			if (typeof f == "object")
				switch (s) {
					case "style":
						return m(f, N.bind(null, e.style, "Property"));
					case "dataset":
						return m(f, y.bind(null, e.dataset));
					case "ariaset":
						return m(f, (x, E) => c("aria-" + x, E));
					case "classList":
						return P(e, f);
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
			return S(e, s) ? M(e, s, f) : c(s, f);
		}), e;
	}
	function P(e, t) {
		return typeof t != "object" || m(
			t,
			(r, n) => e.classList.toggle(r, n === -1 ? void 0 : !!n)
		), e;
	}
	function G(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function S(e, t) {
		let r = "HTMLElement," + t;
		if (e instanceof HTMLElement && l.has(r))
			return l.get(r);
		let n = e.nodeName + "," + t;
		if (l.has(n))
			return l.get(n);
		let [c, a, s] = D(e, t), f = !p(c.set);
		return (!f || a) && l.set(s === HTMLElement.prototype ? r : n, f), f;
	}
	function D(e, t, r = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return [{}, r, e];
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n ? [n, r, e] : D(e, t, r + 1);
	}
	function m(e, t) {
		return Object.entries(e).forEach(([r, n]) => r && t(r, n));
	}
	function N(e, t, r, n) {
		return e[(p(n) ? "remove" : "set") + t](r, n);
	}
	function j(e, t, r, n, c = null) {
		return e[(p(n) ? "remove" : "set") + t + "NS"](c, r, n);
	}
	function y(e, t, r) {
		if (Reflect.set(e, t, r), !!p(r))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function W(e, t, ...r) {
		let n = r.length ? new CustomEvent(t, { detail: r[0] }) : new Event(t);
		return e.dispatchEvent(n);
	}
	function R(e, t, r) {
		return function(c) {
			return c.addEventListener(e, t, r), c;
		};
	}
	var w = H();
	R.connected = function(e, t) {
		return function(n) {
			return typeof n.connectedCallback == "function" ? (n.addEventListener("dde:connected", e, t), n) : (L(t && t.signal, () => w.offConnected(n, e)) && (n.isConnected ? e(new Event("dde:connected")) : w.onConnected(n, e)), n);
		};
	};
	R.disconnected = function(e, t) {
		return function(n) {
			return typeof n.disconnectedCallback == "function" ? (n.addEventListener("dde:disconnected", e, t), n) : (L(t && t.signal, () => w.offDisconnected(n, e)) && w.onDisconnected(n, e), n);
		};
	};
	function H() {
		let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(o) {
			for (let i of o)
				if (i.type === "childList") {
					if (x(i.addedNodes, !0)) {
						s();
						continue;
					}
					E(i.removedNodes, !0) && s();
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
		async function h(o) {
			e.size > 30 && await f();
			let i = [];
			if (!(o instanceof Node))
				return i;
			for (let u of e.keys())
				u === o || !(u instanceof Node) || o.contains(u) && i.push(u);
			return i;
		}
		function x(o, i) {
			for (let u of o) {
				if (i && h(u).then(x), !e.has(u))
					continue;
				let d = e.get(u);
				return d.connected.forEach((C) => C(u)), d.connected.length = 0, d.disconnected.length || e.delete(u), !0;
			}
			return !1;
		}
		function E(o, i) {
			for (let u of o) {
				if (i && h(u).then(E), !e.has(u))
					continue;
				let d = e.get(u);
				return d.disconnected.forEach((C) => C(u)), d.connected.length = 0, d.disconnected.length = 0, e.delete(u), !0;
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
		assign: b,
		classListDeclarative: P,
		createElement: $,
		dispatchEvent: W,
		el: $,
		empty: G,
		namespace: Z,
		on: R,
		registerReactivity: _
	};
	
})();