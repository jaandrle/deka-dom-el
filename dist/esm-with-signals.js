// src/signals-common.js
var w = {
	isSignal(e) {
		return !1;
	},
	processReactiveAttribute(e, t, n, r) {
		return n;
	}
};
function N(e, t = !0) {
	return t ? Object.assign(w, e) : (Object.setPrototypeOf(e, w), e);
}
function x(e) {
	return w.isPrototypeOf(e) && e !== w ? e : w;
}

// src/helpers.js
function v(e) {
	return typeof e > "u";
}
function j(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}
function A(e, t) {
	if (!e || !(e instanceof AbortSignal))
		return !0;
	if (!e.aborted)
		return e.addEventListener("abort", t), function() {
			e.removeEventListener("abort", t);
		};
}

// src/dom-common.js
var T = { setDeleteAttr: k };
function k(e, t, n) {
	if (Reflect.set(e, t, n), !!v(n)) {
		if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
			return e.removeAttribute(t);
		if (Reflect.get(e, t) === "undefined")
			return Reflect.set(e, t, "");
	}
}

// src/dom.js
var y = [{ scope: document.body, namespace: "html", host: (e) => e ? e(document.body) : document.body }], W = (e) => e === "svg" ? "http://www.w3.org/2000/svg" : e, E = {
	get current() {
		return y[y.length - 1];
	},
	get state() {
		return [...y];
	},
	get host() {
		return this.current.host;
	},
	get namespace() {
		return this.current.namespace;
	},
	set namespace(e) {
		return this.current.namespace = W(e);
	},
	elNamespace(e) {
		let t = this.namespace;
		return this.namespace = e, {
			append(...n) {
				return E.namespace = t, n.length === 1 ? n[0] : document.createDocumentFragment().append(...n);
			}
		};
	},
	push(e = {}) {
		return e.namespace && (e.namespace = W(e.namespace)), y.push(Object.assign({}, this.current, e));
	},
	pop() {
		return y.pop();
	}
};
function ie(e, t, ...n) {
	let r = this, o = x(this), { namespace: c } = E, d = !1, s;
	switch ((Object(t) !== t || o.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			d = !0, E.push({ scope: e, host: (f) => f ? (n.unshift(f), void 0) : s }), s = e(t || void 0);
			break;
		}
		case e === "#text":
			s = O.call(r, document.createTextNode(""), t);
			break;
		case e === "<>":
			s = O.call(r, document.createDocumentFragment(), t);
			break;
		case c !== "html":
			s = O.call(r, document.createElementNS(c, e), t);
			break;
		case !s:
			s = O.call(r, document.createElement(e), t);
	}
	return n.forEach((f) => f(s)), d && E.pop(), s;
}
var { setDeleteAttr: M } = T;
function O(e, ...t) {
	let n = this, r = x(this);
	if (!t.length)
		return e;
	let c = (e instanceof SVGElement ? J : I).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function d([s, f]) {
		f = r.processReactiveAttribute(e, s, f, d);
		let [m] = s;
		if (m === "=")
			return c(s.slice(1), f);
		if (m === ".")
			return F(e, s.slice(1), f);
		if (/(aria|data)([A-Z])/.test(s))
			return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), c(s, f);
		switch (s === "className" && (s = "class"), s) {
			case "xlink:href":
				return c(s, f, "http://www.w3.org/1999/xlink");
			case "textContent":
				return M(e, s, f);
			case "style":
				if (typeof f != "object")
					break;
			case "dataset":
				return D(r, f, F.bind(null, e[s]));
			case "ariaset":
				return D(r, f, (b, i) => c("aria-" + b, i));
			case "classList":
				return B.call(n, e, f);
		}
		return G(e, s) ? M(e, s, f) : c(s, f);
	}), e;
}
function B(e, t) {
	let n = x(this);
	return D(
		n,
		t,
		(r, o) => e.classList.toggle(r, o === -1 ? void 0 : !!o)
	), e;
}
function fe(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function G(e, t) {
	if (!Reflect.has(e, t))
		return !1;
	let n = z(e, t);
	return !v(n.set);
}
function z(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || z(e, t);
}
function D(e, t, n) {
	if (!(typeof t != "object" || t === null))
		return Object.entries(t).forEach(function([o, c]) {
			o && (c = e.processReactiveAttribute(t, o, c, (d) => n(...d)), n(o, c));
		});
}
function U(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function I(e, t, n, r) {
	return e[(v(r) ? "remove" : "set") + t](n, U(r));
}
function J(e, t, n, r, o = null) {
	return e[(v(r) ? "remove" : "set") + t + "NS"](o, n, U(r));
}
function F(e, t, n) {
	if (Reflect.set(e, t, n), !!v(n))
		return Reflect.deleteProperty(e, t);
}

// src/events.js
function le(e, t, ...n) {
	let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(r);
}
function S(e, t, n) {
	return function(o) {
		return o.addEventListener(e, t, n), o;
	};
}
var R = Z(), V = /* @__PURE__ */ new WeakSet();
S.connected = function(e, t) {
	let n = "connected";
	return typeof t != "object" && (t = {}), t.once = !0, function(o) {
		let c = "dde:" + n;
		return o.addEventListener(c, e, t), o.__dde_lifecycleToEvents ? o : o.isConnected ? (o.dispatchEvent(new Event(c)), o) : (A(t.signal, () => R.offConnected(o, e)) && R.onConnected(o, e), o);
	};
};
S.disconnected = function(e, t) {
	let n = "disconnected";
	return typeof t != "object" && (t = {}), t.once = !0, function(o) {
		let c = "dde:" + n;
		return o.addEventListener(c, e, t), o.__dde_lifecycleToEvents || A(t.signal, () => R.offDisconnected(o, e)) && R.onDisconnected(o, e), o;
	};
};
S.attributeChanged = function(e, t) {
	let n = "attributeChanged";
	return typeof t != "object" && (t = {}), function(o) {
		let c = "dde:" + n;
		if (o.addEventListener(c, e, t), o.__dde_lifecycleToEvents || V.has(o))
			return o;
		let d = new MutationObserver(function(f) {
			for (let { attributeName: m, target: b } of f)
				b.dispatchEvent(
					new CustomEvent(c, { detail: [m, b.getAttribute(m)] })
				);
		});
		return A(t.signal, () => d.disconnect()) && d.observe(o, { attributes: !0 }), o;
	};
};
function Z() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(i) {
		for (let u of i)
			if (u.type === "childList") {
				if (m(u.addedNodes, !0)) {
					d();
					continue;
				}
				b(u.removedNodes, !0) && d();
			}
	});
	return {
		onConnected(i, u) {
			c();
			let a = o(i);
			a.connected.has(u) || (a.connected.add(u), a.length_c += 1);
		},
		offConnected(i, u) {
			if (!e.has(i))
				return;
			let a = e.get(i);
			a.connected.has(u) && (a.connected.delete(u), a.length_c -= 1, r(i, a));
		},
		onDisconnected(i, u) {
			c();
			let a = o(i);
			a.disconnected.has(u) || (a.disconnected.add(u), a.length_d += 1);
		},
		offDisconnected(i, u) {
			if (!e.has(i))
				return;
			let a = e.get(i);
			a.disconnected.has(u) && (a.disconnected.delete(u), a.length_d -= 1, r(i, a));
		}
	};
	function r(i, u) {
		u.length_c || u.length_d || (e.delete(i), d());
	}
	function o(i) {
		if (e.has(i))
			return e.get(i);
		let u = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		return e.set(i, u), u;
	}
	function c() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function d() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function s() {
		return new Promise(function(i) {
			(requestIdleCallback || requestAnimationFrame)(i);
		});
	}
	async function f(i) {
		e.size > 30 && await s();
		let u = [];
		if (!(i instanceof Node))
			return u;
		for (let a of e.keys())
			a === i || !(a instanceof Node) || i.contains(a) && u.push(a);
		return u;
	}
	function m(i, u) {
		let a = !1;
		for (let p of i) {
			if (u && f(p).then(m), !e.has(p))
				continue;
			let _ = e.get(p);
			_.length_c && (p.dispatchEvent(new Event("dde:connected")), _.connected = /* @__PURE__ */ new WeakSet(), _.length_c = 0, _.length_d || e.delete(p), a = !0);
		}
		return a;
	}
	function b(i, u) {
		let a = !1;
		for (let p of i)
			u && f(p).then(b), !(!e.has(p) || !e.get(p).length_d) && (p.dispatchEvent(new Event("dde:disconnected")), e.delete(p), a = !0);
		return a;
	}
}

