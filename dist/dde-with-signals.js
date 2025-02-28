//deka-dom-el library is available via global namespace `dde`
(()=> {
// src/signals-lib/common.js
var signals_global = {
	isSignal(attributes) {
		return false;
	},
	processReactiveAttribute(obj, key, attr, set) {
		return attr;
	}
};
function registerReactivity(def, global = true) {
	if (global) return Object.assign(signals_global, def);
	Object.setPrototypeOf(def, signals_global);
	return def;
}
function signals(_this) {
	return signals_global.isPrototypeOf(_this) && _this !== signals_global ? _this : signals_global;
}

// src/helpers.js
var hasOwn = (...a) => Object.prototype.hasOwnProperty.call(...a);
function isUndef(value) {
	return typeof value === "undefined";
}
function typeOf(v) {
	const t = typeof v;
	if (t !== "object") return t;
	if (v === null) return "null";
	return Object.prototype.toString.call(v);
}
function onAbort(signal2, listener) {
	if (!signal2 || !(signal2 instanceof AbortSignal))
		return true;
	if (signal2.aborted)
		return;
	signal2.addEventListener("abort", listener);
	return function cleanUp() {
		signal2.removeEventListener("abort", listener);
	};
}
function observedAttributes(instance, observedAttribute2) {
	const { observedAttributes: observedAttributes3 = [] } = instance.constructor;
	return observedAttributes3.reduce(function(out, name) {
		out[kebabToCamel(name)] = observedAttribute2(instance, name);
		return out;
	}, {});
}
function kebabToCamel(name) {
	return name.replace(/-./g, (x) => x[1].toUpperCase());
}

// src/dom-common.js
var enviroment = {
	setDeleteAttr,
	ssr: "",
	D: globalThis.document,
	F: globalThis.DocumentFragment,
	H: globalThis.HTMLElement,
	S: globalThis.SVGElement,
	M: globalThis.MutationObserver,
	q: (p) => p || Promise.resolve()
};
function setDeleteAttr(obj, prop, val) {
	Reflect.set(obj, prop, val);
	if (!isUndef(val)) return;
	Reflect.deleteProperty(obj, prop);
	if (obj instanceof enviroment.H && obj.getAttribute(prop) === "undefined")
		return obj.removeAttribute(prop);
	if (Reflect.get(obj, prop) === "undefined")
		return Reflect.set(obj, prop, "");
}
var keyLTE = "__dde_lifecyclesToEvents";
var evc = "dde:connected";
var evd = "dde:disconnected";
var eva = "dde:attributeChanged";

// src/dom.js
function queue(promise) {
	return enviroment.q(promise);
}
var scopes = [{
	get scope() {
		return enviroment.D.body;
	},
	host: (c) => c ? c(enviroment.D.body) : enviroment.D.body,
	prevent: true
}];
var scope = {
	get current() {
		return scopes[scopes.length - 1];
	},
	get host() {
		return this.current.host;
	},
	preventDefault() {
		const { current } = this;
		current.prevent = true;
		return current;
	},
	get state() {
		return [...scopes];
	},
	push(s = {}) {
		return scopes.push(Object.assign({}, this.current, { prevent: false }, s));
	},
	pushRoot() {
		return scopes.push(scopes[0]);
	},
	pop() {
		if (scopes.length === 1) return;
		return scopes.pop();
	}
};
function append(...els) {
	this.appendOriginal(...els);
	return this;
}
function chainableAppend(el) {
	if (el.append === append) return el;
	el.appendOriginal = el.append;
	el.append = append;
	return el;
}
var namespace;
function createElement(tag, attributes, ...addons) {
	const s = signals(this);
	let scoped = 0;
	let el, el_host;
	if (Object(attributes) !== attributes || s.isSignal(attributes))
		attributes = { textContent: attributes };
	switch (true) {
		case typeof tag === "function": {
			scoped = 1;
			const host = (...c) => !c.length ? el_host : (scoped === 1 ? addons.unshift(...c) : c.forEach((c2) => c2(el_host)), void 0);
			scope.push({ scope: tag, host });
			el = tag(attributes || void 0);
			const is_fragment = el instanceof enviroment.F;
			if (el.nodeName === "#comment") break;
			const el_mark = createElement.mark({
				type: "component",
				name: tag.name,
				host: is_fragment ? "this" : "parentElement"
			});
			el.prepend(el_mark);
			if (is_fragment) el_host = el_mark;
			break;
		}
		case tag === "#text":
			el = assign.call(this, enviroment.D.createTextNode(""), attributes);
			break;
		case (tag === "<>" || !tag):
			el = assign.call(this, enviroment.D.createDocumentFragment(), attributes);
			break;
		case Boolean(namespace):
			el = assign.call(this, enviroment.D.createElementNS(namespace, tag), attributes);
			break;
		case !el:
			el = assign.call(this, enviroment.D.createElement(tag), attributes);
	}
	chainableAppend(el);
	if (!el_host) el_host = el;
	addons.forEach((c) => c(el_host));
	if (scoped) scope.pop();
	scoped = 2;
	return el;
}
createElement.mark = function(attrs, is_open = false) {
	attrs = Object.entries(attrs).map(([n, v]) => n + `="${v}"`).join(" ");
	const end = is_open ? "" : "/";
	const out = enviroment.D.createComment(`<dde:mark ${attrs}${enviroment.ssr}${end}>`);
	if (is_open) out.end = enviroment.D.createComment("</dde:mark>");
	return out;
};
function createElementNS(ns) {
	const _this = this;
	return function createElementNSCurried(...rest) {
		namespace = ns;
		const el = createElement.call(_this, ...rest);
		namespace = void 0;
		return el;
	};
}
function simulateSlots(element, root = element) {
	const mark_e = "\xB9\u2070", mark_s = "\u2713";
	const slots = Object.fromEntries(
		Array.from(root.querySelectorAll("slot")).filter((s) => !s.name.endsWith(mark_e)).map((s) => [s.name += mark_e, s])
	);
	element.append = new Proxy(element.append, {
		apply(orig, _, els) {
			if (els[0] === root) return orig.apply(element, els);
			for (const el of els) {
				const name = (el.slot || "") + mark_e;
				try {
					elementAttribute(el, "remove", "slot");
				} catch (_error) {
				}
				const slot = slots[name];
				if (!slot) return;
				if (!slot.name.startsWith(mark_s)) {
					slot.childNodes.forEach((c) => c.remove());
					slot.name = mark_s + name;
				}
				slot.append(el);
			}
			element.append = orig;
			return element;
		}
	});
	if (element !== root) {
		const els = Array.from(element.childNodes);
		element.append(...els);
	}
	return root;
}
var assign_context = /* @__PURE__ */ new WeakMap();
var { setDeleteAttr: setDeleteAttr2 } = enviroment;
function assign(element, ...attributes) {
	if (!attributes.length) return element;
	assign_context.set(element, assignContext(element, this));
	for (const [key, value] of Object.entries(Object.assign({}, ...attributes)))
		assignAttribute.call(this, element, key, value);
	assign_context.delete(element);
	return element;
}
function assignAttribute(element, key, value) {
	const { setRemoveAttr, s } = assignContext(element, this);
	const _this = this;
	value = s.processReactiveAttribute(
		element,
		key,
		value,
		(key2, value2) => assignAttribute.call(_this, element, key2, value2)
	);
	const [k] = key;
	if ("=" === k) return setRemoveAttr(key.slice(1), value);
	if ("." === k) return setDelete(element, key.slice(1), value);
	if (/(aria|data)([A-Z])/.test(key)) {
		key = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
		return setRemoveAttr(key, value);
	}
	if ("className" === key) key = "class";
	switch (key) {
		case "xlink:href":
			return setRemoveAttr(key, value, "http://www.w3.org/1999/xlink");
		case "textContent":
			return setDeleteAttr2(element, key, value);
		case "style":
			if (typeof value !== "object") break;
		/* falls through */
		case "dataset":
			return forEachEntries(s, key, element, value, setDelete.bind(null, element[key]));
		case "ariaset":
			return forEachEntries(s, key, element, value, (key2, val) => setRemoveAttr("aria-" + key2, val));
		case "classList":
			return classListDeclarative.call(_this, element, value);
	}
	return isPropSetter(element, key) ? setDeleteAttr2(element, key, value) : setRemoveAttr(key, value);
}
function assignContext(element, _this) {
	if (assign_context.has(element)) return assign_context.get(element);
	const is_svg = element instanceof enviroment.S;
	const setRemoveAttr = (is_svg ? setRemoveNS : setRemove).bind(null, element, "Attribute");
	const s = signals(_this);
	return { setRemoveAttr, s };
}
function classListDeclarative(element, toggle) {
	const s = signals(this);
	forEachEntries(
		s,
		"classList",
		element,
		toggle,
		(class_name, val) => element.classList.toggle(class_name, val === -1 ? void 0 : Boolean(val))
	);
	return element;
}
function elementAttribute(element, op, key, value) {
	if (element instanceof enviroment.H)
		return element[op + "Attribute"](key, value);
	return element[op + "AttributeNS"](null, key, value);
}
function isPropSetter(el, key) {
	if (!(key in el)) return false;
	const des = getPropDescriptor(el, key);
	return !isUndef(des.set);
}
function getPropDescriptor(p, key) {
	p = Object.getPrototypeOf(p);
	if (!p) return {};
	const des = Object.getOwnPropertyDescriptor(p, key);
	if (!des) return getPropDescriptor(p, key);
	return des;
}
function forEachEntries(s, target, element, obj, cb) {
	const S = String;
	if (typeof obj !== "object" || obj === null) return;
	return Object.entries(obj).forEach(function process([key, val]) {
		if (!key) return;
		key = new S(key);
		key.target = target;
		val = s.processReactiveAttribute(element, key, val, cb);
		cb(key, val);
	});
}
function setRemove(obj, prop, key, val) {
	return obj[(isUndef(val) ? "remove" : "set") + prop](key, val);
}
function setRemoveNS(obj, prop, key, val, ns = null) {
	return obj[(isUndef(val) ? "remove" : "set") + prop + "NS"](ns, key, val);
}
function setDelete(obj, key, val) {
	Reflect.set(obj, key, val);
	if (!isUndef(val)) return;
	return Reflect.deleteProperty(obj, key);
}

// src/events-observer.js
var c_ch_o = enviroment.M ? connectionsChangesObserverConstructor() : new Proxy({}, {
	get() {
		return () => {
		};
	}
});
function connectionsChangesObserverConstructor() {
	const store = /* @__PURE__ */ new Map();
	let is_observing = false;
	const observerListener = (stop2) => function(mutations) {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			if (observerAdded(mutation.addedNodes, true)) {
				stop2();
				continue;
			}
			if (observerRemoved(mutation.removedNodes, true))
				stop2();
		}
	};
	const observer = new enviroment.M(observerListener(stop));
	return {
		observe(element) {
			const o = new enviroment.M(observerListener(() => {
			}));
			o.observe(element, { childList: true, subtree: true });
			return () => o.disconnect();
		},
		onConnected(element, listener) {
			start();
			const listeners = getElementStore(element);
			if (listeners.connected.has(listener)) return;
			listeners.connected.add(listener);
			listeners.length_c += 1;
		},
		offConnected(element, listener) {
			if (!store.has(element)) return;
			const ls = store.get(element);
			if (!ls.connected.has(listener)) return;
			ls.connected.delete(listener);
			ls.length_c -= 1;
			cleanWhenOff(element, ls);
		},
		onDisconnected(element, listener) {
			start();
			const listeners = getElementStore(element);
			if (listeners.disconnected.has(listener)) return;
			listeners.disconnected.add(listener);
			listeners.length_d += 1;
		},
		offDisconnected(element, listener) {
			if (!store.has(element)) return;
			const ls = store.get(element);
			if (!ls.disconnected.has(listener)) return;
			ls.disconnected.delete(listener);
			ls.length_d -= 1;
			cleanWhenOff(element, ls);
		}
	};
	function cleanWhenOff(element, ls) {
		if (ls.length_c || ls.length_d)
			return;
		store.delete(element);
		stop();
	}
	function getElementStore(element) {
		if (store.has(element)) return store.get(element);
		const out = {
			connected: /* @__PURE__ */ new WeakSet(),
			length_c: 0,
			disconnected: /* @__PURE__ */ new WeakSet(),
			length_d: 0
		};
		store.set(element, out);
		return out;
	}
	function start() {
		if (is_observing) return;
		is_observing = true;
		observer.observe(enviroment.D.body, { childList: true, subtree: true });
	}
	function stop() {
		if (!is_observing || store.size) return;
		is_observing = false;
		observer.disconnect();
	}
	function requestIdle() {
		return new Promise(function(resolve) {
			(requestIdleCallback || requestAnimationFrame)(resolve);
		});
	}
	async function collectChildren(element) {
		if (store.size > 30)
			await requestIdle();
		const out = [];
		if (!(element instanceof Node)) return out;
		for (const el of store.keys()) {
			if (el === element || !(el instanceof Node)) continue;
			if (element.contains(el))
				out.push(el);
		}
		return out;
	}
	function observerAdded(addedNodes, is_root) {
		let out = false;
		for (const element of addedNodes) {
			if (is_root) collectChildren(element).then(observerAdded);
			if (!store.has(element)) continue;
			const ls = store.get(element);
			if (!ls.length_c) continue;
			element.dispatchEvent(new Event(evc));
			ls.connected = /* @__PURE__ */ new WeakSet();
			ls.length_c = 0;
			if (!ls.length_d) store.delete(element);
			out = true;
		}
		return out;
	}
	function observerRemoved(removedNodes, is_root) {
		let out = false;
		for (const element of removedNodes) {
			if (is_root) collectChildren(element).then(observerRemoved);
			if (!store.has(element)) continue;
			const ls = store.get(element);
			if (!ls.length_d) continue;
			(globalThis.queueMicrotask || setTimeout)(dispatchRemove(element));
			out = true;
		}
		return out;
	}
	function dispatchRemove(element) {
		return () => {
			if (element.isConnected) return;
			element.dispatchEvent(new Event(evd));
			store.delete(element);
		};
	}
}

// src/customElement.js
function customElementRender(target, render, props = observedAttributes2) {
	const custom_element = target.host || target;
	scope.push({
		scope: custom_element,
		host: (...c) => c.length ? c.forEach((c2) => c2(custom_element)) : custom_element
	});
	if (typeof props === "function") props = props.call(custom_element, custom_element);
	const is_lte = custom_element[keyLTE];
	if (!is_lte) lifecyclesToEvents(custom_element);
	const out = render.call(custom_element, props);
	if (!is_lte) custom_element.dispatchEvent(new Event(evc));
	if (target.nodeType === 11 && typeof target.mode === "string")
		custom_element.addEventListener(evd, c_ch_o.observe(target), { once: true });
	scope.pop();
	return target.append(out);
}
function lifecyclesToEvents(class_declaration) {
	wrapMethod(class_declaration.prototype, "connectedCallback", function(target, thisArg, detail) {
		target.apply(thisArg, detail);
		thisArg.dispatchEvent(new Event(evc));
	});
	wrapMethod(class_declaration.prototype, "disconnectedCallback", function(target, thisArg, detail) {
		target.apply(thisArg, detail);
		(globalThis.queueMicrotask || setTimeout)(
			() => !thisArg.isConnected && thisArg.dispatchEvent(new Event(evd))
		);
	});
	wrapMethod(class_declaration.prototype, "attributeChangedCallback", function(target, thisArg, detail) {
		const [attribute, , value] = detail;
		thisArg.dispatchEvent(new CustomEvent(eva, {
			detail: [attribute, value]
		}));
		target.apply(thisArg, detail);
	});
	class_declaration.prototype[keyLTE] = true;
	return class_declaration;
}
function wrapMethod(obj, method, apply) {
	obj[method] = new Proxy(obj[method] || (() => {
	}), { apply });
}
function observedAttributes2(instance) {
	return observedAttributes(instance, (i, n) => i.getAttribute(n));
}

// src/events.js
function dispatchEvent(name, options, host) {
	if (!options) options = {};
	return function dispatch(element, ...d) {
		if (host) {
			d.unshift(element);
			element = typeof host === "function" ? host() : host;
		}
		const event = d.length ? new CustomEvent(name, Object.assign({ detail: d[0] }, options)) : new Event(name, options);
		return element.dispatchEvent(event);
	};
}
function on(event, listener, options) {
	return function registerElement(element) {
		element.addEventListener(event, listener, options);
		return element;
	};
}
var lifeOptions = (obj) => Object.assign({}, typeof obj === "object" ? obj : null, { once: true });
on.connected = function(listener, options) {
	options = lifeOptions(options);
	return function registerElement(element) {
		element.addEventListener(evc, listener, options);
		if (element[keyLTE]) return element;
		if (element.isConnected) return element.dispatchEvent(new Event(evc)), element;
		const c = onAbort(options.signal, () => c_ch_o.offConnected(element, listener));
		if (c) c_ch_o.onConnected(element, listener);
		return element;
	};
};
on.disconnected = function(listener, options) {
	options = lifeOptions(options);
	return function registerElement(element) {
		element.addEventListener(evd, listener, options);
		if (element[keyLTE]) return element;
		const c = onAbort(options.signal, () => c_ch_o.offDisconnected(element, listener));
		if (c) c_ch_o.onDisconnected(element, listener);
		return element;
	};
};
var store_abort = /* @__PURE__ */ new WeakMap();
on.disconnectedAsAbort = function(host) {
	if (store_abort.has(host)) return store_abort.get(host);
	const a = new AbortController();
	store_abort.set(host, a);
	host(on.disconnected(() => a.abort()));
	return a;
};
var els_attribute_store = /* @__PURE__ */ new WeakSet();
on.attributeChanged = function(listener, options) {
	if (typeof options !== "object")
		options = {};
	return function registerElement(element) {
		element.addEventListener(eva, listener, options);
		if (element[keyLTE] || els_attribute_store.has(element))
			return element;
		if (!enviroment.M) return element;
		const observer = new enviroment.M(function(mutations) {
			for (const { attributeName, target } of mutations)
				target.dispatchEvent(
					new CustomEvent(eva, { detail: [attributeName, target.getAttribute(attributeName)] })
				);
		});
		const c = onAbort(options.signal, () => observer.disconnect());
		if (c) observer.observe(element, { attributes: true });
		return element;
	};
};

// src/signals-lib/helpers.js
var mark = "__dde_signal";
var SignalDefined = class extends Error {
	constructor() {
		super();
		const [curr, ...rest] = this.stack.split("\n");
		const curr_file = curr.slice(curr.indexOf("@"), curr.indexOf(".js:") + 4);
		this.stack = rest.find((l) => !l.includes(curr_file));
	}
};
var queueSignalWrite = /* @__PURE__ */ (() => {
	let pendingSignals = /* @__PURE__ */ new Set();
	let scheduled = false;
	function flushSignals() {
		scheduled = false;
		for (const signal2 of pendingSignals) {
			const M = signal2[mark];
			if (M) M.listeners.forEach((l) => l(M.value));
		}
		pendingSignals.clear();
	}
	return function(s) {
		pendingSignals.add(s);
		if (scheduled) return;
		scheduled = true;
		queueMicrotask(flushSignals);
	};
})();

// src/signals-lib/signals-lib.js
function isSignal(candidate) {
	return typeof candidate === "function" && hasOwn(candidate, mark);
}
var stack_watch = [];
var deps = /* @__PURE__ */ new WeakMap();
function signal(value, actions) {
	if (typeof value !== "function")
		return create(false, value, actions);
	if (isSignal(value)) return value;
	const out = create(true);
	function contextReWatch() {
		const [origin, ...deps_old] = deps.get(contextReWatch);
		deps.set(contextReWatch, /* @__PURE__ */ new Set([origin]));
		stack_watch.push(contextReWatch);
		write(out, value());
		stack_watch.pop();
		if (!deps_old.length) return;
		const deps_curr = deps.get(contextReWatch);
		for (const dep_signal of deps_old) {
			if (deps_curr.has(dep_signal)) continue;
			removeSignalListener(dep_signal, contextReWatch);
		}
	}
	;
	deps.set(out[mark], contextReWatch);
	deps.set(contextReWatch, /* @__PURE__ */ new Set([out]));
	contextReWatch();
	return out;
}
signal.action = function(s, name, ...a) {
	const M = s[mark];
	if (!M) return;
	const { actions } = M;
	if (!actions || !hasOwn(actions, name))
		throw new Error(`Action "${name}" not defined. See ${mark}.actions.`);
	actions[name].apply(M, a);
	if (M.skip) return delete M.skip;
	queueSignalWrite(s);
};
signal.on = function on2(s, listener, options = {}) {
	const { signal: as } = options;
	if (as && as.aborted) return;
	if (Array.isArray(s)) return s.forEach((s2) => on2(s2, listener, options));
	addSignalListener(s, listener);
	if (as) as.addEventListener("abort", () => removeSignalListener(s, listener));
};
signal.symbols = {
	//signal: mark,
	onclear: Symbol.for("Signal.onclear")
};
signal.clear = function(...signals2) {
	for (const s of signals2) {
		const M = s[mark];
		if (!M) continue;
		delete s.toJSON;
		M.onclear.forEach((f) => f.call(M));
		clearListDeps(s, M);
		delete s[mark];
	}
	function clearListDeps(s, o) {
		o.listeners.forEach((l) => {
			o.listeners.delete(l);
			if (!deps.has(l)) return;
			const ls = deps.get(l);
			ls.delete(s);
			if (ls.size > 1) return;
			s.clear(...ls);
			deps.delete(l);
		});
	}
};
var key_reactive = "__dde_reactive";
var storeMemo = /* @__PURE__ */ new WeakMap();
function memo(key, fun, cache) {
	if (typeof key !== "string") key = JSON.stringify(key);
	if (!cache) {
		const keyStore = scope.host();
		if (storeMemo.has(keyStore))
			cache = storeMemo.get(keyStore);
		else {
			cache = {};
			storeMemo.set(keyStore, cache);
		}
	}
	return hasOwn(cache, key) ? cache[key] : cache[key] = fun();
}
signal.el = function(s, map) {
	const mark_start = createElement.mark({ type: "reactive" }, true);
	const mark_end = mark_start.end;
	const out = enviroment.D.createDocumentFragment();
	out.append(mark_start, mark_end);
	const { current } = scope;
	let cache = {};
	const reRenderReactiveElement = (v) => {
		if (!mark_start.parentNode || !mark_end.parentNode)
			return removeSignalListener(s, reRenderReactiveElement);
		let cache_tmp = cache;
		cache = {};
		scope.push(current);
		let els = map(v, function useCache(key, fun) {
			return cache[key] = memo(key, fun, cache_tmp);
		});
		cache_tmp = {};
		scope.pop();
		if (!Array.isArray(els))
			els = [els];
		const el_start_rm = document.createComment("");
		els.push(el_start_rm);
		mark_start.after(...els);
		let el_r;
		while ((el_r = el_start_rm.nextSibling) && el_r !== mark_end)
			el_r.remove();
		el_start_rm.remove();
		if (mark_start.isConnected)
			requestCleanUpReactives(current.host());
	};
	addSignalListener(s, reRenderReactiveElement);
	removeSignalsFromElements(s, reRenderReactiveElement, mark_start, map);
	reRenderReactiveElement(s());
	current.host(on.disconnected(() => (
		/*! This clears memoized elements in S.el when the host is disconnected */
		cache = {}
	)));
	return out;
};
function requestCleanUpReactives(host) {
	if (!host || !host[key_reactive]) return;
	(requestIdleCallback || setTimeout)(function() {
		host[key_reactive] = host[key_reactive].filter(([s, el]) => el.isConnected ? true : (removeSignalListener(...s), false));
	});
}
var observedAttributeActions = {
	_set(value) {
		this.value = value;
	}
};
function observedAttribute(store) {
	return function(instance, name) {
		const varS = (...args) => !args.length ? read(varS) : instance.setAttribute(name, ...args);
		const out = toSignal(varS, instance.getAttribute(name), observedAttributeActions);
		store[name] = out;
		return out;
	};
}
var key_attributes = "__dde_attributes";
signal.observedAttributes = function(element) {
	const store = element[key_attributes] = {};
	const attrs = observedAttributes(element, observedAttribute(store));
	on.attributeChanged(function attributeChangeToSignal({ detail }) {
		/*! This maps attributes to signals (`S.observedAttributes`).
			Investigate `__dde_attributes` key of the element. */
		const [name, value] = detail;
		const curr = this[key_attributes][name];
		if (curr) return signal.action(curr, "_set", value);
	})(element);
	on.disconnected(function() {
		/*! This removes all signals mapped to attributes (`S.observedAttributes`).
			Investigate `__dde_attributes` key of the element. */
		signal.clear(...Object.values(this[key_attributes]));
	})(element);
	return attrs;
};
var signals_config = {
	isSignal,
	processReactiveAttribute(element, key, attrs, set) {
		if (!isSignal(attrs)) return attrs;
		const l = (attr) => {
			if (!element.isConnected)
				return removeSignalListener(attrs, l);
			set(key, attr);
		};
		addSignalListener(attrs, l);
		removeSignalsFromElements(attrs, l, element, key);
		return attrs();
	}
};
function removeSignalsFromElements(s, listener, ...notes) {
	const { current } = scope;
	current.host(function(element) {
		if (element[key_reactive])
			return element[key_reactive].push([[s, listener], ...notes]);
		element[key_reactive] = [];
		if (current.prevent) return;
		on.disconnected(
			() => (
				/*! Clears all Signals listeners added in the current scope/host (`S.el`, `assign`, …?).
					You can investigate the `__dde_reactive` key of the element. */
				element[key_reactive].forEach(([[s2, listener2]]) => removeSignalListener(s2, listener2, s2[mark] && s2[mark].host && s2[mark].host() === element))
			)
		)(element);
	});
}
var cleanUpRegistry = new FinalizationRegistry(function(s) {
	signal.clear({ [mark]: s });
});
function create(is_readonly, value, actions) {
	const varS = is_readonly ? () => read(varS) : (...value2) => value2.length ? write(varS, ...value2) : read(varS);
	const SI = toSignal(varS, value, actions, is_readonly);
	cleanUpRegistry.register(SI, SI[mark]);
	return SI;
}
var protoSigal = Object.assign(/* @__PURE__ */ Object.create(null), {
	stopPropagation() {
		this.skip = true;
	}
});
function toSignal(s, value, actions, readonly = false) {
	const onclear = [];
	if (typeOf(actions) !== "[object Object]")
		actions = {};
	const { onclear: ocs } = signal.symbols;
	if (actions[ocs]) {
		onclear.push(actions[ocs]);
		delete actions[ocs];
	}
	const { host } = scope;
	Reflect.defineProperty(s, mark, {
		value: {
			value,
			actions,
			onclear,
			host,
			listeners: /* @__PURE__ */ new Set(),
			defined: new SignalDefined().stack,
			readonly
		},
		enumerable: false,
		writable: false,
		configurable: true
	});
	s.toJSON = () => s();
	s.valueOf = () => s[mark] && s[mark].value;
	Object.setPrototypeOf(s[mark], protoSigal);
	return s;
}
function currentContext() {
	return stack_watch[stack_watch.length - 1];
}
function read(s) {
	if (!s[mark]) return;
	const { value, listeners } = s[mark];
	const context = currentContext();
	if (context) listeners.add(context);
	if (deps.has(context)) deps.get(context).add(s);
	return value;
}
function write(s, value, force) {
	const M = s[mark];
	if (!M || !force && M.value === value) return;
	M.value = value;
	queueSignalWrite(s);
	return value;
}
function addSignalListener(s, listener) {
	if (!s[mark]) return;
	return s[mark].listeners.add(listener);
}
function removeSignalListener(s, listener, clear_when_empty) {
	const M = s[mark];
	if (!M) return;
	const { listeners: L } = M;
	const out = L.delete(listener);
	if (!out || !clear_when_empty || L.size) return out;
	signal.clear(s);
	const depList = deps.get(M);
	if (!depList) return out;
	const depSource = deps.get(depList);
	if (!depSource) return out;
	for (const sig of depSource) removeSignalListener(sig, depList, true);
	return out;
}

// signals.js
registerReactivity(signals_config);

globalThis.dde= {
	S: signal,
	assign,
	assignAttribute,
	chainableAppend,
	classListDeclarative,
	createElement,
	createElementNS,
	customElementRender,
	customElementWithDDE: lifecyclesToEvents,
	dispatchEvent,
	el: createElement,
	elNS: createElementNS,
	elementAttribute,
	isSignal,
	lifecyclesToEvents,
	observedAttributes: observedAttributes2,
	on,
	queue,
	registerReactivity,
	scope,
	signal,
	simulateSlots
};

})();