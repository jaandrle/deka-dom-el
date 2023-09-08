// src/helpers.js
function m(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}

// src/signals-common.js
var b = {
	isTextContent(e) {
		return m(e) !== "[object Object]";
	},
	processReactiveAttribute(e, t, n, r) {
		return n;
	}
};
function j(e, t = !0) {
	return t ? Object.assign(b, e) : (Object.setPrototypeOf(e, b), e);
}
function N(e) {
	return b.isPrototypeOf(e) && e !== b ? e : b;
}

// src/dom.js
var v = "html";
function ee(e) {
	return v = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(t) {
			return v = "html", t;
		}
	};
}
function te(e, t, ...n) {
	let r = N(this), o;
	switch (r.isTextContent(t) && (t = { textContent: t }), !0) {
		case typeof e == "function":
			o = e(t || void 0);
			break;
		case e === "#text":
			o = y(document.createTextNode(""), t);
			break;
		case e === "<>":
			o = y(document.createDocumentFragment(), t);
			break;
		case v !== "html":
			o = y(document.createElementNS(v, e), t);
			break;
		case !o:
			o = y(document.createElement(e), t);
	}
	return n.forEach((a) => a(o)), o;
}
var x = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
function y(e, ...t) {
	let n = N(this);
	if (!t.length)
		return e;
	let r = e instanceof SVGElement, o = (r ? q : D).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function a([f, s]) {
		s = n.processReactiveAttribute(e, f, s, a);
		let [h] = f;
		if (h === "=")
			return o(f.slice(1), s);
		if (h === ".")
			return _(e, f.slice(1), s);
		if (typeof s == "object")
			switch (f) {
				case "style":
					return w(s, D.bind(null, e.style, "Property"));
				case "dataset":
					return w(s, _.bind(null, e.dataset));
				case "ariaset":
					return w(s, (E, O) => o("aria-" + E, O));
				case "classList":
					return $(e, s);
				default:
					return Reflect.set(e, f, s);
			}
		if (/(aria|data)([A-Z])/.test(f))
			return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(f, s);
		switch (f) {
			case "href":
				return o(f, s);
			case "xlink:href":
				return o(f, s, "http://www.w3.org/1999/xlink");
			case "textContent":
				if (!r)
					break;
				return e.appendChild(document.createTextNode(s));
		}
		return k(e, f) ? _(e, f, s) : o(f, s);
	}), e;
}
function $(e, t) {
	return typeof t != "object" || w(
		t,
		(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
	), e;
}
function ne(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function k(e, t) {
	let n = "HTMLElement," + t;
	if (e instanceof HTMLElement && x.has(n))
		return x.get(n);
	let r = e.nodeName + "," + t;
	if (x.has(r))
		return x.get(r);
	let [o, a, f] = T(e, t), s = !A(o.set);
	return (!s || a) && x.set(f === HTMLElement.prototype ? n : r, s), s;
}
function T(e, t, n = 0) {
	if (e = Object.getPrototypeOf(e), !e)
		return [{}, n, e];
	let r = Object.getOwnPropertyDescriptor(e, t);
	return r ? [r, n, e] : T(e, t, n + 1);
}
function w(e, t) {
	return Object.entries(e).forEach(([n, r]) => t(n, r));
}
function A(e) {
	return typeof e > "u";
}
function D(e, t, n, r) {
	return e[(A(r) ? "remove" : "set") + t](n, r);
}
function q(e, t, n, r, o = null) {
	return e[(A(r) ? "remove" : "set") + t + "NS"](o, n, r);
}
function _(e, t, n) {
	return Reflect.set(e, t, n);
}

// src/events.js
function M(e, t, n) {
	return (r) => (r.addEventListener(e, t, n), r);
}
var S = J();
M.connected = function(e, t) {
	return function(r) {
		S.onConnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => S.offConnected(r, e));
	};
};
M.disconnected = function(e, t) {
	return function(r) {
		S.onDisconnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => S.offDisconnected(r, e));
	};
};
function J() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
		for (let i of c)
			if (i.type === "childList") {
				if (E(i.addedNodes, !0)) {
					f();
					continue;
				}
				O(i.removedNodes, !0) && f();
			}
	});
	return {
		onConnected(c, i) {
			a(), o(c).connected.push(i);
		},
		offConnected(c, i) {
			if (!e.has(c))
				return;
			let u = e.get(c), l = u.connected;
			l.splice(l.indexOf(i), 1), r(c, u);
		},
		onDisconnected(c, i) {
			a(), o(c).disconnected.push(i);
		},
		offDisconnected(c, i) {
			if (!e.has(c))
				return;
			let u = e.get(c), l = u.disconnected;
			l.splice(l.indexOf(i), 1), r(c, u);
		}
	};
	function r(c, i) {
		i.connected.length || i.disconnect.length || (e.delete(c), f());
	}
	function o(c) {
		if (e.has(c))
			return e.get(c);
		let i = { connected: [], disconnected: [] };
		return e.set(c, i), i;
	}
	function a() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function f() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function s() {
		return new Promise(function(c) {
			(requestIdleCallback || requestAnimationFrame)(c);
		});
	}
	async function h(c) {
		e.size > 30 && await s();
		let i = [];
		if (!(c instanceof Node))
			return i;
		for (let u of e.keys())
			u === c || !(u instanceof Node) || c.contains(u) && i.push(u);
		return i;
	}
	function E(c, i) {
		for (let u of c) {
			if (i && h(u).then(E), !e.has(u))
				return !1;
			let l = e.get(u);
			return l.connected.forEach((L) => L(u)), l.connected.length = 0, l.disconnected.length || e.delete(u), !0;
		}
	}
	function O(c, i) {
		for (let u of c) {
			if (i && h(u).then(O), !e.has(u))
				return !1;
			let l = e.get(u);
			return l.disconnected.forEach((L) => L(u)), l.connected.length = 0, l.disconnected.length = 0, e.delete(u), !0;
		}
	}
}

