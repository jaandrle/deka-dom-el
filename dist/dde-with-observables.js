//deka-dom-el library is available via global namespace `dde`
(()=> {
var O={isObservable(t){return!1},processReactiveAttribute(t,e,n,r){return n}};function F(t,e=!0){return e?Object.assign(O,t):(Object.setPrototypeOf(t,O),t)}function S(t){return O.isPrototypeOf(t)&&t!==O?t:O}function _(t){return typeof t>"u"}function B(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function D(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}function N(t,e){let{observedAttributes:n=[]}=t.constructor;return n.reduce(function(r,o){return Reflect.set(r,ct(o),e(t,o)),r},{})}function ct(t){return t.replace(/-./g,e=>e[1].toUpperCase())}var d={setDeleteAttr:st,ssr:"",D:globalThis.document,F:globalThis.DocumentFragment,H:globalThis.HTMLElement,S:globalThis.SVGElement,M:globalThis.MutationObserver};function st(t,e,n){if(Reflect.set(t,e,n),!!_(n)){if(Reflect.deleteProperty(t,e),t instanceof d.H&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var y=[{get scope(){return d.D.body},host:t=>t?t(d.D.body):d.D.body,custom_element:!1,prevent:!0}],v={get current(){return y[y.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...y]},push(t={}){return y.push(Object.assign({},this.current,{prevent:!1},t))},pushRoot(){return y.push(y[0])},pop(){if(y.length!==1)return y.pop()}};function I(...t){return this.appendOriginal(...t),this}function it(t){return t.append===I||(t.appendOriginal=t.append,t.append=I),t}var P;function R(t,e,...n){let r=S(this),o=0,c,s;switch((Object(e)!==e||r.isObservable(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,v.push({scope:t,host:(...h)=>h.length?(o===1?n.unshift(...h):h.forEach(g=>g(s)),void 0):s}),c=t(e||void 0);let u=c instanceof d.F;if(c.nodeName==="#comment")break;let l=R.mark({type:"component",name:t.name,host:u?"this":"parentElement"});c.prepend(l),u&&(s=l);break}case t==="#text":c=w.call(this,d.D.createTextNode(""),e);break;case(t==="<>"||!t):c=w.call(this,d.D.createDocumentFragment(),e);break;case!!P:c=w.call(this,d.D.createElementNS(P,t),e);break;case!c:c=w.call(this,d.D.createElement(t),e)}return it(c),s||(s=c),n.forEach(u=>u(s)),o&&v.pop(),o=2,c}function Ct(t,e=t,n=void 0){let r=Symbol.for("default"),o=Array.from(e.querySelectorAll("slot")).reduce((s,u)=>Reflect.set(s,u.name||r,u)&&s,{}),c=Reflect.has(o,r);if(t.append=new Proxy(t.append,{apply(s,u,l){if(!l.length)return t;let h=d.D.createDocumentFragment();for(let g of l){if(!g||!g.slot){c&&h.appendChild(g);continue}let i=g.slot,f=o[i];at(g,"remove","slot"),f&&(ft(f,g,n),Reflect.deleteProperty(o,i))}return c&&(o[r].replaceWith(h),Reflect.deleteProperty(o,r)),t.append=s,t}}),t!==e){let s=Array.from(t.childNodes);s.forEach(u=>u.remove()),t.append(...s)}return e}function ft(t,e,n){n&&n(t,e);try{t.replaceWith(w(e,{className:[e.className,t.className],dataset:{...t.dataset}}))}catch{t.replaceWith(e)}}R.mark=function(t,e=!1){t=Object.entries(t).map(([o,c])=>o+`="${c}"`).join(" ");let n=e?"":"/",r=d.D.createComment(`<dde:mark ${t}${d.ssr}${n}>`);return e&&(r.end=d.D.createComment("</dde:mark>")),r};function St(t){let e=this;return function(...r){P=t;let o=R.call(e,...r);return P=void 0,o}}var j=new WeakMap,{setDeleteAttr:J}=d;function w(t,...e){if(!e.length)return t;j.set(t,V(t,this));for(let[n,r]of Object.entries(Object.assign({},...e)))G.call(this,t,n,r);return j.delete(t),t}function G(t,e,n){let{setRemoveAttr:r,s:o}=V(t,this),c=this;n=o.processReactiveAttribute(t,e,n,(u,l)=>G.call(c,t,u,l));let[s]=e;if(s==="=")return r(e.slice(1),n);if(s===".")return Z(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),r(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return r(e,n,"http://www.w3.org/1999/xlink");case"textContent":return J(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return $(o,n,Z.bind(null,t[e]));case"ariaset":return $(o,n,(u,l)=>r("aria-"+u,l));case"classList":return ut.call(c,t,n)}return dt(t,e)?J(t,e,n):r(e,n)}function V(t,e){if(j.has(t))return j.get(t);let r=(t instanceof d.S?pt:lt).bind(null,t,"Attribute"),o=S(e);return{setRemoveAttr:r,s:o}}function ut(t,e){let n=S(this);return $(n,e,(r,o)=>t.classList.toggle(r,o===-1?void 0:!!o)),t}function Dt(t){return Array.from(t.children).forEach(e=>e.remove()),t}function at(t,e,n,r){return t instanceof d.H?t[e+"Attribute"](n,r):t[e+"AttributeNS"](null,n,r)}function dt(t,e){if(!Reflect.has(t,e))return!1;let n=K(t,e);return!_(n.set)}function K(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||K(t,e)}function $(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,c]){o&&(c=t.processReactiveAttribute(e,o,c,n),n(o,c))})}function Q(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function lt(t,e,n,r){return t[(_(r)?"remove":"set")+e](n,Q(r))}function pt(t,e,n,r,o=null){return t[(_(r)?"remove":"set")+e+"NS"](o,n,Q(r))}function Z(t,e,n){if(Reflect.set(t,e,n),!!_(n))return Reflect.deleteProperty(t,e)}function kt(t,e,n=ht){v.push({scope:t,host:(...o)=>o.length?o.forEach(c=>c(t)):t,custom_element:t}),typeof n=="function"&&(n=n.call(t,t));let r=e.call(t,n);return v.pop(),r}function Lt(t){for(let n of["connected","disconnected"])X(t.prototype,n+"Callback",function(r,o,c){r.apply(o,c),o.dispatchEvent(new Event("dde:"+n))});let e="attributeChanged";return X(t.prototype,e+"Callback",function(n,r,o){let[c,,s]=o;r.dispatchEvent(new CustomEvent("dde:"+e,{detail:[c,s]})),n.apply(r,o)}),t.prototype.__dde_lifecycleToEvents=!0,t}function X(t,e,n){t[e]=new Proxy(t[e]||(()=>{}),{apply:n})}function ht(t){return N(t,(e,n)=>e.getAttribute(n))}function Ft(t,e,n){return e||(e={}),function(o,...c){n&&(c.unshift(o),o=typeof n=="function"?n():n);let s=c.length?new CustomEvent(t,Object.assign({detail:c[0]},e)):new Event(t,e);return o.dispatchEvent(s)}}function x(t,e,n){return function(o){return o.addEventListener(t,e,n),o}}var k=d.M?gt():new Proxy({},{get(){return()=>{}}}),bt=new WeakSet;x.connected=function(t,e){let{custom_element:n}=v.current,r="connected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents?c:c.isConnected?(c.dispatchEvent(new Event(s)),c):(D(e.signal,()=>k.offConnected(c,t))&&k.onConnected(c,t),c)}};x.disconnected=function(t,e){let{custom_element:n}=v.current,r="disconnected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents||D(e.signal,()=>k.offDisconnected(c,t))&&k.onDisconnected(c,t),c}};var z=new WeakMap;x.disconnectedAsAbort=function(t){if(z.has(t))return z.get(t);let e=new AbortController;return z.set(t,e),t(x.disconnected(()=>e.abort())),e};x.attributeChanged=function(t,e){let n="attributeChanged";return typeof e!="object"&&(e={}),function(o){let c="dde:"+n;if(o.addEventListener(c,t,e),o.__dde_lifecycleToEvents||bt.has(o)||!d.M)return o;let s=new d.M(function(l){for(let{attributeName:h,target:g}of l)g.dispatchEvent(new CustomEvent(c,{detail:[h,g.getAttribute(h)]}))});return D(e.signal,()=>s.disconnect())&&s.observe(o,{attributes:!0}),o}};function gt(){let t=new Map,e=!1,n=new d.M(function(i){for(let f of i)if(f.type==="childList"){if(h(f.addedNodes,!0)){s();continue}g(f.removedNodes,!0)&&s()}});return{onConnected(i,f){c();let a=o(i);a.connected.has(f)||(a.connected.add(f),a.length_c+=1)},offConnected(i,f){if(!t.has(i))return;let a=t.get(i);a.connected.has(f)&&(a.connected.delete(f),a.length_c-=1,r(i,a))},onDisconnected(i,f){c();let a=o(i);a.disconnected.has(f)||(a.disconnected.add(f),a.length_d+=1)},offDisconnected(i,f){if(!t.has(i))return;let a=t.get(i);a.disconnected.has(f)&&(a.disconnected.delete(f),a.length_d-=1,r(i,a))}};function r(i,f){f.length_c||f.length_d||(t.delete(i),s())}function o(i){if(t.has(i))return t.get(i);let f={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(i,f),f}function c(){e||(e=!0,n.observe(d.D.body,{childList:!0,subtree:!0}))}function s(){!e||t.size||(e=!1,n.disconnect())}function u(){return new Promise(function(i){(requestIdleCallback||requestAnimationFrame)(i)})}async function l(i,f){t.size>30&&await u();let a=[];if(!(i instanceof Node))return a;for(let p of t.keys())p===i||!(p instanceof Node)||f(p)||i.contains(p)&&a.push(p);return a}function h(i,f){let a=!1;for(let p of i){if(f&&l(p,M=>!M.isConnectedd).then(h),!t.has(p))continue;let A=t.get(p);A.length_c&&(p.dispatchEvent(new Event("dde:connected")),A.connected=new WeakSet,A.length_c=0,A.length_d||t.delete(p),a=!0)}return a}function g(i,f){let a=!1;for(let p of i)f&&l(p,M=>M.isConnectedd).then(g),!(!t.has(p)||!t.get(p).length_d)&&(p.dispatchEvent(new Event("dde:disconnected")),t.delete(p),a=!0);return a}}var b=Symbol.for("observable");function T(t){try{return Reflect.has(t,b)}catch{return!1}}var W=[],m=new WeakMap;function E(t,e){if(typeof t!="function")return Y(!1,t,e);if(T(t))return t;let n=Y(!0),r=function(){let[o,...c]=m.get(r);if(m.set(r,new Set([o])),W.push(r),ot(n,t()),W.pop(),!c.length)return;let s=m.get(r);for(let u of c)s.has(u)||C(u,r)};return m.set(n[b],r),m.set(r,new Set([n])),r(),n}E.action=function(t,e,...n){let r=t[b],{actions:o}=r;if(!o||!Reflect.has(o,e))throw new Error(`'${t}' has no action with name '${e}'!`);if(o[e].apply(r,n),r.skip)return Reflect.deleteProperty(r,"skip");r.listeners.forEach(c=>c(r.value))};E.on=function t(e,n,r={}){let{signal:o}=r;if(!(o&&o.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,n,r));H(e,n),o&&o.addEventListener("abort",()=>C(e,n))}};E.symbols={onclear:Symbol.for("Observable.onclear")};E.clear=function(...t){for(let n of t){Reflect.deleteProperty(n,"toJSON");let r=n[b];r.onclear.forEach(o=>o.call(r)),e(n,r),Reflect.deleteProperty(n,b)}function e(n,r){r.listeners.forEach(o=>{if(r.listeners.delete(o),!m.has(o))return;let c=m.get(o);c.delete(n),!(c.size>1)&&(n.clear(...c),m.delete(o))})}};var L="__dde_reactive";E.el=function(t,e){let n=R.mark({type:"reactive"},!0),r=n.end,o=d.D.createDocumentFragment();o.append(n,r);let{current:c}=v,s=u=>{if(!n.parentNode||!r.parentNode)return C(t,s);v.push(c);let l=e(u);v.pop(),Array.isArray(l)||(l=[l]);let h=n;for(;(h=n.nextSibling)!==r;)h.remove();n.after(...l)};return H(t,s),nt(t,s,n,e),s(t()),o};var vt={_set(t){this.value=t}};function mt(t){return function(e,n){let r=(...c)=>c.length?e.setAttribute(n,...c):e.getAttribute(n),o=rt(r,r(),vt);return t[n]=o,o}}var U="__dde_attributes";E.observedAttributes=function(t){let e=t[U]={},n=N(t,mt(e));return x.attributeChanged(function({detail:o}){/*! This maps attributes to observables (`O.observedAttributes`).
	* Investigate `__dde_attributes` key of the element.*/let[c,s]=o,u=this[U][c];if(u)return E.action(u,"_set",s)})(t),x.disconnected(function(){/*! This removes all observables mapped to attributes (`O.observedAttributes`).
	* Investigate `__dde_attributes` key of the element.*/E.clear(...Object.values(this[U]))})(t),n};var et={isObservable:T,processReactiveAttribute(t,e,n,r){if(!T(n))return n;let o=c=>r(e,c);return H(n,o),nt(n,o,t,e),n()}};function nt(t,e,...n){let{current:r}=v;r.prevent||r.host(function(o){o[L]||(o[L]=[],x.disconnected(()=>o[L].forEach(([[c,s]])=>C(c,s,c[b]?.host()===o)))(o)),o[L].push([[t,e],...n])})}function Y(t,e,n){let r=t?()=>tt(r):(...o)=>o.length?ot(r,...o):tt(r);return rt(r,e,n)}var Et=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),q=class extends Error{constructor(){super();let[e,...n]=this.stack.split(`
`),r=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=n.find(o=>!o.includes(r))}};function rt(t,e,n){let r=[];B(n)!=="[object Object]"&&(n={});let{onclear:o}=E.symbols;n[o]&&(r.push(n[o]),Reflect.deleteProperty(n,o));let{host:c}=v;return Reflect.defineProperty(t,b,{value:{value:e,actions:n,onclear:r,host:c,listeners:new Set,defined:new q},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[b],Et),t}function xt(){return W[W.length-1]}function tt(t){if(!t[b])return;let{value:e,listeners:n}=t[b],r=xt();return r&&n.add(r),m.has(r)&&m.get(r).add(t),e}function ot(t,e,n){if(!t[b])return;let r=t[b];if(!(!n&&r.value===e))return r.value=e,r.listeners.forEach(o=>o(e)),e}function H(t,e){if(t[b])return t[b].listeners.add(e)}function C(t,e,n){let r=t[b];if(!r)return;let o=r.listeners.delete(e);if(n&&!r.listeners.size){if(E.clear(t),!m.has(r))return o;let c=m.get(r);if(!m.has(c))return o;m.get(c).forEach(s=>C(s,c,!0))}return o}F(et);
globalThis.dde= {O: E,
assign: w,
assignAttribute: G,
chainableAppend: it,
classListDeclarative: ut,
createElement: R,
createElementNS: St,
customElementRender: kt,
customElementWithDDE: Lt,
dispatchEvent: Ft,
el: R,
elNS: St,
elementAttribute: at,
empty: Dt,
isObservable: T,
lifecycleToEvents: Lt,
observable: E,
observedAttributes: ht,
on: x,
registerReactivity: F,
scope: v,
simulateSlots: Ct
};

})();