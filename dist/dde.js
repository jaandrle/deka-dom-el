//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var g = {
		isSignal(e) {
			return !1;
		},
		processReactiveAttribute(e, t, r, n) {
			return r;
		}
	};
	function P(e, t = !0) {
		return t ? Object.assign(g, e) : (Object.setPrototypeOf(e, g), e);
	}
	function v(e) {
		return g.isPrototypeOf(e) && e !== g ? e : g;
	}
	
	// src/helpers.js
	function p(e) {
		return typeof e > "u";
	}
	function w(e, t) {
		if (!e || !(e instanceof AbortSignal))
			return !0;
		if (!e.aborted)
			return e.addEventListener("abort", t), function() {
				e.removeEventListener("abort", t);
			};
	}
	
	// src/dom-common.js
	var C = { setDeleteAttr: y };
	function y(e, t, r) {
		if (Reflect.set(e, t, r), !!p(r)) {
			if (e instanceof HTMLElement && e.getAttribute(t) === "undefined")
				return e.removeAttribute(t);
			if (Reflect.get(e, t) === "undefined")
				return Reflect.set(e, t, "");
		}
	}
	
	// src/dom.js
	var m = "html";
	function I(e) {
		return m = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
			append(...t) {
				return m = "html", t.length === 1 ? t[0] : document.createDocumentFragment().append(...t);
			}
		};
	}
	function Z(e, t, ...r) {
		let n = v(this), c;
		switch ((Object(t) !== t || n.isSignal(t)) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				c = e(t || void 0, (l) => l ? (r.unshift(l), void 0) : c);
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
		return r.forEach((d) => d(c)), c;
	}
	var { setDeleteAttr: R } = C;
	function x(e, ...t) {
		let r = this, n = v(this);
		if (!t.length)
			return e;
		let c = e instanceof SVGElement, d = (c ? F : j).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function l([f, u]) {
			u = n.processReactiveAttribute(e, f, u, l);
			let [h] = f;
			if (h === "=")
				return d(f.slice(1), u);
			if (h === ".")
				return D(e, f.slice(1), u);
			if (/(aria|data)([A-Z])/.test(f))
				return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), d(f, u);
			switch (f === "className" && (f = "class"), f) {
				case "href":
				case "src":
				case "class":
				case "xlink:href":
					return d(
						f,
						u,
						/* this applies only to SVG elements, see setRemove/setRemoveNS */
						"http://www.w3.org/1999/xlink"
					);
				case "textContent":
				case "innerText":
					return c ? e.appendChild(document.createTextNode(u)) : R(e, f, u);
				case "style":
				case "dataset":
					return O(n, u, D.bind(null, e[f]));
				case "ariaset":
					return O(n, u, (E, o) => d("aria-" + E, o));
				case "classList":
					return _.call(r, e, u);
			}
			return T(e, f) ? R(e, f, u) : d(f, u);
		}), e;
	}
	function _(e, t) {
		let r = v(this);
		return O(
			r,
			t,
			(n, c) => e.classList.toggle(n, c === -1 ? void 0 : !!c)
		), e;
	}
	function G(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function T(e, t) {
		if (!Reflect.has(e, t))
			return !1;
		let r = L(e, t);
		return !p(r.set);
	}
	function L(e, t, r = 0) {
		if (e = Object.getPrototypeOf(e), !e)
			return {};
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n || L(e, t, r + 1);
	}
	function O(e, t, r) {
		if (typeof t == "object")
			return Object.entries(t).forEach(function([c, d]) {
				c && (d = e.processReactiveAttribute(t, c, d, (l) => r(...l)), r(c, d));
			});
	}
	function N(e) {
		return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
	}
	function j(e, t, r, n) {
		return e[(p(n) ? "remove" : "set") + t](r, N(n));
	}
	function F(e, t, r, n, c = null) {
		return e[(p(n) ? "remove" : "set") + t + "NS"](c, r, N(n));
	}
	function D(e, t, r) {
		if (Reflect.set(e, t, r), !!p(r))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function J(e, t, ...r) {
		let n = r.length ? new CustomEvent(t, { detail: r[0] }) : new Event(t);
		return e.dispatchEvent(n);
	}
	function S(e, t, r) {
		return function(c) {
			return c.addEventListener(e, t, r), c;
		};
	}
	var b = M();
	S.connected = function(e, t) {
		return function(n) {
			return typeof n.connectedCallback == "function" ? (n.addEventListener("dde:connected", e, t), n) : (w(t && t.signal, () => b.offConnected(n, e)) && (n.isConnected ? e(new Event("dde:connected")) : b.onConnected(n, e)), n);
		};
	};
	S.disconnected = function(e, t) {
		return function(n) {
			return typeof n.disconnectedCallback == "function" ? (n.addEventListener("dde:disconnected", e, t), n) : (w(t && t.signal, () => b.offDisconnected(n, e)) && b.onDisconnected(n, e), n);
		};
	};
	function M() {
		let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(o) {
			for (let s of o)
				if (s.type === "childList") {
					if (h(s.addedNodes, !0)) {
						l();
						continue;
					}
					E(s.removedNodes, !0) && l();
				}
		});
		return {
			onConnected(o, s) {
				d(), c(o).connected.push(s);
			},
			offConnected(o, s) {
				if (!e.has(o))
					return;
				let i = e.get(o), a = i.connected;
				a.splice(a.indexOf(s), 1), n(o, i);
			},
			onDisconnected(o, s) {
				d(), c(o).disconnected.push(s);
			},
			offDisconnected(o, s) {
				if (!e.has(o))
					return;
				let i = e.get(o), a = i.disconnected;
				a.splice(a.indexOf(s), 1), n(o, i);
			}
		};
		function n(o, s) {
			s.connected.length || s.disconnected.length || (e.delete(o), l());
		}
		function c(o) {
			if (e.has(o))
				return e.get(o);
			let s = { connected: [], disconnected: [] };
			return e.set(o, s), s;
		}
		function d() {
			t || (t = !0, r.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function l() {
			!t || e.size || (t = !1, r.disconnect());
		}
		function f() {
			return new Promise(function(o) {
				(requestIdleCallback || requestAnimationFrame)(o);
			});
		}
		async function u(o) {
			e.size > 30 && await f();
			let s = [];
			if (!(o instanceof Node))
				return s;
			for (let i of e.keys())
				i === o || !(i instanceof Node) || o.contains(i) && s.push(i);
			return s;
		}
		function h(o, s) {
			for (let i of o) {
				if (s && u(i).then(h), !e.has(i))
					continue;
				let a = e.get(i);
				return a.connected.forEach((A) => A(i)), a.connected.length = 0, a.disconnected.length || e.delete(i), !0;
			}
			return !1;
		}
		function E(o, s) {
			for (let i of o) {
				if (s && u(i).then(E), !e.has(i))
					continue;
				let a = e.get(i);
				return a.disconnected.forEach((A) => A(i)), a.connected.length = 0, a.disconnected.length = 0, e.delete(i), !0;
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
		assign: x,
		classListDeclarative: _,
		createElement: Z,
		dispatchEvent: J,
		el: Z,
		empty: G,
		namespace: I,
		on: S,
		registerReactivity: P
	};
	
})();