// index.js
[HTMLElement, DocumentFragment].forEach((e) => {
	let { append: t } = e.prototype;
	e.prototype.append = function(...n) {
		return t.apply(this, n), this;
	};
});

// src/signals-lib.js
var d = Symbol.for("Signal");
function C(e) {
	try {
		return Reflect.has(e, d);
	} catch {
		return !1;
	}
}
var p = /* @__PURE__ */ new WeakMap();
function g(e, t) {
	if (typeof e != "function")
		return H(e, t);
	if (C(e))
		return e;
	let n = H(""), r = () => n(e());
	return p.set(r, /* @__PURE__ */ new Set([n])), Z(r), n;
}
g.action = function(e, t, ...n) {
	let r = e[d], { actions: o } = r;
	if (!o || !Reflect.has(o, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (o[t].apply(r, n), r.skip)
		return Reflect.deleteProperty(r, "skip");
	r.listeners.forEach((a) => a(r.value));
};
g.on = function e(t, n, r = {}) {
	let { signal: o } = r;
	if (!(o && o.aborted)) {
		if (Array.isArray(t))
			return t.forEach((a) => e(a, n, r));
		P(t, n), o && o.addEventListener("abort", () => F(t, n));
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
			if (r.listeners.delete(o), !p.has(o))
				return;
			let a = p.get(o);
			a.delete(n), !(a.size > 1) && (g.clear(...a), p.delete(o));
		});
	}
};
g.el = function(e, t) {
	let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
	o.append(n, r);
	let a = (f) => {
		if (!n.parentNode || !r.parentNode)
			return F(e, a);
		let s = t(f);
		Array.isArray(s) || (s = [s]);
		let h = n;
		for (; (h = n.nextSibling) !== r; )
			h.remove();
		n.after(...s);
	};
	return P(e, a), a(e()), o;
};
var z = {
	isTextContent(e) {
		return m(e) === "string" || C(e) && m(V(e)) === "string";
	},
	processReactiveAttribute(e, t, n, r) {
		return C(n) ? (P(n, (o) => r([t, o])), n()) : n;
	}
};
function H(e, t) {
	let n = (...r) => r.length ? U(n, r[0]) : G(n);
	return I(n, e, t);
}
var W = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function I(e, t, n) {
	return m(n) !== "[object Object]" && (n = {}), e[d] = {
		value: t,
		actions: n,
		listeners: /* @__PURE__ */ new Set()
	}, e.toJSON = () => e(), Object.setPrototypeOf(e[d], W), e;
}
var R = [];
function Z(e) {
	let t = function() {
		R.push(t), e(), R.pop();
	};
	p.has(e) && (p.set(t, p.get(e)), p.delete(e)), t();
}
function B() {
	return R[R.length - 1];
}
function G(e) {
	if (!e[d])
		return;
	let { value: t, listeners: n } = e[d], r = B();
	return r && n.add(r), p.has(r) && p.get(r).add(e), t;
}
function U(e, t) {
	if (!e[d])
		return;
	let n = e[d];
	if (n.value !== t)
		return n.value = t, n.listeners.forEach((r) => r(t)), t;
}
function V(e) {
	return e[d].value;
}
function P(e, t) {
	return e[d].listeners.add(t);
}
function F(e, t) {
	return e[d].listeners.delete(t);
}

// src/signals.js
j(z);
export {
	g as S,
	y as assign,
	$ as classListDeclarative,
	te as createElement,
	te as el,
	ne as empty,
	C as isSignal,
	ee as namespace,
	M as on,
	j as registerReactivity
};
