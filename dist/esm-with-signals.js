// src/helpers.js
function g(e) {
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

// src/signals-common.js
var b = {
	isTextContent(e) {
		return g(e) !== "[object Object]";
	},
	processReactiveAttribute(e, t, n, r) {
		return n;
	}
};
function N(e, t = !0) {
	return t ? Object.assign(b, e) : (Object.setPrototypeOf(e, b), e);
}
function A(e) {
	return b.isPrototypeOf(e) && e !== b ? e : b;
}

// src/dom.js
var y = "html";
function te(e) {
	return y = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(t) {
			return y = "html", t;
		}
	};
}
function ne(e, t, ...n) {
	let r = A(this), o;
	switch (r.isTextContent(t) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			o = e(t || void 0, (s) => s ? (n.unshift(s), void 0) : o);
			break;
		}
		case e === "#text":
			o = w(document.createTextNode(""), t);
			break;
		case e === "<>":
			o = w(document.createDocumentFragment(), t);
			break;
		case y !== "html":
			o = w(document.createElementNS(y, e), t);
			break;
		case !o:
			o = w(document.createElement(e), t);
	}
	return n.forEach((a) => a(o)), o;
}
var x = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
function w(e, ...t) {
	let n = A(this);
	if (!t.length)
		return e;
	let r = e instanceof SVGElement, o = (r ? J : T).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function a([s, i]) {
		i = n.processReactiveAttribute(e, s, i, a);
		let [h] = s;
		if (h === "=")
			return o(s.slice(1), i);
		if (h === ".")
			return _(e, s.slice(1), i);
		if (typeof i == "object")
			switch (s) {
				case "style":
					return O(i, T.bind(null, e.style, "Property"));
				case "dataset":
					return O(i, _.bind(null, e.dataset));
				case "ariaset":
					return O(i, (E, v) => o("aria-" + E, v));
				case "classList":
					return k(e, i);
				default:
					return Reflect.set(e, s, i);
			}
		if (/(aria|data)([A-Z])/.test(s))
			return s = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(s, i);
		switch (s) {
			case "href":
				return o(s, i);
			case "xlink:href":
				return o(s, i, "http://www.w3.org/1999/xlink");
			case "textContent":
				if (!r)
					break;
				return e.appendChild(document.createTextNode(i));
		}
		return q(e, s) ? _(e, s, i) : o(s, i);
	}), e;
}
function k(e, t) {
	return typeof t != "object" || O(
		t,
		(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
	), e;
}
function re(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function q(e, t) {
	let n = "HTMLElement," + t;
	if (e instanceof HTMLElement && x.has(n))
		return x.get(n);
	let r = e.nodeName + "," + t;
	if (x.has(r))
		return x.get(r);
	let [o, a, s] = M(e, t), i = !P(o.set);
	return (!i || a) && x.set(s === HTMLElement.prototype ? n : r, i), i;
}
function M(e, t, n = 0) {
	if (e = Object.getPrototypeOf(e), !e)
		return [{}, n, e];
	let r = Object.getOwnPropertyDescriptor(e, t);
	return r ? [r, n, e] : M(e, t, n + 1);
}
function O(e, t) {
	return Object.entries(e).forEach(([n, r]) => t(n, r));
}
function P(e) {
	return typeof e > "u";
}
function T(e, t, n, r) {
	return e[(P(r) ? "remove" : "set") + t](n, r);
}
function J(e, t, n, r, o = null) {
	return e[(P(r) ? "remove" : "set") + t + "NS"](o, n, r);
}
function _(e, t, n) {
	return Reflect.set(e, t, n);
}

// src/events.js
function ce(e, t, ...n) {
	let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(r);
}
function H(e, t, n) {
	return function(o) {
		return o.addEventListener(e, t, n), o;
	};
}
var S = W();
H.connected = function(e, t) {
	return function(r) {
		return j(t && t.signal, () => S.offConnected(r, e)) && S.onConnected(r, e), r;
	};
};
H.disconnected = function(e, t) {
	return function(r) {
		return j(t && t.signal, () => S.offDisconnected(r, e)) && S.onDisconnected(r, e), r;
	};
};
function W() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
		for (let f of c)
			if (f.type === "childList") {
				if (E(f.addedNodes, !0)) {
					s();
					continue;
				}
				v(f.removedNodes, !0) && s();
			}
	});
	return {
		onConnected(c, f) {
			a(), o(c).connected.push(f);
		},
		offConnected(c, f) {
			if (!e.has(c))
				return;
			let u = e.get(c), l = u.connected;
			l.splice(l.indexOf(f), 1), r(c, u);
		},
		onDisconnected(c, f) {
			a(), o(c).disconnected.push(f);
		},
		offDisconnected(c, f) {
			if (!e.has(c))
				return;
			let u = e.get(c), l = u.disconnected;
			l.splice(l.indexOf(f), 1), r(c, u);
		}
	};
	function r(c, f) {
		f.connected.length || f.disconnected.length || (e.delete(c), s());
	}
	function o(c) {
		if (e.has(c))
			return e.get(c);
		let f = { connected: [], disconnected: [] };
		return e.set(c, f), f;
	}
	function a() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function s() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function i() {
		return new Promise(function(c) {
			(requestIdleCallback || requestAnimationFrame)(c);
		});
	}
	async function h(c) {
		e.size > 30 && await i();
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
			let l = e.get(u);
			return l.connected.forEach((L) => L(u)), l.connected.length = 0, l.disconnected.length || e.delete(u), !0;
		}
		return !1;
	}
	function v(c, f) {
		for (let u of c) {
			if (f && h(u).then(v), !e.has(u))
				continue;
			let l = e.get(u);
			return l.disconnected.forEach((L) => L(u)), l.connected.length = 0, l.disconnected.length = 0, e.delete(u), !0;
		}
		return !1;
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
function m(e, t) {
	if (typeof e != "function")
		return z(e, t);
	if (C(e))
		return e;
	let n = z(""), r = () => n(e());
	return p.set(r, /* @__PURE__ */ new Set([n])), Z(r), n;
}
m.action = function(e, t, ...n) {
	let r = e[d], { actions: o } = r;
	if (!o || !Reflect.has(o, t))
		throw new Error(`'${e}' has no action with name '${t}'!`);
	if (o[t].apply(r, n), r.skip)
		return Reflect.deleteProperty(r, "skip");
	r.listeners.forEach((a) => a(r.value));
};
m.on = function e(t, n, r = {}) {
	let { signal: o } = r;
	if (!(o && o.aborted)) {
		if (Array.isArray(t))
			return t.forEach((a) => e(a, n, r));
		D(t, n), o && o.addEventListener("abort", () => $(t, n));
	}
};
m.symbols = {
	signal: d,
	onclear: Symbol.for("Signal.onclear")
};
m.clear = function(...e) {
	for (let n of e) {
		Reflect.deleteProperty(n, "toJSON");
		let r = n[d], { onclear: o } = m.symbols;
		r.actions && r.actions[o] && r.actions[o].call(r), t(n, r), Reflect.deleteProperty(n, d);
	}
	function t(n, r) {
		r.listeners.forEach((o) => {
			if (r.listeners.delete(o), !p.has(o))
				return;
			let a = p.get(o);
			a.delete(n), !(a.size > 1) && (m.clear(...a), p.delete(o));
		});
	}
};
m.el = function(e, t) {
	let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
	o.append(n, r);
	let a = (s) => {
		if (!n.parentNode || !r.parentNode)
			return $(e, a);
		let i = t(s);
		Array.isArray(i) || (i = [i]);
		let h = n;
		for (; (h = n.nextSibling) !== r; )
			h.remove();
		n.after(...i);
	};
	return D(e, a), a(e()), o;
};
var F = {
	isTextContent(e) {
		return g(e) === "string" || C(e) && g(K(e)) === "string";
	},
	processReactiveAttribute(e, t, n, r) {
		return C(n) ? (D(n, (o) => r([t, o])), n()) : n;
	}
};
function z(e, t) {
	let n = (...r) => r.length ? V(n, r[0]) : G(n);
	return U(n, e, t);
}
var I = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function U(e, t, n) {
	return g(n) !== "[object Object]" && (n = {}), e[d] = {
		value: t,
		actions: n,
		listeners: /* @__PURE__ */ new Set()
	}, e.toJSON = () => e(), Object.setPrototypeOf(e[d], I), e;
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
function V(e, t) {
	if (!e[d])
		return;
	let n = e[d];
	if (n.value !== t)
		return n.value = t, n.listeners.forEach((r) => r(t)), t;
}
function K(e) {
	return e[d].value;
}
function D(e, t) {
	if (e[d])
		return e[d].listeners.add(t);
}
function $(e, t) {
	if (e[d])
		return e[d].listeners.delete(t);
}

// src/signals.js
N(F);
export {
	m as S,
	w as assign,
	k as classListDeclarative,
	ne as createElement,
	ce as dispatchEvent,
	ne as el,
	re as empty,
	C as isSignal,
	te as namespace,
	H as on,
	N as registerReactivity
};
