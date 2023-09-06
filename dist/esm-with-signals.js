// src/helpers.js
function h(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}

// src/signals-common.js
var m = {
	isReactiveAtrribute(e, t) {
		return !1;
	},
	isTextContent(e) {
		return h(e) !== "[object Object]";
	},
	processReactiveAttribute(e, t, n, r) {
		return !1;
	},
	reactiveElement(e, ...t) {
		return document.createDocumentFragment();
	}
};
function A(e, t = !0) {
	return t ? Object.assign(m, e) : (Object.setPrototypeOf(e, m), e);
}
function C(e) {
	return m.isPrototypeOf(e) && e !== m ? e : m;
}

// src/dom.js
var w = "html";
function Y(e) {
	return w = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(t) {
			return w = "html", t;
		}
	};
}
function ee(e, t, ...n) {
	let r = C(this), o;
	if (e === "<>") {
		if (r.isReactiveAtrribute(t))
			return r.reactiveElement(t, ...n);
		o = document.createDocumentFragment();
	}
	switch (r.isTextContent(t) && (t = { textContent: t }), !0) {
		case typeof e == "function":
			o = e(t || void 0);
			break;
		case e === "#text":
			o = N(document.createTextNode(""), t);
			break;
		case w !== "html":
			o = N(document.createElementNS(w, e), t);
			break;
		case !o:
			o = N(document.createElement(e), t);
	}
	return n.forEach((l) => l(o)), o;
}
var S = /* @__PURE__ */ new Map();
function N(e, ...t) {
	let n = C(this);
	if (!t.length)
		return e;
	let r = e instanceof SVGElement, o = (r ? I : _).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function l([f, u]) {
		n.isReactiveAtrribute(u, f) && (u = n.processReactiveAttribute(el, f, u, l));
		let [p] = f;
		if (p === "=")
			return o(f.slice(1), u);
		if (p === ".")
			return L(e, f.slice(1), u);
		if (typeof u == "object")
			switch (f) {
				case "style":
					return E(u, _.bind(null, e.style, "Property"));
				case "dataset":
					return E(u, L.bind(null, e.dataset));
				case "ariaset":
					return E(u, (x, v) => o("aria-" + x, v));
				case "classList":
					return q(e, u);
				default:
					return Reflect.set(e, f, u);
			}
		if (/(aria|data)([A-Z])/.test(f))
			return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(f, u);
		switch (f) {
			case "xlink:href":
				return o(f, u, "http://www.w3.org/1999/xlink");
			case "textContent":
				if (!r)
					break;
				return e.appendChild(document.createTextNode(u));
		}
		return z(e, f) ? L(e, f, u) : o(f, u);
	}), e;
}
function q(e, t) {
	return typeof t != "object" || E(
		t,
		(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
	), e;
}
function te(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function z(e, t) {
	let n = e.nodeName + "," + t;
	if (S.has(n))
		return S.get(n);
	let r = D(e, t), o = !y(r.set);
	return S.set(n, o), o;
}
function D(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || D(e, t);
}
function E(e, t) {
	return Object.entries(e).forEach(([n, r]) => t(n, r));
}
function y(e) {
	return typeof e > "u";
}
function _(e, t, n, r) {
	return e[(y(r) ? "remove" : "set") + t](n, r);
}
function I(e, t, n, r, o = null) {
	return e[(y(r) ? "remove" : "set") + t + "NS"](o, n, r);
}
function L(e, t, n) {
	return Reflect[y(n) ? "deleteProperty" : "set"](e, t, n);
}

// src/events.js
function T(e, t, n) {
	return (r) => (r.addEventListener(e, t, n), r);
}
var O = W();
T.connected = function(e, t) {
	return function(r) {
		O.onConnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => O.offConnected(r, e));
	};
};
T.disconnected = function(e, t) {
	return function(r) {
		O.onDisconnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => O.offDisconnected(r, e));
	};
};
function W() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
		for (let i of c)
			if (i.type === "childList") {
				if (x(i.addedNodes, !0)) {
					f();
					continue;
				}
				v(i.removedNodes, !0) && f();
			}
	});
	return {
		onConnected(c, i) {
			l(), o(c).connected.push(i);
		},
		offConnected(c, i) {
			if (!e.has(c))
				return;
			let s = e.get(c), a = s.connected;
			a.splice(a.indexOf(i), 1), r(c, s);
		},
		onDisconnected(c, i) {
			l(), o(c).disconnected.push(i);
		},
		offDisconnected(c, i) {
			if (!e.has(c))
				return;
			let s = e.get(c), a = s.disconnected;
			a.splice(a.indexOf(i), 1), r(c, s);
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
	function l() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function f() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function u() {
		return new Promise(function(c) {
			(requestIdleCallback || requestAnimationFrame)(c);
		});
	}
	async function p(c) {
		e.size > 30 && await u();
		let i = [];
		if (!(c instanceof Node))
			return i;
		for (let s of e.keys())
			s === c || !(s instanceof Node) || c.contains(s) && i.push(s);
		return i;
	}
	function x(c, i) {
		for (let s of c) {
			if (i && p(s).then(x), !e.has(s))
				return !1;
			let a = e.get(s);
			return a.connected.forEach((j) => j(s)), a.connected.length = 0, a.disconnected.length || e.delete(s), !0;
		}
	}
	function v(c, i) {
		for (let s of c) {
			if (i && p(s).then(v), !e.has(s))
				return !1;
			let a = e.get(s);
			return a.disconnected.forEach((j) => j(s)), a.connected.length = 0, a.disconnected.length = 0, e.delete(s), !0;
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
var d = Symbol.for("signal");
function b(e) {
	try {
		return Reflect.has(e, d);
	} catch {
		return !1;
	}
}
function R(e, t) {
	if (typeof e != "function")
		return F(e, t);
	if (b(e))
		return e;
	let n = F();
	return M(() => n(e())), n;
}
R.action = function(e, t, ...n) {
	if (!b(e))
		throw new Error(`'${e}' is not a signal!`);
	let r = e[d], { actions: o } = r;
	if (!o || !Reflect.has(o, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (o[t].apply(r, n), r.skip)
		return Reflect.deleteProperty(r, "skip");
	r.listeners.forEach((l) => l(r.value));
};
R.on = function e(t, n, r) {
	if (Array.isArray(t))
		return t.forEach((o) => e(o, n, r));
	P(t, n), r && r.signal && r.signal.addEventListener("abort", () => k(t, n));
};
R.clear = function(...e) {
	for (let t of e)
		t[d].listeners.clear(), Reflect.deleteProperty(t, d);
};
var $ = {
	isReactiveAtrribute(e, t) {
		return b(e);
	},
	isTextContent(e) {
		return h(e) === "string" || b(e) && h(V(e)) === "string";
	},
	processReactiveAttribute(e, t, n, r) {
		return P(n, (o) => r([t, o])), n();
	},
	reactiveElement(e, t) {
		let n = document.createComment("<> #reactive"), r = document.createComment("</> #reactive"), o = document.createDocumentFragment();
		o.append(n, r);
		let l = (f) => {
			if (!n.parentNode || !r.parentNode)
				return k(e, l);
			let u = t(f);
			Array.isArray(u) || (u = [u]);
			let p = n;
			for (; (p = n.nextSibling) !== r; )
				p.remove();
			n.after(...u);
		};
		return P(e, l), l(e()), o;
	}
};
function F(e, t) {
	let n = (...r) => r.length ? U(n, r[0]) : H(n);
	return B(n, e, t);
}
var Z = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function B(e, t, n) {
	return h(n) !== "[object Object]" && (n = {}), e[d] = {
		value: t,
		actions: n,
		listeners: /* @__PURE__ */ new Set()
	}, Object.setPrototypeOf(e[d], Z), e;
}
var g = [];
function M(e) {
	let t = function() {
		g.push(t), e(), g.pop();
	};
	g.push(t), e(), g.pop();
}
function G() {
	return g[g.length - 1];
}
function H(e) {
	if (!e[d])
		return;
	let { value: t, listeners: n } = e[d], r = G();
	return r && n.add(r), t;
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
function k(e, t) {
	return e[d].listeners.delete(t);
}

// src/signals.js
A($);
export {
	R as S,
	N as assign,
	q as classListDeclartive,
	ee as createElement,
	ee as el,
	te as empty,
	b as isSignal,
	Y as namespace,
	T as on,
	A as registerReactivity,
	M as watch
};
