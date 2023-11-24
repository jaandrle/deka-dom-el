//deka-dom-el library is available via global namespace `dde`
(()=> {
var A={isSignal(t){return!1},processReactiveAttribute(t,e,n,r){return n}};function T(t,e=!0){return e?Object.assign(A,t):(Object.setPrototypeOf(t,A),t)}function C(t){return A.isPrototypeOf(t)&&t!==A?t:A}function x(t){return typeof t>"u"}function B(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function N(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}var $={setDeleteAttr:tt,ssr:""};function tt(t,e,n){if(Reflect.set(t,e,n),!!x(n)){if(Reflect.deleteProperty(t,e),t instanceof HTMLElement&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var v=[{scope:document.body,host:t=>t?t(document.body):document.body,custom_element:!1,prevent:!0}],g={get current(){return v[v.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...v]},push(t={}){return v.push(Object.assign({},this.current,{prevent:!1},t))},pushRoot(){return v.push(v[0])},pop(){if(v.length!==1)return v.pop()}};function H(...t){return this.appendOriginal(...t),this}function et(t){return t.append===H||(t.appendOriginal=t.append,t.append=H),t}var j;function y(t,e,...n){let r=C(this),o=0,c,s;switch((Object(e)!==e||r.isSignal(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,g.push({scope:t,host:(...l)=>l.length?(o===1?n.unshift(...l):l.forEach(_=>_(s)),void 0):s}),c=t(e||void 0);let d=c instanceof DocumentFragment;if(c.nodeName==="#comment")break;let u=y.mark({type:"component",name:t.name,host:d?"this":"parentElement"});c.prepend(u),d&&(s=u);break}case t==="#text":c=P.call(this,document.createTextNode(""),e);break;case(t==="<>"||!t):c=P.call(this,document.createDocumentFragment(),e);break;case!!j:c=P.call(this,document.createElementNS(j,t),e);break;case!c:c=P.call(this,document.createElement(t),e)}return et(c),s||(s=c),n.forEach(d=>d(s)),o&&g.pop(),o=2,c}function Et(t){let e=Symbol.for("default"),n=Array.from(t.querySelectorAll("slot")).reduce((o,c)=>Reflect.set(o,c.name||e,c)&&o,{}),r=Reflect.has(n,e);return t.append=new Proxy(t.append,{apply(o,c,s){if(!s.length)return t;let d=document.createDocumentFragment();for(let u of s){if(!u||!u.slot){r&&d.appendChild(u);continue}let l=u.slot,_=n[l];S(u,"remove","slot"),_&&(_.replaceWith(u),Reflect.deleteProperty(n,l))}return r&&(n[e].replaceWith(d),Reflect.deleteProperty(n,e)),Object.values(n).forEach(u=>u.replaceWith(y().append(...Array.from(u.childNodes)))),t}}),t}y.mark=function(t,e=!1){t=Object.entries(t).map(([o,c])=>o+`="${c}"`).join(" ");let n=e?"":"/",r=document.createComment(`<dde:mark ${t}${$.ssr}${n}>`);return e||(r.end=document.createComment("</dde:mark>")),r};function vt(t){let e=this;return function(...r){j=t;let o=y.call(e,...r);return j=void 0,o}}var{setDeleteAttr:I}=$,L=new WeakMap;function P(t,...e){if(!e.length)return t;L.set(t,G(t,this));for(let[n,r]of Object.entries(Object.assign({},...e)))Z.call(this,t,n,r);return L.delete(t),t}function Z(t,e,n){let{setRemoveAttr:r,s:o}=G(t,this),c=this;n=o.processReactiveAttribute(t,e,n,(d,u)=>Z.call(c,t,d,u));let[s]=e;if(s==="=")return r(e.slice(1),n);if(s===".")return J(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),r(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return r(e,n,"http://www.w3.org/1999/xlink");case"textContent":return I(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return F(o,n,J.bind(null,t[e]));case"ariaset":return F(o,n,(d,u)=>r("aria-"+d,u));case"classList":return nt.call(c,t,n)}return rt(t,e)?I(t,e,n):r(e,n)}function G(t,e){if(L.has(t))return L.get(t);let r=(t instanceof SVGElement?ct:ot).bind(null,t,"Attribute"),o=C(e);return{setRemoveAttr:r,s:o}}function nt(t,e){let n=C(this);return F(n,e,(r,o)=>t.classList.toggle(r,o===-1?void 0:!!o)),t}function xt(t){return Array.from(t.children).forEach(e=>e.remove()),t}function S(t,e,n,r){return t instanceof HTMLElement?t[e+"Attribute"](n,r):t[e+"AttributeNS"](null,n,r)}function rt(t,e){if(!Reflect.has(t,e))return!1;let n=V(t,e);return!x(n.set)}function V(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||V(t,e)}function F(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,c]){o&&(c=t.processReactiveAttribute(e,o,c,n),n(o,c))})}function K(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function ot(t,e,n,r){return t[(x(r)?"remove":"set")+e](n,K(r))}function ct(t,e,n,r,o=null){return t[(x(r)?"remove":"set")+e+"NS"](o,n,K(r))}function J(t,e,n){if(Reflect.set(t,e,n),!!x(n))return Reflect.deleteProperty(t,e)}function wt(t,e,n){return e||(e={}),function(o,...c){n&&(c.unshift(o),o=typeof n=="function"?n():n);let s=c.length?new CustomEvent(t,Object.assign({detail:c[0]},e)):new Event(t,e);return o.dispatchEvent(s)}}function E(t,e,n){return function(o){return o.addEventListener(t,e,n),o}}var D=it(),st=new WeakSet;E.connected=function(t,e){let{custom_element:n}=g.current,r="connected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents?c:c.isConnected?(c.dispatchEvent(new Event(s)),c):(N(e.signal,()=>D.offConnected(c,t))&&D.onConnected(c,t),c)}};E.disconnected=function(t,e){let{custom_element:n}=g.current,r="disconnected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents||N(e.signal,()=>D.offDisconnected(c,t))&&D.onDisconnected(c,t),c}};var z=new WeakMap;E.disconnectedAsAbort=function(t){if(z.has(t))return z.get(t);let e=new AbortController;return z.set(t,e),t(E.disconnected(()=>e.abort())),e};E.attributeChanged=function(t,e){let n="attributeChanged";return typeof e!="object"&&(e={}),function(o){let c="dde:"+n;if(o.addEventListener(c,t,e),o.__dde_lifecycleToEvents||st.has(o))return o;let s=new MutationObserver(function(u){for(let{attributeName:l,target:_}of u)_.dispatchEvent(new CustomEvent(c,{detail:[l,_.getAttribute(l)]}))});return N(e.signal,()=>s.disconnect())&&s.observe(o,{attributes:!0}),o}};function it(){let t=new Map,e=!1,n=new MutationObserver(function(i){for(let f of i)if(f.type==="childList"){if(l(f.addedNodes,!0)){s();continue}_(f.removedNodes,!0)&&s()}});return{onConnected(i,f){c();let a=o(i);a.connected.has(f)||(a.connected.add(f),a.length_c+=1)},offConnected(i,f){if(!t.has(i))return;let a=t.get(i);a.connected.has(f)&&(a.connected.delete(f),a.length_c-=1,r(i,a))},onDisconnected(i,f){c();let a=o(i);a.disconnected.has(f)||(a.disconnected.add(f),a.length_d+=1)},offDisconnected(i,f){if(!t.has(i))return;let a=t.get(i);a.disconnected.has(f)&&(a.disconnected.delete(f),a.length_d-=1,r(i,a))}};function r(i,f){f.length_c||f.length_d||(t.delete(i),s())}function o(i){if(t.has(i))return t.get(i);let f={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(i,f),f}function c(){e||(e=!0,n.observe(document.body,{childList:!0,subtree:!0}))}function s(){!e||t.size||(e=!1,n.disconnect())}function d(){return new Promise(function(i){(requestIdleCallback||requestAnimationFrame)(i)})}async function u(i){t.size>30&&await d();let f=[];if(!(i instanceof Node))return f;for(let a of t.keys())a===i||!(a instanceof Node)||i.contains(a)&&f.push(a);return f}function l(i,f){let a=!1;for(let m of i){if(f&&u(m).then(l),!t.has(m))continue;let w=t.get(m);w.length_c&&(m.dispatchEvent(new Event("dde:connected")),w.connected=new WeakSet,w.length_c=0,w.length_d||t.delete(m),a=!0)}return a}function _(i,f){let a=!1;for(let m of i)f&&u(m).then(_),!(!t.has(m)||!t.get(m).length_d)&&(m.dispatchEvent(new Event("dde:disconnected")),t.delete(m),a=!0);return a}}var p=Symbol.for("Signal");function W(t){try{return Reflect.has(t,p)}catch{return!1}}var M=[],h=new WeakMap;function b(t,e){if(typeof t!="function")return Q(t,e);if(W(t))return t;let n=Q(),r=function(){let[o,...c]=h.get(r);if(h.set(r,new Set([o])),M.push(r),n(t()),M.pop(),!c.length)return;let s=h.get(r);for(let d of c)s.has(d)||R(d,r)};return h.set(n[p],r),h.set(r,new Set([n])),r(),n}b.action=function(t,e,...n){let r=t[p],{actions:o}=r;if(!o||!Reflect.has(o,e))throw new Error(`'${t}' has no action with name '${e}'!`);if(o[e].apply(r,n),r.skip)return Reflect.deleteProperty(r,"skip");r.listeners.forEach(c=>c(r.value))};b.on=function t(e,n,r={}){let{signal:o}=r;if(!(o&&o.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,n,r));U(e,n),o&&o.addEventListener("abort",()=>R(e,n))}};b.symbols={signal:p,onclear:Symbol.for("Signal.onclear")};b.clear=function(...t){for(let n of t){Reflect.deleteProperty(n,"toJSON");let r=n[p];r.onclear.forEach(o=>o.call(r)),e(n,r),Reflect.deleteProperty(n,p)}function e(n,r){r.listeners.forEach(o=>{if(r.listeners.delete(o),!h.has(o))return;let c=h.get(o);c.delete(n),!(c.size>1)&&(b.clear(...c),h.delete(o))})}};var k="__dde_reactive";b.el=function(t,e){let n=y.mark({type:"reactive"},!1),r=n.end,o=document.createDocumentFragment();o.append(n,r);let{current:c}=g,s=d=>{if(!n.parentNode||!r.parentNode)return R(t,s);g.push(c);let u=e(d);g.pop(),Array.isArray(u)||(u=[u]);let l=n;for(;(l=n.nextSibling)!==r;)l.remove();n.after(...u)};return U(t,s),Y(t,s,n,e),s(t()),o};var O="__dde_attributes";b.attribute=function(t,e=null){let n=b(e),r;return g.host(o=>{if(r=o,S(r,"has",t)?n(S(r,"get",t)):e!==null&&S(r,"set",t,e),o[O]){o[O][t]=n;return}r[O]={[t]:n},E.attributeChanged(function({detail:s}){/*! This maps attributes to signals (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/let[d,u]=s,l=r[O][d];if(l)return l(u)})(r),E.disconnected(function(){/*! This removes all signals mapped to attributes (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/b.clear(...Object.values(r[O]))})(r)}),new Proxy(n,{apply(o,c,s){if(!s.length)return o();let d=s[0];return S(r,"set",t,d)}})};var X={isSignal:W,processReactiveAttribute(t,e,n,r){if(!W(n))return n;let o=c=>r(e,c);return U(n,o),Y(n,o,t,e),n()}};function Y(t,e,...n){let{current:r}=g;r.prevent||r.host(function(o){o[k]||(o[k]=[],E.disconnected(()=>o[k].forEach(([[c,s]])=>R(c,s,c[p]?.host()===o)))(o)),o[k].push([[t,e],...n])})}function Q(t,e){let n=(...r)=>r.length?lt(n,...r):dt(n);return ut(n,t,e)}var ft=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),q=class extends Error{constructor(){super();let[e,...n]=this.stack.split(`
`),r=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=n.find(o=>!o.includes(r))}};function ut(t,e,n){let r=[];B(n)!=="[object Object]"&&(n={});let{onclear:o}=b.symbols;n[o]&&(r.push(n[o]),Reflect.deleteProperty(n,o));let{host:c}=g;return Reflect.defineProperty(t,p,{value:{value:e,actions:n,onclear:r,host:c,listeners:new Set,defined:new q},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[p],ft),t}function at(){return M[M.length-1]}function dt(t){if(!t[p])return;let{value:e,listeners:n}=t[p],r=at();return r&&n.add(r),h.has(r)&&h.get(r).add(t),e}function lt(t,e,n){if(!t[p])return;let r=t[p];if(!(!n&&r.value===e))return r.value=e,r.listeners.forEach(o=>o(e)),e}function U(t,e){if(t[p])return t[p].listeners.add(e)}function R(t,e,n){let r=t[p];if(!r)return;let o=r.listeners.delete(e);if(n&&!r.listeners.size){if(b.clear(t),!h.has(r))return o;let c=h.get(r);if(!h.has(c))return o;h.get(c).forEach(s=>R(s,c,!0))}return o}T(X);
globalThis.dde= {S: b,
assign: P,
assignAttribute: Z,
chainableAppend: et,
classListDeclarative: nt,
createElement: y,
createElementNS: vt,
dispatchEvent: wt,
el: y,
elNS: vt,
elementAttribute: S,
empty: xt,
isSignal: W,
on: E,
registerReactivity: T,
scope: g,
simulateSlots: Et
};

})();