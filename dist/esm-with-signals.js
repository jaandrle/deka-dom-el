// src/signals-common.js
var E = {
	isSignal(e) {
		return !1;
	},
	processReactiveAttribute(e, t, n, r) {
		return n;
	}
};
function C(e, t = !0) {
	return t ? Object.assign(E, e) : (Object.setPrototypeOf(e, E), e);
}
function x(e) {
	return E.isPrototypeOf(e) && e !== E ? e : E;
}

// src/helpers.js
function m(e) {
	return typeof e > "u";
}
function N(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
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
var P = { setDeleteAttr: W };
function W(e, t, n) {
	if (Reflect.set(e, t, n), !!m(n)) {
		if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
			return e.removeAttribute(t);
		if (Reflect.get(e, t) === "undefined")
			return Reflect.set(e, t, "");
	}
}

// src/dom.js
var w = "html";
function oe(e) {
	return w = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(...t) {
			return w = "html", t.length === 1 ? t[0] : document.createDocumentFragment().append(...t);
		}
	};
}
function ce(e, t, ...n) {
	let r = this, o = x(this), c;
	switch ((Object(t) !== t || o.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			c = e(t || void 0, (s) => s ? (n.unshift(s), void 0) : c);
			break;
		}
		case e === "#text":
			c = S.call(r, document.createTextNode(""), t);
			break;
		case e === "<>":
			c = S.call(r, document.createDocumentFragment(), t);
			break;
		case w !== "html":
			c = S.call(r, document.createElementNS(w, e), t);
			break;
		case !c:
			c = S.call(r, document.createElement(e), t);
	}
	return n.forEach((p) => p(c)), c;
}
var { setDeleteAttr: j } = P;
function S(e, ...t) {
	let n = this, r = x(this);
	if (!t.length)
		return e;
	let c = (e instanceof SVGElement ? I : H).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function p([s, a]) {
		a = r.processReactiveAttribute(e, s, a, p);
		let [b] = s;
		if (b === "=")
			return c(s.slice(1), a);
		if (b === ".")
			return F(e, s.slice(1), a);
		if (/(aria|data)([A-Z])/.test(s))
			return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), c(s, a);
		switch (s === "className" && (s = "class"), s) {
			case "xlink:href":
				return c(s, a, "http://www.w3.org/1999/xlink");
			case "textContent":
				return j(e, s, a);
			case "style":
				if (typeof a != "object")
					break;
			case "dataset":
				return _(r, a, F.bind(null, e[s]));
			case "ariaset":
				return _(r, a, (v, i) => c("aria-" + v, i));
			case "classList":
				return B.call(n, e, a);
		}
		return G(e, s) ? j(e, s, a) : c(s, a);
	}), e;
}
function B(e, t) {
	let n = x(this);
	return _(
		n,
		t,
		(r, o) => e.classList.toggle(r, o === -1 ? void 0 : !!o)
	), e;
}
function se(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function G(e, t) {
	if (!Reflect.has(e, t))
		return !1;
	let n = M(e, t);
	return !m(n.set);
}
function M(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || M(e, t);
}
function _(e, t, n) {
	if (!(typeof t != "object" || t === null))
		return Object.entries(t).forEach(function([o, c]) {
			o && (c = e.processReactiveAttribute(t, o, c, (p) => n(...p)), n(o, c));
		});
}
function z(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function H(e, t, n, r) {
	return e[(m(r) ? "remove" : "set") + t](n, z(r));
}
function I(e, t, n, r, o = null) {
	return e[(m(r) ? "remove" : "set") + t + "NS"](o, n, z(r));
}
function F(e, t, n) {
	if (Reflect.set(e, t, n), !!m(n))
		return Reflect.deleteProperty(e, t);
}

// src/events.js
function ae(e, t, ...n) {
	let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(r);
}
function T(e, t, n) {
	return function(o) {
		return o.addEventListener(e, t, n), o;
	};
}
var O = J();
T.connected = function(e, t) {
	return function(r) {
		return typeof r.connectedCallback == "function" ? (r.addEventListener("dde:connected", e, t), r) : (L(t && t.signal, () => O.offConnected(r, e)) && (r.isConnected ? e(new Event("dde:connected")) : O.onConnected(r, e)), r);
	};
};
T.disconnected = function(e, t) {
	return function(r) {
		return typeof r.disconnectedCallback == "function" ? (r.addEventListener("dde:disconnected", e, t), r) : (L(t && t.signal, () => O.offDisconnected(r, e)) && O.onDisconnected(r, e), r);
	};
};
function J() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(i) {
		for (let f of i)
			if (f.type === "childList") {
				if (b(f.addedNodes, !0)) {
					p();
					continue;
				}
				v(f.removedNodes, !0) && p();
			}
	});
	return {
		onConnected(i, f) {
			c(), o(i).connected.push(f);
		},
		offConnected(i, f) {
			if (!e.has(i))
				return;
			let u = e.get(i), l = u.connected;
			l.splice(l.indexOf(f), 1), r(i, u);
		},
		onDisconnected(i, f) {
			c(), o(i).disconnected.push(f);
		},
		offDisconnected(i, f) {
			if (!e.has(i))
				return;
			let u = e.get(i), l = u.disconnected;
			l.splice(l.indexOf(f), 1), r(i, u);
		}
	};
	function r(i, f) {
		f.connected.length || f.disconnected.length || (e.delete(i), p());
	}
	function o(i) {
		if (e.has(i))
			return e.get(i);
		let f = { connected: [], disconnected: [] };
		return e.set(i, f), f;
	}
	function c() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function p() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function s() {
		return new Promise(function(i) {
			(requestIdleCallback || requestAnimationFrame)(i);
		});
	}
	async function a(i) {
		e.size > 30 && await s();
		let f = [];
		if (!(i instanceof Node))
			return f;
		for (let u of e.keys())
			u === i || !(u instanceof Node) || i.contains(u) && f.push(u);
		return f;
	}
	function b(i, f) {
		for (let u of i) {
			if (f && a(u).then(b), !e.has(u))
				continue;
			let l = e.get(u);
			return l.connected.forEach((A) => A(u)), l.connected.length = 0, l.disconnected.length || e.delete(u), !0;
		}
		return !1;
	}
	function v(i, f) {
		for (let u of i) {
			if (f && a(u).then(v), !e.has(u))
				continue;
			let l = e.get(u);
			return l.disconnected.forEach((A) => A(u)), l.connected.length = 0, l.disconnected.length = 0, e.delete(u), !0;
		}
		return !1;
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
var d = Symbol.for("Signal");
function y(e) {
	try {
		return Reflect.has(e, d);
	} catch {
		return !1;
	}
}
var h = /* @__PURE__ */ new WeakMap();
function g(e, t) {
	if (typeof e != "function")
		return U(e, t);
	if (y(e))
		return e;
	let n = U(""), r = () => n(e());
	return h.set(r, /* @__PURE__ */ new Set([n])), k(r), n;
}
g.action = function(e, t, ...n) {
	let r = e[d], { actions: o } = r;
	if (!o || !Reflect.has(o, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (o[t].apply(r, n), r.skip)
		return Reflect.deleteProperty(r, "skip");
	r.listeners.forEach((c) => c(r.value));
};
g.on = function e(t, n, r = {}) {
	let { signal: o } = r;
	if (!(o && o.aborted)) {
		if (Array.isArray(t))
			return t.forEach((c) => e(c, n, r));
		D(t, n), o && o.addEventListener("abort", () => q(t, n));
	}
};
g.symbols = {
	signal: d,
	onclear: Symbol.for("Signal.onclear")
};
g.clear = function(...e) {
	for (let n of e) {
		Reflect.deleteProperty(n, "toJSON");
		let r = n[d], { onclear: o } = g.symbols;
		r.actions && r.actions[o] && r.actions[o].call(r), t(n, r), Reflect.deleteProperty(n, d);
	}
	function t(n, r) {
		r.listeners.forEach((o) => {
			if (r.listeners.delete(o), !h.has(o))
				return;
			let c = h.get(o);
			c.delete(n), !(c.size > 1) && (g.clear(...c), h.delete(o));
		});
	}
};
g.el = function(e, t) {
	let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
	o.append(n, r);
	let c = (p) => {
		if (!n.parentNode || !r.parentNode)
			return q(e, c);
		let s = t(p);
		Array.isArray(s) || (s = [s]);
		let a = n;
		for (; (a = n.nextSibling) !== r; )
			a.remove();
		n.after(...s);
	};
	return D(e, c), c(e()), o;
};
var $ = {
	isSignal: y,
	processReactiveAttribute(e, t, n, r) {
		return y(n) ? (D(n, (o) => r([t, o])), n()) : n;
	}
};
function U(e, t) {
	let n = (...r) => r.length ? X(n, r[0]) : Q(n);
	return Z(n, e, t);
}
var V = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function Z(e, t, n) {
	return N(n) !== "[object Object]" && (n = {}), e[d] = {
		value: t,
		actions: n,
		listeners: /* @__PURE__ */ new Set()
	}, e.toJSON = () => e(), Object.setPrototypeOf(e[d], V), e;
}
var R = [];
function k(e) {
	let t = function() {
		R.push(t), e(), R.pop();
	};
	h.has(e) && (h.set(t, h.get(e)), h.delete(e)), t();
}
function K() {
	return R[R.length - 1];
}
function Q(e) {
	if (!e[d])
		return;
	let { value: t, listeners: n } = e[d], r = K();
	return r && n.add(r), h.has(r) && h.get(r).add(e), t;
}
function X(e, t) {
	if (!e[d])
		return;
	let n = e[d];
	if (n.value !== t)
		return n.value = t, n.listeners.forEach((r) => r(t)), t;
}
function D(e, t) {
	if (e[d])
		return e[d].listeners.add(t);
}
function q(e, t) {
	if (e[d])
		return e[d].listeners.delete(t);
}

// signals.js
C($);
export {
	g as S,
	S as assign,
	B as classListDeclarative,
	ce as createElement,
	ae as dispatchEvent,
	ce as el,
	se as empty,
	y as isSignal,
	oe as namespace,
	T as on,
	C as registerReactivity
};
