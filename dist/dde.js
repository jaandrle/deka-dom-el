//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var m = {
		isSignal(e) {
			return !1;
		},
		processReactiveAttribute(e, t, n, s) {
			return n;
		}
	};
	function P(e, t = !0) {
		return t ? Object.assign(m, e) : (Object.setPrototypeOf(e, m), e);
	}
	function b(e) {
		return m.isPrototypeOf(e) && e !== m ? e : m;
	}
	
	// src/helpers.js
	function g(e) {
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
	var C = { setDeleteAttr: j };
	function j(e, t, n) {
		if (Reflect.set(e, t, n), !!g(n)) {
			if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
				return e.removeAttribute(t);
			if (Reflect.get(e, t) === "undefined")
				return Reflect.set(e, t, "");
		}
	}
	
	// src/dom.js
	var E = [{ scope: document.body, namespace: "html", host: (e) => e ? e(document.body) : document.body }], R = (e) => e === "svg" ? "http://www.w3.org/2000/svg" : e, x = {
		get current() {
			return E[E.length - 1];
		},
		get state() {
			return [...E];
		},
		get host() {
			return this.current.host;
		},
		get namespace() {
			return this.current.namespace;
		},
		set namespace(e) {
			return this.current.namespace = R(e);
		},
		elNamespace(e) {
			let t = this.namespace;
			return this.namespace = e, {
				append(...n) {
					return x.namespace = t, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
				}
			};
		},
		push(e = {}) {
			return e.namespace && (e.namespace = R(e.namespace)), E.push(Object.assign({}, this.current, e));
		},
		pop() {
			return E.pop();
		}
	};
	function V(e, t, ...n) {
		let s = this, r = b(this), { namespace: f } = x, a;
		switch ((Object(t) !== t || r.isSignal(t)) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				x.push({ scope: e, host: (u) => u ? (n.unshift(u), void 0) : a }), a = e(t || void 0), x.pop();
				break;
			}
			case e === "#text":
				a = w.call(s, document.createTextNode(""), t);
				break;
			case e === "<>":
				a = w.call(s, document.createDocumentFragment(), t);
				break;
			case f !== "html":
				a = w.call(s, document.createElementNS(f, e), t);
				break;
			case !a:
				a = w.call(s, document.createElement(e), t);
		}
		return n.forEach((u) => u(a)), a;
	}
	var { setDeleteAttr: S } = C;
	function w(e, ...t) {
		let n = this, s = b(this);
		if (!t.length)
			return e;
		let f = (e instanceof SVGElement ? F : W).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([u, d]) {
			d = s.processReactiveAttribute(e, u, d, a);
			let [h] = u;
			if (h === "=")
				return f(u.slice(1), d);
			if (h === ".")
				return L(e, u.slice(1), d);
			if (/(aria|data)([A-Z])/.test(u))
				return u = u.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), f(u, d);
			switch (u === "className" && (u = "class"), u) {
				case "xlink:href":
					return f(u, d, "http://www.w3.org/1999/xlink");
				case "textContent":
					return S(e, u, d);
				case "style":
					if (typeof d != "object")
						break;
				case "dataset":
					return O(s, d, L.bind(null, e[u]));
				case "ariaset":
					return O(s, d, (l, c) => f("aria-" + l, c));
				case "classList":
					return T.call(n, e, d);
			}
			return M(e, u) ? S(e, u, d) : f(u, d);
		}), e;
	}
	function T(e, t) {
		let n = b(this);
		return O(
			n,
			t,
			(s, r) => e.classList.toggle(s, r === -1 ? void 0 : !!r)
		), e;
	}
	function $(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function M(e, t) {
		if (!Reflect.has(e, t))
			return !1;
		let n = D(e, t);
		return !g(n.set);
	}
	function D(e, t) {
		if (e = Object.getPrototypeOf(e), !e)
			return {};
		let n = Object.getOwnPropertyDescriptor(e, t);
		return n || D(e, t);
	}
	function O(e, t, n) {
		if (!(typeof t != "object" || t === null))
			return Object.entries(t).forEach(function([r, f]) {
				r && (f = e.processReactiveAttribute(t, r, f, (a) => n(...a)), n(r, f));
			});
	}
	function N(e) {
		return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
	}
	function W(e, t, n, s) {
		return e[(g(s) ? "remove" : "set") + t](n, N(s));
	}
	function F(e, t, n, s, r = null) {
		return e[(g(s) ? "remove" : "set") + t + "NS"](r, n, N(s));
	}
	function L(e, t, n) {
		if (Reflect.set(e, t, n), !!g(n))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function Q(e, t, ...n) {
		let s = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
		return e.dispatchEvent(s);
	}
	function y(e, t, n) {
		return function(r) {
			return r.addEventListener(e, t, n), r;
		};
	}
	var A = q(), U = /* @__PURE__ */ new WeakSet();
	y.connected = function(e, t) {
		let n = "connected";
		return typeof t != "object" && (t = {}), t.once = !0, function(r) {
			let f = "dde:" + n;
			return r.addEventListener(f, e, t), r.__dde_lifecycleToEvents ? r : r.isConnected ? (r.dispatchEvent(new Event(f)), r) : (_(t.signal, () => A.offConnected(r, e)) && A.onConnected(r, e), r);
		};
	};
	y.disconnected = function(e, t) {
		let n = "disconnected";
		return typeof t != "object" && (t = {}), t.once = !0, function(r) {
			let f = "dde:" + n;
			return r.addEventListener(f, e, t), r.__dde_lifecycleToEvents || _(t.signal, () => A.offDisconnected(r, e)) && A.onDisconnected(r, e), r;
		};
	};
	y.attributeChanged = function(e, t) {
		let n = "attributeChanged";
		return typeof t != "object" && (t = {}), function(r) {
			let f = "dde:" + n;
			if (r.addEventListener(f, e, t), r.__dde_lifecycleToEvents || U.has(r))
				return r;
			let a = new MutationObserver(function(d) {
				for (let { attributeName: h, target: l } of d)
					l.dispatchEvent(
						new CustomEvent(f, { detail: [h, l.getAttribute(h)] })
					);
			});
			return _(t.signal, () => a.disconnect()) && a.observe(r, { attributes: !0 }), r;
		};
	};
	function q() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
			for (let o of c)
				if (o.type === "childList") {
					if (h(o.addedNodes, !0)) {
						a();
						continue;
					}
					l(o.removedNodes, !0) && a();
				}
		});
		return {
			onConnected(c, o) {
				f();
				let i = r(c);
				i.connected.has(o) || (i.connected.add(o), i.length_c += 1);
			},
			offConnected(c, o) {
				if (!e.has(c))
					return;
				let i = e.get(c);
				i.connected.has(o) && (i.connected.delete(o), i.length_c -= 1, s(c, i));
			},
			onDisconnected(c, o) {
				f();
				let i = r(c);
				i.disconnected.has(o) || (i.disconnected.add(o), i.length_d += 1);
			},
			offDisconnected(c, o) {
				if (!e.has(c))
					return;
				let i = e.get(c);
				i.disconnected.has(o) && (i.disconnected.delete(o), i.length_d -= 1, s(c, i));
			}
		};
		function s(c, o) {
			o.length_c || o.length_d || (e.delete(c), a());
		}
		function r(c) {
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
		function f() {
			t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
		}
		function a() {
			!t || e.size || (t = !1, n.disconnect());
		}
		function u() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function d(c) {
			e.size > 30 && await u();
			let o = [];
			if (!(c instanceof Node))
				return o;
			for (let i of e.keys())
				i === c || !(i instanceof Node) || c.contains(i) && o.push(i);
			return o;
		}
		function h(c, o) {
			let i = !1;
			for (let p of c) {
				if (o && d(p).then(h), !e.has(p))
					continue;
				let v = e.get(p);
				v.length_c && (p.dispatchEvent(new Event("dde:connected")), v.connected = /* @__PURE__ */ new WeakSet(), v.length_c = 0, v.length_d || e.delete(p), i = !0);
			}
			return i;
		}
		function l(c, o) {
			let i = !1;
			for (let p of c)
				o && d(p).then(l), !(!e.has(p) || !e.get(p).length_d) && (p.dispatchEvent(new Event("dde:disconnected")), e.delete(p), i = !0);
			return i;
		}
	}
	
	// index.js
	[HTMLElement, SVGElement, DocumentFragment].forEach((e) => {
		let { append: t } = e.prototype;
		e.prototype.append = function(...n) {
			return t.apply(this, n), this;
		};
	});
	
	globalThis.dde= {
		assign: w,
		classListDeclarative: T,
		createElement: V,
		dispatchEvent: Q,
		el: V,
		empty: $,
		on: y,
		registerReactivity: P,
		scope: x
	};
	
})();