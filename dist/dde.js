//deka-dom-el library is available via global namespace `dde`
(()=> {
	// src/signals-common.js
	var m = {
		isSignal(e) {
			return !1;
		},
		processReactiveAttribute(e, t, n, u) {
			return n;
		}
	};
	function T(e, t = !0) {
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
	var C = { setDeleteAttr: M };
	function M(e, t, n) {
		if (Reflect.set(e, t, n), !!g(n)) {
			if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
				return e.removeAttribute(t);
			if (Reflect.get(e, t) === "undefined")
				return Reflect.set(e, t, "");
		}
	}
	
	// src/dom.js
	var E = [{
		scope: document.body,
		namespace: "html",
		host: (e) => e ? e(document.body) : document.body,
		prevent: !0
	}], R = (e) => e === "svg" ? "http://www.w3.org/2000/svg" : e, x = {
		get current() {
			return E[E.length - 1];
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
		preventDefault() {
			let { current: e } = this;
			return e.prevent = !0, e;
		},
		elNamespace(e) {
			let t = this.namespace;
			return this.namespace = e, {
				append(...n) {
					return x.namespace = t, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
				}
			};
		},
		get state() {
			return [...E];
		},
		push(e = {}) {
			return e.namespace && (e.namespace = R(e.namespace)), E.push(Object.assign({}, this.current, { prevent: !1 }, e));
		},
		pop() {
			return E.pop();
		}
	};
	function V(e, t, ...n) {
		let u = b(this), { namespace: r } = x, f = 0, a;
		switch ((Object(t) !== t || u.isSignal(t)) && (t = { textContent: t }), !0) {
			case typeof e == "function": {
				f = 1, x.push({ scope: e, host: (i) => i ? (f === 1 ? n.unshift(i) : i(a), void 0) : a }), a = e(t || void 0), (a instanceof HTMLElement ? P : j)(a, "Attribute", "dde-fun", e.name);
				break;
			}
			case e === "#text":
				a = w.call(this, document.createTextNode(""), t);
				break;
			case e === "<>":
				a = w.call(this, document.createDocumentFragment(), t);
				break;
			case r !== "html":
				a = w.call(this, document.createElementNS(r, e), t);
				break;
			case !a:
				a = w.call(this, document.createElement(e), t);
		}
		return n.forEach((i) => i(a)), f && x.pop(), f = 2, a;
	}
	var { setDeleteAttr: S } = C;
	function w(e, ...t) {
		let n = this, u = b(this);
		if (!t.length)
			return e;
		let f = (e instanceof SVGElement ? j : P).bind(null, e, "Attribute");
		return Object.entries(Object.assign({}, ...t)).forEach(function a([i, d]) {
			d = u.processReactiveAttribute(e, i, d, a);
			let [l] = i;
			if (l === "=")
				return f(i.slice(1), d);
			if (l === ".")
				return L(e, i.slice(1), d);
			if (/(aria|data)([A-Z])/.test(i))
				return i = i.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), f(i, d);
			switch (i === "className" && (i = "class"), i) {
				case "xlink:href":
					return f(i, d, "http://www.w3.org/1999/xlink");
				case "textContent":
					return S(e, i, d);
				case "style":
					if (typeof d != "object")
						break;
				case "dataset":
					return O(u, d, L.bind(null, e[i]));
				case "ariaset":
					return O(u, d, (h, c) => f("aria-" + h, c));
				case "classList":
					return W.call(n, e, d);
			}
			return F(e, i) ? S(e, i, d) : f(i, d);
		}), e;
	}
	function W(e, t) {
		let n = b(this);
		return O(
			n,
			t,
			(u, r) => e.classList.toggle(u, r === -1 ? void 0 : !!r)
		), e;
	}
	function $(e) {
		return Array.from(e.children).forEach((t) => t.remove()), e;
	}
	function F(e, t) {
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
	function P(e, t, n, u) {
		return e[(g(u) ? "remove" : "set") + t](n, N(u));
	}
	function j(e, t, n, u, r = null) {
		return e[(g(u) ? "remove" : "set") + t + "NS"](r, n, N(u));
	}
	function L(e, t, n) {
		if (Reflect.set(e, t, n), !!g(n))
			return Reflect.deleteProperty(e, t);
	}
	
	// src/events.js
	function Q(e, t, ...n) {
		let u = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
		return e.dispatchEvent(u);
	}
	function y(e, t, n) {
		return function(r) {
			return r.addEventListener(e, t, n), r;
		};
	}
	var A = U(), H = /* @__PURE__ */ new WeakSet();
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
			if (r.addEventListener(f, e, t), r.__dde_lifecycleToEvents || H.has(r))
				return r;
			let a = new MutationObserver(function(d) {
				for (let { attributeName: l, target: h } of d)
					h.dispatchEvent(
						new CustomEvent(f, { detail: [l, h.getAttribute(l)] })
					);
			});
			return _(t.signal, () => a.disconnect()) && a.observe(r, { attributes: !0 }), r;
		};
	};
	function U() {
		let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
			for (let o of c)
				if (o.type === "childList") {
					if (l(o.addedNodes, !0)) {
						a();
						continue;
					}
					h(o.removedNodes, !0) && a();
				}
		});
		return {
			onConnected(c, o) {
				f();
				let s = r(c);
				s.connected.has(o) || (s.connected.add(o), s.length_c += 1);
			},
			offConnected(c, o) {
				if (!e.has(c))
					return;
				let s = e.get(c);
				s.connected.has(o) && (s.connected.delete(o), s.length_c -= 1, u(c, s));
			},
			onDisconnected(c, o) {
				f();
				let s = r(c);
				s.disconnected.has(o) || (s.disconnected.add(o), s.length_d += 1);
			},
			offDisconnected(c, o) {
				if (!e.has(c))
					return;
				let s = e.get(c);
				s.disconnected.has(o) && (s.disconnected.delete(o), s.length_d -= 1, u(c, s));
			}
		};
		function u(c, o) {
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
		function i() {
			return new Promise(function(c) {
				(requestIdleCallback || requestAnimationFrame)(c);
			});
		}
		async function d(c) {
			e.size > 30 && await i();
			let o = [];
			if (!(c instanceof Node))
				return o;
			for (let s of e.keys())
				s === c || !(s instanceof Node) || c.contains(s) && o.push(s);
			return o;
		}
		function l(c, o) {
			let s = !1;
			for (let p of c) {
				if (o && d(p).then(l), !e.has(p))
					continue;
				let v = e.get(p);
				v.length_c && (p.dispatchEvent(new Event("dde:connected")), v.connected = /* @__PURE__ */ new WeakSet(), v.length_c = 0, v.length_d || e.delete(p), s = !0);
			}
			return s;
		}
		function h(c, o) {
			let s = !1;
			for (let p of c)
				o && d(p).then(h), !(!e.has(p) || !e.get(p).length_d) && (p.dispatchEvent(new Event("dde:disconnected")), e.delete(p), s = !0);
			return s;
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
		classListDeclarative: W,
		createElement: V,
		dispatchEvent: Q,
		el: V,
		empty: $,
		on: y,
		registerReactivity: T,
		scope: x
	};
	
})();