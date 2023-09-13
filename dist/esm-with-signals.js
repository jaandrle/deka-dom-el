// src/signals-common.js
var x = {
	isTextContent(e) {
		return typeof e == "string";
	},
	processReactiveAttribute(e, t, r, n) {
		return r;
	}
};
function _(e, t = !0) {
	return t ? Object.assign(x, e) : (Object.setPrototypeOf(e, x), e);
}
function N(e) {
	return x.isPrototypeOf(e) && e !== x ? e : x;
}

// src/helpers.js
function m(e) {
	return typeof e > "u";
}
function w(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}
function j(e, t) {
	if (!e || !(e instanceof AbortSignal))
		return !0;
	if (!e.aborted)
		return e.addEventListener("abort", t), function() {
			e.removeEventListener("abort", t);
		};
}

// src/dom-common.js
var b = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]')), T = { setDelete: $ };
function $(e, t, r) {
	Reflect.set(e, t, r), m(r) && e.getAttribute(t) === "undefined" && e.removeAttribute(t);
}

// src/dom.js
var S = "html";
function oe(e) {
	return S = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(t) {
			return S = "html", t;
		}
	};
}
function ce(e, t, ...r) {
	let n = N(this), o;
	switch (n.isTextContent(t) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			o = e(t || void 0, (i) => i ? (r.unshift(i), void 0) : o);
			break;
		}
		case e === "#text":
			o = y(document.createTextNode(""), t);
			break;
		case e === "<>":
			o = y(document.createDocumentFragment(), t);
			break;
		case S !== "html":
			o = y(document.createElementNS(S, e), t);
			break;
		case !o:
			o = y(document.createElement(e), t);
	}
	return r.forEach((a) => a(o)), o;
}
var { setDelete: D } = T;
function y(e, ...t) {
	let r = N(this);
	if (!t.length)
		return e;
	let n = e instanceof SVGElement, o = (n ? W : M).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function a([i, s]) {
		s = r.processReactiveAttribute(e, i, s, a);
		let [h] = i;
		if (h === "=")
			return o(i.slice(1), s);
		if (h === ".")
			return D(e, i.slice(1), s);
		if (typeof s == "object")
			switch (i) {
				case "style":
					return O(s, M.bind(null, e.style, "Property"));
				case "dataset":
					return O(s, D.bind(null, e.dataset));
				case "ariaset":
					return O(s, (E, v) => o("aria-" + E, v));
				case "classList":
					return q(e, s);
				default:
					return Reflect.set(e, i, s);
			}
		if (/(aria|data)([A-Z])/.test(i))
			return i = i.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(i, s);
		switch (i) {
			case "href":
				return o(i, s);
			case "xlink:href":
				return o(i, s, "http://www.w3.org/1999/xlink");
			case "textContent":
				if (!n)
					break;
				return e.appendChild(document.createTextNode(s));
		}
		return J(e, i) ? D(e, i, s) : o(i, s);
	}), e;
}
function q(e, t) {
	return typeof t != "object" || O(
		t,
		(r, n) => e.classList.toggle(r, n === -1 ? void 0 : !!n)
	), e;
}
function se(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function J(e, t) {
	let r = "HTMLElement," + t;
	if (e instanceof HTMLElement && b.has(r))
		return b.get(r);
	let n = e.nodeName + "," + t;
	if (b.has(n))
		return b.get(n);
	let [o, a, i] = H(e, t), s = !m(o.set);
	return (!s || a) && b.set(i === HTMLElement.prototype ? r : n, s), s;
}
function H(e, t, r = 0) {
	if (e = Object.getPrototypeOf(e), !e)
		return [{}, r, e];
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n ? [n, r, e] : H(e, t, r + 1);
}
function O(e, t) {
	return Object.entries(e).forEach(([r, n]) => t(r, n));
}
function M(e, t, r, n) {
	return e[(m(n) ? "remove" : "set") + t](r, n);
}
function W(e, t, r, n, o = null) {
	return e[(m(n) ? "remove" : "set") + t + "NS"](o, r, n);
}

// src/events.js
function ae(e, t, ...r) {
	let n = r.length ? new CustomEvent(t, { detail: r[0] }) : new Event(t);
	return e.dispatchEvent(n);
}
function k(e, t, r) {
	return function(o) {
		return o.addEventListener(e, t, r), o;
	};
}
var C = I();
k.connected = function(e, t) {
	return function(n) {
		return typeof n.connectedCallback == "function" ? (n.addEventListener("dde:connected", e, t), n) : (j(t && t.signal, () => C.offConnected(n, e)) && (n.isConnected ? e(new Event("dde:connected")) : C.onConnected(n, e)), n);
	};
};
k.disconnected = function(e, t) {
	return function(n) {
		return typeof n.disconnectedCallback == "function" ? (n.addEventListener("dde:disconnected", e, t), n) : (j(t && t.signal, () => C.offDisconnected(n, e)) && C.onDisconnected(n, e), n);
	};
};
function I() {
	let e = /* @__PURE__ */ new Map(), t = !1, r = new MutationObserver(function(c) {
		for (let f of c)
			if (f.type === "childList") {
				if (E(f.addedNodes, !0)) {
					i();
					continue;
				}
				v(f.removedNodes, !0) && i();
			}
	});
	return {
		onConnected(c, f) {
			a(), o(c).connected.push(f);
		},
		offConnected(c, f) {
			if (!e.has(c))
				return;
			let u = e.get(c), p = u.connected;
			p.splice(p.indexOf(f), 1), n(c, u);
		},
		onDisconnected(c, f) {
			a(), o(c).disconnected.push(f);
		},
		offDisconnected(c, f) {
			if (!e.has(c))
				return;
			let u = e.get(c), p = u.disconnected;
			p.splice(p.indexOf(f), 1), n(c, u);
		}
	};
	function n(c, f) {
		f.connected.length || f.disconnected.length || (e.delete(c), i());
	}
	function o(c) {
		if (e.has(c))
			return e.get(c);
		let f = { connected: [], disconnected: [] };
		return e.set(c, f), f;
	}
	function a() {
		t || (t = !0, r.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function i() {
		!t || e.size || (t = !1, r.disconnect());
	}
	function s() {
		return new Promise(function(c) {
			(requestIdleCallback || requestAnimationFrame)(c);
		});
	}
	async function h(c) {
		e.size > 30 && await s();
		let f = [];
		if (!(c instanceof Node))
			return f;
		for (let u of e.keys())
			u === c || !(u instanceof Node) || c.contains(u) && f.push(u);
		return f;
	}
	function E(c, f) {
		for (let u of c) {
			if (f && h(u).then(E), !e.has(u))
				continue;
			let p = e.get(u);
			return p.connected.forEach((A) => A(u)), p.connected.length = 0, p.disconnected.length || e.delete(u), !0;
		}
		return !1;
	}
	function v(c, f) {
		for (let u of c) {
			if (f && h(u).then(v), !e.has(u))
				continue;
			let p = e.get(u);
			return p.disconnected.forEach((A) => A(u)), p.connected.length = 0, p.disconnected.length = 0, e.delete(u), !0;
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

// src/signals-lib.js
var d = Symbol.for("Signal");
function L(e) {
	try {
		return Reflect.has(e, d);
	} catch {
		return !1;
	}
}
var l = /* @__PURE__ */ new WeakMap();
function g(e, t) {
	if (typeof e != "function")
		return z(e, t);
	if (L(e))
		return e;
	let r = z(""), n = () => r(e());
	return l.set(n, /* @__PURE__ */ new Set([r])), G(n), r;
}
g.action = function(e, t, ...r) {
	let n = e[d], { actions: o } = n;
	if (!o || !Reflect.has(o, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (o[t].apply(n, r), n.skip)
		return Reflect.deleteProperty(n, "skip");
	n.listeners.forEach((a) => a(n.value));
};
g.on = function e(t, r, n = {}) {
	let { signal: o } = n;
	if (!(o && o.aborted)) {
		if (Array.isArray(t))
			return t.forEach((a) => e(a, r, n));
		P(t, r), o && o.addEventListener("abort", () => U(t, r));
	}
};
g.symbols = {
	signal: d,
	onclear: Symbol.for("Signal.onclear")
};
g.clear = function(...e) {
	for (let r of e) {
		Reflect.deleteProperty(r, "toJSON");
		let n = r[d], { onclear: o } = g.symbols;
		n.actions && n.actions[o] && n.actions[o].call(n), t(r, n), Reflect.deleteProperty(r, d);
	}
	function t(r, n) {
		n.listeners.forEach((o) => {
			if (n.listeners.delete(o), !l.has(o))
				return;
			let a = l.get(o);
			a.delete(r), !(a.size > 1) && (g.clear(...a), l.delete(o));
		});
	}
};
g.el = function(e, t) {
	let r = document.createComment("<#reactive>"), n = document.createComment("</#reactive>"), o = document.createDocumentFragment();
	o.append(r, n);
	let a = (i) => {
		if (!r.parentNode || !n.parentNode)
			return U(e, a);
		let s = t(i);
		Array.isArray(s) || (s = [s]);
		let h = r;
		for (; (h = r.nextSibling) !== n; )
			h.remove();
		r.after(...s);
	};
	return P(e, a), a(e()), o;
};
var F = {
	isTextContent(e) {
		return w(e) === "string" || L(e) && w(X(e)) === "string";
	},
	processReactiveAttribute(e, t, r, n) {
		return L(r) ? (P(r, (o) => n([t, o])), r()) : r;
	}
};
function z(e, t) {
	let r = (...n) => n.length ? Q(r, n[0]) : K(r);
	return B(r, e, t);
}
var Z = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function B(e, t, r) {
	return w(r) !== "[object Object]" && (r = {}), e[d] = {
		value: t,
		actions: r,
		listeners: /* @__PURE__ */ new Set()
	}, e.toJSON = () => e(), Object.setPrototypeOf(e[d], Z), e;
}
var R = [];
function G(e) {
	let t = function() {
		R.push(t), e(), R.pop();
	};
	l.has(e) && (l.set(t, l.get(e)), l.delete(e)), t();
}
function V() {
	return R[R.length - 1];
}
function K(e) {
	if (!e[d])
		return;
	let { value: t, listeners: r } = e[d], n = V();
	return n && r.add(n), l.has(n) && l.get(n).add(e), t;
}
function Q(e, t) {
	if (!e[d])
		return;
	let r = e[d];
	if (r.value !== t)
		return r.value = t, r.listeners.forEach((n) => n(t)), t;
}
function X(e) {
	return e[d].value;
}
function P(e, t) {
	if (e[d])
		return e[d].listeners.add(t);
}
function U(e, t) {
	if (e[d])
		return e[d].listeners.delete(t);
}

// src/signals.js
_(F);
export {
	g as S,
	y as assign,
	q as classListDeclarative,
	ce as createElement,
	ae as dispatchEvent,
	ce as el,
	se as empty,
	L as isSignal,
	oe as namespace,
	k as on,
	_ as registerReactivity
};
