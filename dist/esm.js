// src/signals-common.js
var g = {
	isSignal(e) {
		return !1;
	},
	processReactiveAttribute(e, t, n, r) {
		return n;
	}
};
function y(e, t = !0) {
	return t ? Object.assign(g, e) : (Object.setPrototypeOf(e, g), e);
}
function v(e) {
	return g.isPrototypeOf(e) && e !== g ? e : g;
}

// src/helpers.js
function p(e) {
	return typeof e > "u";
}
function w(e, t) {
	if (!e || !(e instanceof AbortSignal))
		return !0;
	if (!e.aborted)
		return e.addEventListener("abort", t), function() {
			e.removeEventListener("abort", t);
		};
}

// src/dom-common.js
var R = { setDeleteAttr: P };
function P(e, t, n) {
	if (Reflect.set(e, t, n), !!p(n)) {
		if (Reflect.deleteProperty(e, t), e instanceof HTMLElement && e.getAttribute(t) === "undefined")
			return e.removeAttribute(t);
		if (Reflect.get(e, t) === "undefined")
			return Reflect.set(e, t, "");
	}
}

// src/dom.js
var x = "html";
function H(e) {
	return x = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(...t) {
			return x = "html", t.length === 1 ? t[0] : document.createDocumentFragment().append(...t);
		}
	};
}
function I(e, t, ...n) {
	let r = this, u = v(this), i;
	switch ((Object(t) !== t || u.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			i = e(t || void 0, (f) => f ? (n.unshift(f), void 0) : i);
			break;
		}
		case e === "#text":
			i = m.call(r, document.createTextNode(""), t);
			break;
		case e === "<>":
			i = m.call(r, document.createDocumentFragment(), t);
			break;
		case x !== "html":
			i = m.call(r, document.createElementNS(x, e), t);
			break;
		case !i:
			i = m.call(r, document.createElement(e), t);
	}
	return n.forEach((l) => l(i)), i;
}
var { setDeleteAttr: C } = R;
function m(e, ...t) {
	let n = this, r = v(this);
	if (!t.length)
		return e;
	let i = (e instanceof SVGElement ? M : F).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function l([f, d]) {
		d = r.processReactiveAttribute(e, f, d, l);
		let [h] = f;
		if (h === "=")
			return i(f.slice(1), d);
		if (h === ".")
			return D(e, f.slice(1), d);
		if (/(aria|data)([A-Z])/.test(f))
			return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), i(f, d);
		switch (f === "className" && (f = "class"), f) {
			case "xlink:href":
				return i(f, d, "http://www.w3.org/1999/xlink");
			case "textContent":
				return C(e, f, d);
			case "style":
				if (typeof d != "object")
					break;
			case "dataset":
				return O(r, d, D.bind(null, e[f]));
			case "ariaset":
				return O(r, d, (E, o) => i("aria-" + E, o));
			case "classList":
				return _.call(n, e, d);
		}
		return j(e, f) ? C(e, f, d) : i(f, d);
	}), e;
}
function _(e, t) {
	let n = v(this);
	return O(
		n,
		t,
		(r, u) => e.classList.toggle(r, u === -1 ? void 0 : !!u)
	), e;
}
function Z(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function j(e, t) {
	if (!Reflect.has(e, t))
		return !1;
	let n = L(e, t);
	return !p(n.set);
}
function L(e, t) {
	if (e = Object.getPrototypeOf(e), !e)
		return {};
	let n = Object.getOwnPropertyDescriptor(e, t);
	return n || L(e, t);
}
function O(e, t, n) {
	if (!(typeof t != "object" || t === null))
		return Object.entries(t).forEach(function([u, i]) {
			u && (i = e.processReactiveAttribute(t, u, i, (l) => n(...l)), n(u, i));
		});
}
function S(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function F(e, t, n, r) {
	return e[(p(r) ? "remove" : "set") + t](n, S(r));
}
function M(e, t, n, r, u = null) {
	return e[(p(r) ? "remove" : "set") + t + "NS"](u, n, S(r));
}
function D(e, t, n) {
	if (Reflect.set(e, t, n), !!p(n))
		return Reflect.deleteProperty(e, t);
}

// src/events.js
function J(e, t, ...n) {
	let r = n.length ? new CustomEvent(t, { detail: n[0] }) : new Event(t);
	return e.dispatchEvent(r);
}
function N(e, t, n) {
	return function(u) {
		return u.addEventListener(e, t, n), u;
	};
}
var b = T();
N.connected = function(e, t) {
	return function(r) {
		return typeof r.connectedCallback == "function" ? (r.addEventListener("dde:connected", e, t), r) : (w(t && t.signal, () => b.offConnected(r, e)) && (r.isConnected ? e(new Event("dde:connected")) : b.onConnected(r, e)), r);
	};
};
N.disconnected = function(e, t) {
	return function(r) {
		return typeof r.disconnectedCallback == "function" ? (r.addEventListener("dde:disconnected", e, t), r) : (w(t && t.signal, () => b.offDisconnected(r, e)) && b.onDisconnected(r, e), r);
	};
};
function T() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = new MutationObserver(function(o) {
		for (let c of o)
			if (c.type === "childList") {
				if (h(c.addedNodes, !0)) {
					l();
					continue;
				}
				E(c.removedNodes, !0) && l();
			}
	});
	return {
		onConnected(o, c) {
			i(), u(o).connected.push(c);
		},
		offConnected(o, c) {
			if (!e.has(o))
				return;
			let s = e.get(o), a = s.connected;
			a.splice(a.indexOf(c), 1), r(o, s);
		},
		onDisconnected(o, c) {
			i(), u(o).disconnected.push(c);
		},
		offDisconnected(o, c) {
			if (!e.has(o))
				return;
			let s = e.get(o), a = s.disconnected;
			a.splice(a.indexOf(c), 1), r(o, s);
		}
	};
	function r(o, c) {
		c.connected.length || c.disconnected.length || (e.delete(o), l());
	}
	function u(o) {
		if (e.has(o))
			return e.get(o);
		let c = { connected: [], disconnected: [] };
		return e.set(o, c), c;
	}
	function i() {
		t || (t = !0, n.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function l() {
		!t || e.size || (t = !1, n.disconnect());
	}
	function f() {
		return new Promise(function(o) {
			(requestIdleCallback || requestAnimationFrame)(o);
		});
	}
	async function d(o) {
		e.size > 30 && await f();
		let c = [];
		if (!(o instanceof Node))
			return c;
		for (let s of e.keys())
			s === o || !(s instanceof Node) || o.contains(s) && c.push(s);
		return c;
	}
	function h(o, c) {
		for (let s of o) {
			if (c && d(s).then(h), !e.has(s))
				continue;
			let a = e.get(s);
			return a.connected.forEach((A) => A(s)), a.connected.length = 0, a.disconnected.length || e.delete(s), !0;
		}
		return !1;
	}
	function E(o, c) {
		for (let s of o) {
			if (c && d(s).then(E), !e.has(s))
				continue;
			let a = e.get(s);
			return a.disconnected.forEach((A) => A(s)), a.connected.length = 0, a.disconnected.length = 0, e.delete(s), !0;
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
export {
	m as assign,
	_ as classListDeclarative,
	I as createElement,
	J as dispatchEvent,
	I as el,
	Z as empty,
	H as namespace,
	N as on,
	y as registerReactivity
};
