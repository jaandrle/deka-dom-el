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
	let r = v(this), c;
	switch ((Object(t) !== t || r.isSignal(t)) && (t = { textContent: t }), !0) {
		case typeof e == "function": {
			c = e(t || void 0, (l) => l ? (n.unshift(l), void 0) : c);
			break;
		}
		case e === "#text":
			c = m(document.createTextNode(""), t);
			break;
		case e === "<>":
			c = m(document.createDocumentFragment(), t);
			break;
		case x !== "html":
			c = m(document.createElementNS(x, e), t);
			break;
		case !c:
			c = m(document.createElement(e), t);
	}
	return n.forEach((d) => d(c)), c;
}
var { setDeleteAttr: C } = R;
function m(e, ...t) {
	let n = this, r = v(this);
	if (!t.length)
		return e;
	let d = (e instanceof SVGElement ? M : F).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function l([f, u]) {
		u = r.processReactiveAttribute(e, f, u, l);
		let [h] = f;
		if (h === "=")
			return d(f.slice(1), u);
		if (h === ".")
			return D(e, f.slice(1), u);
		if (/(aria|data)([A-Z])/.test(f))
			return f = f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), d(f, u);
		switch (f === "className" && (f = "class"), f) {
			case "xlink:href":
				return d(f, u, "http://www.w3.org/1999/xlink");
			case "textContent":
				return C(e, f, u);
			case "style":
				if (typeof u != "object")
					break;
			case "dataset":
				return O(r, u, D.bind(null, e[f]));
			case "ariaset":
				return O(r, u, (E, o) => d("aria-" + E, o));
			case "classList":
				return _.call(n, e, u);
		}
		return j(e, f) ? C(e, f, u) : d(f, u);
	}), e;
}
function _(e, t) {
	let n = v(this);
	return O(
		n,
		t,
		(r, c) => e.classList.toggle(r, c === -1 ? void 0 : !!c)
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
		return Object.entries(t).forEach(function([c, d]) {
			c && (d = e.processReactiveAttribute(t, c, d, (l) => n(...l)), n(c, d));
		});
}
function S(e) {
	return Array.isArray(e) ? e.filter(Boolean).join(" ") : e;
}
function F(e, t, n, r) {
	return e[(p(r) ? "remove" : "set") + t](n, S(r));
}
function M(e, t, n, r, c = null) {
	return e[(p(r) ? "remove" : "set") + t + "NS"](c, n, S(r));
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
	return function(c) {
		return c.addEventListener(e, t, n), c;
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
		for (let s of o)
			if (s.type === "childList") {
				if (h(s.addedNodes, !0)) {
					l();
					continue;
				}
				E(s.removedNodes, !0) && l();
			}
	});
	return {
		onConnected(o, s) {
			d(), c(o).connected.push(s);
		},
		offConnected(o, s) {
			if (!e.has(o))
				return;
			let i = e.get(o), a = i.connected;
			a.splice(a.indexOf(s), 1), r(o, i);
		},
		onDisconnected(o, s) {
			d(), c(o).disconnected.push(s);
		},
		offDisconnected(o, s) {
			if (!e.has(o))
				return;
			let i = e.get(o), a = i.disconnected;
			a.splice(a.indexOf(s), 1), r(o, i);
		}
	};
	function r(o, s) {
		s.connected.length || s.disconnected.length || (e.delete(o), l());
	}
	function c(o) {
		if (e.has(o))
			return e.get(o);
		let s = { connected: [], disconnected: [] };
		return e.set(o, s), s;
	}
	function d() {
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
	async function u(o) {
		e.size > 30 && await f();
		let s = [];
		if (!(o instanceof Node))
			return s;
		for (let i of e.keys())
			i === o || !(i instanceof Node) || o.contains(i) && s.push(i);
		return s;
	}
	function h(o, s) {
		for (let i of o) {
			if (s && u(i).then(h), !e.has(i))
				continue;
			let a = e.get(i);
			return a.connected.forEach((A) => A(i)), a.connected.length = 0, a.disconnected.length || e.delete(i), !0;
		}
		return !1;
	}
	function E(o, s) {
		for (let i of o) {
			if (s && u(i).then(E), !e.has(i))
				continue;
			let a = e.get(i);
			return a.disconnected.forEach((A) => A(i)), a.connected.length = 0, a.disconnected.length = 0, e.delete(i), !0;
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
