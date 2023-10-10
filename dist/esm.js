// src/signals-common.js
var m = {
	isSignal(e) {
		return !1;
	},
	processReactiveAttribute(e, t, n, r) {
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
function l(e) {
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
var R = { setDeleteAttr: j };
function j(e, t, n) {
	if (Reflect.set(e, t, n), !!l(n)) {
		if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
			return e.removeAttribute(t);
		if (Reflect.get(e, t) === "undefined")
			return Reflect.set(e, t, "");
	}
}

// src/dom.js
var v = [{ scope: document.body, namespace: "html", host: (e) => e ? e(document.body) : document.body }], C = (e) => e === "svg" ? "http://www.w3.org/2000/svg" : e, x = {
	get current() {
		return v[v.length - 1];
	},
	get state() {
		return [...v];
	},
	get host() {
		return this.current.host;
	},
	get namespace() {
		return this.current.namespace;
	},
	set namespace(e) {
		return this.current.namespace = C(e);
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
		return e.namespace && (e.namespace = C(e.namespace)), v.push(Object.assign({}, this.current, e));
	},
	pop() {
		return v.pop();
	}
};
function I(e, t, ...n) {
	let r = this, u = b(this), { namespace: d } = x, f;
	switch ((Object(t) !== t || u.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			x.push({ scope: e, host: (i) => i ? (n.unshift(i), void 0) : f }), f = e(t || void 0), x.pop();
			break;
		}
		case e === "#text":
			f = w.call(r, document.createTextNode(""), t);
			break;
		case e === "<>":
			f = w.call(r, document.createDocumentFragment(), t);
			break;
		case d !== "html":
			f = w.call(r, document.createElementNS(d, e), t);
			break;
		case !f:
			f = w.call(r, document.createElement(e), t);
	}
	return n.forEach((i) => i(f)), f;
}
var { setDeleteAttr: S } = R;
function w(e, ...t) {
	let n = this, r = b(this);
	if (!t.length)
		return e;
	let d = (e instanceof SVGElement ? U : T).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function f([i, a]) {
		a = r.processReactiveAttribute(e, i, a, f);
		let [h] = i;
		if (h === "=")
			return d(i.slice(1), a);
		if (h === ".")
			return y(e, i.slice(1), a);
		if (/(aria|data)([A-Z])/.test(i))
			return i = i.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), d(i, a);
		switch (i === "className" && (i = "class"), i) {
			case "xlink:href":
				return d(i, a, "http://www.w3.org/1999/xlink");
			case "textContent":
				return S(e, i, a);
			case "style":
				if (typeof a != "object")
					break;
			case "dataset":
				return O(r, a, y.bind(null, e[i]));
			case "ariaset":
				return O(r, a, (E, c) => d("aria-" + E, c));
			case "classList":
				return F.call(n, e, a);
		}
		return M(e, i) ? S(e, i, a) : d(i, a);
	}), e;
}
function F(e, t) {
	let n = b(this);
	return O(
		n,
		t,
		(r, u) => e.classList.toggle(r, u === -1 ? void 0 : !!u)
	), e;
}
function Z(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function M(e, t) {
	if (!Reflect.has(e, t))
		return !1;
	let n = D(e, t);
	return !l(n.set);
}
function D(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || D(e, t);
}
function O(e, t, n) {
	if (!(typeof t != "object" || t === null))
		return Object.entries(t).forEach(function([u, d]) {
			u && (d = e.processReactiveAttribute(t, u, d, (f) => n(...f)), n(u, d));
		});
}
function L(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function T(e, t, n, r) {
	return e[(l(r) ? "remove" : "set") + t](n, L(r));
}
function U(e, t, n, r, u = null) {
	return e[(l(r) ? "remove" : "set") + t + "NS"](u, n, L(r));
}
function y(e, t, n) {
	if (Reflect.set(e, t, n), !!l(n))
		return Reflect.deleteProperty(e, t);
}

// src/events.js
function K(e, t, ...n) {
	let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(r);
}
function N(e, t, n) {
	return function(u) {
		return u.addEventListener(e, t, n), u;
	};
}
var A = W();
N.connected = function(e, t) {
	return typeof t != "object" && (t = {}), t.once = !0, function(r) {
		return r.addEventListener("dde:connected", e, t), typeof r.connectedCallback == "function" ? r : r.isConnected ? (r.dispatchEvent(new Event("dde:connected")), r) : (_(t.signal, () => A.offConnected(r, e)) && A.onConnected(r, e), r);
	};
};
N.disconnected = function(e, t) {
	return typeof t != "object" && (t = {}), t.once = !0, function(r) {
		return r.addEventListener("dde:disconnected", e, t), typeof r.disconnectedCallback == "function" || _(t.signal, () => A.offDisconnected(r, e)) && A.onDisconnected(r, e), r;
	};
};
function W() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(c) {
		for (let o of c)
			if (o.type === "childList") {
				if (h(o.addedNodes, !0)) {
					f();
					continue;
				}
				E(o.removedNodes, !0) && f();
			}
	});
	return {
		onConnected(c, o) {
			d();
			let s = u(c);
			s.connected.has(o) || (s.connected.add(o), s.length_c += 1);
		},
		offConnected(c, o) {
			if (!e.has(c))
				return;
			let s = e.get(c);
			s.connected.has(o) && (s.connected.delete(o), s.length_c -= 1, r(c, s));
		},
		onDisconnected(c, o) {
			d();
			let s = u(c);
			s.disconnected.has(o) || (s.disconnected.add(o), s.length_d += 1);
		},
		offDisconnected(c, o) {
			if (!e.has(c))
				return;
			let s = e.get(c);
			s.disconnected.has(o) && (s.disconnected.delete(o), s.length_d -= 1, r(c, s));
		}
	};
	function r(c, o) {
		o.length_c || o.length_d || (e.delete(c), f());
	}
	function u(c) {
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
	function d() {
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
	async function a(c) {
		e.size > 30 && await i();
		let o = [];
		if (!(c instanceof Node))
			return o;
		for (let s of e.keys())
			s === c || !(s instanceof Node) || c.contains(s) && o.push(s);
		return o;
	}
	function h(c, o) {
		let s = !1;
		for (let p of c) {
			if (o && a(p).then(h), !e.has(p))
				continue;
			let g = e.get(p);
			g.length_c && (p.dispatchEvent(new Event("dde:connected")), g.connected = /* @__PURE__ */ new WeakSet(), g.length_c = 0, g.length_d || e.delete(p), s = !0);
		}
		return s;
	}
	function E(c, o) {
		let s = !1;
		for (let p of c)
			o && a(p).then(E), !(!e.has(p) || !e.get(p).length_d) && (p.dispatchEvent(new Event("dde:disconnected")), e.delete(p), s = !0);
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
export {
	w as assign,
	F as classListDeclarative,
	I as createElement,
	K as dispatchEvent,
	I as el,
	Z as empty,
	N as on,
	P as registerReactivity,
	x as scope
};
