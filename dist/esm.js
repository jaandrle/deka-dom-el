// src/signals-common.js
var m = {
	isSignal(e) {
		return !1;
	},
	processReactiveAttribute(e, t, n, i) {
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
	let i = this, r = b(this), { namespace: f } = x, d = !1, o;
	switch ((Object(t) !== t || r.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			d = !0, x.push({ scope: e, host: (a) => a ? (n.unshift(a), void 0) : o }), o = e(t || void 0);
			break;
		}
		case e === "#text":
			o = w.call(i, document.createTextNode(""), t);
			break;
		case e === "<>":
			o = w.call(i, document.createDocumentFragment(), t);
			break;
		case f !== "html":
			o = w.call(i, document.createElementNS(f, e), t);
			break;
		case !o:
			o = w.call(i, document.createElement(e), t);
	}
	return n.forEach((a) => a(o)), d && x.pop(), o;
}
var { setDeleteAttr: S } = C;
function w(e, ...t) {
	let n = this, i = b(this);
	if (!t.length)
		return e;
	let f = (e instanceof SVGElement ? F : W).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function d([o, a]) {
		a = i.processReactiveAttribute(e, o, a, d);
		let [l] = o;
		if (l === "=")
			return f(o.slice(1), a);
		if (l === ".")
			return L(e, o.slice(1), a);
		if (/(aria|data)([A-Z])/.test(o))
			return o = o.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), f(o, a);
		switch (o === "className" && (o = "class"), o) {
			case "xlink:href":
				return f(o, a, "http://www.w3.org/1999/xlink");
			case "textContent":
				return S(e, o, a);
			case "style":
				if (typeof a != "object")
					break;
			case "dataset":
				return O(i, a, L.bind(null, e[o]));
			case "ariaset":
				return O(i, a, (h, c) => f("aria-" + h, c));
			case "classList":
				return T.call(n, e, a);
		}
		return M(e, o) ? S(e, o, a) : f(o, a);
	}), e;
}
function T(e, t) {
	let n = b(this);
	return O(
		n,
		t,
		(i, r) => e.classList.toggle(i, r === -1 ? void 0 : !!r)
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
			r && (f = e.processReactiveAttribute(t, r, f, (d) => n(...d)), n(r, f));
		});
}
function N(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function W(e, t, n, i) {
	return e[(g(i) ? "remove" : "set") + t](n, N(i));
}
function F(e, t, n, i, r = null) {
	return e[(g(i) ? "remove" : "set") + t + "NS"](r, n, N(i));
}
function L(e, t, n) {
	if (Reflect.set(e, t, n), !!g(n))
		return Reflect.deleteProperty(e, t);
}

// src/events.js
function Q(e, t, ...n) {
	let i = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(i);
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
		let d = new MutationObserver(function(a) {
			for (let { attributeName: l, target: h } of a)
				h.dispatchEvent(
					new CustomEvent(f, { detail: [l, h.getAttribute(l)] })
				);
		});
		return _(t.signal, () => d.disconnect()) && d.observe(r, { attributes: !0 }), r;
	};
};
function q() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
		for (let s of c)
			if (s.type === "childList") {
				if (l(s.addedNodes, !0)) {
					d();
					continue;
				}
				h(s.removedNodes, !0) && d();
			}
	});
	return {
		onConnected(c, s) {
			f();
			let u = r(c);
			u.connected.has(s) || (u.connected.add(s), u.length_c += 1);
		},
		offConnected(c, s) {
			if (!e.has(c))
				return;
			let u = e.get(c);
			u.connected.has(s) && (u.connected.delete(s), u.length_c -= 1, i(c, u));
		},
		onDisconnected(c, s) {
			f();
			let u = r(c);
			u.disconnected.has(s) || (u.disconnected.add(s), u.length_d += 1);
		},
		offDisconnected(c, s) {
			if (!e.has(c))
				return;
			let u = e.get(c);
			u.disconnected.has(s) && (u.disconnected.delete(s), u.length_d -= 1, i(c, u));
		}
	};
	function i(c, s) {
		s.length_c || s.length_d || (e.delete(c), d());
	}
	function r(c) {
		if (e.has(c))
			return e.get(c);
		let s = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return e.set(c, s), s;
	}
	function f() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function d() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function o() {
		return new Promise(function(c) {
			(requestIdleCallback || requestAnimationFrame)(c);
		});
	}
	async function a(c) {
		e.size > 30 && await o();
		let s = [];
		if (!(c instanceof Node))
			return s;
		for (let u of e.keys())
			u === c || !(u instanceof Node) || c.contains(u) && s.push(u);
		return s;
	}
	function l(c, s) {
		let u = !1;
		for (let p of c) {
			if (s && a(p).then(l), !e.has(p))
				continue;
			let v = e.get(p);
			v.length_c && (p.dispatchEvent(new Event("dde:connected")), v.connected = /* @__PURE__ */ new WeakSet(), v.length_c = 0, v.length_d || e.delete(p), u = !0);
		}
		return u;
	}
	function h(c, s) {
		let u = !1;
		for (let p of c)
			s && a(p).then(h), !(!e.has(p) || !e.get(p).length_d) && (p.dispatchEvent(new Event("dde:disconnected")), e.delete(p), u = !0);
		return u;
	}
}

// index.js
[HTMLElement, SVGElement, DocumentFragment].forEach((e) => {
	let { append: t } = e.prototype;
	e.prototype.append = function(...n) {
		return t.apply(this, n), this;
	};
});
export {
	w as assign,
	T as classListDeclarative,
	V as createElement,
	Q as dispatchEvent,
	V as el,
	$ as empty,
	y as on,
	P as registerReactivity,
	x as scope
};
