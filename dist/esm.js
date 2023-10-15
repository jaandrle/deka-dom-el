// src/signals-common.js
var v = {
	isSignal(t) {
		return !1;
	},
	processReactiveAttribute(t, e, n, c) {
		return n;
	}
};
function F(t, e = !0) {
	return e ? Object.assign(v, t) : (Object.setPrototypeOf(t, v), t);
}
function m(t) {
	return v.isPrototypeOf(t) && t !== v ? t : v;
}

// src/helpers.js
function h(t) {
	return typeof t > "u";
}
function _(t, e) {
	if (!t || !(t instanceof AbortSignal))
		return !0;
	if (!t.aborted)
		return t.addEventListener("abort", e), function() {
			t.removeEventListener("abort", e);
		};
}

// src/dom-common.js
var R = { setDeleteAttr: H };
function H(t, e, n) {
	if (Reflect.set(t, e, n), !!h(n)) {
		if (Reflect.deleteProperty(t, e), t instanceof HTMLElement && t.getAttribute(e) === "undefined")
			return t.removeAttribute(e);
		if (Reflect.get(t, e) === "undefined")
			return Reflect.set(t, e, "");
	}
}

// src/dom.js
var E = [{
	scope: document.body,
	namespace: "html",
	host: (t) => t ? t(document.body) : document.body,
	prevent: !0
}], S = (t) => t === "svg" ? "http://www.w3.org/2000/svg" : t, x = {
	get current() {
		return E[E.length - 1];
	},
	get host() {
		return this.current.host;
	},
	get namespace() {
		return this.current.namespace;
	},
	set namespace(t) {
		return this.current.namespace = S(t);
	},
	preventDefault() {
		let { current: t } = this;
		return t.prevent = !0, t;
	},
	elNamespace(t) {
		let e = this.namespace;
		return this.namespace = t, {
			append(...n) {
				return x.namespace = e, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
			}
		};
	},
	get state() {
		return [...E];
	},
	push(t = {}) {
		return t.namespace && (t.namespace = S(t.namespace)), E.push(Object.assign({}, this.current, { prevent: !1 }, t));
	},
	pop() {
		return E.pop();
	}
};
function J(t, e, ...n) {
	let c = m(this), { namespace: r } = x, f = 0, u;
	switch ((Object(e) !== e || c.isSignal(e)) && (e = { textContent: e }), !0) {
		case typeof t == "function": {
			f = 1, x.push({ scope: t, host: (a) => a ? (f === 1 ? n.unshift(a) : a(u), void 0) : u }), u = t(e || void 0), (u instanceof HTMLElement ? M : W)(u, "Attribute", "dde-fun", t.name);
			break;
		}
		case t === "#text":
			u = w.call(this, document.createTextNode(""), e);
			break;
		case t === "<>":
			u = w.call(this, document.createDocumentFragment(), e);
			break;
		case r !== "html":
			u = w.call(this, document.createElementNS(r, t), e);
			break;
		case !u:
			u = w.call(this, document.createElement(t), e);
	}
	return n.forEach((a) => a(u)), f && x.pop(), f = 2, u;
}
var { setDeleteAttr: L } = R, A = /* @__PURE__ */ new WeakMap();
function w(t, ...e) {
	if (!e.length)
		return t;
	A.set(t, P(t, this));
	for (let [n, c] of Object.entries(Object.assign({}, ...e)))
		N.call(this, t, n, c);
	return A.delete(t), t;
}
function N(t, e, n) {
	let { setRemoveAttr: c, s: r } = P(t, this), f = this;
	n = r.processReactiveAttribute(
		t,
		e,
		n,
		(a, p) => N.call(f, t, a, p)
	);
	let [u] = e;
	if (u === "=")
		return c(e.slice(1), n);
	if (u === ".")
		return D(t, e.slice(1), n);
	if (/(aria|data)([A-Z])/.test(e))
		return e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), c(e, n);
	switch (e === "className" && (e = "class"), e) {
		case "xlink:href":
			return c(e, n, "http://www.w3.org/1999/xlink");
		case "textContent":
			return L(t, e, n);
		case "style":
			if (typeof n != "object")
				break;
		case "dataset":
			return y(r, n, D.bind(null, t[e]));
		case "ariaset":
			return y(r, n, (a, p) => c("aria-" + a, p));
		case "classList":
			return U.call(f, t, n);
	}
	return q(t, e) ? L(t, e, n) : c(e, n);
}
function P(t, e) {
	if (A.has(t))
		return A.get(t);
	let c = (t instanceof SVGElement ? W : M).bind(null, t, "Attribute"), r = m(e);
	return { setRemoveAttr: c, s: r };
}
function U(t, e) {
	let n = m(this);
	return y(
		n,
		e,
		(c, r) => t.classList.toggle(c, r === -1 ? void 0 : !!r)
	), t;
}
function Q(t) {
	return Array.from(t.children).forEach((e) => e.remove()), t;
}
function q(t, e) {
	if (!Reflect.has(t, e))
		return !1;
	let n = j(t, e);
	return !h(n.set);
}
function j(t, e) {
	if (t = Object.getPrototypeOf(t), !t)
		return {};
	let n = Object.getOwnPropertyDescriptor(t, e);
	return n || j(t, e);
}
function y(t, e, n) {
	if (!(typeof e != "object" || e === null))
		return Object.entries(e).forEach(function([r, f]) {
			r && (f = t.processReactiveAttribute(e, r, f, n), n(r, f));
		});
}
function T(t) {
	return Array.isArray(t) ? t.filter(Boolean).join(" ") : t;
}
function M(t, e, n, c) {
	return t[(h(c) ? "remove" : "set") + e](n, T(c));
}
function W(t, e, n, c, r = null) {
	return t[(h(c) ? "remove" : "set") + e + "NS"](r, n, T(c));
}
function D(t, e, n) {
	if (Reflect.set(t, e, n), !!h(n))
		return Reflect.deleteProperty(t, e);
}

