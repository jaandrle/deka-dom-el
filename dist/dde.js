//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var E = {
		isSignal(e) {
			return !1;
		},
		processReactiveAttribute(e, t, r, n) {
			return r;
		}
	};
	function N(e, t = !0) {
		return t ? Object.assign(E, e) : (Object.setPrototypeOf(e, E), e);
	}
	function m(e) {
		return E.isPrototypeOf(e) && e !== E ? e : E;
	}
	
	// src/helpers.js
	function p(e) {
		return typeof e > "u";
	}
	function _(e, t) {
		if (!e || !(e instanceof AbortSignal))
			return !0;
		if (!e.aborted)
			return e.addEventListener("abort", t), function() {
				e.removeEventListener("abort", t);
			};
	}
	
	// src/dom-common.js
	var O = { setDeleteAttr: P };
	function P(e, t, r) {
		if (Reflect.set(e, t, r), !!p(r)) {
			if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
				return e.removeAttribute(t);
			if (Reflect.get(e, t) === "undefined")
				return Reflect.set(e, t, "");
		}
	}
	
	// src/dom.js
	var h = "html", S = {
		elNamespace(e) {
			return h = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
				append(...t) {
					return h = "html", t.length === 1 ? t[0] : document.createDocumentFragment().append(...t);
				}
			};
		},
		get namespace() {
			return h;
		},
		set namespace(e) {
			return h = e;
		}
	}, H = Object.assign((e) => e ? e(document.body) : document.body, S);
	function I(e, t, ...r) {
		let n = this, u = m(this), i;
		switch ((Object(t) !== t || u.isSignal(t)) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				let a = Object.assign((f) => f ? (r.unshift(f), void 0) : i, S);
				i = e(t || void 0, a), h = "html";
				break;
			}
			case e === "#text":
				i = w.call(n, document.createTextNode(""), t);
				break;
			case e === "<>":
				i = w.call(n, document.createDocumentFragment(), t);
				break;
			case h !== "html":
				i = w.call(n, document.createElementNS(h, e), t);
				break;
			case !i:
				i = w.call(n, document.createElement(e), t);
		}
		return r.forEach((a) => a(i)), i;
	}
	var { setDeleteAttr: R } = O;
	function w(e, ...t) {
		let r = this, n = m(this);
		if (!t.length)
			return e;
		let i = (e instanceof SVGElement ? T : M).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([f, d]) {
			d = n.processReactiveAttribute(e, f, d, a);
			let [g] = f;
			if (g === "=")
				return i(f.slice(1), d);
			if (g === ".")
				return C(e, f.slice(1), d);
			if (/(aria|data)([A-Z])/.test(f))
				return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), i(f, d);
			switch (f === "className" && (f = "class"), f) {
				case "xlink:href":
					return i(f, d, "http://www.w3.org/1999/xlink");
				case "textContent":
					return R(e, f, d);
				case "style":
					if (typeof d != "object")
						break;
				case "dataset":
					return A(n, d, C.bind(null, e[f]));
				case "ariaset":
					return A(n, d, (b, c) => i("aria-" + b, c));
				case "classList":
					return j.call(r, e, d);
			}
			return F(e, f) ? R(e, f, d) : i(f, d);
		}), e;
	}
	function j(e, t) {
		let r = m(this);
		return A(
			r,
			t,
			(n, u) => e.classList.toggle(n, u === -1 ? void 0 : !!u)
		), e;
	}
	function Z(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function F(e, t) {
		if (!Reflect.has(e, t))
			return !1;
		let r = y(e, t);
		return !p(r.set);
	}
	function y(e, t) {
		if (e = Object.getPrototypeOf(e), !e)
			return {};
		let r = Object.getOwnPropertyDescriptor(e, t);
		return r || y(e, t);
	}
	function A(e, t, r) {
		if (!(typeof t != "object" || t === null))
			return Object.entries(t).forEach(function([u, i]) {
				u && (i = e.processReactiveAttribute(t, u, i, (a) => r(...a)), r(u, i));
			});
	}
	function D(e) {
		return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
	}
	function M(e, t, r, n) {
		return e[(p(n) ? "remove" : "set") + t](r, D(n));
	}
	function T(e, t, r, n, u = null) {
		return e[(p(n) ? "remove" : "set") + t + "NS"](u, r, D(n));
	}
	function C(e, t, r) {
		if (Reflect.set(e, t, r), !!p(r))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function K(e, t, ...r) {
		let n = r.length ? new CustomEvent(t, { detail: r[0] }) : new Event(t);
		return e.dispatchEvent(n);
	}
	function L(e, t, r) {
		return function(u) {
			return u.addEventListener(e, t, r), u;
		};
	}
	var x = U();
	L.connected = function(e, t) {
		return typeof t != "object" && (t = {}), t.once = !0, function(n) {
			return n.addEventListener("dde:connected", e, t), typeof n.connectedCallback == "function" ? n : n.isConnected ? (n.dispatchEvent(new Event("dde:connected")), n) : (_(t.signal, () => x.offConnected(n, e)) && x.onConnected(n, e), n);
		};
	};
	L.disconnected = function(e, t) {
		return typeof t != "object" && (t = {}), t.once = !0, function(n) {
			return n.addEventListener("dde:disconnected", e, t), typeof n.disconnectedCallback == "function" || _(t.signal, () => x.offDisconnected(n, e)) && x.onDisconnected(n, e), n;
		};
	};
	function U() {
		let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(c) {
			for (let o of c)
				if (o.type === "childList") {
					if (g(o.addedNodes, !0)) {
						a();
						continue;
					}
					b(o.removedNodes, !0) && a();
				}
		});
		return {
			onConnected(c, o) {
				i();
				let s = u(c);
				s.connected.has(o) || (s.connected.add(o), s.length_c += 1);
			},
			offConnected(c, o) {
				if (!e.has(c))
					return;
				let s = e.get(c);
				s.connected.has(o) && (s.connected.delete(o), s.length_c -= 1, n(c, s));
			},
			onDisconnected(c, o) {
				i();
				let s = u(c);
				s.disconnected.has(o) || (s.disconnected.add(o), s.length_d += 1);
			},
			offDisconnected(c, o) {
				if (!e.has(c))
					return;
				let s = e.get(c);
				s.disconnected.has(o) && (s.disconnected.delete(o), s.length_d -= 1, n(c, s));
			}
		};
		function n(c, o) {
			o.length_c || o.length_d || (e.delete(c), a());
		}
		function u(c) {
			if (e.has(c))
				return e.get(c);
			let o = {
				connected: /* @__PURE__ */ new WeakSet(),
				length_c: 0,
				disconnected: /* @__PURE__ */ new WeakSet(),
				length_d: 0
			};
			return e.set(c, o), o;
		}
		function i() {
			t || (t = !0, r.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function a() {
			!t || e.size || (t = !1, r.disconnect());
		}
		function f() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function d(c) {
			e.size > 30 && await f();
			let o = [];
			if (!(c instanceof Node))
				return o;
			for (let s of e.keys())
				s === c || !(s instanceof Node) || c.contains(s) && o.push(s);
			return o;
		}
		function g(c, o) {
			let s = !1;
			for (let l of c) {
				if (o && d(l).then(g), !e.has(l))
					continue;
				let v = e.get(l);
				v.length_c && (l.dispatchEvent(new Event("dde:connected")), v.connected = /* @__PURE__ */ new WeakSet(), v.length_c = 0, v.length_d || e.delete(l), s = !0);
			}
			return s;
		}
		function b(c, o) {
			let s = !1;
			for (let l of c)
				o && d(l).then(b), !(!e.has(l) || !e.get(l).length_d) && (l.dispatchEvent(new Event("dde:disconnected")), e.delete(l), s = !0);
			return s;
		}
	}
	
	// index.js
	[HTMLElement, SVGElement, DocumentFragment].forEach((e) => {
		let { append: t } = e.prototype;
		e.prototype.append = function(...r) {
			return t.apply(this, r), this;
		};
	});
	
	globalThis.dde= {
		assign: w,
		classListDeclarative: j,
		createElement: I,
		dispatchEvent: K,
		el: I,
		empty: Z,
		on: L,
		registerReactivity: N,
		scope: H
	};
	
})();