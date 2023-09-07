// src/helpers.js
function h(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}

// src/signals-common.js
var b = {
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
		return null;
	}
};
function C(e, t = !0) {
	return t ? Object.assign(b, e) : (Object.setPrototypeOf(e, b), e);
}
function j(e) {
	return b.isPrototypeOf(e) && e !== b ? e : b;
}

// src/dom.js
var O = "html";
function Y(e) {
	return O = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(t) {
			return O = "html", t;
		}
	};
}
function ee(e, t, ...n) {
	let r = j(this), o;
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
			o = A(document.createTextNode(""), t);
			break;
		case O !== "html":
			o = A(document.createElementNS(O, e), t);
			break;
		case !o:
			o = A(document.createElement(e), t);
	}
	return n.forEach((a) => a(o)), o;
}
var x = new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
function A(e, ...t) {
	let n = j(this);
	if (!t.length)
		return e;
	let r = e instanceof SVGElement, o = (r ? z : P).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function a([f, i]) {
		n.isReactiveAtrribute(i, f) && (i = n.processReactiveAttribute(e, f, i, a));
		let [p] = f;
		if (p === "=")
			return o(f.slice(1), i);
		if (p === ".")
			return L(e, f.slice(1), i);
		if (typeof i == "object")
			switch (f) {
				case "style":
					return y(i, P.bind(null, e.style, "Property"));
				case "dataset":
					return y(i, L.bind(null, e.dataset));
				case "ariaset":
					return y(i, (E, v) => o("aria-" + E, v));
				case "classList":
					return k(e, i);
				default:
					return Reflect.set(e, f, i);
			}
		if (/(aria|data)([A-Z])/.test(f))
			return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o(f, i);
		switch (f) {
			case "xlink:href":
				return o(f, i, "http://www.w3.org/1999/xlink");
			case "textContent":
				if (!r)
					break;
				return e.appendChild(document.createTextNode(i));
		}
		return q(e, f) ? L(e, f, i) : o(f, i);
	}), e;
}
function k(e, t) {
	return typeof t != "object" || y(
		t,
		(n, r) => e.classList.toggle(n, r === -1 ? void 0 : !!r)
	), e;
}
function te(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function q(e, t) {
	let n = "HTMLElement," + t;
	if (e instanceof HTMLElement && x.has(n))
		return x.get(n);
	let r = e.nodeName + "," + t;
	if (x.has(r))
		return x.get(r);
	let [o, a, f] = T(e, t), i = !N(o.set);
	return (!i || a) && x.set(f === HTMLElement.prototype ? n : r, i), i;
}
function T(e, t, n = 0) {
	if (e = Object.getPrototypeOf(e), !e)
		return [{}, n, e];
	let r = Object.getOwnPropertyDescriptor(e, t);
	return r ? [r, n, e] : T(e, t, n + 1);
}
function y(e, t) {
	return Object.entries(e).forEach(([n, r]) => t(n, r));
}
function N(e) {
	return typeof e > "u";
}
function P(e, t, n, r) {
	return e[(N(r) ? "remove" : "set") + t](n, r);
}
function z(e, t, n, r, o = null) {
	return e[(N(r) ? "remove" : "set") + t + "NS"](o, n, r);
}
function L(e, t, n) {
	return Reflect.set(e, t, n);
}

// src/events.js
function D(e, t, n) {
	return (r) => (r.addEventListener(e, t, n), r);
}
var w = I();
D.connected = function(e, t) {
	return function(r) {
		w.onConnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => w.offConnected(r, e));
	};
};
D.disconnected = function(e, t) {
	return function(r) {
		w.onDisconnected(r, e), t && t.signal && t.signal.addEventListener("abort", () => w.offDisconnected(r, e));
	};
};
function I() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
		for (let s of c)
			if (s.type === "childList") {
				if (E(s.addedNodes, !0)) {
					f();
					continue;
				}
				v(s.removedNodes, !0) && f();
			}
	});
	return {
		onConnected(c, s) {
			a(), o(c).connected.push(s);
		},
		offConnected(c, s) {
			if (!e.has(c))
				return;
			let u = e.get(c), d = u.connected;
			d.splice(d.indexOf(s), 1), r(c, u);
		},
		onDisconnected(c, s) {
			a(), o(c).disconnected.push(s);
		},
		offDisconnected(c, s) {
			if (!e.has(c))
				return;
			let u = e.get(c), d = u.disconnected;
			d.splice(d.indexOf(s), 1), r(c, u);
		}
	};
	function r(c, s) {
		s.connected.length || s.disconnect.length || (e.delete(c), f());
	}
	function o(c) {
		if (e.has(c))
			return e.get(c);
		let s = { connected: [], disconnected: [] };
		return e.set(c, s), s;
	}
	function a() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function f() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function i() {
		return new Promise(function(c) {
			(requestIdleCallback || requestAnimationFrame)(c);
		});
	}
	async function p(c) {
		e.size > 30 && await i();
		let s = [];
		if (!(c instanceof Node))
			return s;
		for (let u of e.keys())
			u === c || !(u instanceof Node) || c.contains(u) && s.push(u);
		return s;
	}
	function E(c, s) {
		for (let u of c) {
			if (s && p(u).then(E), !e.has(u))
				return !1;
			let d = e.get(u);
			return d.connected.forEach((S) => S(u)), d.connected.length = 0, d.disconnected.length || e.delete(u), !0;
		}
	}
	function v(c, s) {
		for (let u of c) {
			if (s && p(u).then(v), !e.has(u))
				return !1;
			let d = e.get(u);
			return d.disconnected.forEach((S) => S(u)), d.connected.length = 0, d.disconnected.length = 0, e.delete(u), !0;
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
var l = Symbol.for("Signal");
function R(e) {
	try {
		return Reflect.has(e, l);
	} catch {
		return !1;
	}
}
function m(e, t) {
	if (typeof e != "function")
		return M(e, t);
	if (R(e))
		return e;
	let n = M();
	return F(() => n(e())), n;
}
m.action = function(e, t, ...n) {
	let r = e[l], { actions: o } = r;
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
		_(t, n), o && o.addEventListener("abort", () => $(t, n));
	}
};
m.symbols = {
	signal: l,
	onclear: Symbol.for("Signal.onclear")
};
m.clear = function(...e) {
	for (let t of e) {
		let n = t[l], { onclear: r } = m.symbols;
		n.actions && n.actions[r] && n.actions[r].call(n), n.listeners.clear(), Reflect.deleteProperty(t, l);
	}
};
var H = {
	isReactiveAtrribute(e, t) {
		return R(e);
	},
	isTextContent(e) {
		return h(e) === "string" || R(e) && h(U(e)) === "string";
	},
	processReactiveAttribute(e, t, n, r) {
		return _(n, (o) => r([t, o])), n();
	},
	reactiveElement(e, t) {
		let n = document.createComment("<#reactive>"), r = document.createComment("</#reactive>"), o = document.createDocumentFragment();
		o.append(n, r);
		let a = (f) => {
			if (!n.parentNode || !r.parentNode)
				return $(e, a);
			let i = t(f);
			Array.isArray(i) || (i = [i]);
			let p = n;
			for (; (p = n.nextSibling) !== r; )
				p.remove();
			n.after(...i);
		};
		return _(e, a), a(e()), o;
	}
};
function M(e, t) {
	let n = (...r) => r.length ? J(n, r[0]) : G(n);
	return Z(n, e, t);
}
var W = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = !0;
	}
});
function Z(e, t, n) {
	return h(n) !== "[object Object]" && (n = {}), e[l] = {
		value: t,
		actions: n,
		listeners: /* @__PURE__ */ new Set()
	}, Object.setPrototypeOf(e[l], W), e;
}
var g = [];
function F(e) {
	let t = function() {
		g.push(t), e(), g.pop();
	};
	g.push(t), e(), g.pop();
}
function B() {
	return g[g.length - 1];
}
function G(e) {
	if (!e[l])
		return;
	let { value: t, listeners: n } = e[l], r = B();
	return r && n.add(r), t;
}
function J(e, t) {
	if (!e[l])
		return;
	let n = e[l];
	if (n.value !== t)
		return n.value = t, n.listeners.forEach((r) => r(t)), t;
}
function U(e) {
	return e[l].value;
}
function _(e, t) {
	return e[l].listeners.add(t);
}
function $(e, t) {
	return e[l].listeners.delete(t);
}

// src/signals.js
C(H);
export {
	m as S,
	A as assign,
	k as classListDeclartive,
	ee as createElement,
	ee as el,
	te as empty,
	R as isSignal,
	Y as namespace,
	D as on,
	C as registerReactivity,
	F as watch
};