// index.js
[HTMLElement, SVGElement, DocumentFragment].forEach((e) => {
	let { append: t } = e.prototype;
	e.prototype.append = function(...n) {
		return t.apply(this, n), this;
	};
});

// src/signals-lib.js
var l = Symbol.for("Signal");
function C(e) {
	try {
		return Reflect.has(e, l);
	} catch {
		return !1;
	}
}
var g = /* @__PURE__ */ new WeakMap();
function h(e, t) {
	if (typeof e != "function")
		return $(e, t);
	if (C(e))
		return e;
	let n = $(""), r = () => n(e());
	return g.set(r, /* @__PURE__ */ new Set([n])), X(r), n;
}
h.action = function(e, t, ...n) {
	let r = e[l], { actions: o } = r;
	if (!o || !Reflect.has(o, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (o[t].apply(r, n), r.skip)
		return Reflect.deleteProperty(r, "skip");
	r.listeners.forEach((c) => c(r.value));
};
h.on = function e(t, n, r = {}) {
	let { signal: o } = r;
	if (!(o && o.aborted)) {
		if (Array.isArray(t))
			return t.forEach((c) => e(c, n, r));
		P(t, n), o && o.addEventListener("abort", () => H(t, n));
	}
};
h.symbols = {
	signal: l,
	onclear: Symbol.for("Signal.onclear")
};
h.attribute = function(e, t = void 0) {
	let { host: n } = E, r = n() && n().hasAttribute(e) ? n().getAttribute(e) : t, o = new AbortController(), c = h(r, {
		[h.symbols.onclear]() {
			o.abort();
		}
	});
	return E.host(S.attributeChanged(function({ detail: d }) {
		let [s, f] = d;
		s === e && c(f);
	}, { signal: o.signal })), c;
};
h.clear = function(...e) {
	for (let n of e) {
		Reflect.deleteProperty(n, "toJSON");
		let r = n[l], { onclear: o } = h.symbols;
		r.actions && r.actions[o] && r.actions[o].call(r), t(n, r), Reflect.deleteProperty(n, l);
	}
	function t(n, r) {
		r.listeners.forEach((o) => {
			if (r.listeners.delete(o), !g.has(o))
				return;
			let c = g.get(o);
			c.delete(n), !(c.size > 1) && (h.clear(...c), g.delete(o));
		});
	}
};
h.el = function(e, t) {
	let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
	o.append(n, r);
	let c = (d) => {
		if (!n.parentNode || !r.parentNode)
			return H(e, c);
		let s = t(d);
		Array.isArray(s) || (s = [s]);
		let f = n;
		for (; (f = n.nextSibling) !== r; )
			f.remove();
		n.after(...s);
	};
	return P(e, c), c(e()), o;
};
var q = {
	isSignal: C,
	processReactiveAttribute(e, t, n, r) {
		return C(n) ? (P(n, (o) => r([t, o])), n()) : n;
	}
};
function $(e, t) {
	let n = (...r) => r.length ? te(n, ...r) : ee(n);
	return Q(n, e, t);
}
var K = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function Q(e, t, n) {
	return j(n) !== "[object Object]" && (n = {}), e[l] = {
		value: t,
		actions: n,
		listeners: /* @__PURE__ */ new Set()
	}, e.toJSON = () => e(), Object.setPrototypeOf(e[l], K), e;
}
var L = [];
function X(e) {
	let t = function() {
		L.push(t), e(), L.pop();
	};
	g.has(e) && (g.set(t, g.get(e)), g.delete(e)), t();
}
function Y() {
	return L[L.length - 1];
}
function ee(e) {
	if (!e[l])
		return;
	let { value: t, listeners: n } = e[l], r = Y();
	return r && n.add(r), g.has(r) && g.get(r).add(e), t;
}
function te(e, t, n) {
	if (!e[l])
		return;
	let r = e[l];
	if (!(!n && r.value === t))
		return r.value = t, r.listeners.forEach((o) => o(t)), t;
}
function P(e, t) {
	if (e[l])
		return e[l].listeners.add(t);
}
function H(e, t) {
	if (e[l])
		return e[l].listeners.delete(t);
}

// signals.js
N(q);
export {
	h as S,
	O as assign,
	B as classListDeclarative,
	ie as createElement,
	le as dispatchEvent,
	ie as el,
	fe as empty,
	C as isSignal,
	S as on,
	N as registerReactivity,
	E as scope
};
