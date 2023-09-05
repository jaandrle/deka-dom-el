// src/helpers.js
function R(e) {
	let t = typeof e;
	return t !== "object" ? t : e === null ? "null" : Object.prototype.toString.call(e);
}

// src/signals-common.js
var l = {
	isReactiveAtrribute(e, t) {
		return !1;
	},
	isTextContent(e) {
		return R(e) !== "[object Object]";
	},
	processReactiveAttribute(e, t, o, n) {
		return !1;
	},
	reactiveElement(e, ...t) {
		return document.createDocumentFragment();
	}
};
function y(e, t = !0) {
	return t ? Object.assign(l, e) : (Object.setPrototypeOf(e, l), e);
}
function v(e) {
	return l.isPrototypeOf(e) && e !== l ? e : l;
}

// src/dom.js
var b = "html";
function q(e) {
	return b = e === "svg" ? "http://www.w3.org/2000/svg" : e, {
		append(t) {
			return b = "html", t;
		}
	};
}
function z(e, t, ...o) {
	let n = v(this), u;
	if (e === "<>") {
		if (n.isReactiveAtrribute(t))
			return n.reactiveElement(t, ...o);
		u = document.createDocumentFragment();
	}
	switch (n.isTextContent(t) && (t = { textContent: t }), !0) {
		case typeof e == "function":
			u = e(t || void 0);
			break;
		case e === "#text":
			u = E(document.createTextNode(""), t);
			break;
		case b !== "html":
			u = E(document.createElementNS(b, e), t);
			break;
		default:
			u = E(document.createElement(e), t);
	}
	return o.forEach((d) => d(u)), u;
}
function E(e, ...t) {
	let o = v(this);
	if (!t.length)
		return e;
	let n = e instanceof SVGElement, u = (n ? L : A).bind(null, e, "Attribute");
	return Object.entries(Object.assign({}, ...t)).forEach(function d([i, f]) {
		if (o.isReactiveAtrribute(f, i) && (f = o.processReactiveAttribute(el, i, f, d)), i[0] === "=")
			return u(i.slice(1), f);
		if (i[0] === ".")
			return w(e, i.slice(1), f);
		if (typeof f == "object")
			switch (i) {
				case "style":
					return g(f, A.bind(null, e.style, "Property"));
				case "dataset":
					return g(f, w.bind(null, e.dataset));
				case "ariaset":
					return g(f, (p, h) => u("aria-" + p, h));
				case "classList":
					return N(e, f);
				default:
					return Reflect.set(e, i, f);
			}
		if (/(aria|data)([A-Z])/.test(i))
			return i = i.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), u(i, f);
		switch (i) {
			case "href":
				return u(i, f);
			case "xlink:href":
				return u(i, f, "http://www.w3.org/1999/xlink");
			case "textContent":
				if (!n)
					break;
				return e.appendChild(document.createTextNode(f));
		}
		return i in e && !n ? w(e, i, f) : u(i, f);
	}), e;
}
function N(e, t) {
	return typeof t != "object" || g(
		t,
		(o, n) => e.classList.toggle(o, n === -1 ? void 0 : !!n)
	), e;
}
function M(e) {
	return Array.from(e.children).forEach((t) => t.remove()), e;
}
function g(e, t) {
	return Object.entries(e).forEach(([o, n]) => t(o, n));
}
function O(e) {
	return typeof e > "u";
}
function A(e, t, o, n) {
	return e[(O(n) ? "remove" : "set") + t](o, n);
}
function L(e, t, o, n, u = null) {
	return e[(O(n) ? "remove" : "set") + t + "NS"](u, o, n);
}
function w(e, t, o) {
	return Reflect[O(o) ? "deleteProperty" : "set"](e, t, o);
}

// src/events.js
function j(e, t, o) {
	return (n) => (n.addEventListener(e, t, o), n);
}
var m = D();
j.connected = function(e, t) {
	return function(n) {
		m.onConnected(n, e), t && t.signal && t.signal.addEventListener("abort", () => m.offConnected(n, e));
	};
};
j.disconnected = function(e, t) {
	return function(n) {
		m.onDisconnected(n, e), t && t.signal && t.signal.addEventListener("abort", () => m.offDisconnected(n, e));
	};
};
function D() {
	let e = /* @__PURE__ */ new Map(), t = !1, o = new MutationObserver(function(r) {
		for (let c of r)
			if (c.type === "childList") {
				if (h(c.addedNodes, !0)) {
					i();
					continue;
				}
				C(c.removedNodes, !0) && i();
			}
	});
	return {
		onConnected(r, c) {
			d(), u(r).connected.push(c);
		},
		offConnected(r, c) {
			if (!e.has(r))
				return;
			let s = e.get(r), a = s.connected;
			a.splice(a.indexOf(c), 1), n(r, s);
		},
		onDisconnected(r, c) {
			d(), u(r).disconnected.push(c);
		},
		offDisconnected(r, c) {
			if (!e.has(r))
				return;
			let s = e.get(r), a = s.disconnected;
			a.splice(a.indexOf(c), 1), n(r, s);
		}
	};
	function n(r, c) {
		c.connected.length || c.disconnect.length || (e.delete(r), i());
	}
	function u(r) {
		if (e.has(r))
			return e.get(r);
		let c = { connected: [], disconnected: [] };
		return e.set(r, c), c;
	}
	function d() {
		t || (t = !0, o.observe(document.body, { childList: !0, subtree: !0 }));
	}
	function i() {
		!t || e.size || (t = !1, o.disconnect());
	}
	function f() {
		return new Promise(function(r) {
			(requestIdleCallback || requestAnimationFrame)(r);
		});
	}
	async function p(r) {
		e.size > 30 && await f();
		let c = [];
		if (!(r instanceof Node))
			return c;
		for (let s of e.keys())
			s === r || !(s instanceof Node) || r.contains(s) && c.push(s);
		return c;
	}
	function h(r, c) {
		for (let s of r) {
			if (c && p(s).then(h), !e.has(s))
				return !1;
			let a = e.get(s);
			return a.connected.forEach((x) => x(s)), a.connected.length = 0, a.disconnected.length || e.delete(s), !0;
		}
	}
	function C(r, c) {
		for (let s of r) {
			if (c && p(s).then(C), !e.has(s))
				return !1;
			let a = e.get(s);
			return a.disconnected.forEach((x) => x(s)), a.connected.length = 0, a.disconnected.length = 0, e.delete(s), !0;
		}
	}
}

// index.js
[HTMLElement, DocumentFragment].forEach((e) => {
	let { append: t } = e.prototype;
	e.prototype.append = function(...o) {
		return t.apply(this, o), this;
	};
});
export {
	E as assign,
	N as classListDeclartive,
	z as createElement,
	z as el,
	M as empty,
	q as namespace,
	j as on,
	y as registerReactivity
};