// src/events.js
function k(t, e, ...n) {
	let c = n.length ? new CustomEvent(e, { detail: n[0] }) : new Event(e);
	return t.dispatchEvent(c);
}
function C(t, e, n) {
	return function(r) {
		return r.addEventListener(t, e, n), r;
	};
}
var O = B(), z = /* @__PURE__ */ new WeakSet();
C.connected = function(t, e) {
	let n = "connected";
	return typeof e != "object" && (e = {}), e.once = !0, function(r) {
		let f = "dde:" + n;
		return r.addEventListener(f, t, e), r.__dde_lifecycleToEvents ? r : r.isConnected ? (r.dispatchEvent(new Event(f)), r) : (_(e.signal, () => O.offConnected(r, t)) && O.onConnected(r, t), r);
	};
};
C.disconnected = function(t, e) {
	let n = "disconnected";
	return typeof e != "object" && (e = {}), e.once = !0, function(r) {
		let f = "dde:" + n;
		return r.addEventListener(f, t, e), r.__dde_lifecycleToEvents || _(e.signal, () => O.offDisconnected(r, t)) && O.onDisconnected(r, t), r;
	};
};
C.attributeChanged = function(t, e) {
	let n = "attributeChanged";
	return typeof e != "object" && (e = {}), function(r) {
		let f = "dde:" + n;
		if (r.addEventListener(f, t, e), r.__dde_lifecycleToEvents || z.has(r))
			return r;
		let u = new MutationObserver(function(p) {
			for (let { attributeName: l, target: g } of p)
				g.dispatchEvent(
					new CustomEvent(f, { detail: [l, g.getAttribute(l)] })
				);
		});
		return _(e.signal, () => u.disconnect()) && u.observe(r, { attributes: !0 }), r;
	};
};
function B() {
	let t = /* @__PURE__ */ new Map(), e = !1, n = new MutationObserver(function(o) {
		for (let s of o)
			if (s.type === "childList") {
				if (l(s.addedNodes, !0)) {
					u();
					continue;
				}
				g(s.removedNodes, !0) && u();
			}
	});
	return {
		onConnected(o, s) {
			f();
			let i = r(o);
			i.connected.has(s) || (i.connected.add(s), i.length_c += 1);
		},
		offConnected(o, s) {
			if (!t.has(o))
				return;
			let i = t.get(o);
			i.connected.has(s) && (i.connected.delete(s), i.length_c -= 1, c(o, i));
		},
		onDisconnected(o, s) {
			f();
			let i = r(o);
			i.disconnected.has(s) || (i.disconnected.add(s), i.length_d += 1);
		},
		offDisconnected(o, s) {
			if (!t.has(o))
				return;
			let i = t.get(o);
			i.disconnected.has(s) && (i.disconnected.delete(s), i.length_d -= 1, c(o, i));
		}
	};
	function c(o, s) {
		s.length_c || s.length_d || (t.delete(o), u());
	}
	function r(o) {
		if (t.has(o))
			return t.get(o);
		let s = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return t.set(o, s), s;
	}
	function f() {
		e || (e = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function u() {
		!e || t.size || (e = !1, n.disconnect());
	}
	function a() {
		return new Promise(function(o) {
			(requestIdleCallback || requestAnimationFrame)(o);
		});
	}
	async function p(o) {
		t.size > 30 && await a();
		let s = [];
		if (!(o instanceof Node))
			return s;
		for (let i of t.keys())
			i === o || !(i instanceof Node) || o.contains(i) && s.push(i);
		return s;
	}
	function l(o, s) {
		let i = !1;
		for (let d of o) {
			if (s && p(d).then(l), !t.has(d))
				continue;
			let b = t.get(d);
			b.length_c && (d.dispatchEvent(new Event("dde:connected")), b.connected = /* @__PURE__ */ new WeakSet(), b.length_c = 0, b.length_d || t.delete(d), i = !0);
		}
		return i;
	}
	function g(o, s) {
		let i = !1;
		for (let d of o)
			s && p(d).then(g), !(!t.has(d) || !t.get(d).length_d) && (d.dispatchEvent(new Event("dde:disconnected")), t.delete(d), i = !0);
		return i;
	}
}

// index.js
[HTMLElement, SVGElement, DocumentFragment].forEach((t) => {
	let { append: e } = t.prototype;
	t.prototype.append = function(...n) {
		return e.apply(this, n), this;
	};
});
export {
	w as assign,
	N as assignAttribute,
	U as classListDeclarative,
	J as createElement,
	k as dispatchEvent,
	J as el,
	Q as empty,
	C as on,
	F as registerReactivity,
	x as scope
};
